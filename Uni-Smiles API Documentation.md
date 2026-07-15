# Uni-Smiles API Documentation

This document serves as the strict architectural standard and single source of truth for integrating the **Frontend Kiosk Application** and the **Admin Dashboard Application** with the **Uni-Smiles Backend API Server**.

---

## Table of Contents
1. [Overview & Base URL](#1-overview--base-url)
2. [Authentication & Authorization](#2-authentication--authorization)
3. [System & Health Check](#3-system--health-check)
4. [Authentication Endpoints](#4-authentication-endpoints)
5. [Kiosk Operations Endpoints](#5-kiosk-operations-endpoints)
6. [Frame Templates Endpoints](#6-frame-templates-endpoints)
7. [Session & Transactions Endpoints](#7-session--transactions-endpoints)
8. [Media & Assets Endpoints](#8-media--assets-endpoints)
9. [Analytics & Logs Endpoints](#9-analytics--logs-endpoints)
10. [Error Handling & Status Codes](#10-error-handling--status-codes)

---

## 1. Overview & Base URL

The Uni-Smiles Backend API is built on **Node.js**, **Express**, and **MySQL** (`mysql2/promise`). It communicates over HTTP via RESTful endpoints using standard JSON payloads and multipart form-data for file uploads.

- **Base URL:** `http://localhost:8000`
- **Static Media Base URL:** `http://localhost:8000/uploads`
- **Allowed CORS Origins:** `http://localhost:3000` (Admin Dashboard) and `http://localhost:3001` (Kiosk App)

---

## 2. Authentication & Authorization

Authentication is managed via JSON Web Tokens (**JWT**). 
When an endpoint requires authorization, clients must pass the JWT inside the `Authorization` HTTP header using the `Bearer` schema:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

| Authorization Status | Description |
| :--- | :--- |
| **No (Public)** | Endpoint is accessible without any token (designed for automated Kiosk operations or public logins). |
| **Yes (JWT Bearer Token)** | Requires a valid JWT generated from `/api/auth/login`. If missing or invalid, the API returns `401 Unauthorized` or `403 Forbidden`. |

---

## 3. System & Health Check

### 3.1 Root Health Check
- **Endpoint & Method:** `GET http://localhost:8000/`
- **Description:** Verifies that the backend server is up and actively listening to requests. Primary consumers are monitoring scripts, developers, and load balancers.
- **Primary Consumer:** Both (Kiosk & Admin Dashboard)
- **Authorization:** No (Public)
- **Postman Testing Steps:**
  1. Set method to `GET`.
  2. Enter URL: `http://localhost:8000/`.
  3. Click **Send**.
- **Request Payload:** None
- **Expected Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Uni-Smiles Photobooth Backend API Server is running.",
    "version": "1.0.0"
  }
  ```

---

## 4. Authentication Endpoints

### 4.1 User Login
- **Endpoint & Method:** `POST http://localhost:8000/api/auth/login`
- **Description:** Authenticates a registered user or administrator using their email and password. Returns a signed JWT and user metadata upon successful verification.
- **Primary Consumer:** Admin Dashboard
- **Authorization:** No (Public)
- **Postman Testing Steps:**
  1. Set method to `POST`.
  2. Enter URL: `http://localhost:8000/api/auth/login`.
  3. Under **Headers**, add `Content-Type: application/json`.
  4. Under **Body**, select **raw** and **JSON**, then paste the payload below.
- **Request Payload (Mock Data):**
  ```json
  {
    "email": "admin@unismiles.com",
    "password": "SecurePassword123!"
  }
  ```
- **Expected Response (`200 OK`):**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJidCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIwOTkwMDAwfQ.abc123signature",
    "user": {
      "id": 1,
      "name": "Super Admin",
      "email": "admin@unismiles.com",
      "role": "admin",
      "partner_name": "Uni-Smiles HQ"
    }
  }
  ```

### 4.2 User Registration
- **Endpoint & Method:** `POST http://localhost:8000/api/auth/register`
- **Description:** Creates a new user profile with hashed passwords (`bcrypt`). Primarily used during system setup or when administrators invite new partner operators.
- **Primary Consumer:** Admin Dashboard
- **Authorization:** No (Public)
- **Postman Testing Steps:**
  1. Set method to `POST`.
  2. Enter URL: `http://localhost:8000/api/auth/register`.
  3. Under **Headers**, add `Content-Type: application/json`.
  4. Under **Body**, select **raw** and **JSON**, then paste the payload below.
- **Request Payload (Mock Data):**
  ```json
  {
    "name": "Operator Kiosk A",
    "email": "operator.a@unismiles.com",
    "password": "OperatorPass2026!",
    "role": "operator",
    "partner_name": "Telkom University Branch"
  }
  ```
- **Expected Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "id": 2,
      "name": "Operator Kiosk A",
      "email": "operator.a@unismiles.com",
      "role": "operator",
      "partner_name": "Telkom University Branch"
    }
  }
  ```

### 4.3 Get Current User (`Me`)
- **Endpoint & Method:** `GET http://localhost:8000/api/auth/me`
- **Description:** Validates the provided JWT token and returns the decoded payload of the currently authenticated user.
- **Primary Consumer:** Admin Dashboard
- **Authorization:** Yes (JWT Bearer Token)
- **Postman Testing Steps:**
  1. Set method to `GET`.
  2. Enter URL: `http://localhost:8000/api/auth/me`.
  3. Under **Authorization**, select **Bearer Token** and paste a valid JWT token.
  4. Click **Send**.
- **Request Payload:** None
- **Expected Response (`200 OK`):**
  ```json
  {
    "success": true,
    "user": {
      "id": 1,
      "role": "admin",
      "partner_name": "Uni-Smiles HQ",
      "iat": 1720990000,
      "exp": 1721076400
    }
  }
  ```

---

## 5. Kiosk Operations Endpoints

### 5.1 Retrieve All Kiosks
- **Endpoint & Method:** `GET http://localhost:8000/api/kiosks`
- **Description:** Retrieves the list of all registered photobooth kiosks across all locations.
- **Primary Consumer:** Admin Dashboard
- **Authorization:** No (Public)
- **Postman Testing Steps:**
  1. Set method to `GET`.
  2. Enter URL: `http://localhost:8000/api/kiosks`.
  3. Click **Send**.
- **Request Payload:** None
- **Expected Response (`200 OK`):**
  ```json
  {
    "success": true,
    "count": 2,
    "data": [
      {
        "id": "KSK-TLKM-01",
        "name": "Uni-Smiles Telkom University Main Library",
        "location": "Bandung, West Java"
      },
      {
        "id": "KSK-GCA-02",
        "name": "Uni-Smiles Grand City Mall",
        "location": "Surabaya, East Java"
      }
    ]
  }
  ```

### 5.2 Retrieve Kiosk by ID
- **Endpoint & Method:** `GET http://localhost:8000/api/kiosks/:id`
- **Description:** Fetches detailed information for a specific kiosk identifier (`id`). Used by kiosks during initialization to verify their identity and location.
- **Primary Consumer:** Both (Kiosk & Admin Dashboard)
- **Authorization:** No (Public)
- **Postman Testing Steps:**
  1. Set method to `GET`.
  2. Enter URL: `http://localhost:8000/api/kiosks/KSK-TLKM-01`.
  3. Click **Send**.
- **Request Payload:** None
- **Expected Response (`200 OK`):**
  ```json
  {
    "success": true,
    "data": {
      "id": "KSK-TLKM-01",
      "name": "Uni-Smiles Telkom University Main Library",
      "location": "Bandung, West Java"
    }
  }
  ```

### 5.3 Create New Kiosk
- **Endpoint & Method:** `POST http://localhost:8000/api/kiosks`
- **Description:** Registers a new physical kiosk unit in the system database.
- **Primary Consumer:** Admin Dashboard
- **Authorization:** No (Public)
- **Postman Testing Steps:**
  1. Set method to `POST`.
  2. Enter URL: `http://localhost:8000/api/kiosks`.
  3. Under **Headers**, add `Content-Type: application/json`.
  4. Under **Body**, select **raw** and **JSON**, then paste the payload below.
- **Request Payload (Mock Data):**
  ```json
  {
    "id": "KSK-BDG-03",
    "name": "Uni-Smiles PVJ Mall Concourse",
    "location": "Paris Van Java, Bandung"
  }
  ```
- **Expected Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "Kiosk created successfully.",
    "data": {
      "id": "KSK-BDG-03",
      "name": "Uni-Smiles PVJ Mall Concourse",
      "location": "Paris Van Java, Bandung"
    }
  }
  ```

---

## 6. Frame Templates Endpoints

### 6.1 Retrieve All Frame Templates
- **Endpoint & Method:** `GET http://localhost:8000/api/frame_templates`
- **Description:** Retrieves all available photobooth frame templates along with their layout configurations (`layout_config`).
- **Primary Consumer:** Both (Kiosk & Admin Dashboard)
- **Authorization:** No (Public)
- **Postman Testing Steps:**
  1. Set method to `GET`.
  2. Enter URL: `http://localhost:8000/api/frame_templates`.
  3. Click **Send**.
- **Request Payload:** None
- **Expected Response (`200 OK`):**
  ```json
  {
    "success": true,
    "count": 2,
    "data": [
      {
        "id": 1,
        "name": "Retro Film Strip 3-Slot",
        "category": "Vintage",
        "image_url": "https://cdn.unismiles.com/frames/retro-strip-3.png",
        "slot_count": 3,
        "layout_config": {
          "orientation": "vertical",
          "slots": [
            { "index": 0, "x": 50, "y": 100, "width": 400, "height": 300 },
            { "index": 1, "x": 50, "y": 450, "width": 400, "height": 300 },
            { "index": 2, "x": 50, "y": 800, "width": 400, "height": 300 }
          ]
        }
      },
      {
        "id": 2,
        "name": "Minimalist Y2K Grid 4-Slot",
        "category": "Modern",
        "image_url": "https://cdn.unismiles.com/frames/y2k-grid-4.png",
        "slot_count": 4,
        "layout_config": {
          "orientation": "grid",
          "slots": [
            { "index": 0, "x": 50, "y": 50, "width": 400, "height": 400 },
            { "index": 1, "x": 500, "y": 50, "width": 400, "height": 400 },
            { "index": 2, "x": 50, "y": 500, "width": 400, "height": 400 },
            { "index": 3, "x": 500, "y": 500, "width": 400, "height": 400 }
          ]
        }
      }
    ]
  }
  ```

### 6.2 Retrieve Frame Template by ID
- **Endpoint & Method:** `GET http://localhost:8000/api/frame_templates/:id`
- **Description:** Retrieves detailed layout specifications and asset URLs for a specific frame template ID.
- **Primary Consumer:** Both (Kiosk & Admin Dashboard)
- **Authorization:** No (Public)
- **Postman Testing Steps:**
  1. Set method to `GET`.
  2. Enter URL: `http://localhost:8000/api/frame_templates/1`.
  3. Click **Send**.
- **Request Payload:** None
- **Expected Response (`200 OK`):**
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "name": "Retro Film Strip 3-Slot",
      "category": "Vintage",
      "image_url": "https://cdn.unismiles.com/frames/retro-strip-3.png",
      "slot_count": 3,
      "layout_config": {
        "orientation": "vertical",
        "slots": [
          { "index": 0, "x": 50, "y": 100, "width": 400, "height": 300 },
          { "index": 1, "x": 50, "y": 450, "width": 400, "height": 300 },
          { "index": 2, "x": 50, "y": 800, "width": 400, "height": 300 }
        ]
      }
    }
  }
  ```

### 6.3 Create New Frame Template
- **Endpoint & Method:** `POST http://localhost:8000/api/frame_templates`
- **Description:** Adds a new custom frame template design and layout configuration to the catalog.
- **Primary Consumer:** Admin Dashboard
- **Authorization:** No (Public)
- **Postman Testing Steps:**
  1. Set method to `POST`.
  2. Enter URL: `http://localhost:8000/api/frame_templates`.
  3. Under **Headers**, add `Content-Type: application/json`.
  4. Under **Body**, select **raw** and **JSON**, then paste the payload below.
- **Request Payload (Mock Data):**
  ```json
  {
    "name": "Graduation Special 2026",
    "category": "Seasonal",
    "image_url": "https://cdn.unismiles.com/frames/grad-2026.png",
    "slot_count": 2,
    "layout_config": {
      "orientation": "horizontal",
      "slots": [
        { "index": 0, "x": 100, "y": 150, "width": 500, "height": 650 },
        { "index": 1, "x": 650, "y": 150, "width": 500, "height": 650 }
      ]
    }
  }
  ```
- **Expected Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "Frame template created successfully.",
    "data": {
      "id": 3,
      "name": "Graduation Special 2026",
      "category": "Seasonal",
      "image_url": "https://cdn.unismiles.com/frames/grad-2026.png",
      "slot_count": 2,
      "layout_config": {
        "orientation": "horizontal",
        "slots": [
          { "index": 0, "x": 100, "y": 150, "width": 500, "height": 650 },
          { "index": 1, "x": 650, "y": 150, "width": 500, "height": 650 }
        ]
      }
    }
  }
  ```

### 6.4 Update Frame Template
- **Endpoint & Method:** `PUT http://localhost:8000/api/frame_templates/:id`
- **Description:** Updates the attributes, image asset, or slot coordinates of an existing frame template.
- **Primary Consumer:** Admin Dashboard
- **Authorization:** No (Public)
- **Postman Testing Steps:**
  1. Set method to `PUT`.
  2. Enter URL: `http://localhost:8000/api/frame_templates/3`.
  3. Under **Headers**, add `Content-Type: application/json`.
  4. Under **Body**, select **raw** and **JSON**, then paste the payload below.
- **Request Payload (Mock Data):**
  ```json
  {
    "name": "Graduation Special 2026 (Updated Gold Edition)",
    "category": "Seasonal",
    "image_url": "https://cdn.unismiles.com/frames/grad-2026-gold.png",
    "slot_count": 2,
    "layout_config": {
      "orientation": "horizontal",
      "slots": [
        { "index": 0, "x": 120, "y": 160, "width": 500, "height": 650 },
        { "index": 1, "x": 660, "y": 160, "width": 500, "height": 650 }
      ]
    }
  }
  ```
- **Expected Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Frame template updated successfully.",
    "data": {
      "id": 3,
      "name": "Graduation Special 2026 (Updated Gold Edition)",
      "category": "Seasonal",
      "image_url": "https://cdn.unismiles.com/frames/grad-2026-gold.png",
      "slot_count": 2,
      "layout_config": {
        "orientation": "horizontal",
        "slots": [
          { "index": 0, "x": 120, "y": 160, "width": 500, "height": 650 },
          { "index": 1, "x": 660, "y": 160, "width": 500, "height": 650 }
        ]
      }
    }
  }
  ```

### 6.5 Delete Frame Template
- **Endpoint & Method:** `DELETE http://localhost:8000/api/frame_templates/:id`
- **Description:** Removes a frame template from the system database.
- **Primary Consumer:** Admin Dashboard
- **Authorization:** No (Public)
- **Postman Testing Steps:**
  1. Set method to `DELETE`.
  2. Enter URL: `http://localhost:8000/api/frame_templates/3`.
  3. Click **Send**.
- **Request Payload:** None
- **Expected Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Frame template with ID 3 deleted successfully."
  }
  ```

---

## 7. Session & Transactions Endpoints

### 7.1 Retrieve All Sessions
- **Endpoint & Method:** `GET http://localhost:8000/api/sessions`
- **Description:** Retrieves all user sessions alongside their financial transaction data (`amount`, `payment_method`).
- **Primary Consumer:** Admin Dashboard
- **Authorization:** No (Public)
- **Postman Testing Steps:**
  1. Set method to `GET`.
  2. Enter URL: `http://localhost:8000/api/sessions`.
  3. Click **Send**.
