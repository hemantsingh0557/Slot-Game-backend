import { config } from "../config/index.js";
import jwt from "jsonwebtoken" ;

export function authenticateToken(req, res, next) {
    const token = req.headers.authorization.split(" ", 1);
    const decodedToken = jwt.verify(token, config.auth.jwtSecret);
    const { userId } = decodedToken;
    req.userId = userId;
    next();
}
