const express = require('express');
const app = express()
require('dotenv').config();

// Routes

const landingpage = require('./routes/landingpage');
const conformance = require('./routes/conformance');
const collections = require('./routes/collections');
const collectionId = require('./routes/collectionId');
const queryables = require('./routes/queryables');
const items = require('./routes/items');
const featureId = require('./routes/featureId');

// Set the port

const port = process.env.PORT || 3000;

// Landing page

app.use('/', landingpage);

// Conformance declaration

app.use('/conformance', conformance);

// Collections

app.use('/collections',collections);

// Collections/:collectionId

app.use('/collections', collectionId);

// Collections/:collectionId/queryables

app.use('/collections', queryables);

// Collections/:collectionId/items

app.use('/collections', items);

// Collections/:collectionId/items/:featureId

app.use('/collections', featureId);

// Set the port

app.listen(port, () => {
  console.log(`OGC API Features service listening on port ${port}.`)
})