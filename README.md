# SalonBook – Server

SalonBook Server is the backend API of the SalonBook salon appointment booking platform.

It provides authentication, user management, salon service management, appointment management, role-based authorization, image upload functionality, and secure online payment processing.

## Live API

https://salonbook-server-teal.vercel.app

## Client Website

https://salon-book-client-zeta.vercel.app

## Important Features

- RESTful API Architecture
- User Authentication with Better Auth
- JWT Authentication
- Google OAuth Integration
- Role-Based Authorization
- Admin and Customer Access Control
- Blocked User Access Restriction
- Salon Service Management
- Appointment Creation and Management
- Appointment Cancellation
- Appointment Status Management
- Customer Appointment History
- Stripe Checkout Integration
- Stripe Webhook Payment Verification
- Transaction Management
- MongoDB Database Integration
- Image Upload using ImgBB
- Input Validation and Error Handling
- Protected API Routes

## Technology Stack

- Node.js
- Express.js
- JavaScript (ES Modules)
- MongoDB
- Mongoose
- Better Auth
- JSON Web Token (JWT)
- Stripe
- ImgBB
- Google OAuth
- dotenv
- CORS

## Installation Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/samiulalamsayed/SalonBook-server
```

### 2. Navigate to the Project Directory

```bash
cd salonbook-server
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root directory.

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=your_database_name

BETTER_AUTH_URL=http://localhost:5000
BETTER_AUTH_SECRET=your_better_auth_secret

CLIENT_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

IMGBB_API_KEY=your_imgbb_api_key

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
```

**Note:** Never commit your `.env` file or expose secret credentials in a public repository.

### 5. Run the Development Server

```bash
npm run dev
```

The backend server will run at:

http://localhost:5000

## Required Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `NODE_ENV` | Application environment |
| `MONGODB_URI` | MongoDB connection string |
| `MONGODB_DB` | MongoDB database name |
| `BETTER_AUTH_URL` | Better Auth base URL |
| `BETTER_AUTH_SECRET` | Better Auth secret key |
| `CLIENT_URL` | Frontend application URL |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| `IMGBB_API_KEY` | ImgBB API key |
| `STRIPE_SECRET_KEY` | Stripe secret API key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `ADMIN_EMAIL` | Admin account email (if used by the seed script) |
| `ADMIN_PASSWORD` | Admin account password (if used by the seed script) |

## Deployment

The backend is deployed on Vercel.

Production API:

https://salonbook-server-teal.vercel.app

## Repository Links

- Client Repository: [CLIENT_REPOSITORY_URL](https://github.com/samiulalamsayed/SalonBook-client)
- Server Repository: [SERVER_REPOSITORY_URL](https://github.com/samiulalamsayed/SalonBook-server)


