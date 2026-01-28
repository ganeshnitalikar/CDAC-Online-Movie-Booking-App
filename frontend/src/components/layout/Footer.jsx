
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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <FacebookIcon />, label: 'Facebook', url: 'https://facebook.com' },
    { icon: <TwitterIcon />, label: 'Twitter', url: 'https://twitter.com' },
    { icon: <InstagramIcon />, label: 'Instagram', url: 'https://instagram.com/' },
    { icon: <YouTubeIcon />, label: 'YouTube', url: 'https://www.youtube.com/' },
    { icon: <LinkedInIcon />, label: 'LinkedIn', url: 'https://www.linkedin.com' },
  ];

  const contactInfo = [
    {
      icon: <EmailIcon />,
      value: 'cineversehub1@gmail.com',
      action: 'mailto:cineversehub1@gmail.com',
    },
    {
      icon: <LocationIcon />,
      value: 'Hinjewadi Pune, 411057',
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
        backgroundColor: theme.palette.background.paper,
        borderTop: '1px solid',
        borderColor: theme.palette.divider,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
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
                  C
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
                  CineVerse
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                Your ultimate destination for movie tickets, showtimes, and entertainment. 
                Discover the latest movies, book tickets, and enjoy the best cinema experience.
              </Typography>

              {/* Contact Info */}
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
                    <Box sx={{ color: 'primary.main', display: 'flex', alignItems: 'center', minWidth: 20 }}>
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

          {/* Optional Footer Links can go here if needed */}
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Bottom Footer */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              © {currentYear} CineVerse. All rights reserved.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
              }}
            >
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
          <Typography variant="caption" color="text.disabled">
            CineVerse is your trusted partner for movie bookings. We partner with theaters across the country to bring you the best movie experience.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
