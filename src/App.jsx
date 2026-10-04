import React, { useEffect, useMemo, useState } from "react";
import { Film, Moon, Sun, Sparkles, RotateCcw, AlertTriangle } from "lucide-react";
import SearchPicker from "./components/SearchPicker";
import ComparisonHeader from "./components/ComparisonHeader";
import ComparisonTable from "./components/ComparisonTable";
import Cast from "./components/Cast";
import Overview from "./components/Overview";
import Recommendations from "./components/Recommendations";
import { getDetails, searchAll } from "./services/tmdb";

const starterLeft = {
  id: 0,
  media_type: "movie",
  display_title: "Choose a title",
  poster_path: null,
  backdrop_path: null
};

function App() {
  const [leftSelection, setLeftSelection] = useState(null);
  const [rightSelection, setRightSelection] = useState(null);
  const [leftDetails, setLeftDetails] = useState(null);
  const [rightDetails, setRightDetails] = useState(null);
  const [leftQuery, setLeftQuery] = useState("");
  const [rightQuery, setRightQuery] = useState("");
  const [leftResults, setLeftResults] = useState([]);
  const [rightResults, setRightResults] = useState([]);
  const [leftLoading, setLeftLoading] = useState(false);
  const [rightLoading, setRightLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");
  const [dark, setDark] = useState(() => localStorage.getItem("screencompare-theme") !== "light");

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("screencompare-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      if (!leftQuery.trim() || leftSelection) {
        setLeftResults([]);
        return;
      }
      setLeftLoading(true);
      try {
        setLeftResults(await searchAll(leftQuery));
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLeftLoading(false);
      }
    }, 350);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [leftQuery, leftSelection]);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      if (!rightQuery.trim() || rightSelection) {
        setRightResults([]);
        return;
      }
      setRightLoading(true);
      try {
        setRightResults(await searchAll(rightQuery));
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setRightLoading(false);
      }
    }, 350);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [rightQuery, rightSelection]);

  async function choose(side, item) {
    setError("");
    if (side === "left") {
      setLeftSelection(item);
      setLeftQuery("");
    } else {
      setRightSelection(item);
      setRightQuery("");
    }
    const targetLeft = side === "left" ? item : leftSelection;
    const targetRight = side === "right" ? item : rightSelection;
    
    if (targetLeft && targetRight) {
      setDetailsLoading(true);
      try {
        const [a, b] = await Promise.all([getDetails(targetLeft), getDetails(targetRight)]);
        a.media_type = targetLeft.media_type;
        a.display_title = targetLeft.display_title;
        b.media_type = targetRight.media_type;
        b.display_title = targetRight.display_title;
        setLeftDetails(a);
        setRightDetails(b);
      } catch (e) {
        setError(e.message);
      } finally {
        setDetailsLoading(false);
      }
    }
  }

  async function refreshComparison(a = leftSelection, b = rightSelection) {
    if (!a || !b) return;
    setDetailsLoading(true);
    setError("");
    try {
      const [left, right] = await Promise.all([getDetails(a), getDetails(b)]);
      left.media_type = a.media_type;
      left.display_title = a.display_title;
      right.media_type = b.media_type;
      right.display_title = b.display_title;
      setLeftDetails(left);
      setRightDetails(right);
    } catch (e) {
      setError(e.message);
    } finally {
      setDetailsLoading(false);
    }
  }

  function clearSide(side) {
    if (side === "left") {
      setLeftSelection(null);
      setLeftDetails(null);
      setLeftQuery("");
    } else {
      setRightSelection(null);
      setRightDetails(null);
      setRightQuery("");
    }
  }

  async function swap() {
    const a = leftSelection;
    const b = rightSelection;
    const detailsA = leftDetails;
    const detailsB = rightDetails;
    setLeftSelection(b);
    setRightSelection(a);
    setLeftDetails(detailsB);
    setRightDetails(detailsA);
  }

  const ready = Boolean(leftDetails && rightDetails);
  const heroLeft = leftDetails || leftSelection;
  const heroRight = rightDetails || rightSelection;

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#">
          <span className="brand-mark"><Film size={20} /></span>
          <span>Screen<span>Compare</span></span>
        </a>
        <div className="top-actions">
          <button className="theme-button" onClick={() => setDark(!dark)}>
            {dark ? <Sun size={17} /> : <Moon size={17} />}
            {dark ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      <main>
        <section className="intro">
          <div>
            <div className="eyebrow intro-kicker"><Sparkles size={14} /> LIVE TMDB DATA</div>
            <h1>Compare what<br /><em>you watch.</em></h1>
            <p>Pick any two movies or TV shows and put their stats, cast, story, and production details head-to-head.</p>
          </div>
        </section>

        <section className="pickers">
          <SearchPicker label="TITLE ONE" selected={leftSelection} onSelect={(x) => choose("left", x)} onClear={() => clearSide("left")} query={leftQuery} setQuery={setLeftQuery} results={leftResults} loading={leftLoading} activeSide={!leftSelection} />
          <div className="versus">VS</div>
          <SearchPicker label="TITLE TWO" selected={rightSelection} onSelect={(x) => choose("right", x)} onClear={() => clearSide("right")} query={rightQuery} setQuery={setRightQuery} results={rightResults} loading={rightLoading} activeSide={!rightSelection} />
        </section>

        {error && (
          <div className="error-banner">
            <AlertTriangle size={18} />
            <span>{error}</span>
            <button onClick={() => setError("")}>Dismiss</button>
          </div>
        )}

        {!ready ? (
          <section className="empty-state">
            <div className="empty-icon"><Film size={30} /></div>
            <h2>Your comparison starts here.</h2>
            <p>Search above for two titles. Everything below will be populated from TMDB automatically.</p>
            {detailsLoading && <div className="loading-line">Loading title data…</div>}
          </section>
        ) : (
          <section className="comparison-area">
            {detailsLoading && <div className="refresh-overlay">Updating comparison…</div>}
            <ComparisonHeader left={heroLeft} right={heroRight} onSwap={swap} />

            <div className="compare-label">
              <div>
                <span className="eyebrow">HEAD TO HEAD</span>
                <h2>By the numbers</h2>
              </div>
              <button className="refresh-button" onClick={() => refreshComparison()}><RotateCcw size={16} /> Refresh data</button>
            </div>

            <ComparisonTable left={leftDetails} right={rightDetails} />
            <Overview left={leftDetails} right={rightDetails} />
            <Cast left={leftDetails} right={rightDetails} />
            <Recommendations left={leftDetails} right={rightDetails} onSelect={choose} />
          </section>
        )}
      </main>

      <footer>
        <span>ScreenCompare</span>
        <span>Data provided by TMDB · Not endorsed or certified by TMDB</span>
      </footer>
    </div>
  );
}

export default App;