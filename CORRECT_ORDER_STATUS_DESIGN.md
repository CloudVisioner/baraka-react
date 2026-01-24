# Correct Order Status Flow Design

## Status Flow Diagram

```
PAUSE (No payment proof)
  ↓ [User uploads payment image]
PENDING (Payment proof uploaded, awaiting admin)
  ↓ [Admin approves]          ↓ [Admin rejects]
PROCESS (Approved, processing)  REJECTED (Rejected, can re-upload)
  ↓ [Customer confirms receipt]
FINISH (Order completed)
```

---

## Order Status Definitions

### 1. PAUSE
- **Meaning**: Order created, no payment proof uploaded yet
- **User Action**: Needs to upload payment proof image
- **Display**: "Awaiting Payment Proof" tab
- **UI Label**: "Awaiting Payment" (gray badge)

### 2. PENDING
- **Meaning**: Payment proof uploaded, waiting for admin approval/rejection
- **User Action**: None (waiting for admin)
- **Display**: "Awaiting Payment Proof" tab
- **UI Label**: "Pending Approval" (orange badge)
- **Backend Action**: Admin can approve or reject

### 3. PROCESS
- **Meaning**: Admin approved payment, order is being packed and shipped
- **User Action**: Can mark as received when books arrive
- **Display**: "Processing" tab
- **UI Label**: "Processing" (orange badge)
- **Message**: "Your payment has been verified. Your order is being processed and will be shipped soon."

### 4. REJECTED
- **Meaning**: Admin rejected the payment proof
- **User Action**: Can re-upload payment proof
- **Display**: "Awaiting Payment Proof" tab
- **UI Label**: "Payment Rejected" (red badge)
- **Message**: "Your payment proof was rejected. Please upload a new payment proof image."
- **Re-upload**: Changes status back to `PENDING`

### 5. FINISH
- **Meaning**: Customer confirmed receipt, order fully completed
- **User Action**: None (read-only)
- **Display**: "Completed" tab
- **UI Label**: "Completed" (green badge)
- **Message**: "You've confirmed receipt of your order. Thank you for shopping with Baraka Books!"

### 6. DELETE
- **Meaning**: Order deleted/cancelled (not used for rejection)
- **Note**: Should NOT be used for payment rejection

---

## Correct Backend API Behavior

### When User Uploads Payment Proof
**Endpoint**: `POST /order/update`
**Request**: `multipart/form-data`
```
orderId: "order_id"
orderStatus: "PENDING"  ✅ (NOT "PROCESS" or "FINISH")
paymentImage: [file]
```

**Response**:
```json
{
  "_id": "order_id",
  "orderStatus": "PENDING",  ✅
  "paymentImage": "uploads/payments/uuid.jpg",
  "updatedAt": "2024-01-15T11:00:00Z"
}
```

---

### When Admin Approves Payment
**Endpoint**: `POST /admin/order/approve`
**Request**: `application/json`
```json
{
  "orderId": "order_id"
}
```

**Response**:
```json
{
  "data": {
    "_id": "order_id",
    "orderStatus": "PROCESS",  ✅ (NOT "FINISH")
    "paymentImage": "uploads/payments/uuid.jpg",
    "updatedAt": "2024-01-15T12:00:00Z"
  },
  "message": "Order approved successfully"
}
```

**Frontend Behavior**:
- Order moves from "Awaiting Payment Proof" tab → "Processing" tab
- Shows "Processing" badge
- Shows "Mark as Received" button

---

### When Admin Rejects Payment
**Endpoint**: `POST /admin/order/reject`
**Request**: `application/json`
```json
{
  "orderId": "order_id"
}
```

**Response**:
```json
{
  "data": {
    "_id": "order_id",
    "orderStatus": "REJECTED",  ✅ (NOT "DELETE")
    "paymentImage": "uploads/payments/uuid.jpg",  // Keep the image for reference
    "updatedAt": "2024-01-15T12:00:00Z"
  },
  "message": "Order rejected successfully"
}
```

**Frontend Behavior**:
- Order stays in "Awaiting Payment Proof" tab
- Shows "Payment Rejected" badge (red)
- Shows rejection message
- Shows "Re-upload Payment Proof" button
- User can upload new image → status changes to `PENDING`

---

### When Customer Marks as Received
**Endpoint**: `POST /order/update`
**Request**: `application/json`
```json
{
  "orderId": "order_id",
  "orderStatus": "FINISH"
}
```

**Response**:
```json
{
  "_id": "order_id",
  "orderStatus": "FINISH",  ✅
  "updatedAt": "2024-01-15T13:00:00Z"
}
```

