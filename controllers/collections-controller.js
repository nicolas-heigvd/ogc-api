const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const router = require('./landingpage-controller');

// Set the port

const port = process.env.PORT || 3000;

let config;
try {
  config = yaml.load(fs.readFileSync(path.join(__dirname, '../config.yml'), 'utf8'));
} catch (error) {
  console.log(error);
}

router.get('/', (req, res) => {
  let collections = config.resources;
  let result = {collections: {}}
  let index = 0;
  for (let collection in collections) {
    result.collections[index] = {
      id: collection,
      title: collections[collection].title,
      description: collections[collection].description,
      keywords: collections[collection].keywords,
      links: [
        ...collections[collection].links,
        {type: 'application/json', rel: 'root', title: 'The landing page of this server as JSON', href: `http://localhost:${port}`},
        /*
        Uncomment the following lines once the HTML landing page is implemented
        Check also what information should be displayed
        */  
        // {type: 'application/json', rel: 'root', title: 'The landing page of this server as JSON', href: `http://localhost:${port}?f=json`},
        // {type: 'text/html', rel: 'canonical', title: 'The landing page of this server as HTML', href: `http://localhost:${port}?f=html`},
        // {rel: 'self', href: `http://localhost:${port}/collections/${collection}`},
        // {rel: 'items', href: `http://localhost:${port}/collections/${collection}/items`},
        // {rel: 'queryables', href: `http://localhost:${port}/collections/${collection}/queryables`}
      ]
    }
    index++;
  }
  res.json(result);
});

module.exports = router;