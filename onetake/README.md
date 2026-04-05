# ONETAKE Platformasi (FocusUZ asosi)

Bu qism ONETAKE gamifikasiya qilingan maqsad va vazifalarni boshqaruvchi veb platformasining asosiy kodi hisoblanadi.

## Texnologik Stack
- **Frontend**: Next.js 14, Tailwind CSS, Zustand, Framer Motion
- **Backend**: NestJS, TypeORM, PostgreSQL
- **Ma'lumotlar bazasi**: PostgreSQL (Docker compose)

## Ishga tushirish (Installation & Run)

Loyihani kompyuteringizda ishga tushirish uchun quyidagi ko'rsatmalarni bajaring.

### 1-bosqich: Ma'lumotlar bazasi (Database)
Postgresni ishga tushiring:
```bash
docker-compose up -d
```
> Ma'lumotlar bazasi va undagi barcha jadvallar (`onetake/database/schema.sql` faylidan) avtomatik o'rnatiladi.

### 2-bosqich: Backend (NestJS)
```bash
cd backend
npm install
npm run start:dev
```
Backend `http://localhost:5000` manzilida ishlaydi. Swagger ro'yxati chiqishiga tayyorlangan bo'lsada, REST API POSTMAN orqali tekshirilishi maqsadga muvofiq.

### 3-bosqich: Frontend (Next.js)
E'tibor qiling, `.env.local` ichida manzil to'g'ri ko'rsatilgan bo'lishi lozim:
```bash
cd frontend
npm install
npm run dev
```
Frontend `http://localhost:3000` atrofida ishlaydi. 

## Muhit o'zgaruvchilari (Environment Variables)
Iltimos, `.env.example` namunasi orqali har bir jild ichida `.env` yoki `.env.local` ni saqlang:

**Backend `.env`:**
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=onetake
JWT_ACCESS_SECRET=super-secret-access-key
JWT_REFRESH_SECRET=super-secret-refresh-key
JWT_ACCESS_EXPIRATION=7d
JWT_REFRESH_EXPIRATION=30d
PORT=5000
```

**Frontend `.env.local`:**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Demo Foydalanuvchi
Birinchi marta bazaga ulanganingizdan so'ng, `POST http://localhost:5000/api/auth/register` api-siga json jo'natib yangi test user yaratib oling:
```json
{
  "username": "demo",
  "email": "demo@onetake.uz",
  "password": "demo"
}
```

## Inglizcha ko'rsatma (English Instructions)
1. Run `docker-compose up -d` to spin up PostgreSQL with auto-seeded schema.
2. In `backend` folder, run `npm install` and `npm run start:dev`.
3. In `frontend` folder, run `npm install` and `npm run dev`.
4. Ensure `.env` files are correctly set based on `onetake/.env.example`.
