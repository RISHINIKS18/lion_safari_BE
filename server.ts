import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { createServer as createViteServer } from 'vite';
import apiRouter from './src/routes/index.ts';
import { swaggerSpec, swaggerDefinition } from './src/config/swagger.ts';
import { errorHandler } from './src/middleware/errorHandler.ts';
import { testDbConnection } from './src/config/db.ts';

dotenv.config();


async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  // Global Core Middlewares
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Swagger UI Documentation
  const activeSpec = swaggerSpec && Object.keys(swaggerSpec.paths || {}).length > 0
    ? swaggerSpec
    : swaggerDefinition;

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(activeSpec, {
      customSiteTitle: 'Lion Track Safari - API Docs',
      customCss: `
        .swagger-ui .topbar { background-color: #1c1917; border-bottom: 2px solid #ea580c; }
        .swagger-ui .topbar-wrapper img { content: url('https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=100&auto=format&fit=crop&q=60'); border-radius: 6px; width: 36px; height: 36px; object-fit: cover; }
      `,
    })
  );

  // Raw OpenAPI Specification route for Postman / curl
  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(activeSpec);
  });

  // Mount Master CTA API Endpoints
  app.use('/api', apiRouter);

  // Centralized Error Handler for API errors
  app.use(errorHandler);

  // Test DB Connection in background (non-blocking)
  testDbConnection().catch((err) => {
    console.warn('Initial DB test caught:', err.message);
  });

  // Vite Middleware for Frontend Interactive Console
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`🦁 LION TRACK SAFARI - CTA & LEAD API SERVER`);
    console.log(`🚀 API Base URL:      http://0.0.0.0:${PORT}/api`);
    console.log(`📚 Swagger UI Docs:   http://0.0.0.0:${PORT}/api-docs`);
    console.log(`📄 OpenAPI JSON:      http://0.0.0.0:${PORT}/api/docs.json`);
    console.log(`🏥 Health Endpoint:   http://0.0.0.0:${PORT}/api/health`);
    console.log(`====================================================`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
