// Main app shell + nav + tweaks integration

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "accent": "amber",
  "heroMode": "both",
  "showSerifTitles": true
}/*EDITMODE-END*/;

const ACCENTS = {
  amber:    { c: "#d4a25a", c2: "#f0c987", deep: "#8a6a2f", name: "Bernstein" },
  ink:      { c: "#9ec1d4", c2: "#c2e0ec", deep: "#4a6f7e", name: "Tinte" },
  burgundy: { c: "#c9637a", c2: "#e89aa9", deep: "#7a3045", name: "Burgund" },
  jade:     { c: "#7fb89a", c2: "#a8d4bb", deep: "#3d6651", name: "Jade" },
};

function Nav() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href="#" className="brand">
          <span className="brand-mark">V</span>
          <span>Verve</span>
        </a>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#ki">KI</a>
          <a href="#privacy">Datenschutz</a>
          <a href="#download" className="nav-cta">↓ Laden</a>
        </div>
      </div>
    </nav>
  );
}

function App() {
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  // Apply theme + accent
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", tweaks.theme);
    const a = ACCENTS[tweaks.accent] || ACCENTS.amber;
    const root = document.documentElement.style;
    root.setProperty("--accent", a.c);
    root.setProperty("--accent-2", a.c2);
    root.setProperty("--accent-deep", a.deep);
  }, [tweaks.theme, tweaks.accent]);

  return (
    <>
      <Nav />
      <window.Hero heroMode={tweaks.heroMode} />
      <div id="ki-anchor">
        <window.Features />
      </div>
      <span id="ki" />
      <window.AISection />
      <span id="privacy" />
      <window.Privacy />
      <window.Download />
      <window.Footer />

      <window.TweaksPanel>
        <window.TweakSection title="Erscheinung">
          <window.TweakRadio
            label="Modus"
            value={tweaks.theme}
            onChange={v => setTweak("theme", v)}
            options={[{value:"dark", label:"Dunkel"}, {value:"light", label:"Hell"}]}
          />
          <window.TweakRadio
            label="Akzent"
            value={tweaks.accent}
            onChange={v => setTweak("accent", v)}
            options={Object.entries(ACCENTS).map(([k,v]) => ({value: k, label: v.name}))}
          />
        </window.TweakSection>
        <window.TweakSection title="Hero-Animation">
          <window.TweakRadio
            label="Stil"
            value={tweaks.heroMode}
            onChange={v => setTweak("heroMode", v)}
            options={[
              {value:"both", label:"Beide"},
              {value:"typewriter", label:"Tipper"},
              {value:"constellation", label:"Konstellation"},
              {value:"off", label:"Aus"},
            ]}
          />
        </window.TweakSection>
      </window.TweaksPanel>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
