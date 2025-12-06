import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { ROUTES } from "../constants/routes";

import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

import HomePage from "../pages/public/HomePage";
import LoginPage from "../pages/public/LoginPage";
import MovieDetailsPage from "../pages/public/MovieDetailsPage";
import RegisterPage from "../pages/public/RegisterPage";
import AboutPage from "../pages/public/AboutPage";
import ContactPage from "../pages/public/ContactPage";
import UserRoute from "./UserRoute";
import UserDashboard from "../pages/userPages/UserDashboard";
import UserPayment from "../pages/userPages/UserPayment";
import UserBookings from "../pages/userPages/UserBookings";
import UserSettings from "../pages/userPages/UserSettings";
import UserProfile from "../pages/userPages/UserProfilel";

import AdminDashBoard from "../pages/adminPages/AdminDashBoard";
import AdminRoute from "./AdminRoute";
import AdminLogs from "../pages/adminPages/AdminLogs";
import AdminMovies from "../pages/adminPages/AdminMovies";
import AdminPayment from "../pages/adminPages/AdminPayment";
import AdminSettings from "../pages/adminPages/AdminSettings";
import AdminUsers from "../pages/adminPages/AdminUsers";

const UserRouter = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.MOVIE_DETAILS} element={<MovieDetailsPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.ABOUT} element={<AboutPage />} />
        <Route path={ROUTES.CONTACT} element={<ContactPage />} />

        <Route
          path={ROUTES.USER_DASHBOARD}
          element={
            <UserRoute>
              <UserDashboard />
            </UserRoute>
          }
        />
        <Route
          path={ROUTES.USER_PAYMENT}
          element={
            <UserRoute>
              <UserPayment />
            </UserRoute>
          }
        />
        <Route
          path={ROUTES.USER_BOOKINGS}
          element={
            <UserRoute>
              <UserBookings />
            </UserRoute>
          }
        />
        <Route
          path={ROUTES.USER_SETTINGS}
          element={
            <UserRoute>
              <UserSettings />
            </UserRoute>
          }
        />
        <Route
          path={ROUTES.USER_PROFILE}
          element={
            <UserRoute>
              <UserProfile />
            </UserRoute>
          }
        />

        <Route path={ROUTES.ADMIN_DASHBOARD} element={
          <AdminRoute>
            <AdminDashBoard/>
            </AdminRoute>
        } />
        <Route path={ROUTES.ADMIN_LOGS} element={
          <AdminRoute>
            <AdminLogs/>
            </AdminRoute>
        } />
        <Route path={ROUTES.ADMIN_MOVIES} element={
          <AdminRoute>
            <AdminMovies/>
            </AdminRoute>
        } />
        
        <Route path={ROUTES.ADMIN_PAYMENTS} element={
          <AdminRoute>
            <AdminPayment/>
            </AdminRoute>
        } />
        <Route path={ROUTES.ADMIN_SETTINGS} element={
          <AdminRoute>
            <AdminSettings/>
            </AdminRoute>
        } />
        <Route path={ROUTES.ADMIN_USERS} element={
          <AdminRoute>
            <AdminUsers/>
            </AdminRoute>
        } />

        
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        
      </Routes>
      <Footer />
    </Router>
  );
};

export default UserRouter;
