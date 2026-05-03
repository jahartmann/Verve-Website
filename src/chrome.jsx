// Shared chrome: theme tokens, base styles, nav, footer

const TWEAK_DEFAULTS_SHARED = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "accent": "bordeaux"
}/*EDITMODE-END*/;

const ACCENTS_SITE = {
  bordeaux: { c: "#7A1F2B", c2: "#a93341", deep: "#4d1119", name: "Bordeaux" },
  ink:      { c: "#1E3A8A", c2: "#3d62b5", deep: "#0f1d44", name: "Tinte" },
  graphite: { c: "#3a4554", c2: "#5b6878", deep: "#1f2937", name: "Graphit" },
  sage:     { c: "#3F6B3A", c2: "#5e8d57", deep: "#1f3520", name: "Salbei" },
  amber:    { c: "#B8602B", c2: "#d18244", deep: "#5c3015", name: "Bernstein" },
};

const VERVE_DOWNLOAD_URL = "https://vervewriter.de/downloads/Verve-latest.dmg";
const VERVE_DOWNLOAD_EVENT_URL = "";

function applyTheme(tweaks) {
  document.documentElement.setAttribute("data-theme", tweaks.theme);
  const a = ACCENTS_SITE[tweaks.accent] || ACCENTS_SITE.bordeaux;
  document.documentElement.style.setProperty("--accent", a.c);
  document.documentElement.style.setProperty("--accent-2", a.c2);
  document.documentElement.style.setProperty("--accent-deep", a.deep);
}

