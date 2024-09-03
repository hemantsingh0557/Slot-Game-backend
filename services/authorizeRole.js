import { RESPONSE_MESSAGE } from "../utils/messages.js";



export const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (allowedRoles.includes(req.role)) {
            next();
        } else {
            res.status(403).json({ message: RESPONSE_MESSAGE.NOT_AUTHORISED });
        }
    };
};
