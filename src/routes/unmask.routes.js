import { Router } from 'express';
import { analyzeImageController , analyzeImageNewsController} from '../controller/unmask.controller.js';

const router = Router();


router.post('/image', analyzeImageController);

router.post('/image/news', analyzeImageNewsController);

export default router;
