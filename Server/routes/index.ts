import { Router } from 'express';
import admissionRouter from "./admissionRoute";
import detailsRouter from "./detailsRoute";

const routes = Router();
routes.use("/admission", admissionRouter);
routes.use("/details", detailsRouter);
export default routes;
