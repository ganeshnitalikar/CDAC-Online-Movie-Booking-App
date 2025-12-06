// Mock admin services for admin dashboard and management pages
// Replace with real API calls later

// Get admin dashboard statistics
export const getAdminStats = async () => {
	await new Promise(r => setTimeout(r, 300));
	return {
		totalUsers: 12450,
		totalOwners: 342,
		totalMovies: 1256,
		totalBookings: 45678,
		revenue: 12500000,
		revenueChange: 12.5,
		activeUsers: 3456,
		activeUsersChange: 8.3,
		recentBookings: 1234,
		recentBookingsChange: -5.2,
		pendingApprovals: 23
	}
}

// Get all users with pagination and filters
export const getUsers = async (page = 1, limit = 10, search = '', status = 'all') => {
	await new Promise(r => setTimeout(r, 400));
	const allUsers = Array.from({ length: 12450 }).map((_, i) => ({
		id: `user_${i + 1}`,
		name: `User ${i + 1}`,
		email: `user${i + 1}@example.com`,
		phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
		role: 'user',
		status: i % 10 === 0 ? 'inactive' : 'active',
		joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
		bookingsCount: Math.floor(Math.random() * 50),
		lastActive: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
	}));

	let filtered = allUsers;
	if (search) {
		filtered = filtered.filter(u => 
			u.name.toLowerCase().includes(search.toLowerCase()) ||
			u.email.toLowerCase().includes(search.toLowerCase())
		);
	}
	if (status !== 'all') {
		filtered = filtered.filter(u => u.status === status);
	}

	const start = (page - 1) * limit;
	const end = start + limit;

	return {
		users: filtered.slice(start, end),
		total: filtered.length,
		page,
		limit,
		totalPages: Math.ceil(filtered.length / limit)
	}
}

// Get user by ID
export const getUserById = async (id) => {
	await new Promise(r => setTimeout(r, 300));
	return {
		id,
		name: 'John Doe',
		email: 'john@example.com',
		phone: '+91 9876543210',
		role: 'user',
		status: 'active',
		joinedDate: '2024-01-15T10:00:00Z',
		bookingsCount: 12,
		lastActive: new Date().toISOString(),
		preferences: {
			notifications: true,
			emailUpdates: true
		}
	}
}

// Update user status
export const updateUserStatus = async (id, status) => {
	await new Promise(r => setTimeout(r, 400));
	return { success: true, id, status }
}

// Delete user
export const deleteUser = async (id) => {
	await new Promise(r => setTimeout(r, 400));
	return { success: true, id }
}

// Get all owners with pagination and filters
export const getOwners = async (page = 1, limit = 10, search = '', status = 'all') => {
	await new Promise(r => setTimeout(r, 400));
	const allOwners = Array.from({ length: 342 }).map((_, i) => ({
		id: `owner_${i + 1}`,
		name: `Theater Owner ${i + 1}`,
		email: `owner${i + 1}@example.com`,
		phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
		role: 'owner',
		status: i % 15 === 0 ? 'pending' : i % 20 === 0 ? 'suspended' : 'active',
		theaterName: `Cinema ${i + 1}`,
		theaterCount: Math.floor(Math.random() * 5) + 1,
		joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
		totalRevenue: Math.floor(Math.random() * 1000000),
		verificationStatus: i % 10 === 0 ? 'pending' : 'verified'
	}));

	let filtered = allOwners;
	if (search) {
		filtered = filtered.filter(o => 
			o.name.toLowerCase().includes(search.toLowerCase()) ||
			o.email.toLowerCase().includes(search.toLowerCase()) ||
			o.theaterName.toLowerCase().includes(search.toLowerCase())
		);
	}
	if (status !== 'all') {
		filtered = filtered.filter(o => o.status === status);
	}

	const start = (page - 1) * limit;
	const end = start + limit;

	return {
		owners: filtered.slice(start, end),
		total: filtered.length,
		page,
		limit,
		totalPages: Math.ceil(filtered.length / limit)
	}
}

// Update owner status
export const updateOwnerStatus = async (id, status) => {
	await new Promise(r => setTimeout(r, 400));
	return { success: true, id, status }
}

// Verify owner
export const verifyOwner = async (id) => {
	await new Promise(r => setTimeout(r, 400));
	return { success: true, id, verificationStatus: 'verified' }
}

// Get all movies with pagination and filters
export const getAdminMovies = async (page = 1, limit = 10, search = '', status = 'all') => {
	await new Promise(r => setTimeout(r, 400));
	const allMovies = Array.from({ length: 1256 }).map((_, i) => ({
		id: `movie_${i + 1}`,
		title: `Movie ${i + 1}`,
		genre: ['Action', 'Drama', 'Comedy', 'Thriller'][i % 4],
		rating: (Math.random() * 3 + 6).toFixed(1),
		releaseDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
		durationMins: Math.floor(Math.random() * 120) + 90,
		status: i % 20 === 0 ? 'pending' : i % 30 === 0 ? 'rejected' : 'approved',
		ownerId: `owner_${Math.floor(Math.random() * 342) + 1}`,
		ownerName: `Theater Owner ${Math.floor(Math.random() * 342) + 1}`,
		bookingsCount: Math.floor(Math.random() * 500),
		revenue: Math.floor(Math.random() * 500000),
		posterUrl: `https://picsum.photos/seed/movie${i}/400/600`
	}));

	let filtered = allMovies;
	if (search) {
		filtered = filtered.filter(m => 
			m.title.toLowerCase().includes(search.toLowerCase())
		);
	}
	if (status !== 'all') {
		filtered = filtered.filter(m => m.status === status);
	}

	const start = (page - 1) * limit;
	const end = start + limit;

	return {
		movies: filtered.slice(start, end),
		total: filtered.length,
		page,
		limit,
		totalPages: Math.ceil(filtered.length / limit)
	}
}

