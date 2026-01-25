// Mock user services for dashboard, bookings, profile, and payments
// Replace with real API calls later

// export const getUserProfile = async () => {
// 	await new Promise(r => setTimeout(r, 250));
// 	return {
// 		id: 1,
// 		name: 'MOCK USER',
// 		email: 'user@moviehub.com',
// 		phone: '+1 (555) 123-4567',
// 		role: 'user',
// 		location: 'Mumbai'
// 	}
// }

// export const updateUserProfile = async (payload) => {
// 	await new Promise(r => setTimeout(r, 400));
// 	return { success: true, user: { ...payload } }
// }

import axiosInstance from "../config/axiosInstance";
import { API_CONFIG } from "../config/api";
export const getUserProfile = async () => {
  const res = await axiosInstance.get(API_CONFIG.ENDPOINTS.AUTH.GET_PROFILE);

  // backend wrapper: result.createResult(null, users[0])
  const user = res.data.data;

  // map backend fields → frontend fields
  return {
    id: user.user_id,
    name: user.full_name,
    email: user.email,
    phone: user.phone_number,
    location: user.city,
    role: user.role,
  };
};

/**
 * UPDATE USER PROFILE
 */
// export const updateUserProfile = async (payload) => {
//   const res = await axiosInstance.put('/user/update-profile', {
//     full_name: payload.name,
//     email: payload.email,
//     phone_number: payload.phone,
//     city: payload.location,
//   });

//   return res.data;
// };
export const updateUserProfile = async (formData) => {
	//console.log(formData);
	const token=localStorage.getItem("authToken");
  const payload = {
    name: formData.name,
    phone: formData.phone,
    city: formData.location, 
  };

  const res = await axiosInstance.put(API_CONFIG.ENDPOINTS.AUTH.UPDATE_PROFILE, payload);
    
  return res.data;

};

export const getUserPreferences = async () => {
	await new Promise(r => setTimeout(r, 200));
	return {
		language: 'English',
		notifications: true,
		darkMode: true,
		favoriteGenres: ['Action', 'Drama']
	}
}

export const updateUserPreferences = async (prefs) => {
	await new Promise(r => setTimeout(r, 300));
	return { success: true, preferences: prefs }
}

export const getUserBookings = async () => {
	await new Promise(r => setTimeout(r, 300));
	return [
		{
			id: 'bk_1001',
			movieTitle: 'Eternal Horizon',
			theater: 'PVR Icon, Phoenix',
			showTime: '2025-11-12T19:30:00Z',
			seats: ['E5', 'E6'],
			total: 520,
			status: 'UPCOMING'
		},
		{
			id: 'bk_1000',
			movieTitle: 'Neon Nights',
			theater: 'INOX, R City',
			showTime: '2025-08-01T16:00:00Z',
			seats: ['B3'],
			total: 240,
			status: 'COMPLETED'
		}
	]
}

export const cancelBooking = async (bookingId) => {
	await new Promise(r => setTimeout(r, 400));
	return { success: true, id: bookingId }
}

export const getPaymentMethods = async () => {
	await new Promise(r => setTimeout(r, 200));
	return [
		{ id: 'pm_visa', type: 'card', brand: 'Visa', last4: '4242', expiry: '12/28' },
		{ id: 'pm_upi', type: 'upi', handle: 'moviehub@upi' }
	]
}

export const addPaymentMethod = async (method) => {
	await new Promise(r => setTimeout(r, 400));
	return { success: true, method }
}

export const removePaymentMethod = async (id) => {
	await new Promise(r => setTimeout(r, 250));
	return { success: true, id }
}
