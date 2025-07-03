# Log Ingestion and Querying System

A lightweight log management system that provides a simple yet powerful way to collect, search, and analyze log data. Built with a modern tech stack, this solution offers real-time log processing capabilities without the complexity of traditional log management systems.

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or later
- npm 9 or later

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/log-ingestion-system.git
   cd log-ingestion-system
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   ```

## 🖥️ Running the Application

### Start the Backend Server
```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5001`

### Start the Frontend Development Server
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🛠️ Design Decisions

### 1. File-based Storage
- **Choice**: Using JSON files for storage instead of a database
- **Reasoning**:
  - Simpler setup and deployment
  - No external dependencies required
  - Sufficient for small to medium log volumes
- **Trade-offs**:
  - Limited scalability for very high log volumes
  - No built-in replication or sharding

### 2. Frontend Architecture
- **React 18** with TypeScript for type safety
- **Material-UI** for consistent, accessible UI components
- **React Query** for efficient data fetching and caching
- **Vite** for fast development and builds

### 3. API Design
- RESTful endpoints with consistent response formats
- Comprehensive error handling and validation
- Rate limiting to prevent abuse

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd ../frontend
npm test
```

## 📚 API Documentation

Detailed API documentation is available at `http://localhost:5001/api-docs` when the backend server is running.

## 🔍 Features

- **Log Ingestion**: Simple REST API for adding log entries
- **Advanced Search**: Filter logs by various criteria
- **Analytics**: Visualize log data with interactive charts
- **Responsive Design**: Works on desktop and mobile devices

## 📦 Dependencies

### Backend
- Express.js - Web framework
- Winston - Logging
- Joi - Request validation
- date-fns - Date manipulation

### Frontend
- React 18 - UI library
- Material-UI - Component library
- Recharts - Data visualization
- React Query - Data fetching
- date-fns - Date formatting

## 📝 Notes
- The system is designed to handle moderate log volumes efficiently
- For production use, consider adding authentication and monitoring
- Logs are stored in `backend/data/logs.json` by default

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
