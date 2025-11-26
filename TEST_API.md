# API Testing Guide

## Test if the Backend Server is Running

Open your browser or use curl to test these endpoints:

### 1. Test Users API
```bash
curl http://localhost:3001/api/users
```

### 2. Test Employees API
```bash
curl http://localhost:3001/api/employees
```

### 3. Test Hazards API
```bash
curl http://localhost:3001/api/hazards
```

### 4. Test Equipment API
```bash
curl http://localhost:3001/api/equipment
```

### 5. Test Notifications API
```bash
curl http://localhost:3001/api/notifications
```

### 6. Test Attendance API
```bash
curl http://localhost:3001/api/attendance
```

## Expected Response Format

All endpoints should return JSON in this format:
```json
{
  "users": [...],      // for /api/users
  "employees": [...],  // for /api/employees
  "hazards": [...],    // for /api/hazards
  etc.
}
```

## Common Issues

### 1. Server Not Running
Error: `Failed to fetch` or `Load failed`
Solution: Start the server with `npm start` in the `/server` directory

### 2. MongoDB Connection Error
Error: `MongoServerError: Authentication failed`
Solution: Check your `.env` file has correct MongoDB credentials

### 3. CORS Error
Error: `Access to fetch blocked by CORS policy`
Solution: Server already configured with CORS, restart server if needed

### 4. Port Already in Use
Error: `EADDRINUSE: address already in use :::3001`
Solution: Kill the process using port 3001:
```bash
lsof -ti:3001 | xargs kill -9
```

## How to Start Both Servers

### Terminal 1 - Backend Server:
```bash
cd server
npm start
```

### Terminal 2 - Frontend Dev Server:
```bash
cd my-react-app
npm run dev
```

The backend runs on `http://localhost:3001`
The frontend runs on `http://localhost:5173`
