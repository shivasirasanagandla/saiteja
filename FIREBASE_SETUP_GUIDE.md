# Firebase Setup Guide for Dairy Website

## Prerequisites
- Google account
- Node.js and npm installed
- Firebase CLI (optional but recommended)

## Step 1: Create Firebase Project

### 1.1 Go to Firebase Console
- Visit [Firebase Console](https://console.firebase.google.com/)
- Click "Create a project" or "Add project"

### 1.2 Project Setup
- **Project name**: `natures-dairy-website` (or your preferred name)
- **Enable Google Analytics**: Optional (recommended for production)
- Click "Create project"

### 1.3 Enable Services
In your Firebase project, enable these services:

#### Authentication
1. Go to "Authentication" → "Get started"
2. Enable "Email/Password" provider
3. Go to "Settings" → "Authorized domains"
4. Add your domain (for production) or `localhost` (for development)

#### Firestore Database
1. Go to "Firestore Database" → "Create database"
2. Choose "Start in test mode" (for development)
3. Select a location (choose closest to your users)
4. Click "Done"

#### Storage (Optional)
1. Go to "Storage" → "Get started"
2. Choose "Start in test mode"
3. Select a location
4. Click "Done"

## Step 2: Get Firebase Configuration

### 2.1 Get Config Object
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" → "Web"
4. Register app with nickname (e.g., "Dairy Website")
5. Copy the config object

### 2.2 Update Configuration
Replace the placeholder config in `src/firebase/config.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
```

## Step 3: Set Up Firestore Security Rules

### 3.1 Go to Firestore Rules
1. In Firebase Console, go to "Firestore Database"
2. Click "Rules" tab
3. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products are readable by everyone, writable by admins
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Orders are readable/writable by the user who created them
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Categories are readable by everyone
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Reviews are readable by everyone, writable by authenticated users
    match /reviews/{reviewId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Cart items are readable/writable by the user
    match /cart_items/{itemId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

### 3.2 Publish Rules
Click "Publish" to save the rules.

## Step 4: Create Database Indexes

### 4.1 Required Indexes
Firebase will prompt you to create indexes when needed. Here are the recommended indexes:

1. **Products Collection**:
   - Field: `featured`, Order: `ascending`
   - Field: `categoryId`, Order: `ascending`

2. **Orders Collection**:
   - Field: `userId`, Order: `ascending`
   - Field: `createdAt`, Order: `descending`

3. **Reviews Collection**:
   - Field: `productId`, Order: `ascending`
   - Field: `createdAt`, Order: `descending`

4. **Cart Items Collection**:
   - Field: `userId`, Order: `ascending`

### 4.2 Create Indexes
When you run queries that require indexes, Firebase will show an error with a link to create the index. Click the link and create the index.

## Step 5: Add Sample Data

### 5.1 Using Firebase Console
1. Go to "Firestore Database"
2. Click "Start collection"
3. Create collections: `users`, `products`, `categories`, `orders`

### 5.2 Sample Products Data
Add this sample product:

```javascript
{
  "name": "Fresh Organic Milk",
  "description": "Pure, fresh milk from indigenous-breed cows",
  "price": 45,
  "originalPrice": 50,
  "category": "Milk",
  "categoryId": "milk",
  "image": "/images/freshmilk.jpeg",
  "badge": "Organic",
  "featured": true,
  "inStock": true,
  "unit": "L",
  "features": ["Organic", "Fresh", "No Preservatives"],
  "nutritionalInfo": {
    "calories": 42,
    "protein": 3.4,
    "fat": 1.0,
    "carbs": 5.0
  },
  "createdAt": "timestamp"
}
```

### 5.3 Sample Categories Data
```javascript
{
  "name": "Milk",
  "description": "Fresh dairy milk products",
  "image": "/images/milk-category.jpg",
  "slug": "milk",
  "featured": true,
  "createdAt": "timestamp"
}
```

## Step 6: Test the Integration

### 6.1 Start the Development Server
```bash
npm start
```

### 6.2 Test Authentication
1. Try to register a new user
2. Try to login with the registered user
3. Check if user data is saved in Firestore

### 6.3 Test Products
1. Check if products are loading from Firebase
2. Verify featured products are displayed

## Step 7: Environment Variables (Optional)

### 7.1 Create .env file
Create a `.env` file in the root directory:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### 7.2 Update config.js
Update `src/firebase/config.js` to use environment variables:

```javascript
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};
```

## Step 8: Production Deployment

### 8.1 Update Security Rules
For production, update the security rules to be more restrictive:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Add more specific rules for production
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Add more specific rules as needed
  }
}
```

### 8.2 Update Authorized Domains
1. Go to Authentication → Settings
2. Add your production domain to "Authorized domains"

### 8.3 Deploy
Deploy your React app to your preferred hosting service (Netlify, Vercel, etc.)

## Troubleshooting

### Common Issues

1. **"Firebase App named '[DEFAULT]' already exists"**
   - Make sure you're not initializing Firebase multiple times
   - Check if you have multiple config files

2. **"Permission denied" errors**
   - Check your Firestore security rules
   - Make sure you're authenticated when required

3. **"Index not found" errors**
   - Create the required indexes in Firebase Console
   - Wait for indexes to build (can take a few minutes)

4. **Authentication errors**
   - Check if Email/Password provider is enabled
   - Verify your domain is in authorized domains

### Debug Tips

1. **Enable Firebase Debug Mode**:
   ```javascript
   // In your config.js
   if (process.env.NODE_ENV === 'development') {
     console.log('Firebase config:', firebaseConfig);
   }
   ```

2. **Check Network Tab**:
   - Open browser dev tools
   - Check Network tab for Firebase requests
   - Look for any failed requests

3. **Firebase Console Logs**:
   - Check Firebase Console → Functions → Logs
   - Look for any error messages

## Next Steps

1. **Add more features**:
   - User profile management
   - Order tracking
   - Product reviews
   - Admin dashboard

2. **Optimize performance**:
   - Implement pagination
   - Add caching
   - Optimize queries

3. **Add analytics**:
   - Enable Google Analytics
   - Track user behavior
   - Monitor performance

4. **Security enhancements**:
   - Add email verification
   - Implement password reset
   - Add two-factor authentication 