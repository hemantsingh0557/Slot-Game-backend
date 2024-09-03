
import express from "express" ;
import { dbConnection } from "../startup/dbConnection.js";
import { expressStartUp } from "../startup/expressStartup.js";
import { config } from "../config/index.js";


const app =  express() ;



async function startServer() {
    await dbConnection() ;
    await expressStartUp(app) ;
}

startServer().then( () => {
    app.listen( config.server.port , () => {
        console.log(`Server is running on http://localhost:${config.server.port}`)    
    } )
}).catch( (error) => {
    console.error("Failed to start the server:", error);
})