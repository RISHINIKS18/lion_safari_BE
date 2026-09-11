import { Request, Response, NextFunction } from 'express';

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function generateSafariEnquiryRef(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `LTS-${year}-${rand}`;
}

export function generateCustomSafariRef(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `LTS-CUSTOM-${rand}`;
}

export function generateB2BAgentRef(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `LTS-B2B-${rand}`;
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

export function validateRequiredFields(fields: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missing: string[] = [];
    for (const field of fields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: `Missing required fields: ${missing.join(', ')}`,
        missingFields: missing,
      });
      return;
    }

    next();
  };
}
