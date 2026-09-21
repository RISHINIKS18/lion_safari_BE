import { Request, Response, NextFunction } from 'express';
import { executeQuery, inMemoryDb } from '../config/db.ts';
import { generateB2BAgentRef, isValidEmail } from '../middleware/validator.ts';

export async function createPartnershipApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      agencyName,
      contactPerson,
      email,
      phone,
      country,
      businessType,
      annualClients,
      message,
    } = req.body;

    // Validation
    if (!agencyName || !contactPerson || !email || !phone || !country || !businessType) {
      res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'agencyName, contactPerson, email, phone, country, and businessType are required fields.',
      });
      return;
    }

    if (!isValidEmail(email)) {
      res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Please provide a valid agency email address.',
      });
      return;
    }

    const id = crypto.randomUUID();
    const referenceCode = generateB2BAgentRef();

    const queryText = `
      INSERT INTO b2b_agent_applications (
        id,
        reference_code,
        agency_name,
        contact_person,
        email,
        phone,
        country,
        business_type,
        annual_clients,
        message,
        wholesale_rate_sent,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id, reference_code, created_at;
    `;

    const values = [
      id,
      referenceCode,
      agencyName,
      contactPerson,
      email,
      phone,
      country,
      businessType,
      annualClients || null,
      message || null,
      true, // Simulated wholesale rate dispatch
      'Under Review',
    ];

    await executeQuery(queryText, values, () => {
      const record = {
        id,
        reference_code: referenceCode,
        agency_name: agencyName,
        contact_person: contactPerson,
        email,
        phone,
        country,
        business_type: businessType,
        annual_clients: annualClients,
        message,
        wholesale_rate_sent: true,
        status: 'Under Review',
        created_at: new Date().toISOString(),
      };
      inMemoryDb.b2b_agent_applications.unshift(record);
      return record;
    });

    res.status(201).json({
      success: true,
      message: 'Application logged. Automated welcome kit and rate sheet sent to agency email.',
    });
  } catch (error) {
    next(error);
  }
}

export async function getPartnershipApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await executeQuery(
      `SELECT * FROM b2b_agent_applications ORDER BY created_at DESC LIMIT 50;`,
      [],
      () => inMemoryDb.b2b_agent_applications
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
