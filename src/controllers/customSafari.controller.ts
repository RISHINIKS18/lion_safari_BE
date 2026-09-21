import { Request, Response, NextFunction } from 'express';
import { executeQuery, inMemoryDb } from '../config/db.ts';
import { generateCustomSafariRef, isValidEmail } from '../middleware/validator.ts';

export async function createCustomSafariQuote(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      fullName,
      email,
      phone,
      country,
      countryOfResidence,
      travelStyle,
      destinations,
      duration,
      travelers,
      travelDate,
      travelDateWindow,
      budgetPreference,
      accommodationType,
      specialRequests,
      howHeard,
      referralSource,
      subject,
      message,
    } = req.body;

    // Validation
    if (!fullName || !email || !phone) {
      res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'fullName, email, and phone are required.',
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

    if (!destinations || (Array.isArray(destinations) && destinations.length === 0)) {
      res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'destinations must be provided as a non-empty array or JSON object.',
      });
      return;
    }

    const id = crypto.randomUUID();
    const referenceCode = generateCustomSafariRef();
    const destinationsJson = typeof destinations === 'string' ? destinations : JSON.stringify(destinations);
    const countryVal = country || countryOfResidence || null;
    const travelDateVal = travelDate || travelDateWindow || null;
    const referralVal = howHeard || referralSource || null;

    const queryText = `
      INSERT INTO custom_safari_requests (
        id,
        reference_code,
        full_name,
        email,
        phone,
        country_of_residence,
        travel_style,
        destinations,
        duration,
        travelers,
        travel_date_window,
        budget_preference,
        accommodation_type,
        special_requests,
        referral_source,
        subject,
        message,
        assigned_director
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING id, reference_code, created_at;
    `;

    const values = [
      id,
      referenceCode,
      fullName,
      email,
      phone,
      countryVal,
      travelStyle || null,
      destinationsJson,
      duration || null,
      travelers || null,
      travelDateVal,
      budgetPreference || null,
      accommodationType || null,
      specialRequests || null,
      referralVal,
      subject || null,
      message || null,
      'Arusha Head Specialist',
    ];

    await executeQuery(queryText, values, () => {
      const record = {
        id,
        reference_code: referenceCode,
        full_name: fullName,
        email,
        phone,
        country_of_residence: countryVal,
        travel_style: travelStyle,
        destinations: typeof destinations === 'string' ? JSON.parse(destinations) : destinations,
        duration,
        travelers,
        travel_date_window: travelDateVal,
        budget_preference: budgetPreference,
        accommodation_type: accommodationType,
        special_requests: specialRequests,
        referral_source: referralVal,
        subject,
        message,
        status: 'Pending Review',
        assigned_director: 'Arusha Head Specialist',
        created_at: new Date().toISOString(),
      };
      inMemoryDb.custom_safari_requests.unshift(record);
      return record;
    });

    res.status(201).json({
      success: true,
      referenceCode,
      message: 'Asante sana! Your safari blueprint has been logged for custom itinerary planning.',
    });
  } catch (error) {
    next(error);
  }
}

export async function getCustomSafariQuotes(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await executeQuery(
      `SELECT * FROM custom_safari_requests ORDER BY created_at DESC LIMIT 50;`,
      [],
      () => inMemoryDb.custom_safari_requests
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
