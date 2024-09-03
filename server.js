
import express from "express" ;
import { config } from "./config/index.js";
import { dbConnection } from "./startup/dbConnection.js";
import { expressStartUp } from "./startup/expressStartup.js";


const app = express() ;


async function startServer() {
    await dbConnection() ;
    await expressStartUp(app) ;
}

startServer().then( () => {
    app.listen( config.server.port , () => {
        console.log(`Server is running on http://localhost:${config.server.port}`) ;
    } ) ;
}).catch( (error) => {
    console.error("Failed to start the server:", error);
}) ;    