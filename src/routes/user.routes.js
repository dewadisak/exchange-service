import express from 'express';
import { getUserWithDetails, getAllUsers } from '../controllers/user.controller.js';

const router = express.Router();
router.get('/', getAllUsers);
router.get('/:id', getUserWithDetails);

export default router;
