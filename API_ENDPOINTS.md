# Tawreed API Endpoints

Base URL: `https://localhost:5001/api/v1`

---

## Seed Data GUID Reference

All IDs below are deterministic — they are the same every time you seed/migrate.

### Users & Auth

| Role | Name | Email | UserId (GUID) | Password |
|------|------|-------|---------------|----------|
| Admin | مدير النظام | admin@tawreed.com | `16459628-b0fa-4465-a194-4febc611081d` | 123456 |
| Buyer | أحمد علي | ahmad.ali@example.com | `3ecef09b-9609-4524-97d3-b7eddd08d0e8` | 123456 |
| Buyer | محمد حسن | mohamed.hassan@example.com | `255cb26a-f00b-4ff0-813b-56d0204c64d6` | 123456 |
| Buyer | سارة أحمد | sara.ahmed@example.com | `4686a8ed-0c74-4648-bd5b-49d7d166679d` | 123456 |
| Buyer | عمر خالد | omar.khaled@example.com | `86d86b94-fc93-4e9a-a37d-90f5d89a740c` | 123456 |
| Buyer | كريم محمود | karim.mahmoud@example.com | `fc11d91a-3dd4-4f67-87c1-acf40b944d65` | 123456 |
| Buyer | دينا يوسف | dina.youssef@example.com | `69d10245-5505-4853-a8cc-01217ba4f08f` | 123456 |
| Supplier | محمد الجهيني | supplier.juhayna@example.com | `cde4bb82-3c7f-4f20-b0b1-dcc6a20b3c26` | 123456 |
| Supplier | أحمد المراعي | supplier.almarai@example.com | `e424e914-7c65-4596-b5ee-2ea234643946` | 123456 |
| Supplier | عمر كولا | supplier.cocacola@example.com | `fa057c2b-5927-4f9d-ad92-fef953feed8d` | 123456 |
| Supplier | هاني دومتي | supplier.domty@example.com | `eee99f22-24f6-4e6b-b9dc-05b7b99cadd0` | 123456 |
| Supplier | أيمن السلسلة | supplier.selsela@example.com | `f803a6f5-d484-423a-b48a-3b51fa7f3ad7` | 123456 |

### Suppliers (Company Profiles)

| Company | SupplierId (same as UserId) |
|---------|----------------------------|
| جهينة للصناعات الغذائية | `cde4bb82-3c7f-4f20-b0b1-dcc6a20b3c26` |
| المراعي مصر | `e424e914-7c65-4596-b5ee-2ea234643946` |
| كوكاكولا مصر | `fa057c2b-5927-4f9d-ad92-fef953feed8d` |
| دومتي للصناعات الغذائية | `eee99f22-24f6-4e6b-b9dc-05b7b99cadd0` |
| شركة السلسلة للدواجن | `f803a6f5-d484-423a-b48a-3b51fa7f3ad7` |

### Regions

| Name | GUID | Parent |
|------|------|--------|
| القاهرة (Cairo) | `6fdfba09-030c-4ccd-855d-15dacbf2451f` | — |
| الإسكندرية (Alexandria) | `3a2324e9-da40-4425-bda1-0209221e6c48` | — |
| الجيزة (Giza) | `3dc24d0b-b8f0-4af1-b465-66828037b889` | — |
| الشرقية (Sharqia) | `fe8c8b1c-31dd-4ed5-944b-6a51b1b7677f` | — |
| الدقهلية (Dakahlia) | `462ec992-d9c5-4a93-988e-770c1bd7c486` | — |
| البحيرة (Beheira) | `aa840b9d-999e-4234-9a21-b8a7c3b80e88` | — |
| الغربية (Gharbia) | `30c90dce-304c-4f24-a6f1-39498ad9ddd8` | — |
| المنوفية (Monufia) | `f6188521-61a7-43a1-8b7f-f860d6cccd81` | — |
| القليوبية (Qalyubia) | `862599c0-6386-41e0-a158-4effaa6aea0a` | — |
| بورسعيد (Port Said) | `c2a7a614-adb1-43a3-b6b8-3fa0b3a0ce2f` | — |
| السويس (Suez) | `54993e05-e420-4580-9205-d7066ba1ab2a` | — |
| دمياط (Damietta) | `02f1f34e-8171-4190-bbdd-c38389c3e582` | — |
| الفيوم (Fayoum) | `a404265d-3afa-4c90-897e-74fd9b3e9d79` | — |
| المنيا (Minya) | `64102b07-12af-4f1f-82ca-23ddf35486bd` | — |
| أسيوط (Assiut) | `eecaa639-94be-4571-ae12-6e7cec9b9ca2` | — |
| سوهاج (Sohag) | `de2ae0ea-0f21-457f-9042-ea4b6bf91786` | — |
| الأقصر (Luxor) | `ddcb7ee8-2a1b-4b88-87d5-4b6041a548ac` | — |
| أسوان (Aswan) | `579cd494-5bc3-4660-9bf4-451790456971` | — |
| الإسماعيلية (Ismailia) | `842a0037-2a95-48d8-96b8-d0cc2aaae894` | — |
| **مدينة نصر (Nasr City)** | **`8d313969-e41d-4028-a677-dd214354b956`** | Cairo |
| **المعادي (Maadi)** | **`3ad51b18-928a-44cd-bd3e-6b009d3c742a`** | Cairo |
| **المهندسين (Mohandeseen)** | **`cc02b904-97e3-4df2-82d6-7d1b59bda1ed`** | Giza |
| **السادس من أكتوبر (6th October)** | **`b1b44e4b-5fb7-4b01-be48-386c9238c762`** | Giza |
| **العجمي (Agamy)** | **`d85a5bdc-90f9-453e-a7b0-21f234a16a47`** | Alexandria |
| **سموحة (Smouha)** | **`7898824c-120b-48cc-990c-70d33510c12e`** | Alexandria |

