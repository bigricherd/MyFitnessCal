const dotenv = require('dotenv');
const { Pool } = require("pg");

if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: '.env.dev' }); // .env.dev in top-level directory "app"
}
const devConfig = {
    host: process.env.INSTANCE_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
};

const prodConfig = {
    host: process.env.INSTANCE_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    // connectionString: process.env.DATABASE_URL
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