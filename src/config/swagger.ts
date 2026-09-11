import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: '🦁 Lion Track Safari - Master CTA & Lead Generation API',
    version: '1.0.0',
    description: `
**Lion Track Safari** Call to Action (CTA) and Lead Generation Engine.
Engineered for capturing high-value luxury safari inquiries, bespoke itinerary builders, B2B partner applications, and direct lead generation across all brand touchpoints.

### Key Architecture:
- **Runtime**: Node.js & Express.js
- **Database**: PostgreSQL 13+ with connection pooling via \`pg\`
- **Tables**: \`safari_enquiries\`, \`custom_safari_requests\`, \`b2b_agent_applications\`, \`newsletter_subscribers\`, \`quick_contact_leads\`, \`blog_feedbacks\`
    `,
    contact: {
      name: 'Lion Track Safari - Arusha Head Office',
      email: 'directors@liontracksafari.com',
      url: 'https://liontracksafari.com',
    },
  },
  servers: [
    {
      url: '/',
      description: 'Current Environment Host',
    },
  ],
  tags: [
    {
      name: 'Safari Enquiries',
      description: 'CTA 1: Direct Safari & Route Enquiries from SafariModal',
    },
    {
      name: 'Custom Safari Quotes',
      description: 'CTA 2: 12-Field Bespoke Safari Builder from /contact',
    },
    {
      name: 'B2B Partnerships',
      description: 'CTA 3: Travel Agent & DMC Partnership Applications',
    },
    {
      name: 'Newsletter Opt-In',
      description: 'CTA 4: Savannah Journal Newsletter Opt-Ins',
    },
    {
      name: 'Quick Contact Leads',
      description: 'CTA 5: Quick Call & WhatsApp Click Logger',
    },
    {
      name: 'Blog Feedback',
      description: 'CTA 6: Reader Helpful Upvotes & Social Shares',
    },
    {
      name: 'System Health',
      description: 'Health checks & Database Connectivity Diagnostics',
    },
  ],
  paths: {
    '/api/safari/enquiry': {
      post: {
        tags: ['Safari Enquiries'],
        summary: 'CTA 1: Safari Package & Trekking Enquiry Modal',
        description: 'Captures direct package and route inquiries from the SafariModal booking window.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SafariEnquiryRequest',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Enquiry created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SafariEnquiryResponse',
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
      get: {
        tags: ['Safari Enquiries'],
        summary: 'List Recent Safari Enquiries (Review)',
        responses: {
          '200': {
            description: 'List of recent enquiries',
          },
        },
      },
    },
    '/api/custom-safari/quote': {
      post: {
        tags: ['Custom Safari Quotes'],
        summary: 'CTA 2: 12-Field Bespoke Safari Builder & Contact Quote',
        description: 'Captures multi-field custom tailor-made itinerary requests from the /contact builder.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CustomSafariQuoteRequest',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Custom safari blueprint logged successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CustomSafariQuoteResponse',
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
      get: {
        tags: ['Custom Safari Quotes'],
        summary: 'List Recent Custom Safari Quotes (Review)',
        responses: {
          '200': {
            description: 'List of custom quotes',
          },
        },
      },
    },
    '/api/partnerships/apply': {
      post: {
        tags: ['B2B Partnerships'],
        summary: 'CTA 3: B2B Travel Agent & DMC Partnership Form',
        description: 'Captures B2B travel agent, tour operator, and DMC applications for wholesale safari rates.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/B2BPartnershipRequest',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Application logged and welcome kit dispatched',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/B2BPartnershipResponse',
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
      get: {
        tags: ['B2B Partnerships'],
        summary: 'List B2B Agent Applications (Review)',
        responses: {
          '200': {
            description: 'List of partner applications',
          },
        },
      },
    },
    '/api/newsletter/subscribe': {
      post: {
        tags: ['Newsletter Opt-In'],
        summary: 'CTA 4: Savannah Journal Newsletter Opt-In',
        description: 'Subscribes traveler email to monthly bush dispatches and Great Migration updates.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/NewsletterSubscribeRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Subscribed successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/NewsletterSubscribeResponse',
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
      get: {
        tags: ['Newsletter Opt-In'],
        summary: 'List Newsletter Subscribers (Review)',
        responses: {
          '200': {
            description: 'List of subscribers',
          },
        },
      },
    },
    '/api/leads/quick-contact': {
      post: {
        tags: ['Quick Contact Leads'],
        summary: 'CTA 5: Quick Call & WhatsApp Click Logger',
        description: 'Captures user clicks on WhatsApp direct chats and floating call buttons.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/QuickContactRequest',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Quick contact interaction logged',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/QuickContactResponse',
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
      get: {
        tags: ['Quick Contact Leads'],
        summary: 'List Quick Contact Interactions (Review)',
        responses: {
          '200': {
            description: 'List of quick contact logs',
          },
        },
      },
    },
    '/api/blog/{id}/feedback': {
      post: {
        tags: ['Blog Feedback'],
        summary: 'CTA 6: Blog Article Upvote & Share Feedback',
        description: 'Captures helpful upvotes, social shares, and bookmarks for a specific blog article.',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Article slug or ID',
            example: 'tanzania-southern-circuit-vs-northern-circuit',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/BlogFeedbackRequest',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Feedback recorded successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BlogFeedbackResponse',
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
      get: {
        tags: ['Blog Feedback'],
        summary: 'List Blog Feedback for Article',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
            },
            example: 'tanzania-southern-circuit-vs-northern-circuit',
          },
        ],
        responses: {
          '200': {
            description: 'List of feedbacks',
          },
        },
      },
    },
    '/api/health': {
      get: {
        tags: ['System Health'],
        summary: 'System Health & PostgreSQL Diagnostics',
        responses: {
          '200': {
            description: 'Health check passed',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      SafariEnquiryRequest: {
        type: 'object',
        required: ['packageTitle', 'travelerName', 'travelerEmail', 'travelerPhone'],
        properties: {
          packageTitle: {
            type: 'string',
            example: '7-Day Serengeti & Ngorongoro Classic Migration Safari',
          },
          packageId: {
            type: 'string',
            example: 'tanzania-classic-7d',
          },
          travelerName: {
            type: 'string',
            example: 'Dr. Sarah Jenkins',
          },
          travelerEmail: {
            type: 'string',
            format: 'email',
            example: 'sarah.jenkins@example.com',
          },
          travelerPhone: {
            type: 'string',
            example: '+1 (555) 234-5678',
          },
          guestCount: {
            type: 'integer',
            default: 2,
            example: 2,
          },
          travelMonth: {
            type: 'string',
            example: 'July 2026',
          },
          safariStyle: {
            type: 'string',
            example: 'Luxury Tented Lodge & Bush Camp',
          },
          specialNotes: {
            type: 'string',
            example: 'Celebrating our 10th anniversary. Interested in hot air balloon safari.',
          },
          currency: {
            type: 'string',
            default: 'USD',
            example: 'USD',
          },
          estimatedPrice: {
            type: 'number',
            example: 4500,
          },
          leadSource: {
            type: 'string',
            default: 'SafariModal_EnquiryTab',
            example: 'SafariModal_EnquiryTab',
          },
        },
      },
      SafariEnquiryResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          referenceCode: {
            type: 'string',
            example: 'LTS-2026-9104',
          },
          message: {
            type: 'string',
            example: 'Thank you! Your bespoke enquiry has been saved and routed to our Arusha safari directors.',
          },
        },
      },
      CustomSafariQuoteRequest: {
        type: 'object',
        required: ['fullName', 'email', 'phone', 'destinations'],
        properties: {
          fullName: {
            type: 'string',
            example: 'Marcus Vance',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'm.vance@company.com',
          },
          phone: {
            type: 'string',
            example: '+44 7700 900077',
          },
          country: {
            type: 'string',
            example: 'United Kingdom',
          },
          travelStyle: {
            type: 'string',
            example: 'Private Group Safari',
          },
          destinations: {
            type: 'array',
            items: {
              type: 'string',
            },
            example: [
              'Serengeti National Park',
              'Ngorongoro Crater',
              'Tarangire National Park',
              'Zanzibar Island',
            ],
          },
          duration: {
            type: 'string',
            example: '8 - 10 Days',
          },
          travelers: {
            type: 'string',
            example: '4 Adults',
          },
          travelDate: {
            type: 'string',
            example: 'August 2026',
          },
          budgetPreference: {
            type: 'string',
            example: 'Luxury Tented Camps ($4,500 - $6,500 / person)',
          },
          accommodationType: {
            type: 'string',
            example: 'Luxury Tented Safari Lodges',
          },
          specialRequests: {
            type: 'string',
            example: 'Private photographic guide and interconnected tents.',
          },
          howHeard: {
            type: 'string',
            example: 'Recommendation / Referral',
          },
          subject: {
            type: 'string',
            example: 'Private Family Great Migration & Zanzibar Extension',
          },
          message: {
            type: 'string',
            example: 'We would like to land at Kilimanjaro (JRO) and depart from Zanzibar (ZNZ).',
          },
        },
      },
      CustomSafariQuoteResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          referenceCode: {
            type: 'string',
            example: 'LTS-CUSTOM-8492',
          },
          message: {
            type: 'string',
            example: 'Asante sana! Your safari blueprint has been logged for custom itinerary planning.',
          },
        },
      },
      B2BPartnershipRequest: {
        type: 'object',
        required: ['agencyName', 'contactPerson', 'email', 'phone', 'country', 'businessType'],
        properties: {
          agencyName: {
            type: 'string',
            example: 'Apex Luxury Travel Ltd',
          },
          contactPerson: {
            type: 'string',
            example: 'Elena Rostova',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'elena@apextravel.de',
          },
          phone: {
            type: 'string',
            example: '+49 89 1234567',
          },
          country: {
            type: 'string',
            example: 'Germany',
          },
          businessType: {
            type: 'string',
            example: 'Tour Operator',
          },
          annualClients: {
            type: 'string',
            example: '11-50 clients',
          },
          message: {
            type: 'string',
            example: 'Seeking ground handling partner for East African safari bookings.',
          },
        },
      },
      B2BPartnershipResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Application logged. Automated welcome kit and rate sheet sent to agency email.',
          },
        },
      },
      NewsletterSubscribeRequest: {
        type: 'object',
        required: ['email'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'wildlife.photographer@nature.org',
          },
          source: {
            type: 'string',
            default: 'Footer_Savannah_Journal',
            example: 'Footer_Savannah_Journal',
          },
          tags: {
            type: 'array',
            items: {
              type: 'string',
            },
            example: ['Bush Journal', 'Great Migration Updates'],
          },
        },
      },
      NewsletterSubscribeResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Subscribed! You will receive our monthly bush dispatches.',
          },
        },
      },
      QuickContactRequest: {
        type: 'object',
        required: ['channel'],
        properties: {
          channel: {
            type: 'string',
            example: 'WhatsApp_Direct',
          },
          phoneNumberDialed: {
            type: 'string',
            default: '+255682801818',
            example: '+255682801818',
          },
          pageOrigin: {
            type: 'string',
            example: '/blog?article=tanzania-southern-circuit-vs-northern-circuit',
          },
          userLocationHint: {
            type: 'string',
            example: 'en-US,en;q=0.9',
          },
        },
      },
      QuickContactResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Quick contact interaction logged successfully.',
          },
        },
      },
      BlogFeedbackRequest: {
        type: 'object',
        required: ['interactionType'],
        properties: {
          interactionType: {
            type: 'string',
            enum: ['helpful_upvote', 'social_share', 'bookmark', 'print_itinerary'],
            example: 'helpful_upvote',
          },
        },
      },
      BlogFeedbackResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Feedback recorded. Thank you for reading the Savannah Journal.',
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'string',
            example: 'Validation Error',
          },
          message: {
            type: 'string',
            example: 'Missing required field: travelerName',
          },
        },
      },
    },
  },
};

const options: swaggerJsdoc.Options = {
  definition: swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
