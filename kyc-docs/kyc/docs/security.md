# Security

This document outlines the security expectations for integrating with Apprain KYC.

---

## API Authentication

All API requests must include client credentials in the request headers:

```http
x-client-id: YOUR_CLIENT_ID
x-client-secret: YOUR_CLIENT_SECRET
```

Each production client receives unique credentials.

---

## Sandbox Access

Sandbox access is available for testing and evaluation.

Sandbox credentials are provided on request.

Do not upload real customer identity documents or personal data to the sandbox environment.

---

## HTTPS Requirement

All integrations must use HTTPS.

Production callback URLs must also use HTTPS.

Example:

```text
https://yourdomain.com/kyc/callback
```

---

## Credential Handling

Client credentials should be stored securely on the server side.

Do not expose `x-client-secret` in frontend JavaScript, mobile applications, public repositories, screenshots, or client-side logs.

---

## Recommended Integration Pattern

The client backend should create the KYC session.

```text
Frontend
   ↓
Client Backend
   ↓
Apprain KYC API
```

---

## Production Access

Production credentials are issued separately after client onboarding.

Each production client may receive a dedicated client ID, client secret, allowed callback URLs, and webhook configuration if applicable.

---

## Data Privacy

KYC data may include identity documents, selfie images, OCR results, and verification metadata.

Client applications should handle KYC results according to their own privacy, compliance, and retention policies.