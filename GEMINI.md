# ChaiCharoen-Catering

A full-stack catering service application built with Node.js, Express, MongoDB, and React.

## Project Overview

This project provides a platform for customers to browse catering menus, book events, and provide reviews. It also includes an administrative dashboard for managing users, menus, bookings, and analytics.

### Architecture

- **Backend:** Node.js/Express server using Mongoose for MongoDB interaction. Follows a controller-route-model pattern.
- **Frontend:** React application built with Vite, styled with Tailwind CSS and DaisyUI. Uses React Router for navigation and Axios for API communication.
- **Authentication:** JWT-based authentication with role-based access control (Admin, Customer).
- **Storage:** Local file storage for images (menu items, payment slips) managed via Multer.

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Atlas or local instance)

### Docker Setup (Recommended)

1.  Make sure you have [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed.
2.  Run the following command at the root of the project:
    ```bash
    docker compose up --build
    ```
3.  The application will be available at:
    - Frontend: `http://localhost:5173`
    - Backend API: `http://localhost:8080/api`
    - MongoDB: `mongodb://localhost:27017/chaicharoen`

### Backend Setup (Manual)

1.  Navigate to `backend/`.
2.  Install dependencies: `npm install`.
3.  Create a `.env` file based on `.env exmaple`:
    ```env
    PORT=8080
    JWT_SECRET=your_jwt_secret
    MONGO_URL=your_mongodb_connection_string
    ```
4.  Run in development mode: `npm run dev`.

### Frontend Setup

1.  Navigate to `frontend/`.
2.  Install dependencies: `npm install`.
3.  Run in development mode: `npm run dev`.
4.  Access the app at `http://localhost:5173`.

## Development Conventions

### Backend

- **Entry Point:** `backend/src/server.js`.
- **API Versioning:** All routes are prefixed with `/api` and defined in `backend/src/routes/index.js`.
- **Module System:** Uses CommonJS (`require`/`module.exports`).
- **Database:** Mongoose models are located in `backend/src/models/`.
- **Middleware:** Authentication and authorization logic is in `backend/src/middleware/`.
- **Constants:** Shared constants are in `backend/src/utils/constants.js`.

### Frontend

- **Entry Point:** `frontend/src/main.jsx`.
- **Routing:** Defined in `frontend/src/App.jsx` using `react-router`.
- **Styling:** Tailwind CSS (v4) with DaisyUI (v5).
- **API Services:** Axios instances and service methods are in `frontend/src/services/`.
- **Context:** Global state (e.g., text scaling) is managed in `frontend/src/context/`.
- **Components:** Organized into `admin`, `web`, `card`, `layouts`, and `shared` subdirectories.

### Common Patterns

- **Image Uploads:** Handled by `multer` in the backend. Images are saved to `backend/uploads/` and served statically.
- **Error Handling:** Consistent JSON response format for errors: `{ message: "...", error: "..." }`.
- **Auth Tokens:** JWT is stored in `localStorage` as `token`.

## Key Files

- `API_Documentation.md`: Detailed Thai-language documentation for all API endpoints.
- `Installation_Guide.md`: Detailed Thai-language setup instructions.
- `ER_Diagram.plantuml`: Database schema visualization.
- `backend/src/configs/db.js`: MongoDB connection configuration.
- `frontend/src/services/http-common.js`: Axios configuration for API calls.
