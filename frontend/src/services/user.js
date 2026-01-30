

import axiosInstance from "../config/axiosInstance";
import { API_CONFIG } from "../config/api";
export const getUserProfile = async () => {
  const res = await axiosInstance.get(API_CONFIG.ENDPOINTS.AUTH.GET_PROFILE);

  const user = res.data.data;
  return {
    id: user.sub,
    full_name: user.full_name,
    email: user.email,
    phone_number: user.phone_number,
    city: user.city,
    role: user.role,
  };
};

export const updateUserProfile = async (formData) => {
	const token=localStorage.getItem("authToken");
  const payload = {
    name: formData.name,
    phone: formData.phone,
    city: formData.location, 
  };

  const res = await axiosInstance.put(API_CONFIG.ENDPOINTS.AUTH.UPDATE_PROFILE, payload);
    
  return res.data;

};


export const deleteUserAccount = async () => {
  const res = await axiosInstance.delete(
    API_CONFIG.ENDPOINTS.AUTH.DELETE_PROFILE
  );
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
	return []
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
