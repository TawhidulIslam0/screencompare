# ScreenCompare

**A fully dynamic React application for comparing movies and TV shows side by side using the TMDB API.

**Live Application:** [screencompare1.vercel.app](https://screencompare1.vercel.app)

## Features

- Live TMDB search for movies and TV shows
- Compare two titles side by side
- Movie vs movie, TV vs TV, and movie vs TV
- Dynamic statistics based on the selected content type
- Budget and revenue for movies
- Seasons, episodes, networks, and episode runtime for TV
- Cast, genres, production companies, languages, ratings, popularity, and status
- Responsive layout
- Light/dark mode
- Loading, error, and empty states
- No hardcoded movie/show data
- TMDB image CDN integration

## Setup

1. Create a TMDB account and obtain an API Read Access Token.
2. Copy `.env.example` to `.env`.
3. Put your token in:

```env
VITE_TMDB_READ_ACCESS_TOKEN=your_token_here
```

4. Install dependencies:

```bash
npm install
```

5. Start the development server:

```bash
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## TMDB

This product uses the TMDB API but is not endorsed or certified by TMDB.

TMDB API documentation:
https://developer.themoviedb.org/docs/getting-started
