export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Clean Room Project API',
    version: '1.0.0',
    description: 'Backend API documentation for payload and response testing.',
  },
  servers: [{ url: 'http://localhost:3000' }],
  paths: {
    '/': {
      get: {
        summary: 'Health check',
        responses: {
          '200': {
            description: 'API status message',
            content: {
              'text/plain': {
                schema: { type: 'string', example: 'API is running!' },
              },
            },
          },
        },
      },
    },
    '/v1/customers': {
      get: {
        summary: 'Get customers',
        parameters: [
          {
            name: 'admin_id',
            in: 'query',
            required: false,
            schema: { type: 'integer', example: 10001 },
            description: 'Filter customers by admin id',
          },
        ],
        responses: {
          '200': {
            description: 'Customers fetched',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    customers: {
                      type: 'array',
                      items: { type: 'object', additionalProperties: true },
                    },
                  },
                },
              },
            },
          },
          '500': {
            description: 'Server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { error: { type: 'string' } },
                },
              },
            },
          },
        },
      },
    },
    '/v1/customerinfo': {
      post: {
        summary: 'Create customer',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  admin_id: { type: 'integer', example: 10001 },
                  customerName: { type: 'string', example: 'Acme Labs' },
                  phoneNumber: { type: 'string', example: '+1 222 333 4444' },
                  customerAddress: { type: 'string', example: 'Pune, India' },
                  emailAddress: { type: 'string', example: 'ops@acme.com' },
                  additionalNotes: { type: 'string', example: 'Priority account' },
                },
                required: ['customerName', 'phoneNumber', 'customerAddress', 'emailAddress'],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Customer created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { applicationId: { type: 'integer', example: 101 } },
                },
              },
            },
          },
          '500': {
            description: 'Server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { error: { type: 'string' } },
                },
              },
            },
          },
        },
      },
    },
    '/v1/projectinfo': {
      post: {
        summary: 'Create project',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  customer_id: { type: 'string', example: '47DFB1B2D46C' },
                  uniqueId: { type: 'string', example: 'PRJ-2026-001' },
                  projectName: { type: 'string', example: 'Sterile Line' },
                  unitBranch: { type: 'string', example: 'Plant A' },
                  industry: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['Pharma'],
                  },
                  handling: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['Dry Powder'],
                  },
                  selectedLocation: {
                    type: 'object',
                    properties: { display_name: { type: 'string', example: 'Pune, Maharashtra, India' } },
                    required: ['display_name'],
                  },
                  maxTemp: { type: 'number', example: 30 },
                  minTemp: { type: 'number', example: 20 },
                  relativeHumidityMin: { type: 'number', example: 40 },
                  relativeHumidityMax: { type: 'number', example: 60 },
                },
                required: [
                  'uniqueId',
                  'projectName',
                  'unitBranch',
                  'industry',
                  'handling',
                  'selectedLocation',
                  'maxTemp',
                  'minTemp',
                  'relativeHumidityMin',
                  'relativeHumidityMax',
                ],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Project created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { projectId: { type: 'integer', example: 2001 } },
                },
              },
            },
          },
          '500': {
            description: 'Server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { error: { type: 'string' } },
                },
              },
            },
          },
        },
      },
    },
    '/v1/airflow': {
      post: {
        summary: 'Calculate airflow',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  roomName: { type: 'string', example: 'Mixing Room' },
                  length: { type: 'number', example: 6.5 },
                  width: { type: 'number', example: 4.2 },
                  height: { type: 'number', example: 3.1 },
                  acph: { type: 'number', example: 20 },
                  freshAirPercent: { type: 'number', example: 30 },
                  exhaustAir: { type: 'number', example: 10 },
                  zoneSystem: { type: 'string', example: 'Ventilation System' },
                  zoneSystemType: { type: 'string', example: 'Ventilation System' },
                },
                required: ['roomName', 'length', 'width', 'height', 'acph', 'freshAirPercent', 'exhaustAir'],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Airflow calculation result',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    roomName: { type: 'string' },
                    areaFt2: { type: 'number' },
                    volumeFt3: { type: 'number' },
                    roomCfm: { type: 'number' },
                    freshAir: { type: 'number' },
                    exhaustAir: { type: 'number' },
                  },
                },
              },
            },
          },
          '500': {
            description: 'Server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { error: { type: 'string' } },
                },
              },
            },
          },
        },
      },
    },
    '/v1/RoomStandards': {
      post: {
        summary: 'Create room standards',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  system: { type: 'string' },
                  systemType: { type: 'string' },
                  heatingMethod: { type: 'string' },
                  coolingMethod: { type: 'string' },
                  standard: { type: 'string' },
                  classification: { type: 'string' },
                  acph: { type: 'number' },
                  tempUnit: { type: 'string' },
                  reqInsideTempC: { type: 'number' },
                  reqInsideHum: { type: 'number' },
                  maxTempC: { type: 'number' },
                  minTempC: { type: 'number' },
                  rhMin: { type: 'number' },
                  rhMax: { type: 'number' },
                  flowVelocity: { type: 'number' },
                  flowMedium: { type: 'string' },
                  heatingFlowVelocity: { type: 'number' },
                  coolingFlowVelocity: { type: 'number' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Room standards created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { roomStandardsId: { type: 'integer', example: 5001 } },
                },
              },
            },
          },
          '500': {
            description: 'Server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { error: { type: 'string' } },
                },
              },
            },
          },
        },
      },
    },
    '/v1/projectZones': {
      post: {
        summary: 'Create project zone',
        description: 'Creates a new project zone and returns the generated zoneId. No payload required.',
        responses: {
          '201': {
            description: 'Zone created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { zoneId: { type: 'integer', example: 7001 } },
                },
              },
            },
          },
          '500': {
            description: 'Server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { error: { type: 'string' } },
                },
              },
            },
          },
        },
      },
    },
  },
} as const;
