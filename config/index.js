import dotenv from "dotenv" ;


dotenv.config() ;
export const config = {
    server : {
        port : process.env.PORT || 300 ,
    } ,
    database : {
        url : process.env.DATABASE_URL ,
    } ,
    auth : {
        jwtSecret : process.env.JWT_SECRET ,
    } ,
} ;