export const openApiSpec = {
	openapi: "3.0.3",
	info: {
		title: "Clean Room Project API",
		version: "1.0.0",
		description: "Backend API documentation for payload and response testing.",
	},
	servers: [{ url: "http://localhost:3000" }],
	paths: {
		"/": {
			get: {
				summary: "Health check",
				tags: ["health"],
				responses: {
					"200": {
						description: "API status message",
						content: {
							"text/plain": {
								schema: { type: "string", example: "API is running!" },
							},
						},
					},
				},
			},
		},

		"/v1/customers": {
			get: {
				summary: "Get customers",
				tags: ["customer"],
				parameters: [
					{
						name: "admin_customer_id",
						in: "query",
						required: false,
						schema: { type: "string", example: "lnredd" },
						description: "Filter customers by admin id",
					},
				],
				responses: {
					"200": {
						description: "Customers fetched",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										customers: {
											type: "array",
											items: { type: "object", additionalProperties: true },
										},
									},
								},
							},
						},
					},
					"500": {
						description: "Server error",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: { error: { type: "string" } },
								},
							},
						},
					},
				},
			},
		},

		"/v1/customerinfo": {
			post: {
				summary: "Create customer",
				tags: ["customer"],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									admin_id: { type: "integer", example: 10001 },
									customerName: { type: "string", example: "Acme Labs" },
									phoneNumber: { type: "string", example: "+1 222 333 4444" },
									customerAddress: { type: "string", example: "Pune, India" },
									emailAddress: { type: "string", example: "ops@acme.com" },
									additionalNotes: {
										type: "string",
										example: "Priority account",
									},
								},
								required: [
									"customerName",
									"phoneNumber",
									"customerAddress",
									"emailAddress",
								],
							},
						},
					},
				},
				responses: {
					"201": {
						description: "Customer created",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										applicationId: { type: "integer", example: 101 },
									},
								},
							},
						},
					},
					"500": {
						description: "Server error",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: { error: { type: "string" } },
								},
							},
						},
					},
				},
			},
		},

		"/v1/projectinfo": {
			post: {
				summary: "Create project",
				tags: ["project"],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									customer_id: { type: "string", example: "47DFB1B2D46C" },
									uniqueId: { type: "string", example: "PRJ-2026-001" },
									projectName: { type: "string", example: "Sterile Line" },
									unitBranch: { type: "string", example: "Plant A" },
									industry: {
										type: "array",
										items: { type: "string" },
										example: ["Pharma"],
									},
									handling: {
										type: "array",
										items: { type: "string" },
										example: ["Dry Powder"],
									},
									selectedLocation: {
										type: "object",
										properties: {
											display_name: {
												type: "string",
												example: "Pune, Maharashtra, India",
											},
										},
										required: ["display_name"],
									},
									maxTemp: { type: "number", example: 30 },
									minTemp: { type: "number", example: 20 },
									relativeHumidityMin: { type: "number", example: 40 },
									relativeHumidityMax: { type: "number", example: 60 },
								},
								required: [
									"uniqueId",
									"projectName",
									"unitBranch",
									"industry",
									"handling",
									"selectedLocation",
									"maxTemp",
									"minTemp",
									"relativeHumidityMin",
									"relativeHumidityMax",
								],
							},
						},
					},
				},
				responses: {
					"201": {
						description: "Project created",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: { projectId: { type: "integer", example: 2001 } },
								},
							},
						},
					},
					"500": {
						description: "Server error",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: { error: { type: "string" } },
								},
							},
						},
					},
				},
			},
		},

		"/v1/airflow": {
			post: {
				summary: "Calculate airflow",
				tags: ["calculations"],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									roomName: { type: "string", example: "Mixing Room" },
									length: { type: "number", example: 4 },
									width: { type: "number", example: 4 },
									height: { type: "number", example: 2.4 },
									acph: { type: "number", example: 60 },
									freshAirPercent: { type: "number", example: 15 },
									exhaustAir: { type: "number", example: 5 },
									occupancy: { type: "number", example: 3 },
									equipmentLoad: { type: "number", example: 2 },
									lightingLoad: { type: "number", example: 1.75 },
									infiltrationsPerHour: { type: "number", example: 3 },
									minTempC: { type: "number", example: -16.6 },
									maxTempC: { type: "number", example: 43.1 },
									rhMin: { type: "number", example: 8 },
									rhMax: { type: "number", example: 100 },
									zoneReqInsideTempC: {
										oneOf: [
											{ type: "number", example: 32 },
											{ type: "string", example: "32" },
										],
									},
									zoneReqInsideHum: {
										oneOf: [
											{ type: "number", example: 55 },
											{ type: "string", example: "55" },
										],
									},
									zoneSystem: { type: "string", example: "Air Cooling System" },
									zoneSystemType: {
										type: "string",
										example: "Cleanroom Air-Heating System",
									},
									zoneClassification: { type: "string", example: "ISO 8" },
									zoneCoolingMethod: { type: "string", example: "DX" },
									zoneHeatingMethod: { type: "string", example: "Steam" },
								},
								required: [
									"roomName",
									"length",
									"width",
									"height",
									"acph",
									"freshAirPercent",
									"exhaustAir",
									"occupancy",
									"equipmentLoad",
									"lightingLoad",
									"infiltrationsPerHour",
									"minTempC",
									"maxTempC",
									"rhMin",
									"rhMax",
									"zoneReqInsideTempC",
									"zoneReqInsideHum",
									"zoneSystem",
									"zoneClassification",
									"zoneCoolingMethod",
									"zoneHeatingMethod",
								],
							},
						},
					},
				},
				responses: {
					"200": {
						description: "Airflow calculation result",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										roomName: { type: "string" },
										area: { type: "number" },
										volume: { type: "number" },
										roomCfm: { type: "number" },
										freshAir: { type: "number" },
										exhaustAir: { type: "number" },

										dehumidValue: {
											oneOf: [
												{ type: "number" },
												{ type: "string", example: "Invalid" },
											],
										},
										removedWater: {
											oneOf: [
												{ type: "number" },
												{ type: "string", example: "Invalid" },
											],
										},
										resultantCfm: {
											oneOf: [
												{ type: "number" },
												{ type: "string", example: "Invalid" },
											],
										},
										roomACValue: {
											oneOf: [
												{ type: "number" },
												{ type: "string", example: "Invalid" },
											],
										},
										roomTermSupplyValue: {
											oneOf: [
												{ type: "number" },
												{ type: "string", example: "Invalid" },
											],
										},
										cfmACLoadTR: {
											oneOf: [
												{ type: "number" },
												{ type: "string", example: "Invalid" },
											],
										},
										resultCoolLoadTR: {
											oneOf: [
												{ type: "number" },
												{ type: "string", example: "Invalid" },
											],
										},

										addWaterValue: {
											oneOf: [
												{ type: "number" },
												{ type: "string", example: "Invalid" },
											],
										},
										humidValue: {
											oneOf: [
												{ type: "number" },
												{ type: "string", example: "Invalid" },
											],
										},
										resultantheatCfm: {
											oneOf: [
												{ type: "number" },
												{ type: "string", example: "Invalid" },
											],
										},
										roomTermSupplyHeatValue: {
											oneOf: [
												{ type: "number" },
												{ type: "string", example: "Invalid" },
											],
										},
										cfmHeatLoadTRValue: {
											oneOf: [
												{ type: "number" },
												{ type: "string", example: "Invalid" },
											],
										},
										roomHeatLoadTR: {
											oneOf: [
												{ type: "number" },
												{ type: "string", example: "Invalid" },
											],
										},
										resultHeatLoadTR: {
											oneOf: [
												{ type: "number" },
												{ type: "string", example: "Invalid" },
											],
										},
									},
								},
							},
						},
					},
					"500": {
						description: "Server error",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: { error: { type: "string" } },
								},
							},
						},
					},
				},
			},
		},

		"/v1/RoomStandards": {
			post: {
				summary: "Create room standards",
				tags: ["standards"],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									system: { type: "string" },
									systemType: { type: "string" },
									heatingMethod: { type: "string" },
									coolingMethod: { type: "string" },
									standard: { type: "string" },
									classification: { type: "string" },
									acph: { type: "number" },
									tempUnit: { type: "string" },
									reqInsideTempC: { type: "number" },
									reqInsideHum: { type: "number" },
									maxTempC: { type: "number" },
									minTempC: { type: "number" },
									rhMin: { type: "number" },
									rhMax: { type: "number" },
									flowVelocity: { type: "number" },
									flowMedium: { type: "string" },
									heatingFlowVelocity: { type: "number" },
									coolingFlowVelocity: { type: "number" },
								},
							},
						},
					},
				},
				responses: {
					"201": {
						description: "Room standards created",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										roomStandardsId: { type: "integer", example: 5001 },
									},
								},
							},
						},
					},
					"500": {
						description: "Server error",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: { error: { type: "string" } },
								},
							},
						},
					},
				},
			},
		},

		"/v1/projectZones": {
			post: {
				summary: "Create project zone",
				tags: ["project"],
				description:
					"Creates a new project zone for a specific project and returns the generated zoneId.",
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									projectId: {
										type: "string",
										example: "1003",
										description: "ID of the project this zone belongs to",
									},
									zone_name: {
										type: "string",
										example: "Zone 002",
										description: "Optional name for the new zone",
									},
								},
								required: ["projectId"],
							},
						},
					},
				},
				responses: {
					"201": {
						description:
							"Zone created successfully. `zoneId` returned from DB.",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: { zoneId: { type: "integer", example: 7001 } },
								},
							},
						},
					},
					"500": {
						description: "Server error",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: { error: { type: "string" } },
								},
							},
						},
					},
				},
			},
		},

		"/v1/login": {
			post: {
				summary: "User authentication",
				tags: ["login"],
				requestBody: {
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									identifier: { type: "string", example: "admin" },
									password: { type: "string", example: "password123" },
								},
								required: ["identifier", "password"],
							},
						},
					},
				},
				responses: { "200": { description: "Login successful" } },
			},
		},

		"/v1/users": {
			get: {
				summary: "Get all users",
				tags: ["users"],
				responses: { "200": { description: "List of users retrieved" } },
			},
			post: {
				summary: "Create a new user",
				tags: ["users"],
				requestBody: {
					content: {
						"application/json": {
							schema: { type: "object", additionalProperties: true },
						},
					},
				},
				responses: { "201": { description: "User created" } },
			},
		},

		"/v1/users/{id}": {
			delete: {
				summary: "Delete user",
				tags: ["users"],
				parameters: [
					{
						name: "id",
						in: "path",
						required: true,
						schema: { type: "string" },
					},
				],
				responses: { "200": { description: "User deleted" } },
			},
		},

		"/v1/alldetails": {
			get: {
				summary: "Get all inputs for a room",
				tags: ["results"],
				parameters: [
					{
						name: "room_id",
						in: "query",
						required: true,
						schema: { type: "integer" },
					},
				],
				responses: { "200": { description: "Details fetched" } },
			},
		},

		"/v1/roomstandards": {
			get: {
				summary: "Get standards by project",
				tags: ["rooms"],
				parameters: [
					{ name: "project_id", in: "query", schema: { type: "integer" } },
				],
				responses: { "200": { description: "Standards retrieved" } },
			},
			post: {
				summary: "Create room standard",
				tags: ["rooms"],
				responses: { "201": { description: "Standard created" } },
			},
		},

		"/v1/zonerooms": {
			get: {
				summary: "Get rooms by zone",
				tags: ["zones"],
				parameters: [
					{ name: "zone_id", in: "query", schema: { type: "integer" } },
				],
				responses: { "200": { description: "Rooms retrieved" } },
			},
			post: {
				summary: "Add room to zone",
				tags: ["rooms"],
				responses: { "201": { description: "Room added" } },
			},
		},
	},
} as const;
