// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import axios from "axios";

// const SearchPage = () => {
//   const [searchParams] = useSearchParams();
//   const query = searchParams.get("q");
//   const [movies, setMovies] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!query) return;

//     const fetchMovies = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(
//           `http://localhost:8080/api/public/movies/search?q=${query}`
//         );
//         setMovies(res.data);
//       } catch (err) {
//         console.error("Search failed", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMovies();
//   }, [query]);

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Search Results for "{query}"</h2>

//       {loading && <p>Loading...</p>}

//       {!loading && movies.length === 0 && <p>No movies found.</p>}

//       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, 200px)", gap: "20px" }}>
//         {movies.map(movie => (
//           <div key={movie.id}>
//             <img src={movie.posterUrl} alt={movie.title} width="100%" />
//             <h4>{movie.title}</h4>
//             <p>{movie.genre}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SearchPage;
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Chip,
  Skeleton,
  Stack
} from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

/* 🔁 SAME MovieCard from Home */
const MovieCard = ({ movie, onClick }) => {
  return (
    <Card sx={{ height: "100%", borderRadius: 2 }}>
      <CardActionArea onClick={() => onClick?.(movie)}>
        <CardMedia
          component="img"
          image={movie.posterUrl}
          alt={movie.title}
          sx={{ height: 240, objectFit: "cover" }}
        />
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }} noWrap>
            {movie.title}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
            {(movie.genre || []).slice(0, 2).map((g) => (
              <Chip key={g} size="small" label={g} />
            ))}
          </Stack>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 0.5 }}
          >
            ⭐ {movie.rating} • {movie.releaseDate?.slice(0, 4)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const fetchMovies = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:8080/api/public/movies/search?q=${encodeURIComponent(query)}`
        );
        setMovies(res.data);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [query]);

  const handleSelectMovie = (movie) => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <Box sx={{ pb: 6 }}>
      <Container maxWidth="lg" sx={{ pt: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Search Results for "{query}"
        </Typography>

        <Grid container spacing={2}>
          {(loading ? Array.from({ length: 8 }) : movies).map((m, i) => (
            <Grid item xs={6} sm={4} md={3} key={m?.id || i}>
              {loading ? (
                <Card sx={{ borderRadius: 2 }}>
                  <Skeleton variant="rectangular" height={240} />
                  <CardContent>
                    <Skeleton width="80%" />
                    <Skeleton width="60%" />
                  </CardContent>
                </Card>
              ) : (
                <MovieCard movie={m} onClick={handleSelectMovie} />
              )}
            </Grid>
          ))}
        </Grid>

        {!loading && movies.length === 0 && (
          <Typography sx={{ mt: 4 }} color="text.secondary">
            No movies found for "{query}"
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default SearchPage;
