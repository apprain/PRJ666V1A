# Mobile Integration Guide

This guide explains how to integrate Apprain KYC with Android and iOS applications.

## Overview

Apprain KYC provides a hosted verification experience that can be integrated into native mobile applications without embedding KYC logic directly inside the mobile app.

The recommended architecture is:

```text
Android / iOS App
        ↓
Client Backend
        ↓
Apprain KYC API
        ↓
Verification URL
        ↓
Mobile Browser
        ↓
Hosted KYC Flow
        ↓
Callback
        ↓
Client Backend
        ↓
Mobile App
```

---

# Why Use a Backend?

Apprain KYC APIs require:

```http
x-client-id
x-client-secret
```

These credentials must never be embedded inside Android or iOS applications.

Mobile applications can be reverse engineered, exposing secrets to unauthorized parties.

For this reason, mobile apps should communicate with the client's backend, and the backend should communicate with Apprain KYC.

---

# Integration Flow

## Step 1: Mobile App Requests KYC

The mobile application calls the client's backend.

Example:

```http
POST https://api.yourdomain.com/start-kyc
```

Request:

```json
{
    "customerId": "USER-1001"
}
```

---

## Step 2: Backend Creates Session

The backend creates a KYC session.

```http
POST https://kyc.apprain.ca/api/v1/kyc/sessions
```

Headers:

```http
x-client-id: YOUR_CLIENT_ID
x-client-secret: YOUR_CLIENT_SECRET
Content-Type: application/json
```

Body:

```json
{
    "externalUserId": "USER-1001",
    "redirectUrl": "https://yourdomain.com/kyc/callback"
}
```

---

## Step 3: Backend Returns Verification URL

Example response:

```json
{
    "verificationUrl": "https://kyc.apprain.ca/verify/xxxxxxxx"
}
```

Only the verification URL is returned to the mobile app.

---

# Opening the Hosted KYC Flow

## Android

Recommended:

* Chrome Custom Tabs

Alternative:

* WebView

Chrome Custom Tabs provide a secure browser experience while maintaining the look and feel of the application.

---

## iOS

Recommended:

* SafariViewController

Alternative:

* WKWebView

SafariViewController provides a secure browsing experience with camera support.

---

# Customer Verification Journey

The customer completes:

1. Front document capture
2. Back document capture
3. Selfie capture
4. Review and submission

No additional mobile development is required.

---

# Callback Handling

After submission, the user is redirected to the callback URL specified during session creation.

Example:

```text
https://yourdomain.com/kyc/callback
```

The client backend should:

1. Validate the session.
2. Retrieve the verification summary.
3. Update customer onboarding status.

---

# Retrieve Verification Summary

The backend calls:

```http
GET /api/v1/kyc/sessions/{token}/summary
```

Example:

```http
GET https://kyc.apprain.ca/api/v1/kyc/sessions/{token}/summary
```

Headers:

```http
x-client-id: YOUR_CLIENT_ID
x-client-secret: YOUR_CLIENT_SECRET
```

---

# Recommended Mobile Workflow

```text
Customer clicks "Verify Identity"
        ↓
Mobile App calls Backend
        ↓
Backend creates KYC Session
        ↓
Backend returns verificationUrl
        ↓
Mobile opens Hosted KYC
        ↓
Customer completes KYC
        ↓
Customer redirected back
        ↓
Backend retrieves summary
        ↓
Mobile displays verification status
```

---

# Security Recommendations

* Never store client secrets in mobile applications.
* Always create sessions through the backend.
* Use HTTPS for all communication.
* Validate summary responses on the server.
* Use production credentials only in backend systems.

---

# Future SDK Support

Future versions of Apprain KYC may provide:

* Android SDK
* iOS SDK
* Temporary mobile session tokens
* Native UI components

Until then, the hosted verification flow provides the recommended integration model for mobile applications.
