const dotenv = require('dotenv');
const { Pool } = require("pg");

console.log('Environment');
console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV !== 'production') {
    console.log('Dev environment')
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
    //port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    // connectionString: process.env.DATABASE_URL
};

if (process.env.NODE_ENV === "production") {
    console.log("You're on PROD");
}

const pool = new Pool(process.env.NODE_ENV === "production" ? prodConfig : devConfig);

pool.on('error', (e) => {
    console.log('Postgres  Pool error')
    console.log(e, e.stack, e.message);
});

pool.on('connect', (res) => {
    console.log('Connected to database');
    if (process.env.NODE_ENV === "production") { 
        console.log(prodConfig);
    } else console.log(devConfig);
})

module.exports = {
    performQuery: (text) => {
        return pool.query(text);
    }
}