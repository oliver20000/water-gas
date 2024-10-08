import { Router } from 'express';
import { uploadMeasurement, confirmMeasurement, listMeasurements } from '../controllers/measurementController';

const router = Router();
0
router.post('/upload', uploadMeasurement);
router.patch('/confirm', confirmMeasurement);
router.get('/:customer_code/list', listMeasurements);

export default router;