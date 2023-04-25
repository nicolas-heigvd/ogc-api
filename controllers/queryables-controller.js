const express = require('express');
const router = express.Router();
const { Pool } = require('pg')
require('dotenv').config();
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const format = require('@scaleleap/pg-format');

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

// GET /collections/{collectionId}/queryables

router.get('/:collectionId/queryables', (req, res) => {
  let collectionId = req.params.collectionId;
  let collection = config.resources[collectionId];
  if (!collection) {
    return res.status(404).send({ error: 'Collection not found' });
  }
  let table_name = format.format('%I', collection.providers[0].data.table);
  let attributes = collection.providers[0].data.attributes;
  let query = format.format('SELECT column_name, data_type FROM information_schema.columns WHERE table_name = %L', table_name);
  if (attributes) {
    let attrs = format.format('%L', attributes.map(attr => `'${attr}'`).join(','));
    query += format.format(' AND column_name IN (%s)', attrs);
  }
  pool.query(query, (err, result) => {
    if (err) {
      res.status(500).json({ error: `Error retrieving queryables: ${err}` })
    } else {
      res.json({
        queryables: result.rows.map(row => {
          return {
            name: row.column_name,
            type: row.data_type
          }
        })
      })
    }
  })
});

module.exports = router;