- **Request Payload:** None
- **Expected Response (`200 OK`):**
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "id": "#US-1720995123456",
        "kiosk_id": "KSK-TLKM-01",
        "frame_template_id": 1,
        "status": "completed",
        "created_at": "2026-07-15T10:30:00.000Z",
        "amount": "35000.00",
        "payment_method": "QRIS"
      }
    ]
  }
  ```

### 7.2 Start New Session
- **Endpoint & Method:** `POST http://localhost:8000/api/sessions/start`
- **Description:** Initiates a new photobooth session on a kiosk when a customer selects a frame template. Automatically generates a unique session ID prefixed with `#US-` if one is not provided.
- **Primary Consumer:** Kiosk
- **Authorization:** No (Public)
- **Postman Testing Steps:**
  1. Set method to `POST`.
  2. Enter URL: `http://localhost:8000/api/sessions/start`.
  3. Under **Headers**, add `Content-Type: application/json`.
  4. Under **Body**, select **raw** and **JSON**, then paste the payload below.
- **Request Payload (Mock Data):**
  ```json
  {
    "id": "#US-1721001234567",
    "kiosk_id": "KSK-TLKM-01",
    "frame_template_id": 1
  }
  ```
- **Expected Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "Session started successfully.",
    "data": {
      "id": "#US-1721001234567",
      "kiosk_id": "KSK-TLKM-01",
      "frame_template_id": 1,
      "status": "active"
    }
  }
  ```

### 7.3 Complete Session & Record Transaction
- **Endpoint & Method:** `POST http://localhost:8000/api/sessions/:id/complete`
- **Description:** Atomically marks an active session as `completed` and records its financial transaction details (`transaction_code`, `amount`, `payment_method`, `status`) inside a MySQL database transaction block (`BEGIN ... COMMIT`).
- **Primary Consumer:** Kiosk
- **Authorization:** No (Public)
- **Postman Testing Steps:**
  1. Set method to `POST`.
  2. Enter URL: `http://localhost:8000/api/sessions/%23US-1721001234567/complete` *(Note: `%23` is URL-encoded `#`)*.
  3. Under **Headers**, add `Content-Type: application/json`.
  4. Under **Body**, select **raw** and **JSON**, then paste the payload below.
