# Firebase Database Schema

## Collections

### 1. users
```javascript
{
  uid: "string", // Firebase Auth UID
  email: "string",
  name: "string",
  phone: "string",
  address: "string",
  type: "email" | "mobile",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

### 2. products
```javascript
{
  id: "string", // Auto-generated
  name: "string",
  description: "string",
  price: "number",
  originalPrice: "number",
  category: "string",
  categoryId: "string",
  image: "string", // URL
  badge: "string", // "New", "Sale", "Organic", etc.
  featured: "boolean",
  inStock: "boolean",
  unit: "string", // "L", "kg", "pieces"
  features: ["string"],
  nutritionalInfo: {
    calories: "number",
    protein: "number",
    fat: "number",
    carbs: "number"
  },
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

### 3. orders
```javascript
{
  id: "string", // Auto-generated
  userId: "string", // Reference to user UID
  orderNumber: "string",
  status: "processing" | "in-transit" | "delivered" | "cancelled",
  trackingNumber: "string",
  deliveryAddress: "string",
  deliveryDate: "timestamp",
  items: [
    {
      productId: "string",
      name: "string",
      price: "number",
      quantity: "number",
      total: "number"
    }
  ],
  subtotal: "number",
  tax: "number",
  shipping: "number",
  total: "number",
  paymentMethod: "string",
  paymentStatus: "pending" | "completed" | "failed",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

### 4. categories
```javascript
{
  id: "string", // Auto-generated
  name: "string",
  description: "string",
  image: "string", // URL
  slug: "string",
  featured: "boolean",
  createdAt: "timestamp"
}
```

### 5. reviews
```javascript
{
  id: "string", // Auto-generated
  productId: "string",
  userId: "string",
  rating: "number", // 1-5
  title: "string",
  comment: "string",
  createdAt: "timestamp"
}
```

### 6. cart_items
```javascript
{
  id: "string", // Auto-generated
  userId: "string",
  productId: "string",
  quantity: "number",
  createdAt: "timestamp"
}
```

## Security Rules

### Firestore Rules
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

## Indexes

### Required Indexes
1. `users` collection: `uid` (for user queries)
2. `products` collection: `featured` (for featured products)
3. `products` collection: `categoryId` (for category filtering)
4. `orders` collection: `userId` + `createdAt` (for user orders)
5. `reviews` collection: `productId` + `createdAt` (for product reviews)
6. `cart_items` collection: `userId` (for user cart)

## Sample Data

### Sample Products
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
  }
}
```

### Sample Categories
```javascript
{
  "name": "Milk",
  "description": "Fresh dairy milk products",
  "image": "/images/milk-category.jpg",
  "slug": "milk",
  "featured": true
}
```

## Usage Examples

### Get Featured Products
```javascript
import { productService } from '../firebase/services';

const featuredProducts = await productService.getFeaturedProducts();
```

### Create Order
```javascript
import { orderService } from '../firebase/services';

const orderData = {
  userId: user.uid,
  items: cartItems,
  deliveryAddress: address,
  total: totalAmount
};

const result = await orderService.createOrder(orderData);
```

### Get User Orders
```javascript
import { orderService } from '../firebase/services';

const userOrders = await orderService.getUserOrders(user.uid);
``` 