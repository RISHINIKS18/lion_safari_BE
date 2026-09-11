import { Router } from 'express';
import { createPartnershipApplication, getPartnershipApplications } from '../controllers/partnerships.controller.ts';

const router = Router();

/**
 * @openapi
 * /api/partnerships/apply:
 *   post:
 *     summary: B2B Travel Agent & DMC Partnership Form CTA
 *     description: Captures B2B travel agent, tour operator, and DMC partnership onboarding requests.
 *     tags:
 *       - B2B Partnerships
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - agencyName
 *               - contactPerson
 *               - email
 *               - phone
 *               - country
 *               - businessType
 *             properties:
 *               agencyName:
 *                 type: string
 *                 example: Apex Luxury Travel Ltd
 *               contactPerson:
 *                 type: string
 *                 example: Elena Rostova
 *               email:
 *                 type: string
 *                 format: email
 *                 example: elena@apextravel.de
 *               phone:
 *                 type: string
 *                 example: "+49 89 1234567"
 *               country:
 *                 type: string
 *                 example: Germany
 *               businessType:
 *                 type: string
 *                 example: Tour Operator
 *               annualClients:
 *                 type: string
 *                 example: 11-50 clients
 *               message:
 *                 type: string
 *                 example: Seeking ground handling partner for East African safari bookings.
 *     responses:
 *       201:
 *         description: Application logged and welcome kit dispatched
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
 *                   example: Application logged. Automated welcome kit and rate sheet sent to agency email.
 *       400:
 *         description: Validation error
 */
router.post('/apply', createPartnershipApplication);

router.get('/applications', getPartnershipApplications);

export default router;
