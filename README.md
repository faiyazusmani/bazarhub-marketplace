# 🛍️ BazarHub — OLX-Style Marketplace

Full-stack marketplace with React frontend + Node.js/Express backend + MongoDB database.

---

## 📁 Project Structure

```
marketplace/
├── backend/          ← Node.js + Express + MongoDB
│   ├── server.js
│   ├── models/       ← User.js, Listing.js
│   ├── routes/       ← auth.js, listings.js, categories.js
│   ├── middleware/   ← auth.js (JWT)
│   └── .env
└── frontend/         ← React App
    └── src/
        ├── pages/    ← HomePage, CategoryPage, ListingsPage, etc.
        ├── components/ ← Navbar, AuthModal, PostModal, ListingCard
        ├── api.js    ← All axios API calls
        └── AuthContext.js ← Global auth state
```

---

## ✅ Features

- 🔐 User Registration & Login (JWT auth)
- 📝 Post Listings (Product / Service)
  - Name, Detail, Category, Subcategory
  - Country → State → City → Area
  - Price, up to 5 Photo uploads
- 🏠 Homepage with hero, categories, city cards
- 📂 Category Page (browse by city within category)
- 🏙️ City-wise Listing Page
- 🔍 City + Category filtered listing
- 📋 My Listings with delete + view count
- 🔎 Search across name, category, city
- 💬 Show seller contact (requires login)
- 📱 Responsive — works on mobile

---

## 🚀 How to Run

### Step 1 — Install MongoDB

Make sure MongoDB is running on your machine.
- Download: https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (free cloud): https://cloud.mongodb.com

### Step 2 — Setup Backend

```bash
cd marketplace/backend
npm install
```

Edit `.env` if needed:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/bazarhub
JWT_SECRET=bazarhub_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
```

Start backend:
```bash
npm run dev      # development (auto-restart)
# OR
npm start        # production
```

Backend will run at: **http://localhost:5000**

### Step 3 — Setup Frontend

```bash
cd marketplace/frontend
npm install
npm start
```

Frontend will run at: **http://localhost:3000**

> The `"proxy": "http://localhost:5000"` in frontend/package.json automatically routes all `/api` calls to the backend.

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user (JWT) |
| PUT | `/api/auth/update` | Update profile |
| PUT | `/api/auth/change-password` | Change password |

### Listings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/listings` | Get all listings (filters: category, city, type, search, minPrice, maxPrice, sort, page) |
| GET | `/api/listings/my` | Get my listings (JWT) |
| GET | `/api/listings/stats` | City + category stats |
| GET | `/api/listings/:id` | Get single listing |
| POST | `/api/listings` | Create listing (JWT, multipart/form-data) |
| PUT | `/api/listings/:id` | Update listing (JWT, owner only) |
| DELETE | `/api/listings/:id` | Delete listing (JWT, owner only) |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | All categories + subcategories |
| GET | `/api/categories/locations` | Countries, states, cities, areas |

---

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken) for auth
- bcryptjs for password hashing
- Multer for image uploads
- express-validator for input validation

**Frontend:**
- React 18
- Axios (API calls)
- Context API (auth state)
- CSS Variables (custom design system)

---

## 📦 Deployment Tips

GitHub Pages can host the React frontend, but it cannot run the Express backend. Use GitHub for the source code, then deploy the backend to a Node host like Render, Railway, or Fly.io.

1. Push this repo to GitHub.
2. Deploy the backend from `backend/` with these env vars:
  - `MONGO_URI` = MongoDB Atlas connection string
  - `JWT_SECRET` = strong random secret
  - `FRONTEND_ORIGIN` = your deployed frontend URL
3. Deploy the frontend from `frontend/`.
  - Set `REACT_APP_API_URL` to your backend URL, for example `https://your-backend.onrender.com`
  - Run `npm run build`
4. If you want one server only, host the backend on a Node platform and point the frontend to it using `REACT_APP_API_URL`.
5. For production image storage, move uploads to Cloudinary or AWS S3 instead of local disk.
6. The Express server will serve `frontend/build` automatically if that folder exists, so one backend deploy can run both the API and the React app.

### Single Deploy Setup

For Render/Railway/Fly.io, use either Docker or native commands.

Docker is the simplest option:

- Build command: `docker build -t bazarhub .`
- Run command: `docker run -p 5000:5000 --env-file .env bazarhub`

Local Docker Compose:

- `docker compose up --build`

If you prefer native platform commands, use:

- Build command: `cd frontend && npm install && npm run build`
- Start command: `cd backend && npm install && npm start`

Then set `FRONTEND_ORIGIN` to the final frontend URL only if you host frontend separately.

### Quick Production Env Example

Backend `.env`:
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=replace_with_a_strong_secret
FRONTEND_ORIGIN=https://your-frontend.github.io
```

Frontend `.env`:
```
REACT_APP_API_URL=https://your-backend.onrender.com
```

---

## 🔧 Fixes Needed Before Submission (if importing)

In `frontend/src/pages/AllPages.js`, the imports use `require()` inline — for a real React app, split these into separate files:
- `src/pages/CategoryPage.js`
- `src/pages/ListingsPage.js`
- `src/pages/ListingDetailPage.js`
- `src/pages/MyListingsPage.js`

And update `App.js` imports accordingly.
