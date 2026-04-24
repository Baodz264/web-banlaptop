import express from 'express';
import exportController from './export.controller.js';

const router = express.Router();

router.get('/', exportController.export);

export default router;
