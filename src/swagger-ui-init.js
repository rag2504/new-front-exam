
window.onload = function() {
  // Build a system
  var url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  var options = {
  "swaggerDoc": {
    "openapi": "3.0.3",
    "info": {
      "title": "Clinic Queue Management API",
      "description": "## Overview\n\n**Clinic Queue Management System (CMS)** is a full-stack, multi-tenant clinic management API. It supports multiple clinics; each clinic has its own admin, doctors, receptionists, and patients. All data is **scoped by clinic** – users only see and act on data for their assigned clinic.\n\n**Student accounts:** Each student receives a unique username and password that is **already linked to a specific clinic**. When implementing the frontend, students must build the UI and flows for **their assigned clinic only**, using the credentials they receive.\n\n**Student login (for frontend implementation):**\n\n- **Username:** `enrollment@darshan.ac.in`\n- **Password:** `password123`\n\n---\n\n## Authentication\n\n- **Login:** `POST /auth/login` with `email` and `password`. Returns a **JWT** and user object (id, name, email, role, clinicId, clinicName, clinicCode).\n- **Protected endpoints:** Send the token in the header: `Authorization: Bearer <token>`.\n- **JWT payload** includes `userId`, `role`, and `clinicId`. The API uses these to enforce role-based access and clinic isolation.\n- **No public registration.** Clinics and admins are created via database seed or backend script; admins create receptionists, doctors, and patients from the Admin UI. New users sign in with the email/password set by the admin.\n\n**Errors:** `401` = missing or invalid token; `403` = valid token but role not allowed or user has no clinic.\n\n---\n\n## Roles & Capabilities\n\n| Role | Description | Main actions |\n|------|-------------|--------------|\n| **Admin** | Owns one clinic. | View clinic info and counts; list users; **create** receptionists, doctors, and patients (name, email, password, role). |\n| **Patient** | Belongs to one clinic. | Book appointments; view **my** appointments (with queue token/status); view appointment details with prescription and report; view **my** prescriptions and **my** reports. |\n| **Receptionist** | Belongs to one clinic. | Get daily queue for a date (`date=YYYY-MM-DD`); update queue entry status (waiting → in-progress/skipped, in-progress → done). |\n| **Doctor** | Belongs to one clinic. | Get **today's** queue (token, patient, appointmentId); add **prescription** (medicines, notes) and **report** (diagnosis, tests, remarks) for an appointment. |\n\nEach role can access only its allowed endpoints. Data is always filtered by the user's `clinicId`.\n\n---\n\n## Key Concepts\n\n- **Clinic:** Each clinic has a name and a unique **code** (e.g. `STUD-01`). Used for multi-tenant isolation.\n- **Appointment:** Patient books a date and time slot. One appointment per slot per clinic per date. On creation, status is set to `queued` and a **queue entry** is created.\n- **Queue:** One queue entry per appointment per day. Has a **token number** (per clinic per date), and status: `waiting` | `in_progress` | `done` | `skipped`. Receptionist advances status; doctor uses `appointmentId` to add prescription/report.\n- **Prescription / Report:** One prescription and one report per appointment, added by the doctor (usually when status is in_progress or done).\n\n---\n\n## Project Walkthrough Video\n\nWatch the project explanation and walkthrough here: [Project walkthrough video](https://youtu.be/qCU7-u7ujus)\n\n---\n\n## Typical Workflows\n\n1. **Admin:** Log in → Get clinic info (`GET /admin/clinic`) → List users (`GET /admin/users`) → Create doctor/receptionist/patient (`POST /admin/users`).\n2. **Patient:** Log in → Book appointment (`POST /appointments`) → List my appointments (`GET /appointments/my`) → Get details with prescription/report (`GET /appointments/:id`); optionally list `/prescriptions/my` and `/reports/my`.\n3. **Receptionist:** Log in → Get queue for a date (`GET /queue?date=YYYY-MM-DD`) → Update status (`PATCH /queue/:id`) as patients are called or completed.\n4. **Doctor:** Log in → Get today's queue (`GET /doctor/queue`) → For each patient, add prescription (`POST /prescriptions/:appointmentId`) and/or report (`POST /reports/:appointmentId`).\n\n---\n\n## Servers\n\nUse the **Production Server** at (`https://cmsback.sampaarsh.cloud`) . All paths are relative to the selected server.",
      "version": "1.0.0",
      "contact": {
        "name": "API Support"
      }
    },
    "servers": [
      {
        "url": "https://cmsback.sampaarsh.cloud",
        "description": "Production (Sampaarsh)"
      }
    ],
    "tags": [
      {
        "name": "Auth",
        "description": "Login (no public registration)"
      },
      {
        "name": "Appointments",
        "description": "Patient: book and view appointments"
      },
      {
        "name": "Queue",
        "description": "Receptionist: daily queue and status updates"
      },
      {
        "name": "Doctor",
        "description": "Doctor: today's queue"
      },
      {
        "name": "Prescriptions",
        "description": "Doctor: add; Patient: list own"
      },
      {
        "name": "Reports",
        "description": "Doctor: add; Patient: list own"
      },
      {
        "name": "Admin",
        "description": "Admin: clinic info and create users"
      }
    ],
    "components": {
      "securitySchemes": {
        "bearerAuth": {
          "type": "http",
          "scheme": "bearer",
          "bearerFormat": "JWT",
          "description": "JWT from POST /auth/login. Payload: userId, role, clinicId"
        }
      },
      "schemas": {
        "Error": {
          "type": "object",
          "properties": {
            "error": {
              "type": "string",
              "example": "Error message"
            }
          }
        },
        "LoginRequest": {
          "type": "object",
          "required": [
            "email",
            "password"
          ],
          "properties": {
            "email": {
              "type": "string",
              "format": "email",
              "example": "doctor1@clinic1.local"
            },
            "password": {
              "type": "string",
              "minLength": 1,
              "example": "password123"
            }
          }
        },
        "LoginResponse": {
          "type": "object",
          "properties": {
            "token": {
              "type": "string",
              "description": "JWT for Authorization header"
            },
            "user": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "integer"
                },
                "name": {
                  "type": "string"
                },
                "email": {
                  "type": "string"
                },
                "role": {
                  "type": "string",
                  "enum": [
                    "patient",
                    "doctor",
                    "receptionist",
                    "admin"
                  ]
                },
                "clinicId": {
                  "type": "integer"
                },
                "clinicName": {
                  "type": "string"
                },
                "clinicCode": {
                  "type": "string"
                }
              }
            }
          }
        },
        "BookAppointmentRequest": {
          "type": "object",
          "required": [
            "appointmentDate",
            "timeSlot"
          ],
          "properties": {
            "appointmentDate": {
              "type": "string",
              "format": "date",
              "example": "2025-03-10",
              "description": "YYYY-MM-DD, today or future"
            },
            "timeSlot": {
              "type": "string",
              "example": "10:00-10:15",
              "description": "Format HH:MM-HH:MM"
            }
          }
        },
        "Appointment": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer"
            },
            "appointmentDate": {
              "type": "string",
              "format": "date"
            },
            "timeSlot": {
              "type": "string"
            },
            "status": {
              "type": "string",
              "enum": [
                "scheduled",
                "queued",
                "in_progress",
                "done",
                "cancelled"
              ]
            },
            "patientId": {
              "type": "integer"
            },
            "clinicId": {
              "type": "integer"
            },
            "createdAt": {
              "type": "string",
              "format": "date-time"
            },
            "queueEntry": {
              "$ref": "#/components/schemas/QueueEntry"
            }
          }
        },
        "QueueEntry": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer"
            },
            "tokenNumber": {
              "type": "integer"
            },
            "status": {
              "type": "string",
              "enum": [
                "waiting",
                "in_progress",
                "done",
                "skipped"
              ]
            },
            "queueDate": {
              "type": "string",
              "format": "date"
            },
            "appointmentId": {
              "type": "integer"
            },
            "appointment": {
              "type": "object",
              "properties": {
                "patient": {
                  "type": "object",
                  "properties": {
                    "name": {},
                    "phone": {}
                  }
                }
              }
            }
          }
        },
        "QueueUpdateRequest": {
          "type": "object",
          "required": [
            "status"
          ],
          "properties": {
            "status": {
              "type": "string",
              "enum": [
                "in-progress",
                "done",
                "skipped"
              ],
              "description": "waiting->in-progress|skipped; in_progress->done"
            }
          }
        },
        "DoctorQueueItem": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer"
            },
            "tokenNumber": {
              "type": "integer"
            },
            "status": {
              "type": "string"
            },
            "patientName": {
              "type": "string"
            },
            "patientId": {
              "type": "integer"
            },
            "appointmentId": {
              "type": "integer"
            }
          }
        },
        "PrescriptionMedicine": {
          "type": "object",
          "required": [
            "name",
            "dosage",
            "duration"
          ],
          "properties": {
            "name": {
              "type": "string",
              "example": "Paracetamol"
            },
            "dosage": {
              "type": "string",
              "example": "500mg"
            },
            "duration": {
              "type": "string",
              "example": "5 days"
            }
          }
        },
        "AddPrescriptionRequest": {
          "type": "object",
          "required": [
            "medicines"
          ],
          "properties": {
            "medicines": {
              "type": "array",
              "minItems": 1,
              "items": {
                "$ref": "#/components/schemas/PrescriptionMedicine"
              }
            },
            "notes": {
              "type": "string",
              "example": "After food"
            }
          }
        },
        "AddReportRequest": {
          "type": "object",
          "required": [
            "diagnosis"
          ],
          "properties": {
            "diagnosis": {
              "type": "string",
              "example": "Viral Fever"
            },
            "testRecommended": {
              "type": "string",
              "example": "Blood Test"
            },
            "remarks": {
              "type": "string",
              "example": "Rest for 3 days"
            }
          }
        },
        "AdminCreateUserRequest": {
          "type": "object",
          "required": [
            "name",
            "email",
            "password",
            "role"
          ],
          "properties": {
            "name": {
              "type": "string",
              "minLength": 3,
              "example": "John Doe"
            },
            "email": {
              "type": "string",
              "format": "email"
            },
            "password": {
              "type": "string",
              "minLength": 6
            },
            "role": {
              "type": "string",
              "enum": [
                "receptionist",
                "patient",
                "doctor"
              ]
            },
            "phone": {
              "type": "string"
            }
          }
        }
      }
    },
    "paths": {
      "/health": {
        "get": {
          "tags": [
            "Auth"
          ],
          "summary": "Health check",
          "responses": {
            "200": {
              "description": "OK",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "ok": {
                        "type": "boolean"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/auth/login": {
        "post": {
          "tags": [
            "Auth"
          ],
          "summary": "Login",
          "description": "Returns JWT and user info. Use token in Authorization: Bearer header for all other endpoints. No public registration.",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LoginRequest"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/LoginResponse"
                  }
                }
              }
            },
            "400": {
              "description": "Validation error",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Error"
                  }
                }
              }
            },
            "401": {
              "description": "Invalid email or password",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        }
      },
      "/appointments": {
        "post": {
          "tags": [
            "Appointments"
          ],
          "summary": "Book appointment (Patient)",
          "description": "Creates appointment and queue entry. Status set to queued. Date must be today or future; time slot unique per clinic per date.",
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BookAppointmentRequest"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Appointment with queueEntry",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Appointment"
                  }
                }
              }
            },
            "400": {
              "description": "Validation or time slot already booked",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Error"
                  }
                }
              }
            },
            "401": {
              "description": "Token missing or invalid"
            },
            "403": {
              "description": "Forbidden"
            }
          }
        }
      },
      "/appointments/my": {
        "get": {
          "tags": [
            "Appointments"
          ],
          "summary": "My appointments (Patient)",
          "description": "List appointments for logged-in patient. Includes queueEntry (token, status).",
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "List of appointments",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Appointment"
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Token missing or invalid"
            },
            "403": {
              "description": "Forbidden"
            }
          }
        }
      },
      "/appointments/{id}": {
        "get": {
          "tags": [
            "Appointments"
          ],
          "summary": "Appointment details with prescription and report (Patient)",
          "description": "Single appointment by ID. Includes prescription (medicines array) and report if present.",
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Appointment with prescription and report"
            },
            "400": {
              "description": "Invalid id"
            },
            "401": {
              "description": "Token missing or invalid"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Appointment not found"
            }
          }
        }
      },
      "/queue": {
        "get": {
          "tags": [
            "Queue"
          ],
          "summary": "Daily queue (Receptionist)",
          "description": "Queue for date. Query: date=YYYY-MM-DD. Sorted by token. Includes appointment.patient (name, phone).",
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "name": "date",
              "in": "query",
              "required": true,
              "schema": {
                "type": "string",
                "format": "date",
                "example": "2025-03-10"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "List of queue entries",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/QueueEntry"
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Valid date required (YYYY-MM-DD)"
            },
            "401": {
              "description": "Token missing or invalid"
            },
            "403": {
              "description": "Forbidden"
            }
          }
        }
      },
      "/queue/{id}": {
        "patch": {
          "tags": [
            "Queue"
          ],
          "summary": "Update queue status (Receptionist)",
          "description": "Body: { status: \"in-progress\" | \"done\" | \"skipped\" }. Transitions: waiting->in-progress or skipped; in_progress->done.",
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/QueueUpdateRequest"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Updated queue entry"
            },
            "400": {
              "description": "Invalid status or transition"
            },
            "401": {
              "description": "Token missing or invalid"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Queue entry not found"
            }
          }
        }
      },
      "/doctor/queue": {
        "get": {
          "tags": [
            "Doctor"
          ],
          "summary": "Today's queue (Doctor)",
          "description": "Queue for today. Returns id, tokenNumber, status, patientName, patientId, appointmentId. Use appointmentId for prescription/report.",
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "List",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/DoctorQueueItem"
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Token missing or invalid"
            },
            "403": {
              "description": "Forbidden"
            }
          }
        }
      },
      "/prescriptions/my": {
        "get": {
          "tags": [
            "Prescriptions"
          ],
          "summary": "My prescriptions (Patient)",
          "description": "All prescriptions for patient. Each has medicines (name, dosage, duration), notes, doctor, appointment.",
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "List of prescriptions"
            },
            "401": {
              "description": "Token missing or invalid"
            },
            "403": {
              "description": "Forbidden"
            }
          }
        }
      },
      "/prescriptions/{appointmentId}": {
        "post": {
          "tags": [
            "Prescriptions"
          ],
          "summary": "Add prescription (Doctor)",
          "description": "One per appointment. Only for appointment status in_progress or done. appointmentId from GET /doctor/queue.",
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "name": "appointmentId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AddPrescriptionRequest"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Prescription created"
            },
            "400": {
              "description": "Validation or duplicate or wrong status"
            },
            "401": {
              "description": "Token missing or invalid"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Appointment not found"
            }
          }
        }
      },
      "/reports/my": {
        "get": {
          "tags": [
            "Reports"
          ],
          "summary": "My reports (Patient)",
          "description": "Medical reports for patient. diagnosis, testRecommended, remarks, doctor, appointment.",
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "List of reports"
            },
            "401": {
              "description": "Token missing or invalid"
            },
            "403": {
              "description": "Forbidden"
            }
          }
        }
      },
      "/reports/{appointmentId}": {
        "post": {
          "tags": [
            "Reports"
          ],
          "summary": "Add report (Doctor)",
          "description": "appointmentId from GET /doctor/queue.",
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "name": "appointmentId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AddReportRequest"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Report created"
            },
            "400": {
              "description": "Validation failed"
            },
            "401": {
              "description": "Token missing or invalid"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Appointment not found"
            }
          }
        }
      },
      "/admin/clinic": {
        "get": {
          "tags": [
            "Admin"
          ],
          "summary": "Clinic info (Admin)",
          "description": "Clinic name, code, userCount, appointmentCount, queueCount.",
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "Clinic object"
            },
            "401": {
              "description": "Token missing or invalid"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Clinic not found"
            }
          }
        }
      },
      "/admin/users": {
        "get": {
          "tags": [
            "Admin"
          ],
          "summary": "List users (Admin)",
          "description": "All users in clinic. id, name, email, role, phone, createdAt.",
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "List of users"
            },
            "401": {
              "description": "Token missing or invalid"
            },
            "403": {
              "description": "Forbidden"
            }
          }
        },
        "post": {
          "tags": [
            "Admin"
          ],
          "summary": "Create user (Admin)",
          "description": "Create receptionist, patient, or doctor. They sign in with given email/password.",
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AdminCreateUserRequest"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "User created (no password)"
            },
            "400": {
              "description": "Validation or email in use"
            },
            "401": {
              "description": "Token missing or invalid"
            },
            "403": {
              "description": "Forbidden"
            }
          }
        }
      }
    }
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  var urls = options.swaggerUrls
  var customOptions = options.customOptions
  var spec1 = options.swaggerDoc
  var swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (var attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  var ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.oauth) {
    ui.initOAuth(customOptions.oauth)
  }

  if (customOptions.preauthorizeApiKey) {
    const key = customOptions.preauthorizeApiKey.authDefinitionKey;
    const value = customOptions.preauthorizeApiKey.apiKeyValue;
    if (!!key && !!value) {
      const pid = setInterval(() => {
        const authorized = ui.preauthorizeApiKey(key, value);
        if(!!authorized) clearInterval(pid);
      }, 500)

    }
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }

  window.ui = ui
}
