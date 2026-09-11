import { Router } from 'express';
import { logQuickContactLead, getQuickContactLeads } from '../controllers/leads.controller.ts';

const router = Router();

/**
 * @openapi
 * /api/leads/quick-contact:
 *   post:
 *     summary: Quick Call & WhatsApp Click Logger CTA
 *     description: Tracks immediate outreach clicks on WhatsApp direct chat and phone dialing widgets.
 *     tags:
 *       - Quick Contact Leads
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - channel
 *             properties:
 *               channel:
 *                 type: string
 *                 example: WhatsApp_Direct
 *               phoneNumberDialed:
 *                 type: string
 *                 default: "+255682801818"
 *                 example: "+255682801818"
 *               pageOrigin:
 *                 type: string
 *                 example: /blog?article=tanzania-southern-circuit-vs-northern-circuit
 *               userLocationHint:
 *                 type: string
 *                 example: en-US,en;q=0.9
 *     responses:
 *       201:
 *         description: Quick contact interaction logged successfully
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
 *                   example: Quick contact interaction logged successfully.
 *       400:
 *         description: Validation error
 */
router.post('/quick-contact', logQuickContactLead);

router.get('/quick-contact', getQuickContactLeads);

export default router;
