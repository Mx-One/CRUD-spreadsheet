const {Pool, types} = require('pg')

types.setTypeParser(1700, val => parseFloat(val)); // make numeric values in db return floats instead of strings

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'projects',
    password: '123592',
    port: 5001
})

module.exports = pool;