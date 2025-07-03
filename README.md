# Log Ingestion and Querying System

A lightweight log management system that provides a simple yet powerful way to collect, search, and analyze log data. Built with a modern tech stack, this solution offers real-time log processing capabilities without the complexity of traditional log management systems. 
Built with Vibe Coding approach

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose (for containerized deployment)
- OR Node.js 18+ and npm 9+ (for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sreyas62/Log-Ingestion-and-Querying-system
   cd Log-Ingestion-and-Querying-system
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

### Option 1: Using Docker (Recommended)

1. **Build and start all services**
   ```bash
   docker-compose up --build
   ```

2. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:5001

3. **Stop the application**
   ```bash
   docker-compose down
   ```

### Option 2: Local Development

#### Start the Backend Server
```bash
cd backend
npm install
npm run dev
```

The backend will start on `http://localhost:5000`

#### Start the Frontend Development Server
```bash
cd frontend
npm install
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

Detailed API documentation is available at `API_DOCUMENTATION`.

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

## 🏆 Bonus Challenges Implemented

### 1. Advanced Analytics Dashboard
- **Implementation**: Added an interactive analytics dashboard using Recharts
- **Features**:
  - Visual representation of log distribution by level
  - Real-time updates based on current filters
  - Responsive design that works on all screen sizes
- **Location**: Frontend `/src/components/LogAnalytics.tsx`

### 2. Containerization with Docker
- **Implementation**: Complete Docker setup for both frontend and backend
- **Features**:
  - Multi-stage builds for optimized image sizes
  - Nginx for serving the frontend in production mode
  - Volume mapping for persistent log storage
  - Environment variable configuration
- **Files**:
  - `Dockerfile` (frontend and backend)
  - `docker-compose.yml`
  - `nginx.conf` for frontend routing

### 3. Comprehensive Unit Testing
- **Implementation**: Jest test suite for backend filtering logic
- **Coverage**:
  - Filtering by all log fields (level, resourceId, traceId, etc.)
  - Combined filter scenarios
  - Edge cases (empty results, case sensitivity, date ranges)
  - 90%+ statement coverage
- **Location**: `backend/__tests__/fileStorage.test.js`

## 📝 Notes
- The system is designed to handle moderate log volumes efficiently
- For production use, consider adding authentication and monitoring
- Logs are stored in `backend/data/logs.json` by default

## Project Structure

```
.
├── backend/               # Backend server code
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── data/             # Log data storage (JSON files)
│   ├── middleware/       # Express middleware
│   ├── routes/           # API route definitions
│   ├── __tests__/        # Test files
│   └── utils/            # Utility functions and file storage logic
├── frontend/             # Frontend React application
│   ├── public/           # Static files
│   └── src/              # Source files
│       ├── components/   # Reusable UI components
│       ├── hooks/        # Custom React hooks
│       ├── lib/          # Library code and utilities
│       ├── pages/        # Page components
│       ├── routes/       # Application routes
│       ├── services/     # API service layer
│       ├── theme/        # Styling and theming
│       └── types/        # TypeScript type definitions
├── .github/              # GitHub configurations
├── docker-compose.yml    # Docker Compose configuration
└── README.md            # Project documentation
```

## API Documentation

API documentation will be available at `API_DOCUMENTATION` when the development server is running.

## License

MIT
