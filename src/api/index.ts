import { Router } from 'express';
import contactRouter from './contact/contact-router';

const router = Router();

router.use('/contacts', contactRouter);

export default router;