// Approve/reject movie
export const updateMovieStatus = async (id, status) => {
	await new Promise(r => setTimeout(r, 400));
	return { success: true, id, status }
}

// Get payment transactions
export const getPayments = async (page = 1, limit = 10, search = '', status = 'all', dateRange = null) => {
	await new Promise(r => setTimeout(r, 400));
	const allPayments = Array.from({ length: 45678 }).map((_, i) => ({
		id: `pay_${i + 1}`,
		transactionId: `TXN${Date.now()}_${i}`,
		userId: `user_${Math.floor(Math.random() * 12450) + 1}`,
		userName: `User ${Math.floor(Math.random() * 12450) + 1}`,
		bookingId: `bk_${i + 1}`,
		movieTitle: `Movie ${Math.floor(Math.random() * 1256) + 1}`,
		amount: Math.floor(Math.random() * 2000) + 200,
		status: ['completed', 'pending', 'failed', 'refunded'][i % 4],
		paymentMethod: ['card', 'upi', 'wallet', 'netbanking'][i % 4],
		createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
		completedAt: i % 4 !== 0 ? new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString() : null
	}));

	let filtered = allPayments;
	if (search) {
		filtered = filtered.filter(p => 
			p.transactionId.toLowerCase().includes(search.toLowerCase()) ||
			p.userName.toLowerCase().includes(search.toLowerCase()) ||
			p.movieTitle.toLowerCase().includes(search.toLowerCase())
		);
	}
	if (status !== 'all') {
		filtered = filtered.filter(p => p.status === status);
	}

	const start = (page - 1) * limit;
	const end = start + limit;

	return {
		payments: filtered.slice(start, end),
		total: filtered.length,
		page,
		limit,
		totalPages: Math.ceil(filtered.length / limit),
		totalRevenue: filtered.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)
	}
}

// Get payment statistics
export const getPaymentStats = async (period = 'month') => {
	await new Promise(r => setTimeout(r, 300));
	return {
		totalRevenue: 12500000,
		totalTransactions: 45678,
		successfulTransactions: 43210,
		failedTransactions: 2468,
		averageTransactionValue: 275,
		revenueByMethod: {
			card: 6250000,
			upi: 4500000,
			wallet: 1250000,
			netbanking: 500000
		},
		revenueByDay: Array.from({ length: 30 }).map((_, i) => ({
			date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
			revenue: Math.floor(Math.random() * 500000) + 200000
		}))
	}
}

// Get system logs
export const getLogs = async (page = 1, limit = 50, level = 'all', search = '') => {
	await new Promise(r => setTimeout(r, 300));
	const levels = ['info', 'warning', 'error', 'success'];
	const actions = ['login', 'logout', 'booking_created', 'payment_processed', 'movie_added', 'user_created', 'system_update'];
	
	const allLogs = Array.from({ length: 10000 }).map((_, i) => ({
		id: `log_${i + 1}`,
		level: levels[i % 4],
		action: actions[i % 7],
		message: `${actions[i % 7].replace('_', ' ')} by user ${Math.floor(Math.random() * 1000) + 1}`,
		userId: `user_${Math.floor(Math.random() * 1000) + 1}`,
		userName: `User ${Math.floor(Math.random() * 1000) + 1}`,
		ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
		timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
		details: {
			resource: 'booking',
			resourceId: `bk_${i + 1}`
		}
	}));

	let filtered = allLogs;
	if (level !== 'all') {
		filtered = filtered.filter(l => l.level === level);
	}
	if (search) {
		filtered = filtered.filter(l => 
			l.message.toLowerCase().includes(search.toLowerCase()) ||
			l.action.toLowerCase().includes(search.toLowerCase())
		);
	}

	const start = (page - 1) * limit;
	const end = start + limit;

	return {
		logs: filtered.slice(start, end),
		total: filtered.length,
		page,
		limit,
		totalPages: Math.ceil(filtered.length / limit)
	}
}

// Get recent activity
export const getRecentActivity = async (limit = 10) => {
	await new Promise(r => setTimeout(r, 300));
	return Array.from({ length: limit }).map((_, i) => ({
		id: `activity_${i + 1}`,
		type: ['user_registered', 'booking_created', 'payment_processed', 'movie_added'][i % 4],
		message: `New ${['user registration', 'booking', 'payment', 'movie'][i % 4]}`,
		timestamp: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
		userId: `user_${i + 1}`,
		userName: `User ${i + 1}`
	}));
}