function trackVerveDownload(source) {
  if (typeof window.plausible === "function") {
    window.plausible("Download", { props: { item: "Verve-latest.dmg", source } });
  }

  if (window.umami && typeof window.umami.track === "function") {
    window.umami.track("Download", { item: "Verve-latest.dmg", source });
  }

  if (!VERVE_DOWNLOAD_EVENT_URL) return;

  const payload = JSON.stringify({
    event: "download",
    item: "Verve-latest.dmg",
    source,
    path: window.location.pathname,
    at: new Date().toISOString(),
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(VERVE_DOWNLOAD_EVENT_URL, new Blob([payload], { type: "application/json" }));
    return;
  }

  fetch(VERVE_DOWNLOAD_EVENT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {});
}

function SiteNav({ active }) {
  const links = [
    { href: "warum-verve.html", label: "Warum Verve" },
    { href: "features.html", label: "Funktionen" },
    { href: "ki.html", label: "KI" },
    { href: "datenschutz.html", label: "Datenschutz" },
  ];
  return (
    <nav className="snav">
      <div className="snav-inner">
        <a href="index.html" className="brand">
          <span className="brand-mark">V</span>
          <span>Verve</span>
          <span className="brand-beta">Beta</span>
        </a>
        <div className="snav-links">
          {links.map(l => (
            <a key={l.href} href={l.href} className={active === l.href ? "snav-link snav-link-active" : "snav-link"}>{l.label}</a>
          ))}
          <a href={VERVE_DOWNLOAD_URL} className="snav-cta" download onClick={() => trackVerveDownload("nav")}>
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M8 1.5v9m0 0L4.5 7M8 10.5L11.5 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 13.5h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            Laden
          </a>
        </div>
      </div>
      <style>{`
        .snav {
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 100;
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          background: color-mix(in srgb, var(--bg) 72%, transparent);
          border-bottom: 0.5px solid var(--rule);
        }
        .snav-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 12px 32px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .brand { display: flex; align-items: center; gap: 11px; font-family: var(--serif); font-size: 19px; font-weight: 600; letter-spacing: -0.01em; }
        .brand-mark {
          width: 26px; height: 26px;
          border-radius: 7px;
          background: linear-gradient(135deg, var(--accent-2), var(--accent) 60%, var(--accent-deep));
          display: grid; place-items: center;
          color: #fff;
          font-family: var(--serif);
          font-style: italic;
          font-weight: 600;
          font-size: 16px;
          box-shadow: 0 0 0 0.5px rgba(255,255,255,0.12), 0 6px 18px -4px rgba(0,0,0,0.4);
        }
        .brand-beta {
          display: inline-flex;
          align-items: center;
          height: 19px;
          padding: 0 8px;
          border: 0.5px solid color-mix(in srgb, var(--accent) 55%, var(--rule-strong));
          border-radius: 999px;
          color: var(--accent);
          background: color-mix(in srgb, var(--accent) 9%, transparent);
          font-family: var(--mono);
          font-size: 9.5px;
          font-weight: 500;
          letter-spacing: 0.08em;
          line-height: 1;
          text-transform: uppercase;
        }
        .snav-links { display: flex; gap: 28px; align-items: center; font-size: 13.5px; }
        .snav-link { color: var(--ink-dim); transition: color 0.2s; }
        .snav-link:hover, .snav-link-active { color: var(--ink); }
        .snav-cta {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 14px;
          border: 0.5px solid var(--rule-strong);
          border-radius: 999px;
          color: var(--ink);
          font-size: 13px;
          transition: all 0.2s;
        }
        .snav-cta:hover { border-color: var(--accent); color: var(--accent); }
        @media (max-width: 720px) {
          .snav-link { display: none; }
        }
      `}</style>
    </nav>
  );
}

function SiteFooter() {
  return (
    <footer className="sft">
      <div className="container sft-inner">
        <div className="sft-brand">
          <div className="brand-mark">V</div>
          <div>
            <div style={{fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 600}}>Verve</div>
            <div style={{fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2}}>Werkstatt für Autoren</div>
          </div>
        </div>
        <div className="sft-cols">
          <div>
            <div className="foot-label">Produkt</div>
            <a href="features.html">Funktionen</a>
            <a href="warum-verve.html">Warum Verve</a>
            <a href="ki.html">KI</a>
            <a href="datenschutz.html">Datenschutz</a>
            <a href={VERVE_DOWNLOAD_URL} download onClick={() => trackVerveDownload("footer")}>Download</a>
          </div>
          <div>
            <div className="foot-label">Rechtliches</div>
            <a href="impressum.html">Impressum</a>
            <a href="datenschutz.html">Datenschutz</a>
          </div>
        </div>
      </div>
      <div className="sft-bottom">
        <div className="container sft-bot">
          <span>© 2026 Janik Hartmann</span>
          <a href="impressum.html" style={{color:"inherit",opacity:0.6}}>Impressum</a>
        </div>
      </div>
      <style>{`
        .sft { border-top: 0.5px solid var(--rule); padding-top: 64px; margin-top: 80px; }
        .sft-inner { display: grid; grid-template-columns: 1fr 2fr; gap: 56px; padding-bottom: 56px; }
        @media (max-width: 720px) { .sft-inner { grid-template-columns: 1fr; gap: 32px; } }
        .sft-brand { display: flex; gap: 14px; align-items: flex-start; }
        .sft-cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
        @media (max-width: 720px) { .sft-cols { grid-template-columns: 1fr 1fr; } }
        .sft-cols > div { display: flex; flex-direction: column; gap: 8px; }
        .foot-label { font-family: var(--mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-faint); margin-bottom: 6px; }
        .sft-cols a, .sft-cols span { font-size: 13.5px; color: var(--ink-dim); transition: color 0.2s; }
        .sft-cols a:hover { color: var(--accent); }
        .sft-bottom { border-top: 0.5px solid var(--rule); padding: 22px 0; font-family: var(--mono); font-size: 11px; color: var(--ink-faint); letter-spacing: 0.04em; }
        .sft-bot { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
      `}</style>
    </footer>
  );
}

// Apple-style hero card: big screenshot + text under it
function FeatureCard({ eyebrow, title, sub, route, focusMode = false, hideInspector = true, dark = true, accent = "bordeaux", children, tall = false }) {
  const wrapRef = React.useRef(null);
  const [scale, setScale] = React.useState(1);
  React.useEffect(() => {
    function update() {
      const el = wrapRef.current;
      if (!el) return;
      setScale(Math.max(0.18, Math.min(1, (el.clientWidth - 32) / 1280)));
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <article className="fcard">
      <header className="fcard-head">
        <span className="eyebrow eyebrow-line">{eyebrow}</span>
        <h2 className="fcard-title">{title}</h2>
        <p className="fcard-sub">{sub}</p>
        {children && <div className="fcard-extra">{children}</div>}
      </header>
      <div className="fcard-shot" ref={wrapRef}>
        <div className="fcard-shot-frame" style={{ height: 800 * scale }}>
          <div className="fcard-shot-inner" style={{ transform: `translateX(-50%) scale(${scale})` }}>
            <VerveApp route={route} focusMode={focusMode} hideInspector={hideInspector} dark={dark} accent={accent} />
          </div>
        </div>
      </div>
      <style>{`
        .fcard {
          padding: 80px 0;
          border-bottom: 0.5px solid var(--rule);
        }
        .fcard:last-child { border-bottom: 0; }
        .fcard-head { max-width: 720px; margin: 0 auto 56px; text-align: center; }
        .fcard-title {
          font-family: var(--serif);
          font-size: clamp(36px, 4.5vw, 56px);
          line-height: 1.05;
          letter-spacing: -0.03em;
          font-weight: 500;
          margin: 18px 0 18px;
        }
        .fcard-sub {
          font-family: var(--serif);
          font-weight: 300;
          font-size: 19px;
          color: var(--ink-dim);
          line-height: 1.55;
          margin: 0 auto;
          max-width: 56ch;
        }
        .fcard-extra { margin-top: 28px; }
        .fcard-shot {
          position: relative;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 16px;
        }
        .fcard-shot-frame {
          position: relative;
          width: 100%;
          overflow: hidden;
        }
        .fcard-shot-inner {
          position: absolute;
          top: 0;
          left: 50%;
          width: 1280px;
          height: 800px;
          transform-origin: top center;
        }
      `}</style>
    </article>
  );
}

Object.assign(window, { TWEAK_DEFAULTS_SHARED, ACCENTS_SITE, VERVE_DOWNLOAD_URL, VERVE_DOWNLOAD_EVENT_URL, applyTheme, trackVerveDownload, SiteNav, SiteFooter, FeatureCard });
