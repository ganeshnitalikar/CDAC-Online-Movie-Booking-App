import { Card, CardActionArea, CardContent, CardMedia, Chip, Stack, Typography } from "@mui/material"

const MovieCard = ({ movie, onClick }) => {
	return (
		<Card sx={{ height: '100%', borderRadius: 2 }}>
			<CardActionArea onClick={() => onClick?.(movie)}>
				<CardMedia component="img" image={movie.posterUrl} alt={movie.title} sx={{ height: 240, objectFit: 'cover' }} />
				<CardContent>
					<Typography variant="subtitle1" sx={{ fontWeight: 600 }} noWrap>{movie.title}</Typography>
					<Stack direction="row" spacing={1} sx={{ mt: .5 }}>
						{(movie.genre || []).slice(0, 2).map((g) => (
							<Chip key={g} size="small" label={g} />
						))}
					</Stack>
					<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: .5 }}>⭐ {movie.rating} • {movie.releaseDate?.slice(0,4)}</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
	)
}
export default MovieCard