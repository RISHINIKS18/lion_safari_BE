import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  void next;
  const isProduction = process.env.NODE_ENV === 'production';

  console.error('API Error:', {
    message: err.message,
    code: err.code,
    path: req.originalUrl,
    method: req.method,
    stack: isProduction ? undefined : err.stack,
  });

  if (err.type === 'entity.parse.failed') {
    res.status(400).json({
      success: false,
      error: 'Invalid JSON payload',
      message: 'The request body could not be parsed as valid JSON.',
    });
    return;
  }

  if (err.code === '23505') {
    res.status(409).json({
      success: false,
      error: 'Conflict Error',
      message: 'A record with this identifier or email already exists.',
      ...(isProduction ? {} : { detail: err.detail }),
    });
    return;
  }

  const statusCode = err.status || err.statusCode || 500;
  const isServerError = statusCode >= 500;

  res.status(statusCode).json({
    success: false,
    error: isServerError && isProduction ? 'Internal Server Error' : err.name || 'Internal Server Error',
    message:
      isServerError && isProduction
        ? 'An unexpected error occurred while processing your request.'
        : err.message || 'An unexpected error occurred while processing your request.',
    ...(!isProduction
      ? {
          code: err.code,
          detail: err.detail,
          hint: err.hint,
        }
      : {}),
  });
}
