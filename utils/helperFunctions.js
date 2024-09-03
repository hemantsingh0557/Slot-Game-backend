import { error } from "console";
import Joi from "joi";






export function validateSchema(schema) {
    return (req , res , next ) => {
        if( schema.body ) {
            const { error } = schema.body.validate(req.body) ;
            if( error ) {
                res.status(400).json({
                    error : error.details.map( (err) => err.message ) 
                }) ;
            }
        }
        if( schema.params ) {
            const { error } = schema.params.validate(req.params) ;
            if( error ) {
                res.status(400).json({
                    error : error.details.map( (err) => err.message ) 
                }) ;
            }
        }
        if( schema.query ) {
            const { error } = schema.query.validate(req.query) ;
            if( error ) {
                res.status(400).json({
                    error : error.details.map( (err) => err.message ) 
                }) ;
            }
        }
        if( schema.headers ) {
            const { error } = schema.headers.validate(req.headers) ;
            if( error ) {
                res.status(400).json({
                    error : error.details.map( (err) => err.message ) 
                }) ;
            }
        }
        next() ;
    }
} ;

















