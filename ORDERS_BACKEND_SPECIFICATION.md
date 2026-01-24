# Orders Page - Backend Specification

## Overview
The frontend implements a payment approval flow for orders:
1. **Awaiting Payment Proof** - Customer uploads payment image (PAUSE, PENDING, REJECTED)
2. **Processing** - Admin approves payment, order is packed/shipped (PROCESS)
3. **Completed** - Customer confirms receipt (FINISH)

---

## Current Frontend Implementation

### Order Status Flow
```
PAUSE → PENDING → PROCESS → FINISH
         ↓
      REJECTED (can re-upload)
```

- **PAUSE**: Customer needs to upload payment proof (no image uploaded yet)
- **PENDING**: Payment proof uploaded, awaiting admin approval
- **REJECTED**: Payment proof rejected by admin, customer can re-upload
- **PROCESS**: Payment verified by admin, order being processed
- **FINISH**: Order completed, customer received books

---

## API Endpoints Required

### 1. Get Orders by Status
**Endpoint:** `GET /order/all?page={page}&limit={limit}&orderStatus={status}`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 5)
- `orderStatus`: One of `PAUSE`, `PENDING`, `REJECTED`, `PROCESS`, `FINISH`

**Note:** Frontend fetches `PAUSE`, `PENDING`, and `REJECTED` orders together for the "Awaiting Payment Proof" tab.

**Response:** Array of Order objects

**Order Object Structure:**
```json
{
  "_id": "order_id",
  "orderTotal": 150.00,
  "orderDelivery": 10.00,
  "orderStatus": "PAUSE",
  "memberId": "member_id",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z",
  "paymentImage": "uploads/payments/uuid-image.jpg", // Optional, added after upload
  "orderItems": [
    {
      "_id": "item_id",
      "itemQuantity": 2,
      "itemPrice": 25.00,
      "productId": "product_id",
      "orderId": "order_id"
    }
  ],
  "productData": [
    {
      "_id": "product_id",
      "productName": "Book Title",
      "productImages": ["uploads/products/uuid.jpg"]
    }
  ]
}
```

---

### 2. Update Order (with Payment Image Upload)
**Endpoint:** `POST /order/update`

**Request Format:** `multipart/form-data` when uploading image, JSON otherwise

**When Uploading Payment Image:**
```
Content-Type: multipart/form-data

Form Fields:
- orderId: string (required)
- orderStatus: "PENDING" (required - changes from PAUSE/REJECTED to PENDING)
- paymentImage: File (required - image file)
```

**When Updating Status Only (no image):**
```
Content-Type: application/json

Body:
{
  "orderId": "order_id",
  "orderStatus": "FINISH" // or other status
}
```

**Backend Should:**
1. Accept `multipart/form-data` when `paymentImage` is present
2. Validate file type (JPG, JPEG, PNG only)
3. Validate file size (max 5MB)
4. Save image to: `./uploads/payments/{uuid}.{ext}`
5. Store relative path in database: `uploads/payments/{uuid}.{ext}`
6. Update order:
   - Set `orderStatus` to `PENDING` (awaiting admin approval)
   - Set `paymentImage` field to the stored path
   - Update `updatedAt` timestamp
7. Return updated Order object

**Admin Approval/Rejection:**
- Admin approves: Change `orderStatus` from `PENDING` → `PROCESS`
- Admin rejects: Change `orderStatus` from `PENDING` → `REJECTED`
- Rejected orders can be re-uploaded (status changes back to `PENDING`)

**Response:** Updated Order object (same structure as GET endpoint)

---

## Backend Responsibilities

### 1. File Upload Handling
- Accept `multipart/form-data` for `/order/update` endpoint
- Validate image file (type: JPG/JPEG/PNG, size: max 5MB)
- Generate unique filename (UUID recommended)
- Save to: `./uploads/payments/` directory
- Store relative path in database (not absolute path)

