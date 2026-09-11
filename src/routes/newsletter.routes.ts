import { Router } from 'express';
import { subscribeNewsletter, getNewsletterSubscribers } from '../controllers/newsletter.controller.ts';

const router = Router();

/**
 * @openapi
 * /api/newsletter/subscribe:
 *   post:
 *     summary: Savannah Journal Newsletter Opt-In CTA
 *     description: Subscribes user email to Savannah Journal monthly bush dispatches and migration alerts.
 *     tags:
 *       - Newsletter Opt-In
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: wildlife.photographer@nature.org
 *               source:
 *                 type: string
 *                 default: Footer_Savannah_Journal
 *                 example: Footer_Savannah_Journal
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Bush Journal
 *                   - Great Migration Updates
 *     responses:
 *       200:
 *         description: Subscribed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Subscribed! You will receive our monthly bush dispatches.
 *       400:
 *         description: Validation error
 */
router.post('/subscribe', subscribeNewsletter);

router.get('/subscribers', getNewsletterSubscribers);

export default router;
