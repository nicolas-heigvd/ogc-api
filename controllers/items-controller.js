const express = require('express');
const router = express.Router();
const {Pool} = require('pg');
require('dotenv').config();
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const pgFormat = require('@scaleleap/pg-format');
const convert = require('../utils/convert.js');

// Load the configuration file

let config;
try {
  config = yaml.load(fs.readFileSync(path.join(__dirname, '../config.yml'), 'utf8'));
} catch (error) {
  console.log(error);
}

// Connect to the database

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

router.get('/:collectionId/items', (req, res) => {

    // Extract collection ID

    const collectionId = req.params.collectionId;
    let collection = config.resources[collectionId];
    if (!collection) {
      return res.status(404).send({ error: 'Collection not found' });
    }
    const propertiesFilter = req.query.properties ? req.query.properties.split(',') : [];

    // Extract other query parameters

    const {bbox, limit, offset, sortby, crs, filter, skipGeometry} = req.query
    let table_name = collection.providers[0].data.table;
    let geometry_column = collection.providers[0].data.geom_field;
    let attributes = collection.providers[0].data.attributes;
    let lang = req.query.lang || 'en'

    // Build the SQL query

    let select_columns = ''
    if (lang) {
      select_columns = `,name_${lang} as name`
    }

    let query = pgFormat.format('SELECT ST_AsGeoJSON(ST_Transform(%I, %L)) as geojson, * FROM %I', geometry_column, crs || 4326, table_name);
    if (attributes) {
      query = pgFormat.format('SELECT ST_AsGeoJSON(ST_Transform(%I, %L)) as geojson, %s FROM %I', geometry_column, crs || 4326, attributes.map(attr => `${attr}`).join(','), table_name);
    }    
    if (bbox) {
      const [minx, miny, maxx, maxy] = bbox.split(',').map(parseFloat);
      query += pgFormat.format('%s WHERE %I && ST_MakeEnvelope(%L, %L, %L, %L, 4326)', query, geometry_column, minx, miny, maxx, maxy);
    }

    // CQL filtering for comparison and spatial predicates
    /* 
    Notes:
    (1) the crs shouldn't be provided in the input values
    */

    if (filter) {
      const comparisonPredicate = filter.match(/=\s*[\S]+|<\s*[\S]+|>\s*[\S]+|<=\s*[\S]+|>=\s*[\S]+|LIKE|BETWEEN|IN|NOT IN|IS NULL|IS NOT NULL/);
      const spatialPredicate = filter.match(/^(EQUALS|DISJOINT|TOUCHES|WITHIN|OVERLAPS|INTERSECTS|CONTAINS)/);
      if (spatialPredicate) {
        const input_geometry = filter.replace(/^(EQUALS|DISJOINT|TOUCHES|WITHIN|OVERLAPS|INTERSECTS|CONTAINS)/, "");
        query += pgFormat.format(' WHERE ST_%s(%I, ST_GeomFromText %s)', spatialPredicate[0], geometry_column, input_geometry);
      } else if (comparisonPredicate) {
        const input_values = filter.split(comparisonPredicate[0]);
        query += pgFormat.format(' WHERE %I %I %L', input_values[0], comparisonPredicate[0], input_values[1]);
      }
    }

     // Sorting parameter

    if (sortby) {
      query += ` ORDER BY ${sortby};`
    }

    // Pagination parameters

    query += pgFormat.format(' LIMIT %L OFFSET %L', limit || 10, offset || 0);

    // Execute the query 
    console.log(filter)
    console.log(query)
    pool.query(query, (err, result) => {
      if (err) {
        res.status(500).json({
          error: `Error retrieving items: ${err}`
        })
      } else {
        res.json({
          type: 'FeatureCollection',
          features: result.rows.map(row => {
              let geojson;
              if (collection.providers[0].data.yaw_field) {
                const geopose = convert(row, collection.providers[0]);
                if (geopose)
                  row['geopose'] = geopose;
              }
              if (skipGeometry === undefined || skipGeometry === 'false') {
                geojson = JSON.parse(row.geojson);
              }
              return {
                type: 'Feature',
                properties: propertiesFilter.length > 0 ?
                  Object.keys(row)
                  .filter(key => propertiesFilter.includes(key) && key !== 'id' && key !== 'geometry' && key !== 'geojson')
                  .reduce((obj, key) => {
                    obj[key] = row[key];
                    return obj;
                  }, {}) :
                  Object.keys(row)
                  .filter(key => key !== 'id' && key !== 'geometry' && key !== 'geojson')
                  .reduce((obj, key) => {
                    obj[key] = row[key];
                    return obj;
                  }, {}),
                id: row.id,
                geometry: geojson
              }
          })
        })
      }
    })
});

module.exports = router;
