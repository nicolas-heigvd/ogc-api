const express = require('express');
const router = express.Router();
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

// Set the port

const port = process.env.PORT || 3000;

let config;
try {
  config = yaml.load(fs.readFileSync(path.join(__dirname, '../config.yml'), 'utf8'));
} catch (error) {
  console.log(error);
}

router.get('/:collectionId', (req, res) => {
  let collectionId = req.params.collectionId;
  let collection = config.resources[collectionId];
  if (!collection) {
    return res.status(404).send({ error: 'Collection not found' });
  }
  let links = [...collection.links];
  links.push(
    // Landing page (uncomment once the f parameter is implemented) < -- Does that make sense to put these links here?
    {type: 'application/json', rel: 'root', title: 'The landing page of this server as JSON', href: `http://localhost:${port}`},
    // {type: 'application/json', rel: 'root', title: 'The landing page of this server as JSON', href: `http://localhost:${port}?f=json`},
    // {type: 'text/html', rel: 'root', title: 'The landing page of this server as HTML', href: `http://localhost:${port}?f=html`},
    
    // Self (uncomment once the f parameter is implemented)

    {type: 'application/json', rel: 'root', title: 'This document as JSON', href: `http://localhost:${port}/collections/${collectionId}`},
    // {type: 'application/json', rel: 'root', title: 'This document as JSON', href: `http://localhost:${port}/collections/${collectionId}?f=json`}
    // {type: 'application/ld+json', rel: 'alternate', title: 'This document as RDF (JSON-LD)', href: `http://localhost:${port}/collections/${collectionId}?f=jsonld`},
    // {type: 'text/html', rel: 'root', title: 'This document as HTML', href: `http://localhost:${port}/collections/${collectionId}?f=html`},

    // Queryables (uncomment once the f parameter is implemented)

    {type: 'application/json', rel: 'queryables', title: 'Queryables for this collection as JSON', href: `http://localhost:${port}/collections/${collectionId}/queryables`},
    // {type: 'application/json', rel: 'queryables', title: 'Queryables for this collection as JSON', href: `http://localhost:${port}/collections/${collectionId}/queryables?f=json`},
    // {type: 'text/html', rel: 'queryables', title: 'Queryables for this collection as HTML', href: `http://localhost:${port}/collections/${collectionId}/queryables?f=html`},

    // Items (uncomment once the f parameter is implemented)

    {type: 'application/geo+json', rel: 'items', title: 'Items in this collection as GeoJSON', href: `http://localhost:${port}/collections/${collectionId}/items`},
    // {type: 'application/geo+json', rel: 'items', title: 'Items in this collection as GeoJSON', href: `http://localhost:${port}/collections/${collectionId}/items?f=json`},
    // {type: 'application/ld+json', rel: 'items', title: 'Items in this collection as RDF (GeoJSON-LD)', href: `http://localhost:${port}/collections/${collectionId}/items?f=jsonld`},
    // {type: 'text/html', rel: 'items', title: 'Items in this collection as HTML', href: `http://localhost:${port}/collections/${collectionId}/items?f=html`},

  );
  let result = {
    id: collectionId,
    title: collection.title,
    description: collection.description,
    keywords: collection.keywords,
    links: links,
    extents: collection.extents,
    itemType: "feature"
  };
  res.json(result);
});

module.exports = router;
