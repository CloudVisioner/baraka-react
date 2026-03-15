# Book of the Month - Backend API Specification

## Overview
The "Book of the Month" feature allows bookstore administrators to manually select and configure a featured book recommendation that appears on the homepage. This replaces the automatic selection based on product views.

## API Endpoints

### 1. GET `/book-of-the-month/current`
**Description:** Retrieve the current Book of the Month

**Method:** `GET`

**Authentication:** Not required (public endpoint)

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "bookOfMonthId123",
    "productId": "productId456",
    "productName": "The Great Gatsby",
    "productAuthor": "F. Scott Fitzgerald",
    "productImage": "uploads/products/great-gatsby.jpg",
    "whyRead": "This timeless classic explores the American Dream through the eyes of Nick Carraway, offering profound insights into wealth, love, and the pursuit of happiness. A must-read for anyone interested in American literature and social commentary.",
    "isActive": true,
    "month": "2024-03",
    "createdAt": "2024-03-01T00:00:00.000Z",
    "updatedAt": "2024-03-15T10:30:00.000Z"
  }
}
```

**Error Response (No active book):**
```json
{
  "success": true,
  "data": null
}
```

**Status Codes:**
- `200 OK` - Success
- `500 Internal Server Error` - Server error

---

### 2. POST `/book-of-the-month/create`
**Description:** Create a new Book of the Month entry (Admin only)

**Method:** `POST`

**Authentication:** Required (Admin role)

**Request Body:**
```json
{
  "productId": "productId456",
  "whyRead": "This timeless classic explores the American Dream through the eyes of Nick Carraway, offering profound insights into wealth, love, and the pursuit of happiness. A must-read for anyone interested in American literature and social commentary."
}
```

**Request Fields:**
- `productId` (string, required): The ID of the product/book to feature
- `whyRead` (string, required): Custom recommendation text explaining why users should read this book (max 1000 characters)

**Response:**
```json
{
  "success": true,
  "message": "Book of the Month created successfully",
  "data": {
    "_id": "bookOfMonthId123",
    "productId": "productId456",
    "productName": "The Great Gatsby",
    "productAuthor": "F. Scott Fitzgerald",
    "productImage": "uploads/products/great-gatsby.jpg",
    "whyRead": "This timeless classic explores the American Dream...",
    "isActive": true,
    "month": "2024-03",
    "createdAt": "2024-03-15T10:30:00.000Z",
    "updatedAt": "2024-03-15T10:30:00.000Z"
  }
}
```

**Status Codes:**
- `201 Created` - Successfully created
- `400 Bad Request` - Invalid input (missing fields, invalid productId)
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not an admin
- `404 Not Found` - Product not found
- `409 Conflict` - Book of the Month already exists for current month
- `500 Internal Server Error` - Server error

---

### 3. PUT `/book-of-the-month/update/:id`
**Description:** Update an existing Book of the Month entry (Admin only)

**Method:** `PUT`

**Authentication:** Required (Admin role)

**URL Parameters:**
- `id` (string, required): Book of the Month entry ID

**Request Body:**
```json
{
  "productId": "productId789",
  "whyRead": "Updated recommendation text explaining why this book is exceptional and worth reading."
}
```

**Request Fields:**
- `productId` (string, optional): New product ID to feature
- `whyRead` (string, optional): Updated recommendation text (max 1000 characters)

**Response:**
```json
{
  "success": true,
  "message": "Book of the Month updated successfully",
  "data": {
    "_id": "bookOfMonthId123",
    "productId": "productId789",
    "productName": "1984",
    "productAuthor": "George Orwell",
    "productImage": "uploads/products/1984.jpg",
    "whyRead": "Updated recommendation text...",
    "isActive": true,
    "month": "2024-03",
    "createdAt": "2024-03-01T00:00:00.000Z",
    "updatedAt": "2024-03-15T11:00:00.000Z"
  }
}
```

**Status Codes:**
- `200 OK` - Successfully updated
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not an admin
- `404 Not Found` - Book of the Month entry not found
- `500 Internal Server Error` - Server error

---

### 4. DELETE `/book-of-the-month/delete/:id`
**Description:** Delete a Book of the Month entry (Admin only)

**Method:** `DELETE`

**Authentication:** Required (Admin role)

**URL Parameters:**
- `id` (string, required): Book of the Month entry ID

**Response:**
```json
{
  "success": true,
  "message": "Book of the Month deleted successfully"
}
```

**Status Codes:**
- `200 OK` - Successfully deleted
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not an admin
- `404 Not Found` - Book of the Month entry not found
- `500 Internal Server Error` - Server error

---

### 5. GET `/book-of-the-month/list`
**Description:** Get list of all Book of the Month entries (Admin only, for management)

**Method:** `GET`

**Authentication:** Required (Admin role)

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)
- `isActive` (boolean, optional): Filter by active status

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "bookOfMonthId123",
      "productId": "productId456",
      "productName": "The Great Gatsby",
      "productAuthor": "F. Scott Fitzgerald",
      "productImage": "uploads/products/great-gatsby.jpg",
      "whyRead": "This timeless classic...",
      "isActive": true,
      "month": "2024-03",
      "createdAt": "2024-03-01T00:00:00.000Z",
      "updatedAt": "2024-03-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

**Status Codes:**
- `200 OK` - Success
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not an admin
- `500 Internal Server Error` - Server error

---

## Data Model

### BookOfTheMonth Schema
```javascript
{
  _id: ObjectId,                    // Unique identifier
  productId: String,                 // Reference to Product._id (required)
  productName: String,              // Populated from Product.productName (read-only)
  productAuthor: String,            // Populated from Product.productAuthor (read-only)
  productImage: String,             // Populated from Product.productImages[0] (read-only)
  whyRead: String,                  // Custom recommendation text (required, max 1000 chars)
  isActive: Boolean,                // Whether this is the current active Book of the Month (default: true)
  month: String,                    // Format: "YYYY-MM" (e.g., "2024-03") (auto-generated)
  createdBy: ObjectId,              // Admin member ID who created it
  createdAt: Date,                  // Creation timestamp
  updatedAt: Date                   // Last update timestamp
}
```

---

## Business Logic Requirements

### 1. Automatic Field Population
When creating or updating a Book of the Month entry:
- **productName**: Automatically fetched from the referenced `Product.productName`
- **productAuthor**: Automatically fetched from the referenced `Product.productAuthor`
- **productImage**: Automatically fetched from `Product.productImages[0]` (first image)
- **month**: Automatically set to current month in "YYYY-MM" format

### 2. Active Book Management
- Only **one** Book of the Month can be `isActive: true` at a time
- When creating a new active Book of the Month:
  - If another entry exists with `isActive: true`, automatically set it to `isActive: false`
  - Set the new entry to `isActive: true`
- When updating an entry to `isActive: true`:
  - Deactivate all other active entries
  - Activate the current entry

### 3. Product Validation
- Before creating/updating, verify that the `productId` exists in the Product collection
- If product doesn't exist, return `404 Not Found`
- If product exists but is deleted/inactive, return `400 Bad Request` with appropriate message

### 4. Month Format
- Format: `"YYYY-MM"` (e.g., "2024-03" for March 2024)
- Automatically generated based on `createdAt` date
- Used for historical tracking and potential future features

### 5. Image URL Construction
- The `productImage` field stores the relative path from the Product (e.g., "uploads/products/image.jpg")
- Frontend will use `normalizeImagePath()` function to construct full URLs
- Backend should return the path as stored in the Product model

---

## Frontend Integration

### Current Implementation
The frontend component (`AcitveUsers.tsx`) currently:
1. Fetches the most popular book automatically
2. Displays book image, title, author, and description

### Required Changes
After backend implementation, the frontend will:
1. Call `GET /book-of-the-month/current` instead of fetching popular products
2. Display:
   - Book image (from `productImage`)
   - Book title (from `productName`)
   - Author (from `productAuthor`)
   - Custom recommendation text (from `whyRead`)
3. Handle `null` response gracefully (show "Coming soon" message)

### Frontend API Call Example
```typescript
// In AcitveUsers.tsx
useEffect(() => {
  const fetchBookOfTheMonth = async () => {
    try {
      const response = await axios.get(`${serverApi}/book-of-the-month/current`);
      if (response.data.success && response.data.data) {
        setBookOfTheMonth(response.data.data);
      } else {
        setBookOfTheMonth(null);
      }
    } catch (error) {
      console.error("Error fetching Book of the Month:", error);
      setBookOfTheMonth(null);
    } finally {
      setLoading(false);
    }
  };
  
  fetchBookOfTheMonth();
}, []);
```

---

## Admin Panel Requirements

The admin panel should provide:
1. **Create Book of the Month:**
   - Product selection dropdown/search
   - Text area for "Why You Should Read" (max 1000 characters)
   - Submit button

2. **Update Current Book of the Month:**
   - Edit product selection
   - Edit recommendation text
   - Save changes

3. **View History:**
   - List of all previous Books of the Month
   - Filter by month/year
   - View details

4. **Delete:**
   - Ability to remove Book of the Month entries

---

## Error Handling

### Common Error Scenarios

1. **Product Not Found:**
   ```json
   {
     "success": false,
     "message": "Product not found",
     "error": "PRODUCT_NOT_FOUND"
   }
   ```

2. **Duplicate Active Entry:**
   ```json
   {
     "success": false,
     "message": "Another Book of the Month is already active. Please deactivate it first.",
     "error": "DUPLICATE_ACTIVE"
   }
   ```

3. **Invalid Input:**
   ```json
   {
     "success": false,
     "message": "Validation failed",
     "errors": {
       "whyRead": "Why read text is required and must be less than 1000 characters"
     }
   }
   ```

4. **Unauthorized:**
   ```json
   {
     "success": false,
     "message": "Unauthorized. Admin access required.",
     "error": "UNAUTHORIZED"
   }
   ```

---

## Testing Checklist

- [ ] GET `/book-of-the-month/current` returns active book
- [ ] GET `/book-of-the-month/current` returns null when no active book
- [ ] POST `/book-of-the-month/create` creates new entry and deactivates previous
- [ ] POST `/book-of-the-month/create` validates productId exists
- [ ] POST `/book-of-the-month/create` validates whyRead length
- [ ] PUT `/book-of-the-month/update/:id` updates entry
- [ ] PUT `/book-of-the-month/update/:id` handles productId change
- [ ] DELETE `/book-of-the-month/delete/:id` removes entry
- [ ] Admin authentication required for create/update/delete
- [ ] Public access allowed for GET current
- [ ] Automatic field population from Product model
- [ ] Only one active entry at a time

---

## Notes

1. **Image Handling:** The `productImage` field is populated from the Product's first image. If the product image is updated, the Book of the Month will automatically reflect the new image (since it references the product).

2. **Historical Data:** Keep all Book of the Month entries for historical tracking. Only mark one as `isActive: true`.

3. **Monthly Rotation:** The system supports monthly rotation. Admins can create a new entry each month, and the system will automatically deactivate the previous month's entry.

4. **Product Updates:** If a product's name, author, or image is updated, the Book of the Month should reflect these changes (consider using population or fetching fresh data on each request).

---

## Questions for Backend Team

1. Should we use MongoDB population for `productId` or fetch product data separately?
2. Do we need to handle product deletion? (What happens if a product is deleted but referenced in Book of the Month?)
3. Should we add a `deactivatedAt` timestamp for historical tracking?
4. Do we need soft delete for Book of the Month entries?
