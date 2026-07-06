# Quick Start

This guide demonstrates how to integrate Apprain KYC using the sandbox environment.

## Prerequisites

Before you begin, obtain sandbox credentials from the Apprain team.

You will receive:

* Client ID
* Client Secret

Base URL:

```text
https://kyc.apprain.ca
```

---

## Step 1: Create a KYC Session

Create a new verification session for your customer.

### Request

```bash
curl --location 'https://kyc.apprain.ca/api/v1/kyc/sessions' \
--header 'Content-Type: application/json' \
--header 'x-client-id: YOUR_CLIENT_ID' \
--header 'x-client-secret: YOUR_CLIENT_SECRET' \
--data '{
  "externalUserId": "USER-1001",
  "redirectUrl": "https://yourdomain.com/kyc/callback"
}'
```

### Request Parameters

| Field          | Description                                         |
| -------------- | --------------------------------------------------- |
| externalUserId | Unique customer identifier from your system         |
| redirectUrl    | URL where the user will return after completing KYC |

### Example Response

```json
{
  "sessionId": "5d3b5f0c-2cc9-419d-900a-2bbcd2297e3e",
  "token": "f904c917716c65fa34610c2ca6f02ffdc81db231f72494457a0c61ca8bb628fd",
  "verificationUrl": "https://kyc.apprain.ca/verify/{token}"
}
```

---

## Step 2: Redirect the User

Redirect your customer to the returned:

```text
verificationUrl
```

The customer will complete the hosted verification process, including:

1. Uploading the front of the identity document
2. Uploading the back of the identity document
3. Capturing a selfie
4. Reviewing and submitting the application

---

## Step 3: Handle the Callback

After submission, the browser redirects the user to the callback URL you supplied.

Example:

```text
https://yourdomain.com/kyc/callback
```

---

## Step 4: Retrieve Verification Summary

Use the token returned during session creation to obtain the verification result.

### Request

```bash
curl --location --request GET \
'https://kyc.apprain.ca/api/v1/kyc/sessions/{token}/summary' \
--header 'x-client-id: YOUR_CLIENT_ID' \
--header 'x-client-secret: YOUR_CLIENT_SECRET'
```

### Example Response

```json
{
  "sessionId": "5d3b5f0c-2cc9-419d-900a-2bbcd2297e3e",
  "status": "completed",
  "externalUserId": "USER-1001",
  "faceMatchStatus": "matched",
  "faceMatchScore": 99.99
}
```

The summary response contains the final KYC outcome, face match results, OCR extraction details, and uploaded document information.
