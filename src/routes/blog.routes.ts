import { Router } from 'express';
import { recordBlogFeedback, getBlogFeedbacks } from '../controllers/blog.controller.ts';

const router = Router();

/**
 * @openapi
 * /api/blog/{id}/feedback:
 *   post:
 *     summary: Blog Reader Helpful Upvotes & Social Shares CTA
 *     description: Records user engagement feedback (helpful upvotes, social shares, bookmarks) on Savannah Journal articles.
 *     tags:
 *       - Blog Feedback
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique article slug or article ID (e.g. tanzania-southern-circuit-vs-northern-circuit)
 *         example: tanzania-southern-circuit-vs-northern-circuit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - interactionType
 *             properties:
 *               interactionType:
 *                 type: string
 *                 example: helpful_upvote
 *                 enum:
 *                   - helpful_upvote
 *                   - social_share
 *                   - bookmark
 *                   - print_itinerary
 *     responses:
 *       201:
 *         description: Feedback recorded successfully
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
 *                   example: Feedback recorded. Thank you for reading the Savannah Journal.
 *       400:
 *         description: Validation error
 */
router.post('/:id/feedback', recordBlogFeedback);

router.get('/:id/feedback', getBlogFeedbacks);
router.get('/feedback', getBlogFeedbacks);

export default router;
