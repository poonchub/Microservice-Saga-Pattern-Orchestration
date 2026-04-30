# Microservice-Orchestration

```markdown
# Microservices Distributed Transaction with Saga Pattern (Orchestration)

## 📌 Overview
ระบบนี้เป็นตัวอย่าง **Microservice Architecture** ที่ใช้ **Saga Pattern (Orchestration)**  
เพื่อจัดการ **Distributed Transaction (transaction ข้าม service)**

Use case หลัก:
> ผู้ใช้สั่งซื้อสินค้า → ต้องสร้าง Order + ตัด Stock + จ่ายเงิน

---

## 🧱 System Architecture

ระบบแบ่งออกเป็น 3 services:

```

[ Order Service ]  ← Orchestrator
↓
[ Inventory Service ]
↓
[ Payment Service ]

```

### Services

| Service            | Responsibility |
|-------------------|---------------|
| Order Service     | คุม flow (Saga Orchestrator) |
| Inventory Service | จัดการ stock |
| Payment Service   | จัดการ payment |

---

## 🔄 Saga Pattern (Orchestration)

### Concept

- ไม่มี global transaction (ACID ข้าม DB)
- ใช้ **local transaction ในแต่ละ service**
- ถ้ามี failure → ใช้ **compensating transaction (rollback)**

---

## 🔁 Flow การทำงาน

### ✅ Success Flow

```

1. Order Service → create order (PENDING)
2. → Inventory Service → reserve stock
3. → Payment Service → process payment
4. → Order Service → update status = CONFIRMED

```

---

### ❌ Failure Flow (Payment Fail)

```

1. Order Service → create order
2. → Inventory → reserve stock (สำเร็จ)
3. → Payment → FAIL
4. → Inventory → rollback (release stock)
5. → Order → status = FAILED

```

---

## ⚙️ Project Structure

### Order Service (Orchestrator)

```

order-service/
├── controllers/
├── services/
├── clients/        ← call service อื่น
├── prisma/
├── routes/
└── app.ts

```

---

### Inventory Service

```

inventory-service/
├── controllers/
├── services/
├── prisma/
├── routes/
└── app.ts

```

---

### Payment Service

```

payment-service/
├── controllers/
├── services/
├── prisma/
├── routes/
└── app.ts

````

---

## 🗄️ Database Design

### Order Service

```prisma
model Order {
  id        String @id @default(uuid())
  productId String
  quantity  Int
  status    String // PENDING, CONFIRMED, FAILED
}
````

---

### Inventory Service

```prisma
model Product {
  id    String @id @default(uuid())
  stock Int
}

model Reservation {
  id        String @id @default(uuid())
  orderId   String @unique
  productId String
  quantity  Int
}
```

---

### Payment Service

```prisma
model Payment {
  id      String @id @default(uuid())
  orderId String @unique
  amount  Int
  status  String // SUCCESS, FAILED
}
```

---

## 🧠 Core Concepts

### 1. Local Transaction

แต่ละ service ใช้ transaction ของตัวเอง:

```ts
await prisma.$transaction(async (tx) => {
  // ทำงานใน service นั้น ๆ
})
```

---

### 2. Compensating Transaction

แทนการ rollback แบบ DB:

| Action         | Compensating              |
| -------------- | ------------------------- |
| reserve stock  | release stock             |
| create payment | (optional) cancel payment |

---

### 3. Orchestrator

Order Service ทำหน้าที่:

* คุม flow ทั้งหมด
* เรียก service ทีละ step
* handle error + rollback

---

### 4. Idempotency

ป้องกัน request ซ้ำ:

```prisma
orderId @unique
```

→ ทำให้:

* reserve ซ้ำไม่ได้
* rollback ซ้ำไม่พัง

---

## ⚠️ Limitations

### ❌ No Strong Consistency

* ไม่มี ACID ข้าม service
* เป็น **eventual consistency**

---

### ❌ Partial Failure

เช่น:

* rollback fail
* network error

→ ต้อง handle เพิ่ม (retry, queue)

---

## 🚀 Improvements (Production Level)

### 1. Retry + Backoff

* retry เมื่อ service fail ชั่วคราว

---

### 2. Timeout

```ts
axios.post(url, data, { timeout: 3000 })
```

---

### 3. Message Queue

เปลี่ยนจาก sync → async

* Kafka
* RabbitMQ

---

### 4. Saga State Machine

เก็บ state ของ transaction:

```
PENDING → RESERVED → PAID → CONFIRMED
```

---

### 5. Distributed Tracing

* OpenTelemetry
* Jaeger

---

## 🎯 Summary

* ใช้ **Saga Pattern (Orchestration)** เพื่อจัดการ transaction ข้าม service
* แต่ละ service มี **local transaction ของตัวเอง**
* ใช้ **compensating transaction** แทน rollback
* ได้ **scalability สูง** แต่แลกกับ **eventual consistency**

---

## 📌 Key Takeaway

> Microservice ไม่ใช่แค่แยก service
> แต่คือการ “ออกแบบการจัดการ failure และ consistency”