### Categories

| Name | GUID | Parent |
|------|------|--------|
| ألبان وأجبان (Dairy & Cheese) | `aaff3e05-39b3-4562-ab68-478dac9fda2b` | — |
| مشروبات (Beverages) | `49a6ee6e-c20e-4e18-aafc-56dacdb93fa9` | — |
| مياه ومشروبات غازية (Water & Soft Drinks) | `5752078d-9de9-4021-8a21-e42d495be44a` | — |
| مقرمشات ووجبات خفيفة (Snacks & Chips) | `26478bbc-1417-43c6-83ff-5cb0b39928f6` | — |
| لحوم ودواجن (Meat & Poultry) | `634f8595-0ab8-4681-a80c-efd63b59082f` | — |
| خضروات وفواكه (Fruits & Vegetables) | `05939dd5-afc3-4e6d-9160-d62714a093ba` | — |
| زيوت وبهارات (Oils & Spices) | `6ab2adc7-0583-4b27-8f2f-19c074034789` | — |
| سكر وحلويات (Sugar & Sweets) | `da63afae-3afb-4a14-8832-a7cc225448eb` | — |
| حبوب ومكرونة (Grains & Pasta) | `e76081dd-0555-406b-8d7e-33135dd780ec` | — |
| منظفات (Cleaning Products) | `1190147e-e455-47be-a8f2-78b428631e7f` | — |
| **ألبان (Milk)** | **`628e3d75-e014-476c-a816-807393f2e09f`** | Dairy |
| **زبادي (Yogurt)** | **`73c7a94c-92c7-4b2b-96c9-b94fa1cc4fd0`** | Dairy |
| **جبن (Cheese)** | **`f4513a34-620f-4e7c-b480-30364a6478ec`** | Dairy |
| **عصائر (Juices)** | **`46abead3-2a7c-4124-b917-9aa1d6895147`** | Beverages |
| **شاي وقهوة (Tea & Coffee)** | **`71cf5b52-e672-474c-b4c7-7701d3a1ebc7`** | Beverages |
| **شيبسي (Chips)** | **`19abea6a-4522-43aa-96ea-456c7c7aa53b`** | Snacks |
| **بسكويت (Biscuits)** | **`95f91595-d5e8-4361-a633-ec27318c7393`** | Snacks |
| **دواجن (Poultry)** | **`945de5f2-4f10-4db4-afec-ee077ddd16a4`** | Meat |
| **مجمدات (Frozen)** | **`af41250e-6ec7-4ebe-931f-34d053989073`** | Meat |
| **أرز (Rice)** | **`d293679a-e545-4009-9c37-eb6c14db24a0`** | Grains |
| **مكرونة (Pasta)** | **`0fb143dd-5940-4dff-97c1-5377e9bbd128`** | Grains |

### Units

| Symbol | GUID |
|--------|------|
| kg | `7040ee9a-21d6-48ed-b596-1dd9603e53ff` |
| g | `14eb1c86-473b-42f3-9b8b-512e534ecb16` |
| L | `1c3b36d9-216d-4480-929b-71e611773892` |
| ml | `c92ed86f-1de1-4844-8937-1d4da75a3e45` |
| pc | `25275027-d132-4536-a6ba-8f18d71bcec3` |
| pkt | `9729ee93-9e25-44d9-b137-48921d676c08` |
| ctn | `d8091c00-a214-4c3b-8b9e-28259a79feed` |
| btl | `1bb8edb8-e7f0-49d4-ac09-95c064de2d93` |
| pk | `6c7ff7da-b24f-4458-ab32-8a72290bece4` |

### Products (Key Items)

