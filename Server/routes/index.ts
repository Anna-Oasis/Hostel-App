import { Router } from 'express';
import admissionRouter from "./admissionRoute";


const routes = Router();
routes.use("/admission", admissionRouter);

export default routes;
