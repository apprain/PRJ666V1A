INSERT INTO client_admin_users (
    id,
    name,
    email,
    "passwordHash",
    role,
    status,
    "createdAt",
    "clientAppId"
)
VALUES
(
    gen_random_uuid(),
    'Admin User',
    'admin@test.com',
    '$2b$10$4zXfiSjUrdBCbp0AfvGKme2Dq37ZQtgzDo7L9ayG3Tr8GMDZH',
    'owner',
    'active',
    NOW(),
    '36edd9d1-bd2e-4b59-bc28-b15ae3786e7d'
);