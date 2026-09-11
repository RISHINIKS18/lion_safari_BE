import { Router } from 'express';
import { createCustomSafariQuote, getCustomSafariQuotes } from '../controllers/customSafari.controller.ts';

const router = Router();

/**
 * @openapi
 * /api/custom-safari/quote:
 *   post:
 *     summary: 12-Field Bespoke Safari Builder & Contact Quote CTA
 *     description: Captures custom tailor-made safari requests and itineraries submitted from the /contact itinerary builder.
 *     tags:
 *       - Custom Safari Quotes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - phone
 *               - destinations
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Marcus Vance
 *               email:
 *                 type: string
 *                 format: email
 *                 example: m.vance@company.com
 *               phone:
 *                 type: string
 *                 example: "+44 7700 900077"
 *               country:
 *                 type: string
 *                 example: United Kingdom
 *               travelStyle:
 *                 type: string
 *                 example: Private Group Safari
 *               destinations:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Serengeti National Park
 *                   - Ngorongoro Crater
 *                   - Tarangire National Park
 *                   - Zanzibar Island
 *               duration:
 *                 type: string
 *                 example: 8 - 10 Days
 *               travelers:
 *                 type: string
 *                 example: 4 Adults
 *               travelDate:
 *                 type: string
 *                 example: August 2026
 *               budgetPreference:
 *                 type: string
 *                 example: Luxury Tented Camps ($4,500 - $6,500 / person)
 *               accommodationType:
 *                 type: string
 *                 example: Luxury Tented Safari Lodges
 *               specialRequests:
 *                 type: string
 *                 example: Private photographic guide and interconnected tents.
 *               howHeard:
 *                 type: string
 *                 example: Recommendation / Referral
 *               subject:
 *                 type: string
 *                 example: Private Family Great Migration & Zanzibar Extension
 *               message:
 *                 type: string
 *                 example: We would like to land at Kilimanjaro (JRO) and depart from Zanzibar (ZNZ).
 *     responses:
 *       201:
 *         description: Bespoke safari blueprint saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 referenceCode:
 *                   type: string
 *                   example: LTS-CUSTOM-8492
 *                 message:
 *                   type: string
 *                   example: Asante sana! Your safari blueprint has been logged for custom itinerary planning.
 *       400:
 *         description: Validation error
 */
router.post('/quote', createCustomSafariQuote);

router.get('/quotes', getCustomSafariQuotes);

export default router;
