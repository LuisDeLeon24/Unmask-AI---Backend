import { Router } from 'express';
import { analyzeImageController , unmaskMediaController } from '../controller/unmask.controller.js';

const router = Router();


router.post('/image', analyzeImageController);
router.post('/media', unmaskMediaController);
export default router;
