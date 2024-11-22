import express from 'express';
import { createOrder, getAllOrders } from '../controllers/order.controller.js';
const router = express.Router();
router.get('/',  getAllOrders);
router.post('/',  createOrder);

export default router;