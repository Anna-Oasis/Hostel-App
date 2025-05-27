import { Router } from 'express';
import admissionRoute from "./admissionRoute";


const routes = Router();
routes.use("/admission", admissionRoute);

export default routes;
