import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import db from './db/connection.js'
import {LinkModel} from './models/link.model.js'
import {UrlShortenerController} from './controllers/urlShortener.controller.js'
import './service/scheduler.js'


import dotenv from 'dotenv';

dotenv.config()

const port =process.env.PORT;
//creating an instance of express app
const app= express()
//implementing cors
app.use(cors({
    origin:'*'// allow origin set to all 
}))
//body parser
app.use(bodyParser.json())

//sequelize connection creation
db.authenticate().then(()=>{
    console.log(`connection has been established`)
    }).catch((err)=>{
        console.log('error occured',err)
    })
    //initializing the model
LinkModel(db)
//syncing the database
// db.sync()

//health check
app.get('/healthz', (req,res)=>{
    res.status(200).json({message:'ok',version:'1.0.0',process_id:process.pid})
})

//routes
app.post('/api/links', UrlShortenerController.createUrlShortener)
app.get('/api/links', UrlShortenerController.getAllLinks)
app.get('/api/links/:code', UrlShortenerController.getLinkStats)
app.delete('/api/links/:code', UrlShortenerController.deleteLink)
//route for updating photo by passing their id


//server port
app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})






