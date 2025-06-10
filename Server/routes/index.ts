import { Router } from "express";
import authRouter from "./authRoutes";
import detailsRouter from "./detailsRoute";
import { Request, Response } from "express";
import studentRouter from "./studentRoutes";
import managerRouter from "./managerRoutes";
import rcRouter from "./rcRoutes";

const routes = Router();

routes.use("/", authRouter);
routes.use("/api/details", detailsRouter);
routes.use("/api/student/", studentRouter);
routes.use("/api/manager/", managerRouter);
routes.use("/api/resident_counsellor/",rcRouter);

routes.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

routes.get(/^\/.*/, (req: Request, res: Response) => {
  res.send("👋 Welcome to Anna Oasis API!");
});
export default routes;
