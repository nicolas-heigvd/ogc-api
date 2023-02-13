const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    "title": "OGC API Features",
    "description": "This is a sample OGC API Features server.",
    "links": [
      {
        "rel": "self",
        "type": "application/json",
        "title": "This document as JSON",
        "href": "http://localhost:3000/"
      },
      // JSON (not implemented yet)
      // {
      //   "rel": "self",
      //   "type": "application/json",
      //   "title": "This document as JSON",
      //   "href": "http://localhost:3000?f=json"
      // },
      // JSON-LD (not implemented yet)
      // {
      //   "rel": "alternate",
      //   "type": "application/ld+json",
      //   "title": "This document as RDF (JSON-LD)",
      //   "href": "http://localhost:3000?f=jsonld"
      // },
      // HTML (not implemented yet)
      // {
      //   "rel": "alternate",
      //   "type": "text/html",
      //   "title": "This document as HTML",
      //   "href": "http://localhost:3000?f=html"
      // },
      // OpenAPI
      {
        "rel": "service-desc",
        "type": "application/vnd.oai.openapi+json;version=3.0",
        "title": "The API definition",
        "href": "http://localhost:3000/openapi"
      },
      // // OpenAPI as JSON (not implemented yet)
      // {
      //   "rel": "service-desc",
      //   "type": "application/vnd.oai.openapi+json;version=3.0",
      //   "title": "The API definition",
      //   "href": "http://localhost:3000/openapi?f=json"
      // },
      // OpenAPI as HTML (not implemented yet)
      // {
      //   "rel": "service-desc",
      //   "type": "text/html",
      //   "title": "The OpenAPI definition as HTML",
      //   "href": "http://localhost:3000/openapi?f=html"
      // },
      // Check is needed
      // {
      //   "rel": "service-doc",
      //   "type": "text/html",
      //   "title": "The API documentation",
      //   "href": "http://localhost:3000/docs"
      // },
      {
        "rel": "conformance",
        "type": "application/json",
        "title": "OGC API conformance classes implemented by this server",
        "href": "http://localhost:3000/conformance"
      },
      // Uncomment once the endpoint is implemented
      {
        "rel": "conformance",
        "type": "application/json",
        "title": "OGC API conformance classes implemented by this server as JSON",
        "href": "http://localhost:3000/conformance?f=json"
      },
      {
        "rel": "conformance",
        "type": "text/html",
        "title": "OGC API conformance classes implemented by this server as HTML",
        "href": "http://localhost:3000/conformance?f=html"
      },
      {
        "rel": "data",
        "type": "application/json",
        "title": "Metadata about the feature collections",
        "href": "http://localhost:3000/collections"
      },
      // Uncomment once the endpoint is implemented
      // {
      //   "rel": "data",
      //   "type": "application/json",
      //   "title": "Metadata about the feature collections as JSON",
      //   "href": "http://localhost:3000/collections?f=json"
      // },
      // Uncomment once the endpoint is implemented
      // {
      //   "rel": "data",
      //   "type": "text/html",
      //   "title": "Metadata about the feature collections as HTML",
      //   "href": "http://localhost:3000/collections?f=html"
      // },
    ]
  })
});

module.exports = router;