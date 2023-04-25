# OGC API with Node.js, Express, and PostgreSQL

Generic implementation of OGC API with Node.js, Express and PostgreSQL

## Step #1

Create a .env file in the root directory and add the following environment variables:

```bash
DB_NAME='<db_name>'
DB_HOST='<host_name>'
DB_PORT= <port_number>
DB_USER='<user_name>'
DB_PASSWORD='<user_password>'
```

## Step #2

Create a `config.yml` file with the informations you want to display for each collection. You can take example on `config.example.yml`.

## Step #3

Install the dependencies running the following command:

`npm ci`

## Step #4

Start the server running the following command:

`node index.js`

__Note:__ For development purposes, you can use `nodemon` to automatically restart the server when a file is changed. To do so, run the following command:

`nodemon index.js`
