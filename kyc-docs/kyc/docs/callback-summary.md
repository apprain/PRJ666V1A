# Callback and Verification Summary

This document explains what happens after a customer completes the hosted KYC process.

---

# Verification Flow

```text
Client Application
        ↓
Create KYC Session
        ↓
Receive verificationUrl
        ↓
Redirect Customer
        ↓
Customer Completes Verification
        ↓
Customer Redirected Back
        ↓
Client Retrieves Summary
        ↓
Verification Result Available
```

---

# Redirect Callback

When creating a session, the client application provides a callback URL.

Example:

```json
{
  "externalUserId": "USER-1001",
  "redirectUrl": "https://yourdomain.com/kyc/callback"
}
```

After the customer submits the verification process, the browser redirects the customer back to the specified callback URL.

Example:

```text
https://yourdomain.com/kyc/callback
```

---

# Retrieve Verification Result

Once the customer returns to your application, call the Summary API using the token obtained during session creation.

Example:

```bash
curl --location --request GET \
'https://kyc.apprain.ca/api/v1/kyc/sessions/{token}/summary' \
--header 'x-client-id: YOUR_CLIENT_ID' \
--header 'x-client-secret: YOUR_CLIENT_SECRET'
```

---

# Example Summary Response

```json
{
  "sessionId": "5d3b5f0c-2cc9-419d-900a-2bbcd2297e3e",
  "status": "completed",
  "externalUserId": "USER-1001",
  "faceMatchStatus": "matched",
  "faceMatchScore": 99.99,
  "documents": []
}
```

---

# Status Values

| Status      | Meaning                                      |
| ----------- | -------------------------------------------- |
| pending     | Session created but verification not started |
| in_progress | Customer is completing KYC                   |
| completed   | Verification process completed               |
| expired     | Session expired before completion            |

---

# Face Match Status

| Value       | Meaning                              |
| ----------- | ------------------------------------ |
| matched     | Selfie matched the identity document |
| unmatched   | Face comparison failed               |
| unavailable | Face matching could not be performed |

---

# OCR Extraction

If supported for the submitted document type, the summary response may include extracted values such as:

* Full Name
* First Name
* Last Name
* Date of Birth
* Document Number

Applications should treat OCR results as informational and perform their own validation where required.

---

# Recommended Client Workflow

After receiving the summary response:

1. Verify that the session status is `completed`.
2. Verify that `faceMatchStatus` is `matched`.
3. Review OCR extracted values.
4. Update the customer's onboarding status in your system.
5. Continue with account opening, loan processing, or manual review workflows as appropriate.
