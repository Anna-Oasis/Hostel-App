import {Router} from 'express';


const managerRouter = Router();

managerRouter.get("/", (req, res) => {
  res.send("👋 Welcome to the Manager API!");
});

export default managerRouter;