import React, { useState, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  InputBase,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  AccountCircle as AccountIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Movie as MovieIcon,
  Bookmark as BookmarkIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  ContactMail as ContactIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useTheme as useCustomTheme } from '../../hooks/useTheme';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, isAuthenticated, logout } = useAuth();
  const { mode, toggleMode } = useCustomTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [locationAnchor, setLocationAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Pune');
  
  const searchInputRef = useRef(null);
 

  // Location options
  const locations = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 
    'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat'
  ];

  // Navigation items
  const publicNavigationItems = [
    { label: 'Home', path: ROUTES.HOME, icon: <HomeIcon /> },
    { label: 'Movies', path: '/movies', icon: <MovieIcon /> },
    { label: 'About', path: ROUTES.ABOUT, icon: <InfoIcon /> },
    { label: 'Contact', path: ROUTES.CONTACT, icon: <ContactIcon /> },
  ];

  const userMenuItems = [
    { label: 'Dashboard', path: ROUTES.USER_DASHBOARD, icon: <DashboardIcon /> },
    { label: 'My Bookings', path: ROUTES.USER_BOOKINGS, icon: <BookmarkIcon /> },
    { label: 'Settings', path: ROUTES.USER_SETTINGS, icon: <SettingsIcon /> },
  ];

  const ownerMenuItems = [
    { label: 'Dashboard', path: ROUTES.OWNER_DASHBOARD, icon: <DashboardIcon /> },
    { label: 'Movies', path: ROUTES.OWNER_MOVIES, icon: <MovieIcon /> },
    { label: 'Screens', path: ROUTES.OWNER_SCREENS, icon: <MovieIcon /> },
    { label: 'Shows', path: ROUTES.OWNER_SHOWS, icon: <MovieIcon /> },
    { label: 'Bookings', path: ROUTES.OWNER_BOOKINGS, icon: <BookmarkIcon /> },
    { label: 'Settings', path: ROUTES.OWNER_SETTINGS, icon: <SettingsIcon /> },
  ];

  const adminMenuItems = [
    { label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: <DashboardIcon /> },
    { label: 'Users', path: ROUTES.ADMIN_USERS, icon: <AccountIcon /> },
    { label: 'Owners', path: ROUTES.ADMIN_OWNERS, icon: <AccountIcon /> },
    { label: 'Movies', path: ROUTES.ADMIN_MOVIES, icon: <MovieIcon /> },
    { label: 'Payments', path: ROUTES.ADMIN_PAYMENTS, icon: <BookmarkIcon /> },
    { label: 'Logs', path: ROUTES.ADMIN_LOGS, icon: <SettingsIcon /> },
    { label: 'Settings', path: ROUTES.ADMIN_SETTINGS, icon: <SettingsIcon /> },
  ];

  // Get role-specific menu items
  const getRoleSpecificMenuItems = () => {
    if (!isAuthenticated || !user) return [];
    
    switch (user.role) {
      case 'USER':
        return userMenuItems;
      case 'THEATER_OWNER':
        return ownerMenuItems;
      case 'ADMIN':
        return adminMenuItems;
      default:
        return [];
    }
  };

  // Handle search
  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   if (searchQuery.trim()) {
  //     navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  //     setSearchQuery('');
  //   }
  // };
  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    navigate(`/search?q=${encodeURIComponent(query)}`);
    setSearchQuery('');
  };
  // Handle location change
  const handleLocationSelect = (location) => {
    setCurrentLocation(location);
    setLocationAnchor(null);
    // You can add logic here to filter movies by location
  };

  // Handle profile menu
  const handleProfileMenuOpen = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchor(null);
  };

  // Handle drawer
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/');
  };

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };



  // Drawer content
  const drawerContent = (
    <Box sx={{ width: 300, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              background: 'linear-gradient(45deg, #6366F1, #EC4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem',
            }}
          >
            C
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            CineVerse
          </Typography>
        </Box>
        <IconButton onClick={toggleDrawer(false)} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      
      {/* User Info Section */}
      {isAuthenticated && user && (
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'primary.main',
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              {user.name?.charAt(0) || 'U'}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {user.name || 'User'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'User'}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Public Navigation */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Box sx={{ p: 1 }}>
          <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary', fontWeight: 'bold' }}>
            Navigation
          </Typography>
          <List dense>
            {publicNavigationItems.map((item) => (
              <ListItem 
                button 
                key={item.label}
                onClick={() => handleNavigation(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Role-specific Navigation */}
        {isAuthenticated && getRoleSpecificMenuItems().length > 0 && (
          <Box sx={{ p: 1 }}>
            <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary', fontWeight: 'bold' }}>
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} Panel
            </Typography>
            <List dense>
              {getRoleSpecificMenuItems().map((item) => (
                <ListItem 
                  button 
                  key={item.label}
                  onClick={() => handleNavigation(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    mb: 0.5,
                    '&.Mui-selected': {
                      backgroundColor: 'secondary.light',
                      '&:hover': {
                        backgroundColor: 'secondary.light',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>

      {/* Bottom Actions */}
      <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
        {isAuthenticated ? (
          <List dense>
            <ListItem 
              button 
              onClick={handleLogout}
              sx={{
                borderRadius: 1,
                mx: 1,
                my: 0.5,
                color: 'error.main',
                '&:hover': {
                  backgroundColor: 'error.light',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: 'error.main' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        ) : (
          <List dense>
            <ListItem 
              button 
              onClick={() => handleNavigation(ROUTES.LOGIN)}
              sx={{
                borderRadius: 1,
                mx: 1,
                my: 0.5,
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Sign In" />
            </ListItem>
            <ListItem 
              button 
              onClick={() => handleNavigation(ROUTES.REGISTER)}
              sx={{
                borderRadius: 1,
                mx: 1,
                my: 0.5,
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <RegisterIcon />
              </ListItemIcon>
              <ListItemText primary="Sign Up" />
            </ListItem>
          </List>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={1} sx={{ backgroundColor: 'background.paper' }}>
        <Toolbar sx={{ px: { xs: 1, sm: 2 }, gap: 2, justifyContent: 'space-between' }}>

          
          {/* Left Side - Logo and Brand Name */}
          <Box onClick={() => navigate(ROUTES.HOME)} sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 'fit-content', cursor: 'pointer' }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #6366F1, #EC4899)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.2rem',
              }}
            >
              C
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #6366F1, #EC4899)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              CineVerse
            </Typography>
          </Box>

          {/* Center - Search Bar */}
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              flexGrow: 1,
              maxWidth: { xs: '200px', sm: '400px', md: '500px' },
              position: 'relative',
              mx: { xs: 2, sm: 3, md: 4 },
            }}
          >
            <Box
              sx={{
                position: 'relative',
                borderRadius: 2,
                backgroundColor: 'background.surface',
                border: '1px solid',
                borderColor: 'border',
                '&:hover': {
                  borderColor: 'primary.main',
                },
                '&:focus-within': {
                  borderColor: 'primary.main',
                  boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.2)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <InputBase
                ref={searchInputRef}
                placeholder="Search movies, theaters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  width: '100%',
                  pl: 5,
                  pr: 1,
                  py: 1,
                  fontSize: '0.9rem',
                }}
                startAdornment={
                  <SearchIcon
                    sx={{
                      position: 'absolute',
                      left: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'text.secondary',
                      fontSize: '1.2rem',
                    }}
                  />
                }
               
              />
            </Box>
          </Box>

          {/* Right Side - All Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
            {/* Location Dropdown */}
            <Button
              onClick={(e) => setLocationAnchor(e.currentTarget)}
              startIcon={<LocationIcon />}
              sx={{
                color: 'text.primary',
                textTransform: 'none',
                minWidth: 'fit-content',
                display: { xs: 'none', md: 'flex' },
              }}
            >
              {currentLocation}
            </Button>

            {/* Drawer Menu Button - Always Visible */}
            <IconButton
              onClick={toggleDrawer(true)}
              sx={{ 
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'primary.main',
                }
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Desktop Authentication Actions */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              {!isAuthenticated ? (
                <>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(ROUTES.LOGIN)}
                    startIcon={<LoginIcon />}
                    sx={{ textTransform: 'none' }}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => navigate(ROUTES.REGISTER)}
                    startIcon={<RegisterIcon />}
                    sx={{ textTransform: 'none' }}
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: 'success.main',
                        color: 'success.main',
                        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: 'primary.main',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {user?.name?.charAt(0) || 'U'}
                    </Avatar>
                  </Badge>
                </IconButton>
              )}
            </Box>
          </Box>

          {/* Location Menu */}
          <Menu
            anchorEl={locationAnchor}
            open={Boolean(locationAnchor)}
            onClose={() => setLocationAnchor(null)}
            PaperProps={{
              sx: { minWidth: 200, maxHeight: 300 }
            }}
          >
            {locations.map((location) => (
              <MenuItem
                key={location}
                onClick={() => handleLocationSelect(location)}
                selected={location === currentLocation}
              >
                <LocationIcon sx={{ mr: 1, fontSize: '1rem' }} />
                {location}
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: { minWidth: 200, mt: 1 }
        }}
      >
        <Box sx={{ px: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {user?.name || 'User'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
        {getRoleSpecificMenuItems().map((item) => (
          <MenuItem
            key={item.label}
            onClick={() => {
              handleNavigation(item.path);
              handleProfileMenuClose();
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: 'background.paper',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Navbar;

// import React, { useState, useRef, useEffect } from 'react';
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   IconButton,
//   Button,
//   Box,
//   InputBase,
//   Menu,
//   MenuItem,
//   Avatar,
//   Drawer,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Divider,
//   Badge,
//   useTheme,
//   useMediaQuery,
// } from '@mui/material';
// import {
//   Search as SearchIcon,
//   LocationOn as LocationIcon,
//   AccountCircle as AccountIcon,
//   Menu as MenuIcon,
//   Close as CloseIcon,
//   Dashboard as DashboardIcon,
//   Movie as MovieIcon,
//   Bookmark as BookmarkIcon,
//   Settings as SettingsIcon,
//   Logout as LogoutIcon,
//   Login as LoginIcon,
//   PersonAdd as RegisterIcon,
//   Home as HomeIcon,
//   Info as InfoIcon,
//   ContactMail as ContactIcon,
// } from '@mui/icons-material';
// import { useAuth } from '../../hooks/useAuth';
// import { useTheme as useCustomTheme } from '../../hooks/useTheme';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ROUTES } from '../../constants/routes';

// const Navbar = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//   const { user, isAuthenticated, logout } = useAuth();
//   const { mode, toggleMode } = useCustomTheme();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [searchQuery, setSearchQuery] = useState('');
//   const [profileAnchor, setProfileAnchor] = useState(null);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [currentLocation, setCurrentLocation] = useState('Detecting...');
//   const searchInputRef = useRef(null);

//   // LIVE LOCATION
//   useEffect(() => {
//     if (!navigator.geolocation) {
//       setCurrentLocation('Location unavailable');
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords;

//         try {
//           const res = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
//           );
//           const data = await res.json();

//           const city =
//             data.address.city ||
//             data.address.town ||
//             data.address.village ||
//             data.address.state ||
//             'Your Location';

//           setCurrentLocation(city);
//         } catch {
//           setCurrentLocation('Location found');
//         }
//       },
//       () => {
//         setCurrentLocation('Permission denied');
//       }
//     );
//   }, []);

//   const publicNavigationItems = [
//     { label: 'Home', path: ROUTES.HOME, icon: <HomeIcon /> },
//     { label: 'Movies', path: '/movies', icon: <MovieIcon /> },
//     { label: 'About', path: ROUTES.ABOUT, icon: <InfoIcon /> },
//     { label: 'Contact', path: ROUTES.CONTACT, icon: <ContactIcon /> },
//   ];

//   const userMenuItems = [
//     { label: 'Dashboard', path: ROUTES.USER_DASHBOARD, icon: <DashboardIcon /> },
//     { label: 'My Bookings', path: ROUTES.USER_BOOKINGS, icon: <BookmarkIcon /> },
//     { label: 'Settings', path: ROUTES.USER_SETTINGS, icon: <SettingsIcon /> },
//   ];

//   const ownerMenuItems = [
//     { label: 'Dashboard', path: ROUTES.OWNER_DASHBOARD, icon: <DashboardIcon /> },
//     { label: 'Movies', path: ROUTES.OWNER_MOVIES, icon: <MovieIcon /> },
//     { label: 'Screens', path: ROUTES.OWNER_SCREENS, icon: <MovieIcon /> },
//     { label: 'Shows', path: ROUTES.OWNER_SHOWS, icon: <MovieIcon /> },
//     { label: 'Bookings', path: ROUTES.OWNER_BOOKINGS, icon: <BookmarkIcon /> },
//     { label: 'Settings', path: ROUTES.OWNER_SETTINGS, icon: <SettingsIcon /> },
//   ];

//   const adminMenuItems = [
//     { label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: <DashboardIcon /> },
//     { label: 'Users', path: ROUTES.ADMIN_USERS, icon: <AccountIcon /> },
//     { label: 'Owners', path: ROUTES.ADMIN_OWNERS, icon: <AccountIcon /> },
//     { label: 'Movies', path: ROUTES.ADMIN_MOVIES, icon: <MovieIcon /> },
//     { label: 'Payments', path: ROUTES.ADMIN_PAYMENTS, icon: <BookmarkIcon /> },
//     { label: 'Logs', path: ROUTES.ADMIN_LOGS, icon: <SettingsIcon /> },
//     { label: 'Settings', path: ROUTES.ADMIN_SETTINGS, icon: <SettingsIcon /> },
//   ];

//   const getRoleSpecificMenuItems = () => {
//     if (!isAuthenticated || !user) return [];
//     switch (user.role) {
//       case 'USER': return userMenuItems;
//       case 'THEATER_OWNER': return ownerMenuItems;
//       case 'ADMIN': return adminMenuItems;
//       default: return [];
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
//       setSearchQuery('');
//     }
//   };

//   const handleProfileMenuOpen = (event) => setProfileAnchor(event.currentTarget);
//   const handleProfileMenuClose = () => setProfileAnchor(null);

//   const toggleDrawer = (open) => (event) => {
//     if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
//     setDrawerOpen(open);
//   };

//   const handleLogout = () => {
//     logout();
//     handleProfileMenuClose();
//     navigate('/');
//   };

//   const handleNavigation = (path) => {
//     navigate(path);
//     setDrawerOpen(false);
//   };

//   // ================= DRAWER CONTENT (UNCHANGED) =================
//   const drawerContent = (
//     <Box sx={{ width: 300, height: '100%', display: 'flex', flexDirection: 'column' }}>
//       <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//           <Box sx={{ width: 32, height: 32, borderRadius: 1.5, background: 'linear-gradient(45deg, #6366F1, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>C</Box>
//           <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>CineVerse</Typography>
//         </Box>
//         <IconButton onClick={toggleDrawer(false)} size="small"><CloseIcon /></IconButton>
//       </Box>

//       <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
//         <Box sx={{ p: 1 }}>
//           <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary', fontWeight: 'bold' }}>Navigation</Typography>
//           <List dense>
//             {publicNavigationItems.map((item) => (
//               <ListItem button key={item.label} onClick={() => handleNavigation(item.path)} selected={location.pathname === item.path}>
//                 <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
//                 <ListItemText primary={item.label} />
//               </ListItem>
//             ))}
//           </List>
//         </Box>

//         {isAuthenticated && getRoleSpecificMenuItems().length > 0 && (
//           <Box sx={{ p: 1 }}>
//             <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary', fontWeight: 'bold' }}>{user?.role} Panel</Typography>
//             <List dense>
//               {getRoleSpecificMenuItems().map((item) => (
//                 <ListItem button key={item.label} onClick={() => handleNavigation(item.path)}>
//                   <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
//                   <ListItemText primary={item.label} />
//                 </ListItem>
//               ))}
//             </List>
//           </Box>
//         )}
//       </Box>

//       <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
//         {!isAuthenticated ? (
//           <List dense>
//             <ListItem button onClick={() => handleNavigation(ROUTES.LOGIN)}>
//               <ListItemIcon sx={{ minWidth: 36 }}><LoginIcon /></ListItemIcon>
//               <ListItemText primary="Sign In" />
//             </ListItem>
//             <ListItem button onClick={() => handleNavigation(ROUTES.REGISTER)}>
//               <ListItemIcon sx={{ minWidth: 36 }}><RegisterIcon /></ListItemIcon>
//               <ListItemText primary="Sign Up" />
//             </ListItem>
//           </List>
//         ) : (
//           <List dense>
//             <ListItem button onClick={handleLogout}>
//               <ListItemIcon sx={{ minWidth: 36, color: 'error.main' }}><LogoutIcon /></ListItemIcon>
//               <ListItemText primary="Logout" />
//             </ListItem>
//           </List>
//         )}
//       </Box>
//     </Box>
//   );

//   // =================== NAVBAR UI ===================
//   return (
//     <>
//       <AppBar position="sticky" elevation={1} sx={{ backgroundColor: 'background.paper' }}>
//         <Toolbar sx={{ px: { xs: 1, sm: 2 }, gap: 2, justifyContent: 'space-between' }}>
//           <Box onClick={() => navigate(ROUTES.HOME)} sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
//             <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(45deg, #6366F1, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>C</Box>
//             <Typography variant="h6" sx={{ fontWeight: 'bold', background: 'linear-gradient(45deg, #6366F1, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: { xs: 'none', sm: 'block' } }}>
//               CineVerse
//             </Typography>
//           </Box>

//           <Box component="form" onSubmit={handleSearch} sx={{ flexGrow: 1, maxWidth: { xs: 200, sm: 400, md: 500 }, mx: { xs: 2, sm: 3, md: 4 } }}>
//             <Box sx={{ position: 'relative', borderRadius: 2, border: '1px solid', borderColor: 'border' }}>
//               <InputBase
//                 ref={searchInputRef}
//                 placeholder="Search movies, theaters..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 sx={{ width: '100%', pl: 5, py: 1 }}
//                 startAdornment={<SearchIcon sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />}
//               />
//             </Box>
//           </Box>

//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
//             <Button startIcon={<LocationIcon />} sx={{ color: 'text.primary', textTransform: 'none', display: { xs: 'none', md: 'flex' } }}>
//               {currentLocation}
//             </Button>

//             <IconButton onClick={toggleDrawer(true)}>
//               <MenuIcon />
//             </IconButton>

//             <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
//               {!isAuthenticated ? (
//                 <>
//                   <Button variant="outlined" onClick={() => navigate(ROUTES.LOGIN)} startIcon={<LoginIcon />}>Sign In</Button>
//                   <Button variant="contained" onClick={() => navigate(ROUTES.REGISTER)} startIcon={<RegisterIcon />}>Sign Up</Button>
//                 </>
//               ) : (
//                 <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
//                   <Badge overlap="circular" variant="dot">
//                     <Avatar>{user?.name?.charAt(0)}</Avatar>
//                   </Badge>
//                 </IconButton>
//               )}
//             </Box>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       <Menu anchorEl={profileAnchor} open={Boolean(profileAnchor)} onClose={handleProfileMenuClose}>
//         {getRoleSpecificMenuItems().map((item) => (
//           <MenuItem key={item.label} onClick={() => handleNavigation(item.path)}>
//             {item.label}
//           </MenuItem>
//         ))}
//         <Divider />
//         <MenuItem onClick={handleLogout}>Logout</MenuItem>
//       </Menu>

//       <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
//         {drawerContent}
//       </Drawer>
//     </>
//   );
// };

// export default Navbar;
