const mongoose= require('mongoose');
require('dotenv').config({path: __dirname + '/../.env'}); // dotenv

const url = process.env.URL_DATABASE;
class Database{
    constructor(){
        this.connect();
    }

    connect(typeDB = 'mongoDB') {
        mongoose
        .connect(url)
        .then(console.log('\x1b[32m%s\x1b[0m',`Connect ${typeDB} Successfully`))
        .catch((err)=> console.log(err))
        
    }
    
    static getInstance() {
        if (!this.instance) this.instance = new Database();
        return this.instance;
      }
}

const instanceDB = Database.getInstance();

module.exports = instanceDB;