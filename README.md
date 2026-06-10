# Portal Project

A full-stack portfolio-style web application with a React frontend and an Express/MongoDB backend.

## Overview

This project delivers a modern marketing website experience together with an admin interface and API-backed content storage.

- **Frontend:** React + Create React App + Tailwind CSS + CRACO
- **Backend:** Express.js + Mongoose + MongoDB
- **Features:** homepage sections, projects, services, testimonials, tech stack, contact form, admin panel, WhatsApp button
- **Data:** resource-based REST API for projects, testimonials, services, tech stack, about values, and timeline

## Architecture

- `frontend/` contains the React application.
- `backend/` contains the Express API server.
- `backend/server.js` defines REST routes under `/api/:resource`.
- `frontend/src/App.js` routes `/` for the public landing page and `/admin` for the admin interface.

## Key Frontend Components

- `Navbar`, `Hero`, `About`, `Services`, `TechStack`, `Projects`, `WhyChooseUs`, `Testimonials`, `Contact`, `Footer`
- `ParticleBackground` for animated background effects
- `WhatsAppButton` for quick chat access
- `AdminPanel` for managing content data

## Backend API Resources

The backend exposes generic CRUD endpoints for these resources:

- `projects`
- `testimonials`
- `services`
- `techStack`
- `aboutValues`
- `aboutTimeline`

Example endpoints:

- `GET /api/projects`
- `POST /api/testimonials`
- `PUT /api/services/:id`
- `DELETE /api/aboutTimeline/:id`

## Prerequisites

- Node.js (recommended latest LTS)
- Yarn installed globally
- MongoDB running locally or a MongoDB Atlas connection string

## Setup

### Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Create a `.env` file with your MongoDB URI:
   ```env
   MONGODB_URI=mongodb://localhost:27017/webnexa
   ```
4. Start the backend server:
   ```bash
   node server.js
   ```

The backend listens on `PORT` or `5000` by default when `NODE_ENV !== 'production'`.

### Frontend

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Start the development server:
   ```bash
   yarn start
   ```

The React app will start in development mode and typically open at `http://localhost:3000`.

## Build

From `frontend/`:

```bash
yarn build
```

This generates production files under `frontend/build/`.

## Deployment Notes

- The frontend can be deployed as a static site from `frontend/build/`.
- The backend is deployable anywhere Node.js is supported, with `MONGODB_URI` configured.
- `backend/server.js` includes a health endpoint at `/api/health` for platform checks.

## Customization

- Add new projects, services, testimonials, or tech stack entries via the backend API or `AdminPanel`.
- Update page content by editing component files in `frontend/src/components/`.
- Change design tokens and theme settings in `frontend/tailwind.config.js`.

## Notes

- The frontend uses React Router for client-side navigation.
- The backend uses generic model mapping so resources are accessible through a single route pattern.
- If running both servers locally, confirm the frontend is configured to call the backend API host/port correctly.

## License

This project does not specify a license in the repository. Add one if you want to define reuse permissions.
