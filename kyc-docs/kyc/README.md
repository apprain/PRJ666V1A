# Apprain KYC

A hosted identity verification platform that enables third-party applications to perform Know Your Customer (KYC) verification through a simple API integration.

## Features

* Hosted KYC verification flow
* Secure session-based verification
* Front document capture
* Back document capture
* Selfie capture
* OCR extraction from documents
* Face matching between selfie and identity document
* Verification summary API
* Sandbox environment for testing

## Sandbox Environment

### Base URL

```
https://kyc.apprain.ca
```

### Sandbox Credentials

```
Client ID:
app_43bfa1bacf4435bfc2405459

Client Secret:
secret_75f1d4deec9274c35c65a8744146d5406e19e16d167e8d3f
```

> These credentials are intended for sandbox testing only. Do not upload real customer data.

---

## Integration Flow

```text
Client Application
        ↓
Create KYC Session
        ↓
Receive verificationUrl
        ↓
Redirect User to Hosted KYC
        ↓
User Completes Verification
        ↓
Redirect to Callback URL
        ↓
Retrieve Verification Summary
        ↓
Receive Verification Result
```

---

## Quick Example

### Create KYC Session

```bash
curl --location 'https://kyc.apprain.ca/api/v1/kyc/sessions' \
--header 'Content-Type: application/json' \
--header 'x-client-id: app_43bfa1bacf4435bfc2405459' \
--header 'x-client-secret: secret_75f1d4deec9274c35c65a8744146d5406e19e16d167e8d3f' \
--data '{
  "externalUserId": "USER-1001",
  "redirectUrl": "https://localhost/kyc/callback"
}'
```

### Retrieve Verification Summary

```bash
curl --location --request GET \
'https://kyc.apprain.ca/api/v1/kyc/sessions/{token}/summary' \
--header 'x-client-id: app_43bfa1bacf4435bfc2405459' \
--header 'x-client-secret: secret_75f1d4deec9274c35c65a8744146d5406e19e16d167e8d3f'
```

---

## Documentation

* [Quick Start](docs/quick-start.md)
* [API Reference](docs/api-reference.md)
* [Callback Summary](docs/callback-summary.md)
* [Security](docs/security.md)

---

## Postman Collection

Import the sandbox collection from:

```
postman/Apprain-KYC-Sandbox.postman_collection.json
```

---

## Version

Current Version: **v1.0.0**
