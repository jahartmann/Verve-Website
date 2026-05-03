// Hero — Apple-style: tight headline, real app preview, scroll-driven reveal

const HERO_LINES = [
  { de: "Sie öffnete das Fenster, und der Nebel kam herein.", meta: "Kapitel 3 · Szene 12" },
  { de: "Aelara wusste, dass die Krähe kein Tier mehr war.", meta: "Werk: Die Eiserne Stunde" },
  { de: "Drei Tage, sagte er. Drei Tage, dann sind wir in Lichtenfels.", meta: "Dialog · Kapitel 7" },
];

function Hero({ heroMode }) {
  const [routeIdx, setRouteIdx] = React.useState(0);
  const routes = ["editor", "characters", "world", "chat"];
  const routeLabels = ["Editor", "Figuren", "Welt", "Wissens-Chat"];

  // gentle auto-cycle of preview routes
  React.useEffect(() => {
    const t = setInterval(() => setRouteIdx(i => (i + 1) % routes.length), 5200);
    return () => clearInterval(t);
  }, []);

  // measure container for preview scaling
  const wrapRef = React.useRef(null);
  const [scale, setScale] = React.useState(0.62);
  React.useEffect(() => {
    function update() {
      const el = wrapRef.current;
      if (!el) return;
      const w = el.clientWidth;
      setScale(Math.min(1, w / 1280));
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <section className="hero" data-screen-label="01 Hero">
      <div className="hero-glow" />
      <div className="container hero-inner">
        <div className="hero-eyebrow">
          <span className="eyebrow">macOS Sequoia · Universal · Open Source</span>
        </div>

        <h1 className="hero-title">
          Schreibe das ganze Werk.<br />
          <span className="hero-title-italic">Nicht nur das Dokument.</span>
        </h1>

        <p className="hero-sub">
          Verve hält Reihen, Bücher, Kapitel und Szenen zusammen — mit Figuren,
          Orten und einer KI, die <em>dein</em> Werk kennt. Lokal. Ohne Cloud-Zwang.
        </p>

        <div className="hero-cta">
          <a href="https://github.com/jahartmann/Verve/releases" className="btn btn-primary">
            <DownloadGlyph />
            Verve laden
          </a>
          <a href="#features" className="btn-link">
            Alle Funktionen ansehen <span className="arr">→</span>
          </a>
        </div>

        <div className="hero-meta">
          <span>macOS 14+</span>
          <span className="dot">·</span>
          <span>Apple Silicon &amp; Intel</span>
          <span className="dot">·</span>
          <span>~ 24 MB</span>
          <span className="dot">·</span>
          <span>kostenlos</span>
        </div>
      </div>

      {/* Real app preview */}
      <div className="hero-preview-wrap" ref={wrapRef}>
        <div className="hero-preview-tabs">
          {routes.map((r, i) => (
            <button
              key={r}
              className={`hpt ${i === routeIdx ? "hpt-active" : ""}`}
              onClick={() => setRouteIdx(i)}
            >
              {routeLabels[i]}
            </button>
          ))}
        </div>
        <div className="hero-preview-frame" style={{ height: 800 * scale }}>
          <div className="hero-preview-inner" style={{ transform: `scale(${scale})` }}>
            <VerveApp route={routes[routeIdx]} dark={true} accent="bordeaux" />
          </div>
          <div className="hero-preview-floor" />
        </div>
      </div>

      <style>{`
        .hero {
          position: relative;
          padding-top: 130px;
          padding-bottom: 0;
          overflow: hidden;
        }
        .hero-glow {
          position: absolute;
          top: -200px; left: 50%;
          transform: translateX(-50%);
          width: 1200px; height: 800px;
          pointer-events: none;
          background:
            radial-gradient(ellipse at center, rgba(122,31,43,0.22), transparent 60%);
          filter: blur(40px);
          z-index: 0;
        }
        .hero-inner { position: relative; z-index: 2; text-align: center; max-width: 880px; }
        .hero-eyebrow { animation: fadeUp 0.9s 0.1s both; }
        .eyebrow { justify-content: center; }
        .eyebrow::before { display: none; }
        .eyebrow {
          display: inline-block;
          padding: 5px 14px;
          background: var(--rule);
          border: 0.5px solid var(--rule-strong);
          border-radius: 999px;
          color: var(--ink-dim);
          letter-spacing: 0.1em;
        }
        .hero-title {
          font-size: clamp(44px, 7vw, 88px);
          line-height: 1.04;
          margin: 26px 0 22px;
          font-weight: 500;
          letter-spacing: -0.035em;
          animation: fadeUp 1s 0.2s both;
        }
        .hero-title-italic {
          font-style: italic;
          font-weight: 300;
          color: var(--ink-dim);
        }
        .hero-sub {
          font-family: var(--serif);
          font-weight: 300;
          font-size: clamp(18px, 1.5vw, 22px);
          color: var(--ink-dim);
          max-width: 56ch;
          line-height: 1.55;
          margin: 0 auto 36px;
          animation: fadeUp 1s 0.4s both;
        }
        .hero-sub em { color: var(--ink); font-style: italic; }
        .hero-cta {
          display: flex; gap: 24px; align-items: center; justify-content: center;
          animation: fadeUp 1s 0.55s both;
        }
        .btn-link {
          color: var(--accent);
          font-size: 15px;
          font-weight: 500;
          display: inline-flex; align-items: center; gap: 6px;
          transition: gap 0.2s;
        }
        .btn-link:hover { gap: 10px; }
        .btn-link .arr { transition: transform 0.2s; }
        .hero-meta {
          margin-top: 24px;
          font-family: var(--mono);
          font-size: 11px;
          color: var(--ink-faint);
          letter-spacing: 0.08em;
          display: inline-flex; gap: 10px; flex-wrap: wrap; justify-content: center;
          animation: fadeUp 1s 0.7s both;
        }
        .hero-meta .dot { opacity: 0.5; }

        .hero-preview-wrap {
          position: relative;
          margin-top: 80px;
          z-index: 2;
          animation: fadeUp 1.2s 0.8s both;
        }
        .hero-preview-tabs {
          display: flex; gap: 4px; justify-content: center;
          margin-bottom: 24px;
          padding: 4px;
          background: var(--bg-2);
          border: 0.5px solid var(--rule-strong);
          border-radius: 10px;
          width: fit-content;
          margin-left: auto; margin-right: auto;
        }
        .hpt {
          padding: 6px 14px;
          background: transparent;
          border: 0;
          border-radius: 7px;
          color: var(--ink-dim);
          font-size: 13px;
          font-family: inherit;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .hpt:hover { color: var(--ink); }
        .hpt-active {
          background: var(--accent);
          color: white;
        }
        .hero-preview-frame {
          position: relative;
          margin: 0 auto;
          max-width: 1280px;
          padding: 0 32px;
        }
        .hero-preview-inner {
          transform-origin: top center;
          margin: 0 auto;
          width: 1280px;
          position: relative;
          z-index: 2;
        }
        .hero-preview-floor {
          position: absolute;
          left: 0; right: 0; bottom: -40px;
          height: 200px;
          background: linear-gradient(180deg, transparent, var(--bg));
          pointer-events: none;
          z-index: 3;
        }
      `}</style>
    </section>
  );
}

function DownloadGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5v9m0 0L4.5 7M8 10.5L11.5 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 13.5h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

window.Hero = Hero;
window.DownloadGlyph = DownloadGlyph;
