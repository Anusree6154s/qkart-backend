<div align="center">
  <img src="https://github.com/user-attachments/assets/fa08e516-e0d6-4ff2-836b-06da3682465a" width="150"/>
  <h1 id="title">QKart Frontend</h1>
  <p><strong>Frontend for QKart - An E-commerce application</strong></p>
  <p>
    <a href="https://qkart-backend-8sar.onrender.com/">View QKart Backend</a> •
    <a href="https://qkart-frontend-01.vercel.app/">View QKart Frontend</a>
  </p>
  <img src="https://github.com/user-attachments/assets/b8ce7ec8-3fde-4b1a-a230-af5a180bc482" width="700"/>
</div>

## Table of Contents

1. [Project Overview](#project-overview)
2. [Setup Instructions](#setup-instructions)
3. [Technical Architecture](#technical-architecture)
4. [Features Implemented](#features-implemented)
5. [Potential Improvements](#potential-improvements)

## Project Overview

<p id="description">QKart is a full-stack E-commerce application offering users a comprehensive shopping platform. This project focuses on the frontend development, implementing various features and maintaining a responsive UI</p>

### Tech Stack

- **Frontend**: React.js, React Router, Material UI
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Render (Backend), Vercel (Frontend)

## Setup Instructions

### Frontend

```bash
git clone https://github.com/Anusree6154s/qkart-backend # clone repo
npm install # install dependencies
npm start
```

### Backend

```bash
cd backend
npm install
npm start
```

## Technical Architecture

- **Frontend Library**: React.js for building a component-based user interface.
- **State Management**: React hooks (`useState`, `useEffect`) for managing component state.
- **Routing**: React Router for dynamic routing and navigation.
- **Styling**: Material UI for a consistent design across components.
- **Deployment Architecture**:
  - **Hosting**: Render (backend) for automated deployments, Netlify (frontend) for static assets.
<div align="center"> 
<img src="https://directus.crio.do/assets/1034488f-e6c8-4489-bb93-4265fd12fc11?" width="50%" >
<p align="center">QKart Component Architecture</p>
</div>

## Features Implemented

1. **User Registration**:

   - Created UI with form validation and error messages.
   - Integrated with backend API for registration and feedback.

2. **User Login and Authentication**:

   - Persisted sessions using localStorage.
   - Secured shopping cart and checkout routes for authenticated users only.

3. **Product Display and Search**:
   - Loaded product data with useEffect() for optimized rendering.
   - Implemented debounced search bar to reduce API calls and enhance UX.

<div align="center">
  <img src="https://directus.crio.do/assets/ff900517-2e55-454d-9419-25bd4ce4db49?" width="600"/>
  <h5>Search functionality</h5>
</div>

4. **Shopping Cart and Checkout**:
   - Real-time cart updates implemented with useState and useEffect.
   - Responsive design achieved using CSS media queries and Material UI’s Grid.
   - API calls managed with Axios to handle cart modifications and checkout process.

<div align="center">
  <img src="https://directus.crio.do/assets/cee7a520-32d5-4fd1-9661-c5e257f1b98d?" width="600"/>
  <h5>Shopping Cart</h5>
</div>
<div align="center">
  <img src="https://directus.crio.do/assets/58527646-a8d2-4d39-ae15-5356da347459?" width="600"/>
  <h5>Checkout Page</h5>
</div>

5. **Deployment**:
   - Set up for deployment on Netlify and Vercel

## Potential Improvements

- **Wishlist Feature**: Allow users to save favorite items.
- **User Reviews**: Enable reviews and ratings on product pages.
- **Cart Enhancements**: Direct item quantity adjustment within the cart.
- **Admin Dashboard**: Create an admin interface for managing products and users.
- **Enhanced Error Handling**: Improve logging and error-handling mechanisms.

<p align="center"> 
  <img width="0" id="image" alt="qkart-backend-img" src="https://github.com/user-attachments/assets/ebe87c30-8a19-496f-af77-29b552b0bdb6">
</p>
