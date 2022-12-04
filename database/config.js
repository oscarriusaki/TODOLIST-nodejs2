const { Pool } = require('pg');

const host1 = process.env.HOST || 'localhost';
const user1 = process.env.USER || 'postgres';
const database1 = process.env.DATABASE || 'todolist2';
const password1 = process.env.PASSWORD || '00000000';
const port1 = process.env.PORT || '5432';
const max1 = process.env.MAX || '20';

const db = new Pool({
    host: host1 ,
    user: user1 ,
    database: database1 ,
    password: password1 ,
    port: port1 ,
    max: max1 ,
})

module.exports = {
    db
}

