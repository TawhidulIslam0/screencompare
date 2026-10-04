import { Check, Minus, Trophy } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
function formatMoney(value) {
  if (!value) return "Not available";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function formatNumber(value) {
  if (value === null || value === undefined) return "Not available";
  return new Intl.NumberFormat("en-US").format(value);
}

function formatRuntime(item) {
  if (item.media_type === "movie") {
    return item.runtime ? `${item.runtime} min` : "Not available";
  }
  if (!item.episode_run_time?.length) return "Not available";
  return `${Math.round(item.episode_run_time.reduce((a, b) => a + b, 0) / item.episode_run_time.length)} min avg.`;
}

function join(values) {
  return values?.length ? values.join(", ") : "Not available";
}

function winner(a, b, type = "higher") {
  if (typeof a !== "number" || typeof b !== "number" || a === b) return null;
  return type === "lower" ? (a < b ? "left" : "right") : (a > b ? "left" : "right");
}

export default function ComparisonTable({ left, right }) {
  const rows = [
    { label: "Rating", left: left.vote_average, right: right.vote_average, display: (x) => x ? `${x.toFixed(1)} / 10` : "Not available", win: winner(left.vote_average, right.vote_average) },
    { label: "Vote count", left: left.vote_count, right: right.vote_count, display: formatNumber, win: winner(left.vote_count, right.vote_count) },
    { label: "Popularity", left: left.popularity, right: right.popularity, display: (x) => x ? x.toFixed(1) : "Not available", win: winner(left.popularity, right.popularity) },
    { label: "Genres", left: join(left.genres?.map((g) => g.name)), right: join(right.genres?.map((g) => g.name)) },
    { label: "Release / first air", left: left.release_date || left.first_air_date || "Not available", right: right.release_date || right.first_air_date || "Not available" },
    { label: "Runtime", left: formatRuntime(left), right: formatRuntime(right) },
    { label: "Status", left: left.status || "Not available", right: right.status || "Not available" },
    { label: "Original language", left: left.original_language?.toUpperCase() || "Not available", right: right.original_language?.toUpperCase() || "Not available" },
    { label: "Production companies", left: join(left.production_companies?.map((c) => c.name)), right: join(right.production_companies?.map((c) => c.name)) }
  ];

  if (left.media_type === "movie" && right.media_type === "movie") {
    rows.splice(5, 0,
      { label: "Budget", left: left.budget, right: right.budget, display: formatMoney, win: winner(left.budget, right.budget) },
      { label: "Revenue", left: left.revenue, right: right.revenue, display: formatMoney, win: winner(left.revenue, right.revenue) },
      { label: "Profit", left: left.revenue && left.budget ? left.revenue - left.budget : null, right: right.revenue && right.budget ? right.revenue - right.budget : null, display: formatMoney, win: winner(left.revenue - left.budget, right.revenue - right.budget) }
    );
  }

  if (left.media_type === "tv" || right.media_type === "tv") {
    rows.splice(5, 0,
      { label: "Seasons", left: left.media_type === "tv" ? left.number_of_seasons : null, right: right.media_type === "tv" ? right.number_of_seasons : null, display: (x) => x ? formatNumber(x) : "Not applicable", win: winner(left.number_of_seasons, right.number_of_seasons) },
      { label: "Episodes", left: left.media_type === "tv" ? left.number_of_episodes : null, right: right.media_type === "tv" ? right.number_of_episodes : null, display: (x) => x ? formatNumber(x) : "Not applicable", win: winner(left.number_of_episodes, right.number_of_episodes) },
      { label: "Networks", left: join(left.networks?.map((n) => n.name)), right: join(right.networks?.map((n) => n.name)) }
    );
  }

  return (
    <div className="comparison-table">
      <div className="table-head">
        <div>Metric</div>
        <div>{left.display_title}</div>
        <div>{right.display_title}</div>
      </div>
      {rows.map((row) => (
        <div className="table-row" key={row.label}>
          <div className="metric-name">{row.label}</div>
          <div className={row.win === "left" ? "winner-cell" : ""}>
            {row.win === "left" && <Trophy size={15} />}
            {row.display ? row.display(row.left) : row.left}
          </div>
          <div className={row.win === "right" ? "winner-cell" : ""}>
            {row.win === "right" && <Trophy size={15} />}
            {row.display ? row.display(row.right) : row.right}
          </div>
        </div>
      ))}
    </div>
  );
}
