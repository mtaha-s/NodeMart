# NodeMart

> NodeMart is a web-based inventory and vendor management system designed to help 
businesses manage products, vendors, and purchasing workflows efficiently. The system 
is being developed using modern, scalable technologies to ensure performance, security, 
and future expansion.

## Features
- User registration with hashed passwords (bcrypt)
- JWT-based authentication (access + refresh tokens)
- Login, logout, and session management
- Avatar upload:
  *  Default avatar assigned if none is uploaded
  *  Direct upload to ImageKit.io
  *  Old avatar deleted when a new one is uploaded
  *  Public URL stored in MongoDB
- Role-based user management (user, admin)
- Secure cookies for tokens

## Project Structure
<pre>
src/
 ├── controllers/       # Route handlers (user.controller.js)
 ├── middlewares/       # JWT auth, multer upload
 ├── models/            # Mongoose schemas (user.model.js)
 ├── routes/            # Express routes (authenticationRoutes.js)
 ├── services/          # JWT + bcrypt helpers, ImageKit client
 ├── utils/             # ApiError, ApiResponse, asyncHandler
</pre>

## Setup
1. Clone the repo  
   <pre>git clone https://github.com/mtaha-s/nodemart.git  
   cd nodemart</pre>

2. Install dependencies  
   <pre>npm install</pre>

3. Create a `.env` file in the root:  
   <pre>
   PORT=5000
   MONGO_URI=your_mongodb_connection_string

   ACCESS_TOKEN_SECRET=your_access_secret
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_SECRET=your_refresh_secret
   REFRESH_TOKEN_EXPIRY=7d

   IMAGEKIT_PUBLIC_KEY=your_public_key
   IMAGEKIT_PRIVATE_KEY=your_private_key
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_project_id
   </pre>

4. Run the server  
   <pre>npm run dev</pre>

## API Endpoints
### Auth
+ POST /api/users/register → Register new user (with optional avatar upload)  
+ POST /api/users/login → Login with email + password  
+ POST /api/users/logout → Logout (protected)  
+ GET /api/users/currentUser → Get current user (protected)  
+ POST /api/users/changeUserPassword → Change password (protected)  

## Avatar Logic
- If user uploads an avatar → file goes to ImageKit → public URL saved in DB.  
- If user doesn’t upload → schema assigns a default avatar URL.  
- When updating avatar → old ImageKit file is deleted → new one uploaded → DB updated.  
