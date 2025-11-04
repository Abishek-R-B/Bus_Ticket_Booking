
import express from 'express';
import { getSeatsForBus, bookSeats, initializeSeats } from '../controllers/seatController.js';

const router = express.Router();

router.get('/:tripId', getSeatsForBus);
router.post('/init/:tripId', initializeSeats); // admin/testing: initialize seats for a bus
router.post('/book', bookSeats);

export default router;