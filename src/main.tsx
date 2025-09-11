import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App.tsx'
import { ReduxProvider } from './providers/ReduxProvider.tsx'
import { MaterialUIProvider } from './providers/MaterialUIProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReduxProvider>
      <BrowserRouter>
        <MaterialUIProvider>
          <CssBaseline />
          <App />
        </MaterialUIProvider>
      </BrowserRouter>
    </ReduxProvider>
  </React.StrictMode>,
)
