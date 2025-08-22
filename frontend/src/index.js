import React from 'react';
import ReactDOM from 'react-dom/client';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import './index.css';

import App from './App';
import Dashboard from './pages/dashboard/Dashboard';
import Auth from './pages/authentication/Auth';
import CreateEditCourse from './pages/courses/CourseEdit';
import Courses from './pages/courses/Courses';
import LearnCourse from './pages/learning/LearnCourse';
import About from './pages/About';
import Devs from './pages/Devs';

import ProtectedRoute, { PublicRoutes } from './components/functional/ProtectedRoutes';
import ToastProvider from './components/functional/Toast';
import Navbar from './components/ui/Navbar';
import Footer from './components/ui/Footer';

import reportWebVitals from './reportWebVitals';
import ThemeProvider from './context/ThemeProvider';
import SessionProvider from './context/SessionContext';
import Page404 from './pages/404';
import ProfileView from './pages/misc/ProfileView';

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
              path="/learning/:id"
              element={
                <SessionProvider>
                  <ProtectedRoute>
                    <LearnCourse />
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
            <Route path="/auth/:mode" element={
              <PublicRoutes>
                <Auth />
              </PublicRoutes>
            } />
            <Route path="/about" element={<About />} />
            <Route path="/devs" element={<Devs />} />
            <Route path='/profile/:username' element={<ProfileView />} />
            {/* 404 pages */}
            <Route path='*' element={<Page404 />} />
          </Routes>
          <Footer />
          <ToastProvider />
        </SessionProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
