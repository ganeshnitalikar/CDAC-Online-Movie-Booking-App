import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();

  // Footer sections data
  const footerSections = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', path: ROUTES.ABOUT },
        { label: 'Careers', path: '/careers' },
        { label: 'Press', path: '/press' },
        { label: 'Investor Relations', path: '/investors' },
      ],
    },
    {
      title: 'Movies',
      links: [
        { label: 'Now Showing', path: '/movies/now-showing' },
        { label: 'Coming Soon', path: '/movies/coming-soon' },
        { label: 'Top Rated', path: '/movies/top-rated' },
        { label: 'Genres', path: '/movies/genres' },
      ],
    },
    {
      title: 'Theaters',
      links: [
        { label: 'Find Theaters', path: '/theaters' },
        { label: 'IMAX', path: '/theaters/imax' },
        { label: '4DX', path: '/theaters/4dx' },
        { label: 'Premium', path: '/theaters/premium' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', path: '/help' },
        { label: 'Contact Us', path: ROUTES.CONTACT },
        { label: 'Terms of Service', path: '/terms' },
        { label: 'Privacy Policy', path: '/privacy' },
      ],
    },
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, label: 'Facebook', url: 'https://facebook.com' },
    { icon: <TwitterIcon />, label: 'Twitter', url: 'https://twitter.com' },
    { icon: <InstagramIcon />, label: 'Instagram', url: 'https://instagram.com' },
    { icon: <YouTubeIcon />, label: 'YouTube', url: 'https://youtube.com' },
    { icon: <LinkedInIcon />, label: 'LinkedIn', url: 'https://linkedin.com' },
  ];

  const contactInfo = [
    {
      icon: <EmailIcon />,
      label: 'Email',
      value: 'support@moviehub.com',
      action: 'mailto:support@moviehub.com',
    },
    {
      icon: <PhoneIcon />,
      label: 'Phone',
      value: '+1 (555) 123-4567',
      action: 'tel:+15551234567',
    },
    {
      icon: <LocationIcon />,
      label: 'Address',
      value: '123 Cinema Street, Movie City, MC 12345',
      action: null,
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleExternalLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'background.surface',
        borderTop: '1px solid',
        borderColor: 'border',
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Main Footer Content */}
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid   sx={{md : 4 , xs : 12}  }>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
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
                  M
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #6366F1, #EC4899)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  MovieHub
                </Typography>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3, lineHeight: 1.6 }}
              >
                Your ultimate destination for movie tickets, showtimes, and entertainment. 
                Discover the latest movies, book tickets, and enjoy the best cinema experience.
              </Typography>
              
              {/* Contact Information */}
              <Box sx={{ mb: 3 }}>
                {contactInfo.map((contact, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 1,
                      cursor: contact.action ? 'pointer' : 'default',
                    }}
                    onClick={() => contact.action && handleExternalLink(contact.action)}
                  >
                    <Box
                      sx={{
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        minWidth: 20,
                      }}
                    >
                      {contact.icon}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {contact.value}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Social Links */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Follow Us
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {socialLinks.map((social, index) => (
                    <IconButton
                      key={index}
                      onClick={() => handleExternalLink(social.url)}
                      sx={{
                        color: 'text.secondary',
                        '&:hover': {
                          color: 'primary.main',
                          backgroundColor: 'primary.light',
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                      aria-label={social.label}
                    >
                      {social.icon}
                    </IconButton>
                  ))}
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Footer Links */}
          <Grid  xs={12} sx={{md : 8}}>
            <Grid container spacing={3}>
              {footerSections.map((section, index) => (
                <Grid  xs={6} sx={{sm : 3}} key={index}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 'bold',
                      mb: 2,
                      color: 'text.primary',
                    }}
                  >
                    {section.title}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {section.links.map((link, linkIndex) => (
                      <Link
                        key={linkIndex}
                        component="button"
                        variant="body2"
                        onClick={() => handleNavigation(link.path)}
                        sx={{
                          color: 'text.secondary',
                          textDecoration: 'none',
                          textAlign: 'left',
                          '&:hover': {
                            color: 'primary.main',
                            textDecoration: 'underline',
                          },
                          transition: 'color 0.2s ease-in-out',
                          cursor: 'pointer',
                        }}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Bottom Footer */}
        <Grid container spacing={2} alignItems="center">
          <Grid  xs={12} sx={{md : 6}}>
            <Typography variant="body2" color="text.secondary">
              © {currentYear} MovieHub. All rights reserved.
            </Typography>
          </Grid>
          <Grid  xs={12} sx={{md : 6}}>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
              }}
            >
              <Link
                component="button"
                variant="body2"
                onClick={() => handleNavigation('/terms')}
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline',
                  },
                  transition: 'color 0.2s ease-in-out',
                  cursor: 'pointer',
                }}
              >
                Terms of Service
              </Link>
              <Link
                component="button"
                variant="body2"
                onClick={() => handleNavigation('/privacy')}
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline',
                  },
                  transition: 'color 0.2s ease-in-out',
                  cursor: 'pointer',
                }}
              >
                Privacy Policy
              </Link>
              <Link
                component="button"
                variant="body2"
                onClick={() => handleNavigation('/cookies')}
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline',
                  },
                  transition: 'color 0.2s ease-in-out',
                  cursor: 'pointer',
                }}
              >
                Cookie Policy
              </Link>
            </Box>
          </Grid>
        </Grid>

        {/* Additional Info */}
        <Box
          sx={{
            mt: 3,
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" color="text.disabled">
            MovieHub is your trusted partner for movie bookings. We partner with theaters 
            across the country to bring you the best movie experience.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;