import { Router } from 'express';
import authRouter from './authRoutes';
import detailsRouter from "./detailsRoute";
import { Request, Response } from 'express';

const routes = Router();


routes.use("/", authRouter);
routes.use("/api/details", detailsRouter);




routes.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
});

routes.get(/^\/.*/, (req: Request, res: Response) => {
    res.send("👋 Welcome to Anna Oasis API!");
});
export default routes;