- **Request Payload (Mock Data):**
  ```json
  {
    "transaction_code": "QRIS-PAY-99887766",
    "amount": 35000,
    "payment_method": "QRIS",
    "status": "completed"
  }
  ```
- **Expected Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Session #US-1721001234567 completed successfully."
  }
  ```

### 7.4 Send Digital Copy via Email
- **Endpoint & Method:** `POST http://localhost:8000/api/sessions/:id/send-email`
- **Description:** Delivers a digital copy of the session photo and collage to the customer's email address. Returns the direct download link of the photo along with a success message.
- **Primary Consumer:** Kiosk
- **Authorization:** No (Public)
- **Postman Testing Steps:**
  1. Set method to `POST`.
  2. Enter URL: `http://localhost:8000/api/sessions/%23US-1721001234567/send-email`.
  3. Under **Headers**, add `Content-Type: application/json`.
  4. Under **Body**, select **raw** and **JSON**, then paste the payload below.
- **Request Payload (Mock Data):**
  ```json
  {
    "email": "customer.smile@gmail.com"
  }
  ```
- **Expected Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Digital copy of photo sent successfully to customer.smile@gmail.com.",
    "data": {
      "session_id": "#US-1721001234567",
      "recipient_email": "customer.smile@gmail.com",
      "download_link": "/uploads/1721001255000-123456789.jpg",
      "all_photos": [
        "/uploads/1721001255000-123456789.jpg"
      ]
    }
  }
  ```

---

## 8. Media & Assets Endpoints

### 8.1 Upload Photo
- **Endpoint & Method:** `POST http://localhost:8000/api/photos`
- **Description:** Uploads a captured photo from the kiosk, stores it locally inside `/uploads`, saves its record inside the `photos` table, and applies any optional visual filter associations.
- **Primary Consumer:** Kiosk
- **Authorization:** No (Public)
- **Postman Testing Steps:**
  1. Set method to `POST`.
  2. Enter URL: `http://localhost:8000/api/photos`.
  3. Under **Body**, select **form-data**.
  4. Add the form data keys and values specified below.
