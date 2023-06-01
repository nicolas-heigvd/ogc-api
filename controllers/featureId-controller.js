const express = require('express');
const router = express.Router();
const { Pool } = require('pg')
require('dotenv').config();
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const format = require('@scaleleap/pg-format');
const convert = require('../utils/convert.js')

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

router.get('/:collectionId/items/:id', async (req, res) => {
  const collectionId = req.params.collectionId;
  let collection = config.resources[collectionId];
  if (!collection) {
    return res.status(404).send({ error: 'Collection not found' });
  }
  let table_name = collection.providers[0].data.table;
  let geometry_column = collection.providers[0].data.geom_field;
  const itemId = req.params.id;

  // Define the query parameters

  const { limit, offset, crs } = req.query

  let lang = req.query.lang || 'en'

  // Build the SQL query
  
  let select_columns = ''
  if(lang){
    select_columns = `,name_${lang} as name`
  }

  // Execute the query

  let query = format.format('SELECT ST_AsGeoJSON(ST_Transform(%I, %L)) as geojson, * FROM %I WHERE id = %L', geometry_column, crs || 4326, table_name, itemId);

  pool.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ error: `Error retrieving items: ${err}` });
    } else {
      let currentItemID = result.rows[result.rows.length-1].id + (offset || 0);
      let nextItemID = currentItemID + (limit || 1);
      let prevItemID = currentItemID - (limit || 1);
      res.json({
        type: 'FeatureCollection',
        features: result.rows.map(row => {
          let geojson;
          geojson = JSON.parse(row.geojson);
          if (collection.providers[0].data.yaw_field) {
            const geopose = convert(row, collection.providers[0]);
            if (geopose)
              row['geopose'] = geopose;
          }
          return {
            type: 'Feature',
            properties: Object.keys(row)
            .filter(key => key !== 'id' && key !== 'geometry' && key !== 'geojson')
            .reduce((obj, key) => {
              obj[key] = row[key];
              return obj;
            }, {}),
        id: row.id,
        geometry : geojson
          }
        }),
        links: [
          {type: "application/json", rel: "root", title: "The landing page of this server as JSON", href: req.protocol + '://' + req.get('host') + '/'},
          {type: "text/html", rel: "root", title: "The landing page of this server as HTML", href: ""},
          {type: "application/geo+json", rel: "self", title: "This document as GeoJSON", href: req.protocol + '://' + req.get('host') + req.originalUrl},
          {type: "alternate", rel: "application/ld+json", title: "This document as RDF (JSON-LD)", href: ""},
          {type: "alternate", rel: "text/html", title: "This document as HTML", href: ""},
          {type: "collection", rel: "application/json", title: collectionId, href: req.protocol + '://' + req.get('host') + req.originalUrl.split('/').slice(0, -1).join('/')+"/"+collectionId},
          {type: "prev", rel: "application/json", title: "Previous item", href: req.protocol + '://' + req.get('host') + req.originalUrl.split('/').slice(0, -1).join('/')+"/"+prevItemID},
          {type: "next", rel: "application/json", title: "Next item", href: req.protocol + '://' + req.get('host') + req.originalUrl.split('/').slice(0, -1).join('/')+"/"+nextItemID},            
          ],
        timeStamp: new Date().toISOString(),
      })
    }
  });
});

module.exports = router;
