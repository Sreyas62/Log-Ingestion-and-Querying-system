# Log Ingestion and Querying System

A lightweight log management system that lets you ingest and search through log data with ease. Built with React and Node.js, this application provides a clean interface for managing logs without the overhead of complex infrastructure.

## Features

- **Simple Log Ingestion**: REST API endpoint to add log entries
- **Powerful Search**: Filter logs by level, message, resource ID, and date range
- **Analytics Dashboard**: Visualize log distribution by level
- **Responsive Design**: Works smoothly on both desktop and mobile

## Tech Stack

- **Frontend**: React 18, Material-UI 5, Recharts
- **Backend**: Node.js, Express
- **Storage**: File-based storage (no database required)
- **Build Tool**: Vite 4

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm (v9 or later) or yarn
- MongoDB Atlas account or local MongoDB instance

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables (see `.env.example`)

4. Start the development servers:
   ```bash
   # In one terminal (backend)
   cd backend
   npm run dev

   # In another terminal (frontend)
   cd frontend
   npm run dev
   ```

## Project Structure

```
.
├── backend/           # Backend server code
│   ├── config/       # Configuration files
│   ├── controllers/  # Route controllers
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── services/     # Business logic
│   └── utils/        # Utility functions
├── frontend/         # Frontend React application
│   ├── public/       # Static files
│   └── src/          # Source files
│       ├── components/  # Reusable UI components
│       ├── pages/       # Page components
│       ├── services/    # API services
│       ├── hooks/       # Custom React hooks
│       └── utils/       # Utility functions
└── .github/          # GitHub configurations
```

## API Documentation

API documentation will be available at `/api-docs` when the development server is running.

## License

MIT