- **Request Payload (`multipart/form-data` specification):**
  | Key | Type | Description / Example Value |
  | :--- | :--- | :--- |
  | `photo` | **File** | Select the captured image file (`.jpg`, `.png`). **Required.** |
  | `session_id` | **Text** | `#US-1721001234567` **Required.** |
  | `filter_ids` | **Text** | `[1, 3]` (JSON string array) or `1,3` (comma-separated). **Optional.** |
- **Expected Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "Photo uploaded successfully.",
    "data": {
      "id": 15,
      "session_id": "#US-1721001234567",
      "url": "/uploads/1721001255000-123456789.jpg",
      "filters": [1, 3]
    }
  }
  ```

### 8.2 Retrieve Photos by Session ID
- **Endpoint & Method:** `GET http://localhost:8000/api/photos/session/:sessionId`
- **Description:** Retrieves all photos uploaded during a specific session ID.
- **Primary Consumer:** Both (Kiosk & Admin Dashboard)
- **Authorization:** No (Public)
- **Postman Testing Steps:**
  1. Set method to `GET`.
  2. Enter URL: `http://localhost:8000/api/photos/session/%23US-1721001234567`.
  3. Click **Send**.
- **Request Payload:** None
- **Expected Response (`200 OK`):**
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "id": 15,
        "session_id": "#US-1721001234567",
        "url": "/uploads/1721001255000-123456789.jpg"
      }
    ]
  }
  ```

### 8.3 Retrieve Active Filters
- **Endpoint & Method:** `GET http://localhost:8000/api/filters`
- **Description:** Retrieves all active photo filters available for real-time application on the kiosk camera preview (`is_active = 1`).
- **Primary Consumer:** Kiosk
- **Authorization:** No (Public)
- **Postman Testing Steps:**
  1. Set method to `GET`.
  2. Enter URL: `http://localhost:8000/api/filters`.
  3. Click **Send**.
