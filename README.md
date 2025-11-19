# Candidate Referral System -- Setup Guide

## 📁 Project Structure

    /backend
    /frontend

------------------------------------------------------------------------

# 🚀 Backend Setup

## 1️⃣ Install Dependencies

``` bash
cd backend
npm install
```

## 2️⃣ Create `.env` file

Create a file named `.env` inside the **backend** folder:

    PORT=4000
    MONGO_URI=your mmongo url
    JWT_SECRET=your_jwt_secret_here

### 🔥 Explanation

-   **PORT** → Server port\
-   **MONGO_URI** → MongoDB connection string\
-   **JWT_SECRET** → Secret key used to sign JWT tokens

## 3️⃣ Start Backend Server

``` bash
npm start
```

Backend will run at:

    http://localhost:4000

------------------------------------------------------------------------

# 💻 Frontend Setup

## 1️⃣ Install Dependencies

``` bash
cd frontend
npm install
```

## 2️⃣ Update API Base URL

Open **src/api.js** and ensure:

``` js
const client = axios.create({
  baseURL: "http://localhost:4000/api",
});
```

## 3️⃣ Start Frontend

``` bash
npm run dev
```

Frontend will run at:

    http://localhost:5173

------------------------------------------------------------------------

# 🔐 Authentication Flow

### On login:

-   Backend returns a **JWT token**
-   Frontend saves it to **localStorage**
-   Axios automatically attaches it in every request:

``` js
Authorization: Bearer <token>
```

------------------------------------------------------------------------

# 📦 How to Run the Entire Project

### Step 1 --- Start MongoDB

``` bash
mongod
```

### Step 2 --- Start Backend

``` bash
cd backend
npm start
```

### Step 3 --- Start Frontend

``` bash
cd frontend
npm run dev
```

------------------------------------------------------------------------

# 🧪 Test Admin Login

You may need a seed user:

    {
      "name": "aayush",
      "email": "aayush@gmail.com",
      "password": "aayush"
    }

------------------------------------------------------------------------

# 📁 Resume Upload Notes

-   Resumes are uploaded via **Multer**
-   Stored in `/uploads`
-   Accessible via:

```{=html}
<!-- -->
```
    http://localhost:4000/uploads/<filename>

------------------------------------------------------------------------

# 🎉 You're All Set!

Your Candidate Referral System is live locally.
