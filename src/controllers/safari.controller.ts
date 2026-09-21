import { Request, Response, NextFunction } from 'express';
import { executeQuery, inMemoryDb } from '../config/db.ts';
import { generateSafariEnquiryRef, getClientIp, isValidEmail } from '../middleware/validator.ts';

export async function createSafariEnquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      packageTitle,
      packageId,
      travelerName,
      travelerEmail,
      travelerPhone,
      guestCount = 2,
      travelMonth,
      safariStyle,
      specialNotes,
      currency = 'USD',
      estimatedPrice,
      leadSource = 'SafariModal_EnquiryTab',
    } = req.body;

    // Validation
    if (!packageTitle || !travelerName || !travelerEmail || !travelerPhone) {
      res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'packageTitle, travelerName, travelerEmail, and travelerPhone are required.',
      });
      return;
    }

    if (!isValidEmail(travelerEmail)) {
      res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Please provide a valid traveler email address.',
      });
      return;
    }

    const id = crypto.randomUUID();
    const referenceCode = generateSafariEnquiryRef();
    const ipAddress = getClientIp(req);
    const userAgent = req.headers['user-agent'] || '';

    const queryText = `
      INSERT INTO safari_enquiries (
        id,
        reference_code,
        package_title,
        package_id,
        traveler_name,
        traveler_email,
        traveler_phone,
        guest_count,
        travel_month,
        safari_style,
        special_notes,
        currency,
        estimated_price,
        lead_source,
        ip_address,
        user_agent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING id, reference_code, created_at;
    `;

    const values = [
      id,
      referenceCode,
      packageTitle,
      packageId || null,
      travelerName,
      travelerEmail,
      travelerPhone,
      parseInt(guestCount, 10) || 2,
      travelMonth || null,
      safariStyle || null,
      specialNotes || null,
      currency || 'USD',
      estimatedPrice !== undefined && estimatedPrice !== null ? parseFloat(estimatedPrice) : null,
      leadSource || 'SafariModal_EnquiryTab',
      ipAddress,
      userAgent,
    ];

    await executeQuery(queryText, values, () => {
      const record = {
        id,
        reference_code: referenceCode,
        package_title: packageTitle,
        package_id: packageId,
        traveler_name: travelerName,
        traveler_email: travelerEmail,
        traveler_phone: travelerPhone,
        guest_count: guestCount,
        travel_month: travelMonth,
        safari_style: safariStyle,
        special_notes: specialNotes,
        currency: currency,
        estimated_price: estimatedPrice,
        lead_source: leadSource,
        status: 'New Lead',
        ip_address: ipAddress,
        user_agent: userAgent,
        created_at: new Date().toISOString(),
      };
      inMemoryDb.safari_enquiries.unshift(record);
      return record;
    });

    res.status(201).json({
      success: true,
      referenceCode,
      message: 'Thank you! Your bespoke enquiry has been saved and routed to our Arusha safari directors.',
    });
  } catch (error) {
    next(error);
  }
}

export async function getSafariEnquiries(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await executeQuery(
      `SELECT * FROM safari_enquiries ORDER BY created_at DESC LIMIT 50;`,
      [],
      () => inMemoryDb.safari_enquiries
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
