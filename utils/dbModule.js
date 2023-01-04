const dotenv = require('dotenv');
const { Pool } = require("pg");

if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: '.env.dev' }); // .env.dev in top-level directory "app"
}
const devConfig = {
    host: "localhost",
    port: process.env.DBPORT,
    user: process.env.DBUSER,
    database: process.env.DBNAME,
};

const prodConfig = {
    connectionString: process.env.DATABASE_URL
};


const pool = new Pool(process.env.NODE_ENV === "production" ? prodConfig : devConfig);

pool.on('error', (e) => {
    console.log(e, e.stack, e.message);
});

module.exports = {
    performQuery: (text) => {
        return pool.query(text);
    }
}