- **Request Payload:** None
- **Expected Response (`200 OK`):**
  ```json
  {
    "success": true,
    "count": 3,
    "data": [
      {
        "id": 1,
        "name": "B&W Classic",
        "css_filter": "grayscale(100%) contrast(120%)",
        "is_active": 1
      },
      {
        "id": 2,
        "name": "Warm Sunset",
        "css_filter": "sepia(40%) saturate(140%) hue-rotate(-10deg)",
        "is_active": 1
      },
      {
        "id": 3,
        "name": "Soft Pastel Glow",
        "css_filter": "brightness(110%) contrast(90%) saturate(120%)",
        "is_active": 1
      }
    ]
  }
  ```

---

## 9. Analytics & Logs Endpoints

### 9.1 Log Kiosk Gesture
- **Endpoint & Method:** `POST http://localhost:8000/api/gestures`
- **Description:** Logs hand gestures recognized by the kiosk vision system (`V-Sign`, `Wave`, `Palm`) alongside confidence scores and triggered actions (`take_photo`, `start_session`).
- **Primary Consumer:** Kiosk
- **Authorization:** No (Public)
- **Postman Testing Steps:**
  1. Set method to `POST`.
  2. Enter URL: `http://localhost:8000/api/gestures`.
  3. Under **Headers**, add `Content-Type: application/json`.
  4. Under **Body**, select **raw** and **JSON**, then paste the payload below.