**Frontend Behavior**:
- Order moves from "Processing" tab → "Completed" tab
- Shows "Completed" badge (green)
- Shows completion message

---

## Status Transition Rules

### Valid Transitions:
1. ✅ `PAUSE` → `PENDING` (user uploads payment proof)
2. ✅ `REJECTED` → `PENDING` (user re-uploads payment proof)
3. ✅ `PENDING` → `PROCESS` (admin approves)
4. ✅ `PENDING` → `REJECTED` (admin rejects)
5. ✅ `PROCESS` → `FINISH` (customer confirms receipt)

### Invalid Transitions (Should be prevented):
1. ❌ `PAUSE` → `PROCESS` (skip approval)
2. ❌ `PENDING` → `FINISH` (skip processing)
3. ❌ `REJECTED` → `PROCESS` (must re-upload first)
4. ❌ `PROCESS` → `REJECTED` (can't reject after approval)
5. ❌ `FINISH` → any other status (final state)

---

## Frontend Tab Organization

### Tab 1: "Awaiting Payment Proof"
**Shows orders with status:**
- `PAUSE` - No payment proof uploaded
- `PENDING` - Payment proof uploaded, awaiting approval
- `REJECTED` - Payment proof rejected, can re-upload

**UI States:**
- **PAUSE**: Upload section visible, "Select Image First" button
- **PENDING**: Shows uploaded image, "Pending Approval" button (disabled)
- **REJECTED**: Shows rejection message, "Re-upload Payment Proof" button

---

### Tab 2: "Processing"
**Shows orders with status:**
- `PROCESS` - Payment approved, being processed

**UI States:**
- Shows "Processing" badge
- Shows "Payment Approved" message
- Shows "Mark as Received" button

---

### Tab 3: "Completed"
**Shows orders with status:**
- `FINISH` - Order completed

**UI States:**
- Shows "Completed" badge
- Shows completion message
- Read-only (no actions)

---

## Backend Changes Required

### 1. Fix Admin Approve Endpoint
**Current:** Sets status to `FINISH`
**Should:** Set status to `PROCESS`

```javascript
// ❌ WRONG
order.orderStatus = "FINISH";

// ✅ CORRECT
order.orderStatus = "PROCESS";
```

---

### 2. Fix Admin Reject Endpoint
**Current:** Sets status to `DELETE`
**Should:** Set status to `REJECTED`

```javascript
// ❌ WRONG
order.orderStatus = "DELETE";

// ✅ CORRECT
order.orderStatus = "REJECTED";
```

---

### 3. Keep Payment Image on Rejection
**Should:** Keep `paymentImage` field when rejecting (for reference)
**Should NOT:** Delete or clear the payment image

---

## Frontend Code Status Values

```typescript
export enum OrderStatus {
    PAUSE = "PAUSE",        // No payment proof
    PENDING = "PENDING",    // Payment proof uploaded, awaiting approval
    PROCESS = "PROCESS",    // Approved, being processed
    FINISH = "FINISH",      // Completed
    REJECTED = "REJECTED",  // Payment proof rejected
    DELETE = "DELETE"       // Order deleted (not for rejection)
}
```

---

## Summary of Required Backend Fixes

1. ✅ **Admin Approve**: Change `orderStatus` from `"FINISH"` → `"PROCESS"`
2. ✅ **Admin Reject**: Change `orderStatus` from `"DELETE"` → `"REJECTED"`
3. ✅ **Keep payment image**: Don't delete `paymentImage` when rejecting
4. ✅ **Status validation**: Prevent invalid status transitions

---

## Testing Checklist

After backend fixes:

1. ✅ User uploads payment → Status becomes `PENDING`
2. ✅ Admin approves → Status becomes `PROCESS`, order appears in Processing tab
3. ✅ Admin rejects → Status becomes `REJECTED`, order stays in Awaiting Payment Proof tab
4. ✅ User re-uploads after rejection → Status becomes `PENDING` again
5. ✅ Customer marks as received → Status becomes `FINISH`, order appears in Completed tab

---

## Current vs Correct Behavior

| Action | Current Backend | Correct Backend |
|--------|----------------|-----------------|
| User uploads | `PENDING` ✅ | `PENDING` ✅ |
| Admin approves | `FINISH` ❌ | `PROCESS` ✅ |
| Admin rejects | `DELETE` ❌ | `REJECTED` ✅ |
| Customer confirms | `FINISH` ✅ | `FINISH` ✅ |

---

This document provides the complete correct design for the order status flow. The backend team should update their endpoints to match these status values.
