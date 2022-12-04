const express = require('express');
const cors = require('cors');
const { db } = require('../database/config');

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.path = {
            user: '/user',
            login: '/login',
            err: '/',
        }

        // database
        this.database();
        // middlewares
        this.middlewares();
        // routes
        this.routes();
    }
    async database(){
        const pg = await db;

        try{

            pg.connect((err, client, release) =>{
                if(err){
                    throw console.error(err);
                    // console.log(err.error);
                }else{
                    // console.log(client);
                    console.log('connected');
                }
            })
            // pg.end();

        }catch(err){
            console.log(err);
            throw new Error('there was an error during the conectation the database');
        }
    }

    middlewares(){
        // allow routes
        this.app.use(cors());
        // read dates type json
        this.app.use(express.json());
        // directory public
        this.app.use(express.static('public'));
    }
    routes(){
        this.app.use(this.path.user, require('../router/user'));
        this.app.use(this.path.login, require('../router/login'))

        this.app.use(this.path.err, require('../router/err'));
    }
    listen(){
        this.app.listen(this.port, () => {
            console.log(`Server running at ${this.port}`);
        });
    }    
}

module.exports = Server;
