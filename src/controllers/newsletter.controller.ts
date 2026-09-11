import { Request, Response, NextFunction } from 'express';
import { executeQuery, inMemoryDb } from '../config/db.ts';
import { isValidEmail } from '../middleware/validator.ts';

export async function subscribeNewsletter(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, source = 'Footer_Savannah_Journal', tags } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'email is required to subscribe.',
      });
      return;
    }

    if (!isValidEmail(email)) {
      res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Please provide a valid email address.',
      });
      return;
    }

    const assignedTags = Array.isArray(tags) && tags.length > 0
      ? tags
      : ['Bush Journal', 'Great Migration Updates'];

    // Postgres Upsert on email conflict
    const queryText = `
      INSERT INTO newsletter_subscribers (email, source, tags, is_active)
      VALUES ($1, $2, $3, true)
      ON CONFLICT (email) 
      DO UPDATE SET is_active = true, source = EXCLUDED.source
      RETURNING id, email, subscribed_at;
    `;

    await executeQuery(queryText, [email.toLowerCase().trim(), source, assignedTags], () => {
      const existing = inMemoryDb.newsletter_subscribers.find(
        (s) => s.email.toLowerCase() === email.toLowerCase().trim()
      );
      if (existing) {
        existing.is_active = true;
        existing.source = source;
        return existing;
      }
      const record = {
        id: inMemoryDb.newsletter_subscribers.length + 1,
        email: email.toLowerCase().trim(),
        source,
        tags: assignedTags,
        is_active: true,
        subscribed_at: new Date().toISOString(),
      };
      inMemoryDb.newsletter_subscribers.unshift(record);
      return record;
    });

    res.status(200).json({
      success: true,
      message: 'Subscribed! You will receive our monthly bush dispatches.',
    });
  } catch (error) {
    next(error);
  }
}

export async function getNewsletterSubscribers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await executeQuery(
      `SELECT id, email, source, tags, is_active, subscribed_at FROM newsletter_subscribers ORDER BY subscribed_at DESC LIMIT 50;`,
      [],
      () => inMemoryDb.newsletter_subscribers
    );
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
}
