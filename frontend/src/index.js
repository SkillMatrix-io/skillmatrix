import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import Dashboard from './pages/dashboard/Dashboard';
import Auth from './pages/authentication/Auth';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoutes';

import reportWebVitals from './reportWebVitals';
import ThemeProvider from './context/ThemeProvider';
import SessionProvider from './context/SessionContext';

import { Routes, Route, BrowserRouter } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SessionProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<App />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/auth/:mode" element={<Auth />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </SessionProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
