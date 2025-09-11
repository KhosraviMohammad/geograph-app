# Geograph App

A modern React application for geographic data management and visualization, built with Vite, Redux Toolkit, and Material-UI.

## Features

- 🗺️ Interactive map view with layer management
- 📁 Data import for various geographic formats
- 🎨 Modern Material-UI design
- 🔄 Redux state management
- ⚡ Fast development with Vite

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **Material-UI (MUI)** - Component library
- **React Router** - Navigation

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── store/         # Redux store and slices
├── hooks/         # Custom React hooks
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## API Integration

The app is configured to proxy API requests to `http://localhost:8000` (Django backend). Update the proxy configuration in `vite.config.ts` if needed.

## Development

This app is designed to work with the Django backend in the parent directory. Make sure the Django server is running on port 8000 for full functionality.
