import express from 'express';
import { shortenUrl, resolveUrl } from '../controllers/urlController';

const router = express.Router();

router.post('/shorten', shortenUrl);
router.get('/resolve', resolveUrl);

export default router;