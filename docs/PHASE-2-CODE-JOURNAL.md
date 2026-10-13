# PHASE-2 Code Journal - Backend Authentication

## Overview
PHASE-2 implements JWT-based authentication system with user registration and login functionality.

---

## Backend Components

### 1. Auth Service (`Backend/src/services/auth.service.ts`)
**Purpose:** Centralized authentication logic

**Key Functions:**
- `hashPassword()`: Uses bcryptjs to hash passwords with 10 salt rounds
  - Never store plain passwords in database
  - Salt ensures same password produces different hashes
  
- `comparePassword()`: Compares plain password with stored hash
  - Used during login to verify credentials
  
- `generateToken()`: Creates JWT token with user ID
  - Token expires in 24 hours
  - Contains userId payload for authorization
  
- `verifyToken()`: Validates JWT token signature
  - Returns userId if valid, null if expired/invalid
  
- `register()`: Creates new user with validation
  - Checks if user already exists
  - Hashes password before storage
  - Returns user data + token
  
- `login()`: Authenticates user with email/password
  - Finds user by email
  - Verifies password hash
  - Returns user data + token

### 2. Auth Middleware (`Backend/src/middleware/auth.middleware.ts`)
**Purpose:** Protect API routes from unauthorized access

**How it works:**
- Extracts JWT token from Authorization header
- Verifies token using auth service
- Sets userId on request object for route handlers
- Returns 401 if token missing or invalid
- Attached to protected routes like `GET /users/:id`

### 3. Auth Endpoints (`Backend/src/server.ts`)
**Purpose:** API routes for authentication

**Routes:**
- `POST /auth/register` - Create new user account
  - Body: { email, password, name }
  - Returns: { user, token }
  
- `POST /auth/login` - Authenticate existing user
  - Body: { email, password }
  - Returns: { user, token }
  
- `GET /users/:id` - Get user profile (protected)
  - Requires: Authorization header with token
  - Returns: { id, email, name, createdAt }

---

## Frontend Components

### 1. Auth Context (`Frontend/src/context/AuthContext.tsx`)
**Purpose:** Global authentication state management

**Features:**
- Stores current user data and JWT token
- Persists to localStorage for session persistence
- Provides login/register/logout functions
- Available to all components via `useAuth()` hook

**State:**
- `user`: Current logged-in user or null
- `token`: JWT token or null
- `loading`: Loading state during auth operations

**Functions:**
- `login(email, password)`: Makes API call, stores token/user
- `register(email, password, name)`: Creates account, auto-logs in
- `logout()`: Clears user data and localStorage

### 2. Login Page (`Frontend/src/pages/Login.tsx`)
**Purpose:** User login form

**Features:**
- Email and password fields with validation
- Error message display
- Loading state during submission
- Links to registration page
- Dark/light theme support
- Redirects to home after success

### 3. Register Page (`Frontend/src/pages/Register.tsx`)
**Purpose:** User registration form

**Features:**
- Name, email, password fields
- Password confirmation validation
- Error message display
- Loading state
- Links to login page
- Dark/light theme support
- Redirects to home after success

---

## Security Considerations

1. **Password Storage**: Passwords hashed with bcryptjs (10 rounds)
2. **JWT Token**: Signed with secret, expires in 24 hours
3. **Token Storage**: Stored in localStorage (vulnerable to XSS)
   - Better option: httpOnly cookies (for future)
4. **Protected Routes**: Auth middleware validates token on each request
5. **CORS**: Enabled for local development

---

## Data Flow

### Registration Flow
