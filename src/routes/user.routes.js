import express from 'express';
import { getUserWithDetails } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/:id', getUserWithDetails);

export default router;
