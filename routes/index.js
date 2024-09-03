import { adminRoutes } from "./adminRoutes.js";
import { fileRoutes } from "./fileRoutes.js";
import { gameRoutes } from "./gameRoutes.js";
import { otpRoutes } from "./otpRoutes.js";
import { userRoutes } from "./userRoutes.js";


export const allRoutes = [ ...userRoutes , ...otpRoutes , ...fileRoutes , ...adminRoutes , ...gameRoutes ] ; 

