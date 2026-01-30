import React from 'react'
import { Box, Container, Grid, Typography, Paper, Stack, Chip } from '@mui/material'

const Stat = ({ value, label }) => (
	<Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
		<Typography variant="h4" sx={{ fontWeight: 800 }}>{value}</Typography>
		<Typography variant="body2" color="text.secondary">{label}</Typography>
	</Paper>
)

const AboutPage = () => {
	return (
		<Box sx={{ py: 6 }}>
			<Container maxWidth="lg">
				{/* Hero */}
				<Box sx={{ textAlign: 'center', mb: 5 }}>
					<Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>About CineVerse</Typography>
					<Typography color="text.secondary">Your trusted destination for movie discovery and ticket booking across India.</Typography>
				</Box>

				{/* Mission */}
				<Paper elevation={0} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 3, border: '1px solid', borderColor: 'divider', mb: 5 }}>
					<Grid container spacing={3} alignItems="center">
						<Grid item xs={12} md={7}>
							<Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Our Mission</Typography>
							<Typography color="text.secondary">
								We aim to make movie-going effortless and delightful: discover what's trending, explore theaters and formats, and book your seats in seconds. We partner with top exhibitors nationwide to ensure real-time showtimes, secure payments, and a premium experience.
							</Typography>
							<Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
								<Chip label="Real-time Showtimes"/>
								<Chip label="Secure Payments"/>
								<Chip label="Premium Formats"/>
								<Chip label="Personalized Picks"/>
							</Stack>
						</Grid>
						<Grid item xs={12} md={5}>
							<Box sx={{ height: 220, borderRadius: 2, background: 'url(https://images.unsplash.com/photo-1517602302552-471fe67acf66?q=80&w=1200&auto=format&fit=crop) center/cover' }} />
						</Grid>
					</Grid>
				</Paper>

				{/* Stats */}
				<Grid container spacing={2}>
					<Grid item xs={6} md={3}><Stat value="500+" label="Theaters"/></Grid>
					<Grid item xs={6} md={3}><Stat value="12,000+" label="Screens"/></Grid>
					<Grid item xs={6} md={3}><Stat value="50M+" label="Tickets Booked"/></Grid>
					<Grid item xs={6} md={3}><Stat value="4.8/5" label="Avg. Rating"/></Grid>
				</Grid>
			</Container>
		</Box>
	)
}

export default AboutPage