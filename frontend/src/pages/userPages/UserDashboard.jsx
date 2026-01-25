import React, { useEffect, useState } from 'react'
import { Box, Container, Typography, Grid, Paper, Stack, Button, Chip, Skeleton } from '@mui/material'
import { useAuth } from '../../hooks/useAuth'
import { getUserBookings, getUserProfile } from '../../services/user'
import { useNavigate } from 'react-router-dom'

const QuickAction = ({ title, description, action, onClick }) => (
	<Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
		<Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{title}</Typography>
		<Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>{description}</Typography>
		<Button size="small" sx={{ mt: 1.5 }} onClick={onClick}>{action}</Button>
	</Paper>
)

const UserDashboard = () => {
	const { user } = useAuth()
	const navigate = useNavigate()
	const [bookings, setBookings] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		let mounted = true
		getUserBookings().then((b) => { if (mounted) setBookings(b) }).finally(() => mounted && setLoading(false))
		return () => { mounted = false }
	}, [])

	const upcoming = bookings.find(b => b.status === 'UPCOMING')

	return (
		<Box sx={{ py: 4 }}>
			<Container maxWidth="lg">
				<Typography variant="h4" sx={{ fontWeight: 800, mb: .5 }}>Hi {user?.name || 'there'} 👋</Typography>
				<Typography color="text.secondary">Welcome back to MovieHub. Here's what's coming up.</Typography>

				<Grid container spacing={3} sx={{ mt: 2 }}>
					<Grid item xs={12} md={8}>
						<Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
							<Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Your next show</Typography>
							{loading ? (
								<>
									<Skeleton height={28} width="60%" />
									<Skeleton height={20} width="40%" />
									<Skeleton height={20} width="30%" />
								</>
							) : upcoming ? (
								<Stack spacing={1}>
									<Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{upcoming.movieTitle}</Typography>
									<Typography variant="body2" color="text.secondary">{upcoming.theater}</Typography>
									<Typography variant="body2">{new Date(upcoming.showTime).toLocaleString()}</Typography>
									<Stack direction="row" spacing={1}>
										<Chip label={`Seats: ${upcoming.seats.join(', ')}`} size="small" />
										<Chip label={`₹${upcoming.total}`} size="small" />
									</Stack>
									<Stack direction="row" spacing={1} sx={{ mt: 1 }}>
										<Button variant="contained" onClick={() => navigate('/user/bookings')}>View Ticket</Button>
										<Button variant="outlined" onClick={() => navigate('/user/bookings')}>Manage</Button>
									</Stack>
								</Stack>
							) : (
								<Typography color="text.secondary">No upcoming bookings. Explore movies and book your seat!</Typography>
							)}
						</Paper>
					</Grid>
					<Grid item xs={12} md={4}>
						<Stack spacing={2}>
							<QuickAction title="My Bookings" description="View and manage your tickets." action="Open" onClick={() => navigate('/user/bookings')} />
							<QuickAction title="Payment Methods" description="Add or remove payment options." action="Manage" onClick={() => navigate('/user/payment')} />
							<QuickAction title="Profile" description="Update your personal information." action="Edit" onClick={() => navigate('/user/profile')} />
						</Stack>
					</Grid>
				</Grid>
			</Container>
		</Box>
	)
}

export default UserDashboard