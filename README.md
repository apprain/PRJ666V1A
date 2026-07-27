"# PRJ566V1A" 

Off HTTPS:
	$env:NODE_TLS_REJECT_UNAUTHORIZED="0"

Access Db: docker exec -it kyc-postgres psql -U postgres -d kyc_service_db
Access Db: docker exec -it task-postgres psql -U postgres -d taskdb
\dt                    -- List tables

Docker Command:
sudo docker compose down --remove-orphans
sudo docker compose build --no-cache
sudo docker compose up -d

docker compose down --remove-orphans
docker compose build --no-cache
docker compose up -d

#Kakra Collection
20.151.59.28:5000

Front 
 npm run dev

npm run build  



Backend
npm run start:dev


Run seed:
npm run seed
:Insode docker
docker exec -it kakra-backend \
  node dist/database/seeds/seed.js
  


Crate Store
sudo docker exec -it kakra-postgres psql -U postgres -d kakra_db
INSERT INTO stores (
  id,
  name,
  slug,
  domain,
  database_name,
  database_host,
  database_port,
  database_user,
  database_password,
  theme,
  currency,
  language,
  timezone,
  active,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(),
  'Kakra Local',
  'kakra-local',
  'localhost',
  'kakra_db',
  'localhost',
  5435,
  'postgres',
  'postgres',
  'default',
  'CAD',
  'en',
  'America/Toronto',
  true,
  now(),
  now()
);



Statement
	demouser:
			Customer:
			reazulk@gmail.com
			Aa123456
			
			https://trustledger.apprain.ca/share/verify/6d3cde39-5913-488b-b98e-eb779a8ca3f9


	Backend: 
		cd Backend : 3000
		npm install
		npm run start:dev


		frontned : 3001
		npx next dev -p 3001
		npx next start -p 3001    
		
		Name: statement
		Client ID: app_28e03c1868d8cc8adc129e6a
		Client Secret: secret_2c196bb850f5afab9f6bb008e460976188582917a3e78387
		
		sudo docker exec -it task-postgres psql -U postgres -d taskdb
		\dt
		
		
		
		
	
	
KYC Admin Frontend: 3003
  npx next dev -p 3003
  
  # Client admnin
  abccp@test.com/Admin@123
  admin@test.com/Password123
  
  # Create System admnin
  docker exec -it kyc-postgres psql -U postgres -d kyc_service_dbdocker exec -it kyc-postgres psql -U postgres -d kyc_service_db
  \dt
  
  Gen Password
  node -e "const bcrypt=require('bcrypt'); bcrypt.hash('Admin@123',10).then(console.log)"
  $2b$10$yreY0VW6BOWkEazgfUphR.vL8Z3X3dlqVV7S47SkmfnDoou98QiIG
  
	INSERT INTO system_admin_users (
		name,
		email,
		"passwordHash",
		role,
		status
	)
	VALUES (
		'System Admin',
		'admin@kyc.com',
		'$2b$10$yreY0VW6BOWkEazgfUphR.vL8Z3X3dlqVV7S47SkmfnDoou98QiIG',
		'super_admin',
		'active'
	);
  
  
  
COS : Customer Origination System  
    backend : 3004
       npm start dev
	
    frontend: 3005
	npx next dev -p 3005
	
	Off HTTPS:
	$env:NODE_TLS_REJECT_UNAUTHORIZED="0"
	
	COS:Customer Onboarding System
	http://cos.apprain.ca
	
	Admin Link: http://cos.apprain.ca/admin/login
	admin@abccp.com/Admin@12345
	
	INSERT INTO admin_users (
		id,
		"tenantId",
		email,
		"passwordHash",
		role,
		"createdAt"
	)
	VALUES (
		gen_random_uuid(),
		'abccp',
		'admin@abccp.com',
		'$2b$10$lHbGpkJxz9nv9OidZN4xqO7Jm2a1G/AAD9PGAOm5sq9cBL/gLTCsW',
		'TENANT_ADMIN',
		NOW()
	);
	
	### APP INFO
	Name: cos {Local}
	Client ID: app_d1b7e500ee2b09312e921ecf
	Client Secret: secret_b6920cb4e26c9a6fac17b175eaa934f47a5946be06053bec
	http://localhost:3005/kyc/callback
	http://localhost:3005/kyc/webhook	

    ##Local Docker:
	Name: abccp
	Client ID: app_c76c7b7b025c0f3dcad1e024
	Client Secret: secret_609b81ba7d7222ccd415077d60eacaa716c0c1d311981b41
	http://localhost:3005/kyc/callback
	http://localhost:3005/kyc/webhook	
	
	##Cloud Docker:
	Name: abccp
	Client ID: app_34fb2f7a2e0f230a757d07ff
	Client Secret: secret_48f9511d8b9eaa44ee08742a22a57db77d1d7cb7ad6d9e35
	http://20.151.59.28:3005/kyc/callback
	http://20.151.59.28:3005/kyc/webhook
	

 KYC Service: Port: 4000
	docker compose down
	docker compose up --build -d
    npm start dev    
	
	https://kyc.apprain.ca
	
	### Sandbox
	Name: sandbox
	Client ID: app_43bfa1bacf4435bfc2405459
	Client Secret: secret_75f1d4deec9274c35c65a8744146d5406e19e16d167e8d3f
	https://localhost/kyc/callback
	https://localhost/api/kyc/webhook
	
	
	
	
 MinIO: 9000
    docker compose up    
     http://localhost:9000  		
     http://20.151.59.28:9000  	
 
		
	Backend
	http://localhost:3000
	http://localhost:3000/api-docs#/
	
	http://20.151.59.28:3000/
	http://20.151.59.28:3000/api-docs#/
	
	MinIO Fileserver
	http://localhost:9001/login admin/password123
	
	http://20.151.59.28:9001/login admin/password123
	
	Frontend
	http://localhost:3001/login
	http://localhost:3001/dashboard/share-statement
	
	http://20.151.59.28:3001/
	
	COS: 
	http://20.151.59.28:3005/  font
	http://20.151.59.28:3004/  back
	http://20.151.59.28:3005/admin/login
	
	https://cos.apprain.ca  front
	https://cos.apprain.ca/admin/login  admin
	https://cos.service.apprain.ca back
	
	KYC Admin Frontend:
	http://localhost:3003/client-admin/login
	http://localhost:3003/system-admin/login
	
	https://verify.apprain.ca/client-admin/login
	abccp@test.com/Admin@123
	
	https://verify.apprain.ca/system-admin/login
	admin@kyc.com/Admin@123
	
	
	Desklocator
	http://20.151.59.28:3002/
	
	Verify Token: 
	http://localhost:3001/share/verify/95b09007-f6b6-45a1-abda-c71800627816
	
VM Setup Azure: (Manika Account):

1. Azure Portal → Resource groups → Create
   
  ssh prj666gr1@20.151.59.28
  prj666project@2026
  
  ssh azureuser@20.63.99.152
  @ppRain#162341#2026



################ KYC INTEGRATION ###############

corp@test.com
1
admin@test.com/Admin@123


https://github.com/apprain/kyc
