import { Request, Response, NextFunction } from 'express';
import { executeQuery, inMemoryDb } from '../config/db.ts';

export async function logQuickContactLead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      channel,
      phoneNumberDialed = '+255682801818',
      pageOrigin,
      userLocationHint,
    } = req.body;

    if (!channel) {
      res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'channel is required (e.g. WhatsApp_Direct, Direct_Call, Floating_Bar).',
      });
      return;
    }

    const locationHint = userLocationHint || (req.headers['accept-language'] ? req.headers['accept-language'].slice(0, 50) : null);

    const queryText = `
      INSERT INTO quick_contact_leads (
        channel,
        phone_number_dialed,
        page_origin,
        user_location_hint
      ) VALUES ($1, $2, $3, $4)
      RETURNING id, channel, clicked_at;
    `;

    const values = [
      channel,
      phoneNumberDialed || '+255682801818',
      pageOrigin || null,
      locationHint,
    ];

    await executeQuery(queryText, values, () => {
      const record = {
        id: crypto.randomUUID(),
        channel,
        phone_number_dialed: phoneNumberDialed || '+255682801818',
        page_origin: pageOrigin,
        user_location_hint: locationHint,
        clicked_at: new Date().toISOString(),
      };
      inMemoryDb.quick_contact_leads.unshift(record);
      return record;
    });

    res.status(201).json({
      success: true,
      message: 'Quick contact interaction logged successfully.',
    });
  } catch (error) {
    next(error);
  }
}

export async function getQuickContactLeads(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await executeQuery(
      `SELECT * FROM quick_contact_leads ORDER BY clicked_at DESC LIMIT 50;`,
      [],
      () => inMemoryDb.quick_contact_leads
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