- **Request Payload (Mock Data):**
  ```json
  {
    "session_id": "#US-1721001234567",
    "gesture_type": "V-Sign",
    "confidence_score": 0.98,
    "action_triggered": "take_photo"
  }
  ```
- **Expected Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "Gesture logged successfully",
    "data": {
      "id": 42,
      "session_id": "#US-1721001234567",
      "gesture_type": "V-Sign",
      "confidence_score": 0.98,
      "action_triggered": "take_photo"
    }
  }
  ```

### 9.2 Record Print Log
- **Endpoint & Method:** `POST http://localhost:8000/api/prints`
- **Description:** Inserts a print log from the kiosk right after printing a photo collage. Allows administrators to monitor paper rolls and track hardware print failures (`status`: `success` | `failed`).
- **Primary Consumer:** Kiosk
- **Authorization:** No (Public)
- **Postman Testing Steps:**
  1. Set method to `POST`.
  2. Enter URL: `http://localhost:8000/api/prints`.
  3. Under **Headers**, add `Content-Type: application/json`.
  4. Under **Body**, select **raw** and **JSON**, then paste the payload below.
- **Request Payload (Mock Data):**
  ```json
  {
    "kiosk_id": "KSK-TLKM-01",
    "session_id": "#US-1721001234567",
    "status": "success",
    "paper_stock_left": 142
  }
  ```
