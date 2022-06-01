const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'localhost', 
    user:'root', 
    password: 'root',
    database: 'project'
    });

module.exports = pool   
