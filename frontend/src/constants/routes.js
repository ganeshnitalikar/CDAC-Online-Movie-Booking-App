// Route constants for the movie booking app
export const ROUTES = {
    // Public routes
    HOME: '/',
    ABOUT: '/about',
    CONTACT: '/contact',
    LOGIN: '/login',
    REGISTER: '/register',
    MOVIE_DETAILS: '/movie/:id',
    ADMIN_OTP_PAGE:  "/otp",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    SEARCH:"/search",

    // User routes
    USER_DASHBOARD: '/user/dashboard',
    USER_PROFILE: '/user/profile',
    USER_BOOKINGS: '/user/bookings',
    USER_PAYMENT: '/user/payment',
    USER_SETTINGS: '/user/settings',

    // Booking flow routes
    THEATRE_SELECTION: '/movies/:movieId/theatres',
    SCREEN_SELECTION: '/movies/:movieId/theatres/:theatreId/screens',
    SHOW_SELECTION: '/movies/:movieId/theatres/:theatreId/screens/:screenId/shows',
    SEAT_SELECTION: '/shows/:showId/seats',
    BOOKING_CONFIRM: '/booking/:bookingId/confirm',
    BOOKING_PAYMENT: '/booking/:bookingId/payment',
    BOOKING_TICKET: '/booking/:bookingId/ticket',

    // Owner routes
    OWNER_DASHBOARD: '/owner/dashboard',
    OWNER_MOVIES: '/owner/movies',
    OWNER_SCREENS: '/owner/screens',
    OWNER_SHOWS: '/owner/shows',
    OWNER_BOOKINGS: '/owner/bookings',
    OWNER_SETTINGS: '/owner/settings',

    // Admin routes
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_USERS: '/admin/users',
    ADMIN_OWNERS: '/admin/owners',
    ADMIN_MOVIES: '/admin/movies',
    ADMIN_PAYMENTS: '/admin/payments',
    ADMIN_LOGS: '/admin/logs',
    ADMIN_SETTINGS: '/admin/settings',
};

// Route groups for easier navigation
export const ROUTE_GROUPS = {
    PUBLIC: [
        ROUTES.HOME,
        ROUTES.ABOUT,
        ROUTES.CONTACT,
        ROUTES.LOGIN,
        ROUTES.REGISTER,
        ROUTES.MOVIE_DETAILS,
        ROUTES.ADMIN_OTP_PAGE,
        ROUTES.FORGOT_PASSWORD,
        ROUTES.RESET_PASSWORD,
    ],
    USER: [
        ROUTES.USER_DASHBOARD,
        ROUTES.USER_PROFILE,
        ROUTES.USER_BOOKINGS,
        ROUTES.USER_PAYMENT,
        ROUTES.USER_SETTINGS,
    ],
    OWNER: [
        ROUTES.OWNER_DASHBOARD,
        ROUTES.OWNER_MOVIES,
        ROUTES.OWNER_SCREENS,
        ROUTES.OWNER_SHOWS,
        ROUTES.OWNER_BOOKINGS,
        ROUTES.OWNER_SETTINGS,
    ],
    ADMIN: [
        ROUTES.ADMIN_DASHBOARD,
        ROUTES.ADMIN_USERS,
        ROUTES.ADMIN_OWNERS,
        ROUTES.ADMIN_MOVIES,
        ROUTES.ADMIN_PAYMENTS,
        ROUTES.ADMIN_LOGS,
        ROUTES.ADMIN_SETTINGS,
    ],
};

