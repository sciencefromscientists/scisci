/**
* You'll need to use environment variables in order to deploy your
* pg-pool configuration to Heroku.
* It will look something like this:
**/

let pg = require('pg');
let url = require('url');
let config = {};

if (process.env.DATABASE_URL) {
    // Heroku gives a url, not a connection object
    // https://github.com/brianc/node-pg-pool
    let params = url.parse(process.env.DATABASE_URL);
    let auth = params.auth.split(':');

    config = {
        user: auth[0],
        password: auth[1],
        host: params.hostname,
        port: params.port,
        database: params.pathname.split('/')[1],
        ssl: true, // heroku requires ssl to be true
        max: 20, // max number of clients in the pool
        min: 20, // min number of clients in the pool
        idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    };

} else {
    config = {
        user: process.env.PG_USER || null, //env let: PGUSER
        password: process.env.DATABASE_SECRET || null, //env let: PGPASSWORD
        host: process.env.DATABASE_SERVER || 'localhost', // Server hosting the postgres database
        port: process.env.DATABASE_PORT || 5432, //env let: PGPORT
        database: process.env.DATABASE_NAME || 'sciencefromscientists', //env let: PGDATABASE
        max: 20, // max number of clients in the pool
        min: 20, // min number of clients in the pool
        idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    };
}

module.exports = new pg.Pool(config);
