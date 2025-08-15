import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import Dashboard from './pages/dashboard/Dashboard';
import Auth from './pages/authentication/Auth';
import CreateEditCourse from './pages/courses/CourseEdit';
import Courses from './pages/courses/Courses';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoutes';
import Footer from './components/Footer';
import About from './pages/About';

import reportWebVitals from './reportWebVitals';
import ThemeProvider from './context/ThemeProvider';
import SessionProvider from './context/SessionContext';

import { Routes, Route, BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        {/* <CreateEditCourse /> */}
        <SessionProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/courses" element={<Courses />} />

            <Route
              path="/dashboard/:role"
              element={
                <SessionProvider>
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                </SessionProvider>
              }
            />
            <Route
              path="/create_edit/:courseId"
              element={
                <SessionProvider>
                  <ProtectedRoute>
                    <CreateEditCourse />
                  </ProtectedRoute>
                </SessionProvider>
              }
            />
            {/* <Route
              path="/create_edit/new"
              element={
                <SessionProvider>
                  <ProtectedRoute>
                    <CreateEditCourse />
                  </ProtectedRoute>
                </SessionProvider>
              }
            /> */}
            <Route path="/auth/:mode" element={
              <Auth />
            } />
            <Route path="/about" element={<About />} />

          </Routes>
          <Footer />

        </SessionProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
