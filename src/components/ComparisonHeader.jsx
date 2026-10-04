import { ArrowLeftRight, ExternalLink } from "lucide-react";
import { backdropUrl, imageUrl } from "../services/tmdb";
import React, { useEffect, useMemo, useState } from "react";
export default function ComparisonHeader({ left, right, onSwap }) {
  const renderPanel = (item) => (
    <div className="hero-title">
      <div className="hero-poster-wrap">
        <img className="hero-poster" src={imageUrl(item.poster_path, "w500")} alt={item.display_title} />
      </div>
      <div className="hero-copy">
        <span className="media-pill">{item.media_type === "movie" ? "MOVIE" : "TV SHOW"}</span>
        <h2>{item.display_title}</h2>
        <p>{(item.release_date || item.first_air_date || "").slice(0, 4) || "—"} · {item.vote_average?.toFixed?.(1) || "—"} / 10</p>
        <a href={`https://www.themoviedb.org/${item.media_type}/${item.id}`} target="_blank" rel="noreferrer">
          View on TMDB <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );

  return (
    <div className="comparison-hero">
      <div className="hero-backdrop backdrop-left" style={{ backgroundImage: `url(${backdropUrl(left.backdrop_path, "w1280")})` }} />
      <div className="hero-backdrop backdrop-right" style={{ backgroundImage: `url(${backdropUrl(right.backdrop_path, "w1280")})` }} />
      <div className="hero-content">
        {renderPanel(left)}
        <button className="swap-button" onClick={onSwap} title="Swap titles" aria-label="Swap titles">
          <ArrowLeftRight size={20} />
        </button>
        {renderPanel(right)}
      </div>
    </div>
  );
}
