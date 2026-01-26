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
import AdminPendingMoviesPage from "../pages/adminPages/AdminPendingMoviesPage";
import AdminPayment from "../pages/adminPages/AdminPayment";
import AdminSettings from "../pages/adminPages/AdminSettings";
import AdminUsers from "../pages/adminPages/AdminUsers";
import ResetPassword from "../pages/public/ResetPassword";
import ForgotPassword from "../pages/public/ForgotPassword";

import OwnerRoute from "./OwnerRoute";
import OwnerDashboard from "../pages/ownerPages/OwnerDashboard";
import OwnerScreens from "../pages/ownerPages/OwnerScreens";
import OwnerShows from "../pages/ownerPages/OwnerShows";
import OwnerProfile from "../pages/ownerPages/OwnerProfile";
import OwnerMovieFormPage from "../pages/ownerPages/OwnerMovieFormPage";
import OwnerMoviesPage from "../pages/ownerPages/OwnerMoviesPage";

// Booking flow pages
import TheatreSelectionPage from "../pages/bookingPages/TheatreSelectionPage";
import ScreenSelectionPage from "../pages/bookingPages/ScreenSelectionPage";
import ShowSelectionPage from "../pages/bookingPages/ShowSelectionPage";
import SeatSelectionPage from "../pages/bookingPages/SeatSelectionPage";
import BookingConfirmationPage from "../pages/bookingPages/BookingConfirmationPage";
import PaymentPage from "../pages/bookingPages/PaymentPage";
import TicketPage from "../pages/bookingPages/TicketPage";
import SearchPage from "../pages/public/searchPage";
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
         <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
         <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
         <Route path={ROUTES.SEARCH}  element={<SearchPage />} />
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
            <AdminPendingMoviesPage/>
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

        {/* Owner Routes */}
        <Route path={ROUTES.OWNER_DASHBOARD} element={
          <OwnerRoute>
            <OwnerDashboard/>
          </OwnerRoute>
        } />
        <Route path={ROUTES.OWNER_SCREENS} element={
          <OwnerRoute>
            <OwnerScreens/>
          </OwnerRoute>
        } />
        <Route path={ROUTES.OWNER_SHOWS} element={
          <OwnerRoute>
            <OwnerShows/>
          </OwnerRoute>
        } />
        <Route path={ROUTES.OWNER_SETTINGS} element={
          <OwnerRoute>
            <OwnerProfile/>
          </OwnerRoute>
        } />
        <Route path="/owner/movies/new" element={
          <OwnerRoute>
            <OwnerMovieFormPage/>
          </OwnerRoute>
        } />
        <Route path="/owner/movies/:movieId/edit" element={
          <OwnerRoute>
            <OwnerMovieFormPage/>
          </OwnerRoute>
        } />
        <Route path={ROUTES.OWNER_MOVIES} element={
          <OwnerRoute>
            <OwnerMoviesPage/>
          </OwnerRoute>
        } />

        {/* Booking Flow Routes */}
        <Route path="/movies/:movieId/theatres" element={<TheatreSelectionPage />} />
        <Route path="/movies/:movieId/theatres/:theatreId/screens" element={<ScreenSelectionPage />} />
        <Route path="/movies/:movieId/theatres/:theatreId/screens/:screenId/shows" element={<ShowSelectionPage />} />
        <Route path="/shows/:showId/seats" element={
          <UserRoute>
            <SeatSelectionPage />
          </UserRoute>
        } />
        <Route path="/booking/:bookingId/confirm" element={
          <UserRoute>
            <BookingConfirmationPage />
          </UserRoute>
        } />
        <Route path="/booking/:bookingId/payment" element={
          <UserRoute>
            <PaymentPage />
          </UserRoute>
        } />
        <Route path="/booking/:bookingId/ticket" element={
          <UserRoute>
            <TicketPage />
          </UserRoute>
        } />
        
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        
      </Routes>
      <Footer />
    </Router>
  );
};

export default UserRouter;
