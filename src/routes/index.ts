import { Router } from 'express';
import safariRouter from './safari.routes.ts';
import customSafariRouter from './customSafari.routes.ts';
import partnershipsRouter from './partnerships.routes.ts';
import newsletterRouter from './newsletter.routes.ts';
import leadsRouter from './leads.routes.ts';
import blogRouter from './blog.routes.ts';
import { getDbStatus, testDbConnection } from '../config/db.ts';

const apiRouter = Router();

// CTA 1: Safari Package & Route Enquiries
apiRouter.use('/safari', safariRouter);

// CTA 2: Custom Safari Itinerary Quotes
apiRouter.use('/custom-safari', customSafariRouter);

// CTA 3: B2B Travel Agent & DMC Applications
apiRouter.use('/partnerships', partnershipsRouter);

// CTA 4: Savannah Journal Newsletter Opt-in
apiRouter.use('/newsletter', newsletterRouter);

// CTA 5: Quick Call & WhatsApp Click Logger
apiRouter.use('/leads', leadsRouter);

// CTA 6: Blog Article Feedback & Social Upvotes
apiRouter.use('/blog', blogRouter);

// System Health & Database Diagnostics
apiRouter.get('/health', async (req, res) => {
  const force = req.query.force === 'true';
  const isConnected = await testDbConnection(force);
  const dbStatus = getDbStatus();

  res.json({
    status: 'ok',
    service: 'Lion Track Safari - CTA Lead Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: {
      connected: isConnected,
      engine: dbStatus.storageEngine,
      postgresConfigured: dbStatus.postgresConfigured,
      targetHost: dbStatus.targetHost,
      targetDatabase: dbStatus.targetDatabase,
      lastError: dbStatus.lastConnectionError,
      activeRecords: dbStatus.counts,
    },
    endpoints: [
      { name: 'CTA 1 - Safari Enquiry', method: 'POST', path: '/api/safari/enquiry' },
      { name: 'CTA 2 - Custom Safari Quote', method: 'POST', path: '/api/custom-safari/quote' },
      { name: 'CTA 3 - B2B Agent Partnership', method: 'POST', path: '/api/partnerships/apply' },
      { name: 'CTA 4 - Newsletter Subscription', method: 'POST', path: '/api/newsletter/subscribe' },
      { name: 'CTA 5 - Quick Contact Log', method: 'POST', path: '/api/leads/quick-contact' },
      { name: 'CTA 6 - Blog Feedback', method: 'POST', path: '/api/blog/:id/feedback' },
    ],
    documentation: '/api-docs',
  });
});

export default apiRouter;