| Name Ar | Name En | GUID | Supplier | Base Price |
|---------|---------|------|----------|------------|
| حليب جهينة كامل الدسم 1لتر | Juhayna Milk Full Cream 1L | `ace045a1-907c-4d76-939f-fd03d0e84a11` | Juhayna | 42 EGP |
| زبادي جهينة بلدي 500جم | Juhayna Yogurt Plain 500g | `e5aec121-254e-42c9-a676-80453debbf89` | Juhayna | 25 EGP |
| حليب المراعي كامل الدسم 1لتر | Almarai Milk Full Cream 1L | `65f927b8-ded7-4ed6-9448-b0f28c48fb1f` | Almarai | 45 EGP |
| كوكاكولا 1لتر | Coca-Cola 1L | `dc0b12cb-7686-4d36-88ac-e721966fb65f` | Coca-Cola | 18 EGP |
| بيبسي 1لتر | Pepsi 1L | `ec7275f7-13c2-4305-849f-bd71660046d3` | Pepsi | 17 EGP |
| بسكو مصر شاي 200جم | Bisco Misr Tea Biscuit 200g | `e1e52a0f-1f22-4071-8562-e8df1c4e515e` | Bisco Misr | 15 EGP |
| جبن دومتي مثلثات 250جم | Domty Cheese Triangles 250g | `ed9a09e8-3842-4bc8-bbd6-935f58b1b97a` | Domty | 30 EGP |
| شبسي هوهوز كريمة 50جم | HOHOs Chips Sour Cream 50g | `17f2af19-6ca1-402a-93f5-a08193696c07` | Edita | 5 EGP |
| دجاج كامل طازج 1كجم | Whole Chicken Fresh 1kg | `c55cedf9-be8b-4aa6-ad96-1a2dd7c2415b` | Selsela | 130 EGP |
| حليب مزارع دينا 1لتر | Dina Farms Milk 1L | `005f9f49-e511-4130-8d38-9bfe78b50cd1` | Dina Farms | 48 EGP |

### Group Orders

| Title | GUID | Status | Supplier |
|-------|------|--------|----------|
| طلب حليب جهينة | `bba56c6a-827e-4394-a10a-b81c6d9dbeaf` | Open | Juhayna |
| طلب كوكاكولا للفندق | `6b1ac916-146a-44e8-a523-7d69d833f055` | Open | Coca-Cola |
| طلب دجاج للنادي | `3d1335a9-a25c-4762-9f39-8046fc475f7a` | PendingApproval | Selsela |
| طلب جبن دومتي | `85085d3d-4938-4ba1-8b6a-2ef99f9995b0` | Draft | Domty |
| طلب هوهوز و بسكويت | `38e769df-7e03-4d47-82e2-4fe4c7a6d3ae` | Locked | Edita |
| طلب بسكويت للسوبر ماركت | `7e0d7a95-b9f5-40d9-beaf-4ac077593cf5` | Completed | Bisco Misr |
| طلب ألبان المراعي | `382e6a64-ea3a-4dcc-8c05-379aa01a3461` | Cancelled | Almarai |

---

## Authentication (`/auth`)

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "ahmad.ali@example.com",
  "password": "123456"
}
```
**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "base64randomstring...",
  "user": {
    "id": "3ecef09b-9609-4524-97d3-b7eddd08d0e8",
    "name": "أحمد علي",
    "email": "ahmad.ali@example.com",
    "role": "Buyer",
    "avatar": null
  }
}
```

### Register Buyer
```http
POST /auth/register/buyer
Content-Type: application/json

{
  "fullName": "محمود سعيد",
  "email": "mahmoud.saeed@example.com",
  "phone": "01000000020",
  "password": "123456",
  "businessName": "مطعم النيل",
  "businessType": "Restaurant",
  "regionId": "8d313969-e41d-4028-a677-dd214354b956",
  "address": "مدينة نصر، القاهرة"
}
```
**Response 201:** Same as Login response.

