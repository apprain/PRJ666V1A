"# PRJ566V1A" 

Backend: 
    cd Backend
    npm install
    npm run start:dev


frontned
    npx next dev -p 3001
    npx next start -p 3001    
	
	
KYC Admin Frontend:
  npx next dev -p 3003
  
  # Client admnin
  abccp@test.com/Admin@123
  
  # Create System admnin
  docker exec -it kyc-postgres psql -U postgres -d kyc_service_db
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
    backend
    npm start dev
    frontend
	npx next dev -p 3005
	
	Off HTTPS:
	$env:NODE_TLS_REJECT_UNAUTHORIZED="0"
	
	Admin Link: http://localhost:3005/admin/login
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


 KYC Service: 
	docker compose down
	docker compose up --build -d

    npm start dev    
	
 MinIO
    docker compose up    
     http://localhost:9000  		
		
		
		
		
		
		
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
	
	KYC Admin Frontend:
	http://localhost:3003/client-admin/login
	
	http://localhost:3003/system-admin/login
	
	
	Desklocator
	http://20.151.59.28:3002/
	
	Verify Token: 
	http://localhost:3001/share/verify/95b09007-f6b6-45a1-abda-c71800627816
	
VM Setup Azure: (Manika Account):

1. Azure Portal → Resource groups → Create
   
  ssh prj666gr1@20.151.59.28
  prj666project@2026



################ KYC INTEGRATION ###############

