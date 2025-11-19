import {Sequelize} from 'sequelize';
import dotenv from 'dotenv'

dotenv.config()

//sequelize initialization 

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  sync:{
    force:true
  },
 
});






export default db;