### Register Supplier
```http
POST /auth/register/supplier
Content-Type: application/json

{
  "fullName": "مصطفى كامل",
  "email": "mostafa.kamel@example.com",
  "phone": "01100000020",
  "password": "123456",
  "companyName": "مخابز القاهرة الحديثة",
  "taxId": "123-456-789",
  "regionId": "6fdfba09-030c-4ccd-855d-15dacbf2451f",
  "categoryIds": [
    "95f91595-d5e8-4361-a633-ec27318c7393",
    "e76081dd-0555-406b-8d7e-33135dd780ec"
  ]
}
```
**Response 201:** Same as Login response.

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "base64randomstring..."
}
```
**Response 200:** Same as Login response.

### Logout
```http
POST /auth/logout
Authorization: Bearer {token}
```
**Response 200:** `{ "message": "Logged out" }`

### Change Password
```http
PUT /auth/password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "123456",
  "newPassword": "newpass123"
}
```
**Response 200:** `{ "message": "Password updated" }`

### Get Current User
```http
GET /auth/me
Authorization: Bearer {token}
```
**Response 200:**
```json
{
  "id": "3ecef09b-9609-4524-97d3-b7eddd08d0e8",
  "name": "أحمد علي",
  "email": "ahmad.ali@example.com",
  "role": "Buyer",
  "avatar": null
}
```

---

## Buyer Dashboard & Orders (`/buyer`)

All buyer endpoints require `Authorization: Bearer {token-of-buyer}` header.

### Get Dashboard
```http
GET /buyer/dashboard?regionId=8d313969-e41d-4028-a677-dd214354b956
Authorization: Bearer {token-of-buyer-ahmad}
```
**Response 200:**
```json
{
  "activeOrders": [
    {
      "id": "bba56c6a-827e-4394-a10a-b81c6d9dbeaf",
      "title": "طلب حليب جهينة",
      "status": "Open",
      "deadline": "2026-06-20T12:00:00Z",
      "participantCount": 2,
      "totalValue": 1520,
      "productCount": 1,
      "creatorName": "أحمد علي",
      "region": "Nasr City",
      "isCreator": true
    }
  ],
  "nearbyOrders": [
    {
      "id": "6b1ac916-146a-44e8-a523-7d69d833f055",
      "creatorName": "عمر خالد",
      "productName": "Coca-Cola 1L",
      "quantity": 200,
      "currentParticipants": 1,
      "deadline": "2026-06-22T12:00:00Z",
      "region": "Maadi"
    }
  ],
  "notifications": [
    {
      "id": "fb61558d-8b3f-4dac-b4b9-c0ef2dc89b3f",
      "type": "order_update",
      "titleEn": "New participant joined",
      "titleAr": "انضم مشارك جديد",
      "isRead": false,
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ],
  "trendingProducts": [
    {
      "id": "ace045a1-907c-4d76-939f-fd03d0e84a11",
      "name": "Juhayna Milk Full Cream 1L",
      "price": 42,
      "imageUrl": "https://images.tawreed.com/products/juhayna-milk-full-cream-1l.jpg",
      "categoryName": "ألبان",
      "orderCount": 1
    }
  ],
  "totalSavings": 0,
  "unreadNotificationCount": 2
}
```

### List Orders
```http
GET /buyer/orders?status=Open&page=1&limit=20
Authorization: Bearer {token-of-buyer}
```
**Response 200:**
```json
{
  "items": [
    {
      "id": "bba56c6a-827e-4394-a10a-b81c6d9dbeaf",
      "title": "طلب حليب جهينة",
      "status": "Open",
      "createdAt": "2026-01-01T00:00:00Z",
      "deadline": "2026-06-20T12:00:00Z",
      "totalOrderValue": 1520,
      "participantCount": 2,
      "productCount": 1,
      "region": "Nasr City",
      "creatorName": "أحمد علي",
      "supplierName": "جهينة للصناعات الغذائية"
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 1,
  "totalPages": 1
}
```

### Get Order Detail
```http
GET /buyer/orders/bba56c6a-827e-4394-a10a-b81c6d9dbeaf
Authorization: Bearer {token}
```
**Response 200:**
```json
{
  "id": "bba56c6a-827e-4394-a10a-b81c6d9dbeaf",
  "title": "طلب حليب جهينة",
  "description": "حليب كامل الدسم للتوزيع على المطعم",
  "creatorName": "أحمد علي",
  "region": "Nasr City",
  "createdAt": "2026-01-01T00:00:00Z",
  "deadline": "2026-06-20T12:00:00Z",
  "deadlinePassed": false,
  "status": "Open",
  "totalOrderValue": 1520,
  "supplierName": "جهينة للصناعات الغذائية",
  "supplierId": "cde4bb82-3c7f-4f20-b0b1-dcc6a20b3c26",
  "products": [
    {
      "productId": "ace045a1-907c-4d76-939f-fd03d0e84a11",
      "productName": "Juhayna Milk Full Cream 1L",
      "currentQuantity": 40,
      "targetQuantity": 50,
      "unit": "L",
      "currentPrice": 38,
      "originalPrice": 42,
      "discountPercent": 9
    }
  ],
  "participants": [
    {
      "id": "3694114e-406b-4561-b5ed-04ca0aea0f32",
      "name": "محمد حسن",
      "joinedAt": "2026-06-17T10:00:00Z",
      "items": [
        { "productId": "ace045a1-907c-4d76-939f-fd03d0e84a11", "productName": "Juhayna Milk Full Cream 1L", "quantity": 20 }
      ]
    },
    {
      "id": "7ca5a39b-7d08-41c3-86d4-6e7d22a0d2ce",
      "name": "سارة أحمد",
      "joinedAt": "2026-06-17T11:00:00Z",
      "items": [
        { "productId": "ace045a1-907c-4d76-939f-fd03d0e84a11", "productName": "Juhayna Milk Full Cream 1L", "quantity": 20 }
      ]
    }
  ],
  "activities": [
    {
      "id": "7d2b6d80-0487-4c6e-9827-843343669ec8",
      "eventType": "Created",
      "notes": "تم إنشاء الطلب",
      "createdBy": "مدير النظام",
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ]
}
```

### Create Order
```http
POST /buyer/orders
Authorization: Bearer {token-of-buyer-ahmad}
Content-Type: application/json

{
  "title": "طلب حليب جديد",
  "description": "حليب طازج للكافeteria",
  "supplierId": "cde4bb82-3c7f-4f20-b0b1-dcc6a20b3c26",
  "regionId": "8d313969-e41d-4028-a677-dd214354b956",
  "deadline": "2026-06-27T15:00:00Z",
  "items": [
    {
      "productId": "ace045a1-907c-4d76-939f-fd03d0e84a11",
      "targetQuantity": 30
    }
  ]
}
```
**Response 201:** Returns the created GroupOrder entity.

### Save Draft
```http
POST /buyer/orders/draft
Authorization: Bearer {token-of-buyer-dina}
Content-Type: application/json

{
  "title": "مسودة طلب جبن",
  "description": "أجبان متنوعة",
  "supplierId": "eee99f22-24f6-4e6b-b9dc-05b7b99cadd0",
  "regionId": "d85a5bdc-90f9-453e-a7b0-21f234a16a47",
  "deadline": "2026-07-01T15:00:00Z",
  "items": [
    {
      "productId": "ed9a09e8-3842-4bc8-bbd6-935f58b1b97a",
      "targetQuantity": 30
    }
  ]
}
```
**Response 201:** Returns the created GroupOrder entity.

### Get Drafts
```http
GET /buyer/orders/drafts?page=1&limit=20
Authorization: Bearer {token-of-buyer}
```
**Response 200:** Same structure as List Orders (filtered by status="Draft").

### Delete Draft
```http
DELETE /buyer/orders/{orderId}/draft
Authorization: Bearer {token-of-buyer}
```
**Response 204:** No Content.

### Publish Draft
```http
POST /buyer/orders/85085d3d-4938-4ba1-8b6a-2ef99f9995b0/publish
Authorization: Bearer {token-of-buyer}
```
**Response 200:** Returns the updated GroupOrder entity (status → "PendingApproval").

### Join Order
```http
POST /buyer/orders/bba56c6a-827e-4394-a10a-b81c6d9dbeaf/join
Authorization: Bearer {token-of-buyer-nourhan}
Content-Type: application/json

{
  "items": [
    {
      "productId": "ace045a1-907c-4d76-939f-fd03d0e84a11",
      "quantity": 10
    }
  ]
}
```
**Response 200:**
```json
{
  "message": "Joined order successfully",
  "participant": {
    "id": "guid-new",
    "name": "نورهان سعيد",
    "items": [
      { "productId": "ace045a1-907c-4d76-939f-fd03d0e84a11", "quantity": 10 }
    ]
  },
  "updatedProducts": [
    { "productId": "ace045a1-907c-4d76-939f-fd03d0e84a11", "currentQuantity": 50 }
  ]
}
```

### Leave Order
```http
POST /buyer/orders/bba56c6a-827e-4394-a10a-b81c6d9dbeaf/leave
Authorization: Bearer {token-of-buyer}
```
**Response 200:**
```json
{
  "message": "Left order successfully",
  "updatedProducts": [
    { "productId": "ace045a1-907c-4d76-939f-fd03d0e84a11", "currentQuantity": 20 }
  ]
}
```

### Update Participant Items
```http
PUT /buyer/orders/bba56c6a-827e-4394-a10a-b81c6d9dbeaf/participants/3694114e-406b-4561-b5ed-04ca0aea0f32/items
Authorization: Bearer {token-of-buyer-mohamed}
Content-Type: application/json

{
  "items": [
    {
      "productId": "ace045a1-907c-4d76-939f-fd03d0e84a11",
      "quantity": 15
    }
  ]
}
```
**Response 200:**
```json
{
  "message": "Quantities updated",
  "updatedProducts": [
    { "productId": "ace045a1-907c-4d76-939f-fd03d0e84a11", "currentQuantity": 55 }
  ]
}
```

---

## Supplier (`/supplier`)

All supplier endpoints require `Authorization: Bearer {token-of-supplier}` header.

### Get Dashboard
```http
GET /supplier/dashboard
Authorization: Bearer {token-of-supplier-juhayna}
```
**Response 200:**
```json
{
  "kpi": {
    "totalRevenue": 0,
    "totalOrders": 1,
    "activeOrders": 1,
    "pendingDeliveries": 0,
    "totalProducts": 7,
    "ratingAvg": 4.5
  },
  "pendingOrders": [],
  "activeGroupOrders": [
    {
      "id": "bba56c6a-827e-4394-a10a-b81c6d9dbeaf",
      "title": "طلب حليب جهينة",
      "participants": 2,
      "totalValue": 1520,
      "deadline": "2026-06-20T12:00:00Z",
      "status": "Open"
    }
  ],
  "inventoryAlerts": [],
  "deliveryOverview": {
    "pending": 0,
    "preparing": 0,
    "shipped": 0,
    "delivered": 0,
    "failed": 0
  },
  "recentActivity": [
    {
      "action": "Created",
      "time": "2026-01-01T00:00:00Z"
    }
  ]
}
```

### Get Profile
```http
GET /supplier/profile
Authorization: Bearer {token-of-supplier-juhayna}
```
**Response 200:**
```json
{
  "name": "محمد الجهيني",
  "email": "supplier.juhayna@example.com",
  "phone": "01100000001",
  "companyName": "جهينة للصناعات الغذائية",
  "taxId": null,
  "avatar": null,
  "joinedDate": "2026-01-01T00:00:00Z",
  "address": "جهينة للصناعات الغذائية - المنطقة الصناعية",
  "regionName": "6th October",
  "regionId": "b1b44e4b-5fb7-4b01-be48-386c9238c762",
  "ratingAvg": 4.5,
  "isApproved": true,
  "preferredLang": "ar"
}
```

### Update Profile
```http
PUT /supplier/profile
Authorization: Bearer {token-of-supplier-juhayna}
Content-Type: application/json

{
  "fullName": "محمد أحمد الجهيني",
  "phone": "01100000001",
  "businessName": "جهينة للصناعات الغذائية",
  "address": "المنطقة الصناعية - السادس من أكتوبر",
  "avatar": "https://images.tawreed.com/avatars/juhayna.jpg",
  "preferredLang": "ar"
}
```
**Response 200:** `{ "message": "Profile updated" }`

### Get Registration Status
```http
GET /supplier/registration-status
Authorization: Bearer {token-of-supplier}
```
**Response 200:**
```json
{
  "status": "Active",
  "isApproved": true,
  "approvalLogs": []
}
```

### List Supplier Orders
```http
GET /supplier/orders?status=Open&page=1&limit=20
Authorization: Bearer {token-of-supplier-juhayna}
```
**Response 200:**
```json
{
  "items": [
    {
      "id": "bba56c6a-827e-4394-a10a-b81c6d9dbeaf",
      "title": "طلب حليب جهينة",
      "creatorName": "أحمد علي",
      "buyerCompany": "مطعم الأهرام",
      "totalAmount": 1520,
      "status": "Open",
      "deadline": "2026-06-20T12:00:00Z",
      "region": "Nasr City",
      "receivedAt": "2026-01-01T00:00:00Z",
      "items": [
        {
          "productId": "ace045a1-907c-4d76-939f-fd03d0e84a11",
          "productName": "Juhayna Milk Full Cream 1L",
          "quantity": 40,
          "unitPrice": 38,
          "lineTotal": 1520
        }
      ]
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 1,
  "totalPages": 1
}
```

### Accept Order
```http
POST /supplier/orders/3d1335a9-a25c-4762-9f39-8046fc475f7a/accept
Authorization: Bearer {token-of-supplier-selsela}
Content-Type: application/json

"تمت الموافقة على الطلب"
```
**Response 200:**
```json
{
  "message": "Order accepted",
  "orderStatus": "Open"
}
```

### Decline Order
```http
POST /supplier/orders/3d1335a9-a25c-4762-9f39-8046fc475f7a/decline
Authorization: Bearer {token-of-supplier-selsela}
Content-Type: application/json

"المنتج غير متوفر حالياً"
```
**Response 200:**
```json
{
  "message": "Order declined",
  "orderStatus": "Declined"
}
```

### List Deliveries
```http
GET /supplier/deliveries?status=Pending&page=1&limit=20
Authorization: Bearer {token-of-supplier}
```
**Response 200:**
```json
{
  "items": [],
  "page": 1,
  "limit": 20,
  "total": 0,
  "totalPages": 0
}
```

### Update Delivery Status
```http
PATCH /supplier/deliveries/{deliveryId}/status
Authorization: Bearer {token-of-supplier}
Content-Type: application/json

{
  "status": "Shipped",
  "trackingNotes": "تم الشحن عبر شركة النيل",
  "scheduledAt": "2026-06-19T10:00:00Z"
}
```
**Response 200:**
```json
{
  "message": "Delivery status updated",
  "delivery": { ... }
}
```

---

## Admin (`/admin`)

All admin endpoints require `Authorization: Bearer {token-of-admin}` header (role must be `Admin`).

### Get Dashboard
```http
GET /admin/dashboard
Authorization: Bearer {token-of-admin}
```
**Response 200:**
```json
{
  "kpi": {
    "totalUsers": 21,
    "totalSuppliers": 10,
    "totalBuyers": 10,
    "totalOrders": 7,
    "pendingSuppliers": 0,
    "activeCategories": 21,
    "newUsersThisMonth": 21
  },
  "pendingSupplierApplications": [],
  "recentOrders": [
    {
      "id": "bba56c6a-827e-4394-a10a-b81c6d9dbeaf",
      "title": "طلب حليب جهينة",
      "buyerName": "أحمد علي",
      "totalAmount": 1520,
      "status": "Open",
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ]
}
```

### List Users
```http
GET /admin/users?search=أحمد&status=Active&page=1&limit=20
Authorization: Bearer {token-of-admin}
```
**Response 200:**
```json
{
  "items": [
    {
      "id": "3ecef09b-9609-4524-97d3-b7eddd08d0e8",
      "name": "أحمد علي",
      "email": "ahmad.ali@example.com",
      "phone": "01000000001",
      "role": "Buyer",
      "status": "Active",
      "businessName": "مطعم الأهرام",
      "region": "Nasr City",
      "joinedDate": "2026-01-01T00:00:00Z",
      "lastLoginAt": null
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 1,
  "totalPages": 1
}
```

### Get User Detail
```http
GET /admin/users/3ecef09b-9609-4524-97d3-b7eddd08d0e8
Authorization: Bearer {token-of-admin}
```
**Response 200:**
```json
{
  "id": "3ecef09b-9609-4524-97d3-b7eddd08d0e8",
  "name": "أحمد علي",
  "email": "ahmad.ali@example.com",
  "phone": "01000000001",
  "role": "Buyer",
  "status": "Active",
  "businessName": "مطعم الأهرام",
  "region": "Nasr City",
  "joinedDate": "2026-01-01T00:00:00Z",
  "lastLoginAt": null,
  "suspensionReason": null,
  "ordersCreated": 2,
  "ordersJoined": 1,
  "completedOrders": 0,
  "cancelledOrders": 0
}
```

### Suspend User
```http
POST /admin/users/{userId}/suspend
Authorization: Bearer {token-of-admin}
Content-Type: application/json

"مخالفة شروط الاستخدام"
```
**Response 200:** `{ "message": "User suspended" }`

### Reactivate User
```http
POST /admin/users/{userId}/reactivate
Authorization: Bearer {token-of-admin}
```
**Response 200:** `{ "message": "User reactivated" }`

### Reset User Password
```http
POST /admin/users/{userId}/reset-password
Authorization: Bearer {token-of-admin}
```
**Response 200:**
```json
{
  "tempPassword": "Temp@a1b2c3d4"
}
```

### List Suppliers (Admin)
```http
GET /admin/suppliers?status=Active&categoryId=628e3d75-e014-476c-a816-807393f2e09f&regionId=b1b44e4b-5fb7-4b01-be48-386c9238c762&page=1&limit=20
Authorization: Bearer {token-of-admin}
```
**Response 200:**
```json
{
  "items": [
    {
      "id": "cde4bb82-3c7f-4f20-b0b1-dcc6a20b3c26",
      "companyName": "جهينة للصناعات الغذائية",
      "contactName": "محمد الجهيني",
      "email": "supplier.juhayna@example.com",
      "phone": "01100000001",
      "category": "ألبان",
      "status": "Active",
      "region": "6th October",
      "joinedDate": "2026-01-01T00:00:00Z",
      "ratingAvg": 4.5,
      "totalProducts": 7,
      "isApproved": true
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 10,
  "totalPages": 1
}
```

### Get Supplier Detail (Admin)
```http
GET /admin/suppliers/cde4bb82-3c7f-4f20-b0b1-dcc6a20b3c26
Authorization: Bearer {token-of-admin}
```
**Response 200:**
```json
{
  "id": "cde4bb82-3c7f-4f20-b0b1-dcc6a20b3c26",
  "companyName": "جهينة للصناعات الغذائية",
  "contactName": "محمد الجهيني",
  "email": "supplier.juhayna@example.com",
  "phone": "01100000001",
  "categoryNames": ["ألبان", "زبادي", "جبن"],
  "region": "6th October",
  "status": "Active",
  "isApproved": true,
  "joinedDate": "2026-01-01T00:00:00Z",
  "ratingAvg": 4.5,
  "totalProducts": 7,
  "address": "جهينة للصناعات الغذائية - المنطقة الصناعية",
  "approvalLogs": [],
  "products": [
    {
      "name": "Juhayna Milk Full Cream 1L",
      "categoryName": "ألبان",
      "stock": 5000,
      "unit": "L"
    }
  ]
}
```

### Approve Supplier
```http
POST /admin/suppliers/{supplierId}/approve
Authorization: Bearer {token-of-admin}
```
**Response 200:** `{ "message": "Supplier approved" }`

### Reject Supplier
```http
POST /admin/suppliers/{supplierId}/reject
Authorization: Bearer {token-of-admin}
Content-Type: application/json

"المستندات غير مكتملة"
```
**Response 200:** `{ "message": "Supplier rejected" }`

### Suspend Supplier
```http
POST /admin/suppliers/{supplierId}/suspend
Authorization: Bearer {token-of-admin}
Content-Type: application/json

"مخالفات متكررة"
```
**Response 200:** `{ "message": "Supplier suspended" }`

### Reactivate Supplier
```http
POST /admin/suppliers/{supplierId}/reactivate
Authorization: Bearer {token-of-admin}
```
**Response 200:** `{ "message": "Supplier reactivated" }`

### List Orders (Admin)
```http
GET /admin/orders?status=Open&regionId=8d313969-e41d-4028-a677-dd214354b956&page=1&limit=20
Authorization: Bearer {token-of-admin}
```
**Response 200:**
```json
{
  "items": [
    {
      "id": "bba56c6a-827e-4394-a10a-b81c6d9dbeaf",
      "title": "طلب حليب جهينة",
      "buyerName": "أحمد علي",
      "buyerCompany": "مطعم الأهرام",
      "supplierName": "جهينة للصناعات الغذائية",
      "totalAmount": 1520,
      "status": "Open",
      "region": "Nasr City",
      "createdAt": "2026-01-01T00:00:00Z",
      "deadline": "2026-06-20T12:00:00Z",
      "participants": 2
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 1,
  "totalPages": 1
}
```

### Get Order Detail (Admin)
```http
GET /admin/orders/bba56c6a-827e-4394-a10a-b81c6d9dbeaf
Authorization: Bearer {token-of-admin}
```
**Response 200:** Detailed order view with buyer, supplier, items, participants, timeline.

### Force Close Order
```http
POST /admin/orders/bba56c6a-827e-4394-a10a-b81c6d9dbeaf/force-close
Authorization: Bearer {token-of-admin}
Content-Type: application/json

"إلغاء بسبب مخالفة"
```
**Response 200:** `{ "message": "Order closed" }`

### List Categories (Admin)
```http
GET /admin/categories?search=ألبان&page=1&limit=20
Authorization: Bearer {token-of-admin}
```
**Response 200:**
```json
{
  "items": [
    {
      "id": "aaff3e05-39b3-4562-ab68-478dac9fda2b",
      "nameAr": "ألبان وأجبان",
      "nameEn": "Dairy & Cheese",
      "productCount": 12,
      "supplierCount": 4,
      "isActive": true,
      "sortOrder": 1
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 21,
  "totalPages": 2
}
```

### Get Category Detail (Admin)
```http
GET /admin/categories/628e3d75-e014-476c-a816-807393f2e09f
Authorization: Bearer {token-of-admin}
```
**Response 200:**
```json
{
  "id": "628e3d75-e014-476c-a816-807393f2e09f",
  "nameAr": "ألبان",
  "nameEn": "Milk",
  "productCount": 5,
  "supplierCount": 3,
  "isActive": true,
  "sortOrder": 1,
  "parentId": "aaff3e05-39b3-4562-ab68-478dac9fda2b",
  "iconUrl": null
}
```

### Create Category
```http
POST /admin/categories?nameAr=معلبات&nameEn=Canned Food&parentId={optional-guid}&iconUrl=https://images.tawreed.com/icons/canned.png&sortOrder=11
Authorization: Bearer {token-of-admin}
```
**Response 201:** Returns the created Category entity.

### Update Category
```http
PATCH /admin/categories/{categoryId}
Authorization: Bearer {token-of-admin}
Content-Type: application/json

{
  "nameAr": "معلبات وأغذية محفوظة",
  "nameEn": "Canned & Preserved Food",
  "sortOrder": 11,
  "isActive": true
}
```
**Response 200:** `{ "message": "Category updated" }`

### Deactivate Category
```http
DELETE /admin/categories/{categoryId}
Authorization: Bearer {token-of-admin}
```
**Response 200:** `{ "message": "Category deactivated" }`

### Activate Category
```http
POST /admin/categories/{categoryId}/activate
Authorization: Bearer {token-of-admin}
```
**Response 200:** `{ "message": "Category activated" }`

### List Regions (Admin)
```http
GET /admin/regions?search=قاهرة
Authorization: Bearer {token-of-admin}
```
**Response 200:**
```json
[
  {
    "id": "6fdfba09-030c-4ccd-855d-15dacbf2451f",
    "nameAr": "القاهرة",
    "nameEn": "Cairo",
    "parentId": null,
    "isActive": true,
    "createdAt": "2026-01-01T00:00:00Z"
  }
]
```

### Create Region
```http
POST /admin/regions?nameAr=الغردقة&nameEn=Hurghada&parentId=
Authorization: Bearer {token-of-admin}
```
**Response 201:** Returns the created Region entity.

### Toggle Region
```http
POST /admin/regions/6fdfba09-030c-4ccd-855d-15dacbf2451f/toggle
Authorization: Bearer {token-of-admin}
```
**Response 200:** `{ "message": "Region toggled" }`

---

## Public CRUD Endpoints (no auth required)

### Products
```http
GET  /api/products                     # List all products
GET  /api/products/ace045a1-907c-4d76-939f-fd03d0e84a11
POST /api/products                     # Create product
PUT  /api/products/{id}                # Update product
DEL  /api/products/{id}                # Delete product
```

### Categories
```http
GET  /api/categories                   # List all categories
GET  /api/categories/root              # List root categories only
GET  /api/categories/aaff3e05-39b3-4562-ab68-478dac9fda2b
POST /api/categories                   # Create category
PUT  /api/categories/{id}              # Update category
DEL  /api/categories/{id}              # Delete category
```

### Regions
```http
GET  /api/regions                      # List all regions
GET  /api/regions/root                 # List root regions only
GET  /api/regions/6fdfba09-030c-4ccd-855d-15dacbf2451f
```

### Group Orders (public)
```http
GET  /api/group-orders                 # List all group orders
GET  /api/group-orders/bba56c6a-827e-4394-a10a-b81c6d9dbeaf
POST /api/group-orders                 # Create group order
PATCH /api/group-orders/{id}/status    # Update order status
DEL  /api/group-orders/{id}            # Delete group order
```

### Notifications
```http
GET  /api/notifications/unread/3ecef09b-9609-4524-97d3-b7eddd08d0e8
GET  /api/notifications/unread-count/3ecef09b-9609-4524-97d3-b7eddd08d0e8
PATCH /api/notifications/fb61558d-8b3f-4dac-b4b9-c0ef2dc89b3f/read
PATCH /api/notifications/read-all/3ecef09b-9609-4524-97d3-b7eddd08d0e8
```

---

## HTTP Status Codes Used

| Code | Meaning |
|------|---------|
| 200 | OK — successful response |
| 201 | Created — resource created |
| 204 | No Content — delete success |
| 400 | Bad Request — validation error |
| 401 | Unauthorized — missing/invalid token |
| 403 | Forbidden — insufficient role |
| 404 | Not Found — resource doesn't exist |
| 409 | Conflict — duplicate email, etc. |

## Authentication Header Format
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```
