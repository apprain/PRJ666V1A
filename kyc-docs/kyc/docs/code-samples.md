# Code Samples

This document provides sample integrations for the Apprain KYC APIs.

## JavaScript (Node.js)

### Create KYC Session

```javascript
const response = await fetch("https://kyc.apprain.ca/api/v1/kyc/sessions", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "x-client-id": "YOUR_CLIENT_ID",
        "x-client-secret": "YOUR_CLIENT_SECRET",
    },
    body: JSON.stringify({
        externalUserId: "USER-1001",
        redirectUrl: "https://yourdomain.com/kyc/callback",
    }),
});

const data = await response.json();

console.log(data);

/*
{
  sessionId,
  token,
  verificationUrl
}
*/
```

### Retrieve Verification Summary

```javascript
const token = "SESSION_TOKEN";

const response = await fetch(
    `https://kyc.apprain.ca/api/v1/kyc/sessions/${token}/summary`,
    {
        headers: {
            "x-client-id": "YOUR_CLIENT_ID",
            "x-client-secret": "YOUR_CLIENT_SECRET",
        },
    }
);

const summary = await response.json();

console.log(summary);
```

---

## PHP

### Create KYC Session

```php
<?php

$payload = [
    "externalUserId" => "USER-1001",
    "redirectUrl" => "https://yourdomain.com/kyc/callback",
];

$ch = curl_init("https://kyc.apprain.ca/api/v1/kyc/sessions");

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",
        "x-client-id: YOUR_CLIENT_ID",
        "x-client-secret: YOUR_CLIENT_SECRET",
    ],
    CURLOPT_POSTFIELDS => json_encode($payload),
]);

$response = curl_exec($ch);

curl_close($ch);

$result = json_decode($response, true);

print_r($result);
```

### Retrieve Verification Summary

```php
<?php

$token = "SESSION_TOKEN";

$ch = curl_init(
    "https://kyc.apprain.ca/api/v1/kyc/sessions/$token/summary"
);

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "x-client-id: YOUR_CLIENT_ID",
        "x-client-secret: YOUR_CLIENT_SECRET",
    ],
]);

$response = curl_exec($ch);

curl_close($ch);

$result = json_decode($response, true);

print_r($result);
```