### 2. Order Status Management
- When payment image is uploaded → change status from `PAUSE`/`REJECTED` to `PENDING`
- When admin approves payment → change status from `PENDING` to `PROCESS`
- When admin rejects payment → change status from `PENDING` to `REJECTED`
- When customer marks as received → change status from `PROCESS` to `FINISH`
- Ensure status transitions are valid:
  - `PAUSE` → `PENDING` (on upload)
  - `REJECTED` → `PENDING` (on re-upload)
  - `PENDING` → `PROCESS` (admin approval)
  - `PENDING` → `REJECTED` (admin rejection)
  - `PROCESS` → `FINISH` (customer confirmation)

### 3. Image URL Construction
- Frontend constructs full URLs as: `http://localhost:3003/uploads/{path}`
- Ensure static file serving is configured: `app.use("/uploads", express.static("./uploads"))`
- Database should store: `uploads/payments/uuid.jpg` (relative path, no leading slash)

### 4. Order Aggregation
- When fetching orders, include:
  - Order items (`orderItems`)
  - Product data (`productData`) - populated product details for each item
  - Payment image path (if exists)

---

## Important Notes

1. **Payment Image Field**: Add optional `paymentImage?: string` field to Order schema
2. **Status Validation**: Only allow these transitions:
   - `PAUSE` → `PENDING` (when payment image uploaded)
   - `REJECTED` → `PENDING` (when payment image re-uploaded)
   - `PENDING` → `PROCESS` (when admin approves)
   - `PENDING` → `REJECTED` (when admin rejects)
   - `PROCESS` → `FINISH` (when customer confirms receipt)
3. **File Storage**: Use consistent path structure: `uploads/payments/{uuid}.{ext}`
4. **Error Handling**: Return clear error messages for:
   - Invalid file type/size
   - Missing orderId
   - Invalid status transitions
   - File upload failures

---

## Example Request/Response

### Upload Payment Image
**Request (Upload Payment Proof):**
```
POST /order/update
Content-Type: multipart/form-data

orderId: "507f1f77bcf86cd799439011"
orderStatus: "PENDING"
paymentImage: [binary file data]
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "orderStatus": "PENDING",
  "paymentImage": "uploads/payments/a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg",
  "updatedAt": "2024-01-15T11:30:00Z",
  ...
}
```

**Request (Admin Approves - Admin Panel):**
```
POST /admin/order/approve
Content-Type: application/json

{
  "orderId": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "orderStatus": "PROCESS",
  "updatedAt": "2024-01-15T12:00:00Z",
  ...
}
```

**Request (Admin Rejects - Admin Panel):**
```
POST /admin/order/reject
Content-Type: application/json

{
  "orderId": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "orderStatus": "REJECTED",
  "updatedAt": "2024-01-15T12:00:00Z",
  ...
}
```

### Mark as Received
**Request:**
```
POST /order/update
Content-Type: application/json

{
  "orderId": "507f1f77bcf86cd799439011",
  "orderStatus": "FINISH"
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "orderStatus": "FINISH",
  "updatedAt": "2024-01-15T12:00:00Z",
  ...
}
```

---

## Summary

**Backend needs to:**
1. ✅ Handle `multipart/form-data` on `/order/update` endpoint
2. ✅ Save payment images to `uploads/payments/` directory
3. ✅ Store image path in Order document
4. ✅ Update order status from `PAUSE`/`REJECTED` → `PENDING` when image uploaded
5. ✅ Admin endpoint to approve: `PENDING` → `PROCESS`
6. ✅ Admin endpoint to reject: `PENDING` → `REJECTED`
7. ✅ Update order status from `PROCESS` → `FINISH` when customer confirms
8. ✅ Return orders with populated product data and payment image path
9. ✅ Serve static files from `/uploads` path
10. ✅ Support fetching orders with status `PAUSE`, `PENDING`, `REJECTED` (for "Awaiting Payment Proof" tab)
