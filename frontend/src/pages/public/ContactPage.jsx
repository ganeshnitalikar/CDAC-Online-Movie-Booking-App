import React, { useState } from 'react'
import { Box, Container, Grid, Typography, Paper, TextField, Button, Stack } from '@mui/material'

const ContactPage = () => {
	const [form, setForm] = useState({ name: '', email: '', message: '' })
	const [submitted, setSubmitted] = useState(false)

	const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
	const handleSubmit = (e) => {
		e.preventDefault()
		setSubmitted(true)
	}

	return (
		<Box sx={{ py: 6 }}>
			<Container maxWidth="lg">
				<Box sx={{ textAlign: 'center', mb: 4 }}>
					<Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>Contact Us</Typography>
					<Typography color="text.secondary">We’re here to help with bookings, payments, and partnerships.</Typography>
				</Box>

				<Grid container spacing={3}>
					<Grid item xs={12} md={6}>
						<Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
							<Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Send us a message</Typography>
							<Box component="form" onSubmit={handleSubmit}>
								<Stack spacing={2}>
									<TextField name="name" label="Full Name" value={form.name} onChange={handleChange} required />
									<TextField name="email" label="Email" type="email" value={form.email} onChange={handleChange} required />
									<TextField name="message" label="Message" value={form.message} onChange={handleChange} required multiline minRows={4} />
									<Button type="submit" variant="contained" size="large">Submit</Button>
									{submitted && <Typography color="success.main">Thanks! We will get back within 24 hours.</Typography>}
								</Stack>
							</Box>
						</Paper>
					</Grid>
					<Grid item xs={12} md={6}>
						<Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
							<Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Support</Typography>
							<Stack spacing={1} sx={{ mb: 3 }}>
								<Typography>Email: cineversehub1@gmail.com</Typography>
								<Typography>Phone: +91 8830109545</Typography>
								<Typography>Hours: Mon - Sun, 9:00 AM - 9:00 PM</Typography>
							</Stack>
							<Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Head Office</Typography>
							<Typography>Hinjewadi Tech Park, Pune 411057</Typography>
							<Box sx={{ mt: 2, height: 200, borderRadius: 2, background: 'url(https://images.unsplash.com/photo-1481437642641-2f0ae875f836?q=80&w=1200&auto=format&fit=crop) center/cover' }} />
						</Paper>
					</Grid>
				</Grid>
			</Container>
		</Box>
	)
}

export default ContactPage