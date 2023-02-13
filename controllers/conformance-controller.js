const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    conformsTo: [
      "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/core",
      "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/oas30",
      "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/geojson",
      "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/html"]
  })
});

module.exports = router;
