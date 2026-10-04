import React, { useEffect, useMemo, useState } from "react";
export default function Overview({ left, right }) {
  return (
    <section className="detail-section">
      <div className="section-title">
        <span className="eyebrow">OVERVIEWS</span>
        <h3>The story</h3>
      </div>
      <div className="overview-grid">
        <article><p>{left.overview || "No overview available."}</p></article>
        <article><p>{right.overview || "No overview available."}</p></article>
      </div>
    </section>
  );
}
