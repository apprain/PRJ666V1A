# API Reference

## Authentication

All API requests must include the following headers:

```http
x-client-id: YOUR_CLIENT_ID
x-client-secret: YOUR_CLIENT_SECRET
```

Base URL:

```text
https://kyc.apprain.ca
```

---

# Create KYC Session

Creates a new KYC verification session.

## Endpoint

```http
POST /api/v1/kyc/sessions
```

## Headers

| Header                         | Required |
| ------------------------------ | -------- |
| Content-Type: application/json | Yes      |
| x-client-id                    | Yes      |
| x-client-secret                | Yes      |

## Request Body

```json
{
  "externalUserId": "USER-1001",
  "redirectUrl": "https://yourdomain.com/kyc/callback"
}
```

## Request Fields

| Field          | Type   | Required | Description                          |
| -------------- | ------ | -------- | ------------------------------------ |
| externalUserId | string | Yes      | Unique customer identifier           |
| redirectUrl    | string | Yes      | URL to redirect after KYC completion |

## Success Response

### HTTP 201

```json
{
  "sessionId": "5d3b5f0c-2cc9-419d-900a-2bbcd2297e3e",
  "token": "f904c917716c65fa34610c2ca6f02ffdc81db231f72494457a0c61ca8bb628fd",
  "verificationUrl": "https://kyc.apprain.ca/verify/{token}"
}
```

---

# Get KYC Summary

Retrieves the verification outcome for a completed KYC session.

## Endpoint

```http
GET /api/v1/kyc/sessions/{token}/summary
```

## Headers

| Header          | Required |
| --------------- | -------- |
| x-client-id     | Yes      |
| x-client-secret | Yes      |

## Path Parameters

| Parameter | Description                                    |
| --------- | ---------------------------------------------- |
| token     | Session token returned during session creation |

## Success Response

### HTTP 200

```json
{
  "sessionId": "5d3b5f0c-2cc9-419d-900a-2bbcd2297e3e",
  "status": "completed",
  "externalUserId": "USER-1001",
  "expiresAt": "2026-06-16T23:05:32.263Z",
  "reviewStatus": null,
  "faceMatchScore": 99.99954223632812,
  "faceMatchStatus": "matched",
  "faceMatchConfidence": 99.99970245361328,
  "firstName": null,
  "lastName": null,
  "fullName": null,
  "dateOfBirth": null,
  "documentNumber": null,
  "documents": []
}
```

## Response Fields

| Field               | Description                            |
| ------------------- | -------------------------------------- |
| sessionId           | Internal session identifier            |
| status              | Current KYC status                     |
| externalUserId      | Customer identifier from client system |
| expiresAt           | Session expiry timestamp               |
| reviewStatus        | Manual review result                   |
| faceMatchScore      | Face matching score                    |
| faceMatchStatus     | Face match outcome                     |
| faceMatchConfidence | Confidence percentage                  |
| firstName           | OCR extracted first name               |
| lastName            | OCR extracted last name                |
| fullName            | OCR extracted full name                |
| dateOfBirth         | OCR extracted date of birth            |
| documentNumber      | OCR extracted document number          |
| documents           | Uploaded document details              |

---

# Error Responses

## HTTP 401

```json
{
  "message": "Unauthorized"
}
```

Returned when client credentials are invalid.

## HTTP 404

```json
{
  "message": "Session not found"
}
```

Returned when the supplied token cannot be found.
