import express from 'express';
import { createTransactionBuyOrder, createTransfer, getAllTransactions } from '../controllers/transaction.controller.js';
const router = express.Router();

router.post('/',  createTransactionBuyOrder);
router.post('/tranfer',  createTransfer);
router.get('/',  getAllTransactions);

export default router;