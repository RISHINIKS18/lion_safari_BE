import { Request, Response, NextFunction } from 'express';
import { executeQuery, inMemoryDb } from '../config/db.ts';

export async function recordBlogFeedback(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { interactionType } = req.body;

    if (!id) {
      res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Blog article slug or ID is required in the URL path.',
      });
      return;
    }

    if (!interactionType) {
      res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'interactionType is required (e.g. helpful_upvote, social_share, bookmark).',
      });
      return;
    }

    const queryText = `
      INSERT INTO blog_feedbacks (article_slug, interaction_type)
      VALUES ($1, $2)
      RETURNING id, article_slug, interaction_type, created_at;
    `;

    await executeQuery(queryText, [id, interactionType], () => {
      const record = {
        id: inMemoryDb.blog_feedbacks.length + 1,
        article_slug: id,
        interaction_type: interactionType,
        created_at: new Date().toISOString(),
      };
      inMemoryDb.blog_feedbacks.unshift(record);
      return record;
    });

    res.status(201).json({
      success: true,
      message: 'Feedback recorded. Thank you for reading the Savannah Journal.',
    });
  } catch (error) {
    next(error);
  }
}

export async function getBlogFeedbacks(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const queryText = id
      ? `SELECT * FROM blog_feedbacks WHERE article_slug = $1 ORDER BY created_at DESC LIMIT 50;`
      : `SELECT * FROM blog_feedbacks ORDER BY created_at DESC LIMIT 50;`;
    const params = id ? [id] : [];

    const result = await executeQuery(queryText, params, () => {
      if (id) {
        return inMemoryDb.blog_feedbacks.filter((b) => b.article_slug === id);
      }
      return inMemoryDb.blog_feedbacks;
    });

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
}
