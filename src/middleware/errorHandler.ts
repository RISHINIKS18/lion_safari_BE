import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('API Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.originalUrl,
    method: req.method,
  });

  if (err.type === 'entity.parse.failed') {
    res.status(400).json({
      success: false,
      error: 'Invalid JSON payload',
      message: 'The request body could not be parsed as valid JSON.',
    });
    return;
  }

  // Handle unique constraint violation in Postgres
  if (err.code === '23505') {
    res.status(409).json({
      success: false,
      error: 'Conflict Error',
      message: 'A record with this identifier or email already exists.',
      detail: err.detail,
    });
    return;
  }

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred while processing your request.',
  });
}
