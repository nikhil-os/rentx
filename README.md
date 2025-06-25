# RentX - Rental Marketplace Platform

RentX is a full-stack rental marketplace platform where users can rent out their items or rent items from others. The platform includes features like user authentication, item listings, bookings, payments, and more.

## Project Structure

The project is divided into two main parts:

- **rentx-frontend**: Next.js frontend application
- **rentx-backend**: Express.js backend API

## Local Development Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd rentx-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the development server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd rentx-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the frontend directory with the following variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

### Deploying to Vercel

#### Option 1: Using the Deployment Script

1. Make sure you have the Vercel CLI installed and are logged in:
   ```
   npm install -g vercel
   vercel login
   ```

2. Run the deployment script from the root directory:
   ```
   node deploy.js
   ```

#### Option 2: Manual Deployment

##### Backend Deployment

1. Navigate to the backend directory:
   ```
   cd rentx-backend
   ```

2. Deploy to Vercel:
   ```
   vercel --prod
   ```

3. Set up the following environment variables in the Vercel project settings:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key

##### Frontend Deployment

1. Navigate to the frontend directory:
   ```
   cd rentx-frontend
   ```

2. Deploy to Vercel:
   ```
   vercel --prod
   ```

3. Set up the following environment variables in the Vercel project settings:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend URL (e.g., https://your-backend.vercel.app/api)

## Troubleshooting

### Backend Connection Issues

If you're experiencing "Failed to fetch" errors or "Backend connection error" messages:

1. Make sure your backend server is running
2. Check that the `NEXT_PUBLIC_API_URL` environment variable is correctly set
3. Verify that CORS is properly configured on the backend
4. Check the browser console for specific error messages

### Image Loading Issues

If images aren't loading correctly:

1. Make sure the image paths are correct
2. Check that the backend server can serve the uploaded files
3. Verify that the `getImageUrl` function in the frontend is correctly configured

## License

This project is licensed under the MIT License. 