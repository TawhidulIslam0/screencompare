const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

const token = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;
async function request(path, params = {}) {
  if (!token) {
    throw new Error("Missing TMDB token. Add VITE_TMDB_READ_ACCESS_TOKEN to your .env file.");
  }

  const query = new URLSearchParams(params);
  const response = await fetch(`${BASE_URL}${path}?${query}`, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    let message = `TMDB request failed (${response.status})`;
    try {
      const body = await response.json();
      if (body.status_message) message = body.status_message;
    } catch {}
    throw new Error(message);
  }

  return response.json();
}

export function imageUrl(path, size = "w500") {
  return path ? `${IMAGE_BASE}/${size}${path}` : null;
}

export function backdropUrl(path, size = "original") {
  return path ? `${IMAGE_BASE}/${size}${path}` : null;
}

export async function searchAll(query) {
  if (!query.trim()) return [];
  const [movies, tv] = await Promise.all([
    request("/search/movie", { query, include_adult: "false", language: "en-US", page: 1 }),
    request("/search/tv", { query, include_adult: "false", language: "en-US", page: 1 })
  ]);

  const movieResults = movies.results.slice(0, 6).map((item) => ({
    ...item,
    media_type: "movie",
    display_title: item.title,
    display_date: item.release_date
  }));

  const tvResults = tv.results.slice(0, 6).map((item) => ({
    ...item,
    media_type: "tv",
    display_title: item.name,
    display_date: item.first_air_date
  }));

  return [...movieResults, ...tvResults]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 10);
}

export async function getDetails(item) {
  const [detailsRes, recsRes] = await Promise.all([
    request(`/${item.media_type}/${item.id}`, {
      language: "en-US",
      append_to_response: "credits"
    }),
    request(`/${item.media_type}/${item.id}/recommendations`, {
      language: "en-US",
      page: 1
    })
  ]);

  const sourceGenres = new Set((detailsRes.genres || []).map(g => g.id));
  const sourceTitle = detailsRes.title || detailsRes.name || "";
  
  // Clean up source title to find core franchise name (e.g., "JoJo's Bizarre Adventure" from "JoJo's Bizarre Adventure: Stardust Crusaders")
  const coreFranchise = sourceTitle.split(/[:\-\u2013\u2014]/)[0].trim().toLowerCase();
  const franchiseKeywords = coreFranchise.split(" ").filter(word => word.length > 2);

  const scoredRecs = (recsRes.results || []).map(rec => {
    let score = 0;
    const recTitle = rec.title || rec.name || "";
    const recTitleLower = recTitle.toLowerCase();
    const recGenres = rec.genre_ids || [];

    // 1. Direct Franchise / Universe Match (Highest Priority for multi-part shows/movies)
    if (franchiseKeywords.some(keyword => recTitleLower.includes(keyword))) {
      score += 100; // Massive boost so other seasons/parts/movies of the same show appear first!
    }

    // 2. Genre overlap score for thematic similarity
    const matchingGenres = recGenres.filter(id => sourceGenres.has(id)).length;
    score += matchingGenres * 5;

    // 3. Popularity balance
    score += Math.log10((rec.vote_count || 1) + 1) * 0.5;

    return { ...rec, relevanceScore: score };
  });

  // Sort by our calculated franchise + genre accuracy score descending
  scoredRecs.sort((a, b) => b.relevanceScore - a.relevanceScore);

  detailsRes.recommendations = scoredRecs.slice(0, 6).map((rec) => ({
    ...rec,
    media_type: item.media_type,
    display_title: rec.title || rec.name,
    display_date: rec.release_date || rec.first_air_date
  }));

  return detailsRes;
}

export async function getRecommendations(item) {
  try {
    const data = await request(`/${item.media_type}/${item.id}/recommendations`, {
      language: "en-US",
      page: 1
    });
    return data.results.slice(0, 6).map((rec) => ({
      ...rec,
      media_type: item.media_type,
      display_title: rec.title || rec.name,
      display_date: rec.release_date || rec.first_air_date
    }));
  } catch {
    return [];
  }
}