// Navigation menu structure
export const NAVIGATION_MENU = {
    public: [
        { label: 'Home', path: ROUTES.HOME, icon: 'home' },
        { label: 'About', path: ROUTES.ABOUT, icon: 'info' },
        { label: 'Contact', path: ROUTES.CONTACT, icon: 'contact' },
    ],
    user: [
        { label: 'Dashboard', path: ROUTES.USER_DASHBOARD, icon: 'dashboard' },
        { label: 'My Bookings', path: ROUTES.USER_BOOKINGS, icon: 'bookings' },
        { label: 'Profile', path: ROUTES.USER_PROFILE, icon: 'profile' },
        { label: 'Settings', path: ROUTES.USER_SETTINGS, icon: 'settings' },
    ],
    owner: [
        { label: 'Dashboard', path: ROUTES.OWNER_DASHBOARD, icon: 'dashboard' },
        { label: 'Movies', path: ROUTES.OWNER_MOVIES, icon: 'movie' },
        { label: 'Screens', path: ROUTES.OWNER_SCREENS, icon: 'screen' },
        { label: 'Shows', path: ROUTES.OWNER_SHOWS, icon: 'show' },
        { label: 'Bookings', path: ROUTES.OWNER_BOOKINGS, icon: 'bookings' },
        { label: 'Settings', path: ROUTES.OWNER_SETTINGS, icon: 'settings' },
    ],
    admin: [
        { label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: 'dashboard' },
        { label: 'Users', path: ROUTES.ADMIN_USERS, icon: 'users' },
        { label: 'Owners', path: ROUTES.ADMIN_OWNERS, icon: 'owners' },
        { label: 'Movies', path: ROUTES.ADMIN_MOVIES, icon: 'movie' },
        { label: 'Payments', path: ROUTES.ADMIN_PAYMENTS, icon: 'payment' },
        { label: 'Logs', path: ROUTES.ADMIN_LOGS, icon: 'logs' },
        { label: 'Settings', path: ROUTES.ADMIN_SETTINGS, icon: 'settings' },
    ],
};

// Route permissions
export const ROUTE_PERMISSIONS = {
    [ROUTES.HOME]: ['public', 'user', 'owner', 'admin'],
    [ROUTES.ABOUT]: ['public', 'user', 'owner', 'admin'],
    [ROUTES.CONTACT]: ['public', 'user', 'owner', 'admin'],
    [ROUTES.LOGIN]: ['public'],
    [ROUTES.REGISTER]: ['public'],
    [ROUTES.MOVIE_DETAILS]: ['public'],
    [ROUTES.FORGOT_PASSWORD]:['public'],
     [ROUTES.RESET_PASSWORD]:['public'],
    // User routes
    [ROUTES.USER_DASHBOARD]: ['user'],
    [ROUTES.USER_PROFILE]: ['user'],
    [ROUTES.USER_BOOKINGS]: ['user'],
    [ROUTES.USER_PAYMENT]: ['user'],
    [ROUTES.USER_SETTINGS]: ['user'],

    // Owner routes
    [ROUTES.OWNER_DASHBOARD]: ['owner'],
    [ROUTES.OWNER_MOVIES]: ['owner'],
    [ROUTES.OWNER_SCREENS]: ['owner'],
    [ROUTES.OWNER_SHOWS]: ['owner'],
    [ROUTES.OWNER_BOOKINGS]: ['owner'],
    [ROUTES.OWNER_SETTINGS]: ['owner'],

    // Admin routes
    [ROUTES.ADMIN_DASHBOARD]: ['admin'],
    [ROUTES.ADMIN_USERS]: ['admin'],
    [ROUTES.ADMIN_OWNERS]: ['admin'],
    [ROUTES.ADMIN_MOVIES]: ['admin'],
    [ROUTES.ADMIN_PAYMENTS]: ['admin'],
    [ROUTES.ADMIN_LOGS]: ['admin'],
    [ROUTES.ADMIN_SETTINGS]: ['admin'],
};

export const getRoutePermissions = (route) => ROUTE_PERMISSIONS[route] || [];
export const canAccessRoute = (route, userRole) => {
    const permissions = getRoutePermissions(route);
    return permissions.includes(userRole) || permissions.includes('public');
};
export const isPublicRoute = (route) => getRoutePermissions(route).includes('public');
export const isProtectedRoute = (route) => !isPublicRoute(route);
