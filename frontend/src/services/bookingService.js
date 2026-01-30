import axiosBookingInstance from "../config/axiosBookingInstance";
import notificationApi from "../config/notificationApi";
import { getMovieById } from "./movie.public.service";
/**
 * Booking Service
 * Handles booking-related API calls
 */

/**
 * Initiate a booking
 * POST /user/bookings/initiate
 *  showId - Show ID
 *  seatIds - Array of seat IDs
 *  return Booking response with bookingId and lockExpiry
 */
export const initiateBooking = async (showId, seatIds) => {
  if (!showId) {
    throw new Error("Show ID is required");
  }
  if (!seatIds || seatIds.length === 0) {
    throw new Error("Please select at least one seat");
  }

  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Please login to book tickets");
    }
    console.log(showId,seatIds);
    const response = await axiosBookingInstance.post("booking/user/bookings/initiate", {
      showId: Number(showId),
        seatIds: seatIds.map(Number),
    });
    return response.data;
  } catch (error) {
    console.error("Error initiating booking:", error);
    
    // Handle specific error codes
    if (error.response?.status === 401) {
      throw new Error("Please login to book tickets");
    }
    if (error.response?.status === 409) {
      throw new Error("Some seats are already locked. Please select different seats.");
    }
    if (error.response?.status === 410) {
      throw new Error("Booking session expired. Please try again.");
    }
    if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || "Invalid booking request");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to initiate booking. Please try again.");
  }
};

/**
 * Get ticket details
 * GET /user/bookings/{bookingId}/ticket
 *  bookingId - Booking ID
 *  return Ticket details
 */
export const getTicket = async (bookingId) => {
  
  if (!bookingId) {
    throw new Error("Booking ID is required");
  }

  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Please login to view ticket");
    }
    
    const response = await axiosBookingInstance.get(`booking/user/bookings/${bookingId}/ticket`);
     const ticket = response.data;
   const movie = await getMovieById(ticket.movieId);
   console.log(movie.title)
   console.log(response.data)
    
  
   const authUser = JSON.parse(localStorage.getItem("authUser"));
   const formattedShowTime = new Date(ticket.showStartTime).toLocaleString("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
    // Prepare notification body
    const notificationBody = {
  toEmail: authUser?.email,
  userName: authUser?.name,
  movieName: movie.title, // if movieName not in response
  showTime: formattedShowTime,
  seats: ticket.seats.join(", "),
  bookingId: ticket.bookingId.toString(),
    };
   
    // Call notification service (don't block UI)
    notificationApi
      .post("/api/notification/booking-success", notificationBody)
      .then(() => console.log("Notification sent successfully"))
      .catch((err) => console.error("Notification failed:", err));
    console.log(response.data);
                 
    return response.data;
  } catch (error) {
    console.error("Error fetching ticket:", error);
    if (error.response?.status === 401) {
      throw new Error("Please login to view ticket");
    }
    if (error.response?.status === 404) {
      throw new Error("Ticket not found");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch ticket. Please try again.");
  }
};