- **Expected Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "Print log recorded successfully.",
    "data": {
      "id": 88,
      "kiosk_id": "KSK-TLKM-01",
      "session_id": "#US-1721001234567",
      "status": "success",
      "paper_stock_left": 142
    }
  }
  ```

### 9.3 Retrieve All Print Logs
- **Endpoint & Method:** `GET http://localhost:8000/api/prints`
- **Description:** Retrieves all recorded print history logs. Supports filtering by specific kiosk via optional query string `?kiosk_id=...`.
- **Primary Consumer:** Admin Dashboard
- **Authorization:** No (Public)
- **Postman Testing Steps:**
  1. Set method to `GET`.
  2. Enter URL: `http://localhost:8000/api/prints?kiosk_id=KSK-TLKM-01`.
  3. Click **Send**.
- **Request Payload:** None
- **Expected Response (`200 OK`):**
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "id": 88,
        "kiosk_id": "KSK-TLKM-01",
        "session_id": "#US-1721001234567",
        "status": "success",
        "paper_stock_left": 142
      }
    ]
  }
  ```

### 9.4 Get Dashboard Analytics Stats
- **Endpoint & Method:** `GET http://localhost:8000/api/dashboard/stats`
- **Description:** Returns real-time aggregated operational statistics for the admin dashboard. Executes concurrent database queries (`Promise.all`) to calculate total revenue, total sessions completed today, and the top 3 most popular frame templates.
- **Primary Consumer:** Admin Dashboard
- **Authorization:** No (Public)
- **Postman Testing Steps:**
  1. Set method to `GET`.
  2. Enter URL: `http://localhost:8000/api/dashboard/stats`.
  3. Click **Send**.
- **Request Payload:** None
- **Expected Response (`200 OK`):**
  ```json
  {
    "success": true,
    "data": {
      "total_revenue": 1450000,
      "total_sessions_today": 42,
      "top_frame_templates": [
        {
          "id": 1,
          "name": "Retro Film Strip 3-Slot",
          "category": "Vintage",
          "image_url": "https://cdn.unismiles.com/frames/retro-strip-3.png",
          "usage_count": 18
        },
        {
          "id": 2,
          "name": "Minimalist Y2K Grid 4-Slot",
          "category": "Modern",
          "image_url": "https://cdn.unismiles.com/frames/y2k-grid-4.png",
          "usage_count": 14
        },
        {
          "id": 3,
          "name": "Graduation Special 2026",
          "category": "Seasonal",
          "image_url": "https://cdn.unismiles.com/frames/grad-2026.png",
          "usage_count": 10
        }
      ]
    }
  }
  ```

---

## 10. Error Handling & Status Codes

All endpoints follow a standardized JSON response format when an error occurs (`middlewares/errorHandler.js`):

```json
{
  "success": false,
  "message": "Please provide all required fields: kiosk_id, session_id, status, paper_stock_left",
  "stack": "Error: Please provide all required fields...\n    at printController.createPrintLog..."
}
```

*(Note: The `stack` field is only included when running with `NODE_ENV=development`)*

### Summary of Common HTTP Status Codes
| Status Code | Name | Common Trigger |
| :---: | :--- | :--- |
| **200** | `OK` | Request succeeded (`GET`, `PUT`, `DELETE`, or completed actions). |
| **201** | `Created` | New resource successfully created (`POST`). |
| **400** | `Bad Request` | Missing required fields (`session_id`, `kiosk_id`), invalid types, or malformed body. |
| **401** | `Unauthorized` | Missing or invalid login credentials, or missing JWT `Bearer` token. |
| **403** | `Forbidden` | JWT `Bearer` token failed signature verification or expired. |
| **404** | `Not Found` | Requested resource ID (kiosk or frame template) or route path does not exist. |
| **409** | `Conflict` | Resource conflict, such as creating a kiosk or user with an ID/email that already exists. |
| **500** | `Internal Server Error` | Unhandled database error, SQL constraint failure, or server exception. |
