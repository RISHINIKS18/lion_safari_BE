import { Router } from 'express';
import { createSafariEnquiry, getSafariEnquiries } from '../controllers/safari.controller.ts';

const router = Router();

/**
 * @openapi
 * /api/safari/enquiry:
 *   post:
 *     summary: Safari Package & Trekking Enquiry Modal CTA
 *     description: Captures direct safari and route enquiries initiated from the SafariModal enquiry tab.
 *     tags:
 *       - Safari Enquiries
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - packageTitle
 *               - travelerName
 *               - travelerEmail
 *               - travelerPhone
 *             properties:
 *               packageTitle:
 *                 type: string
 *                 example: 7-Day Serengeti & Ngorongoro Classic Migration Safari
 *               packageId:
 *                 type: string
 *                 example: tanzania-classic-7d
 *               travelerName:
 *                 type: string
 *                 example: Dr. Sarah Jenkins
 *               travelerEmail:
 *                 type: string
 *                 format: email
 *                 example: sarah.jenkins@example.com
 *               travelerPhone:
 *                 type: string
 *                 example: "+1 (555) 234-5678"
 *               guestCount:
 *                 type: integer
 *                 default: 2
 *                 example: 2
 *               travelMonth:
 *                 type: string
 *                 example: July 2026
 *               safariStyle:
 *                 type: string
 *                 example: Luxury Tented Lodge & Bush Camp
 *               specialNotes:
 *                 type: string
 *                 example: Celebrating our 10th anniversary. Interested in hot air balloon safari.
 *               currency:
 *                 type: string
 *                 default: USD
 *                 example: USD
 *               estimatedPrice:
 *                 type: number
 *                 example: 4500
 *               leadSource:
 *                 type: string
 *                 default: SafariModal_EnquiryTab
 *                 example: SafariModal_EnquiryTab
 *     responses:
 *       201:
 *         description: Bespoke enquiry saved successfully
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
 *                   example: LTS-2026-9104
 *                 message:
 *                   type: string
 *                   example: Thank you! Your bespoke enquiry has been saved and routed to our Arusha safari directors.
 *       400:
 *         description: Validation error
 */
router.post('/enquiry', createSafariEnquiry);

// Optional listing endpoint for admin/review
router.get('/enquiries', getSafariEnquiries);

export default router;
