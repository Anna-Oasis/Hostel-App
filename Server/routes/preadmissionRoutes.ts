import {Router} from 'express';
import errorWrapper from '../middleware/errorWrapper';
import { createPreAdmissionController, getPreAdmissionsController } from '../controllers/preAdmissionController'

const preadmissionRouter = Router();

preadmissionRouter.post("",errorWrapper(createPreAdmissionController))
preadmissionRouter.get("", errorWrapper(getPreAdmissionsController));

export default preadmissionRouter;