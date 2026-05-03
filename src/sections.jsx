// Features section + KI provider + Privacy + Download
// Using real VerveApp mockup (window.VerveApp) so feature reveals show actual UI.

const FEATURES = [
  {
    title: "Editor mit Werk-Bewusstsein",
    eyebrow: "Schreiben",
    desc: "Schreib in Ruhe — Verve erkennt Figuren und Orte im Text, verlinkt sie automatisch und hält Inspector und Welt synchron.",
    bullets: [
      "Wikilinks zu Figuren & Welt",
      "Inspector mit POV-Tracking, Wörterzielen",
      "Focus-Modus · ⌘.",
      "Ghost-Text-KI direkt im Feld",
    ],
    route: "editor",
  },
  {
    title: "Figuren als lebende Karten",
    eyebrow: "Werk-Wissen",
    desc: "Pflege Figuren mit Motiven, Konflikten, Beziehungen. Die KI schlägt Verbindungen vor — du bestätigst, was bleibt.",
    bullets: [
      "Smart-Import aus Notizen",
      "Beziehungen & Aliasse",
      "Pro Werk · pro Reihe",
      "Direkt verlinkt im Manuskript",
    ],
    route: "characters",
  },
  {
    title: "Welten, die zusammenhalten",
    eyebrow: "Welt bauen",
    desc: "Orte, Magie-Systeme, Fraktionen, Konzepte. Alles vernetzt, alles in der ⌘K-Palette auffindbar.",
    bullets: [
      "Vier Welt-Kategorien",
      "Cover, Felder, Querverweise",
      "KI-Vorschläge auf Anfrage",
      "Wikilinks aus dem Editor",
    ],
    route: "world",
  },
  {
    title: "Wissens-Chat über dein Werk",
    eyebrow: "RAG-Chat",
    desc: "Frag dein Manuskript: Was hat Aelara in Kap. 3 erfahren? Wer war beim Begräbnis? Antworten mit Quellen — direkt aus deinem Text.",
    bullets: [
      "Semantischer Index lokal",
      "Quellen pro Aussage",
      "Multi-Session-Chats",
      "Funktioniert mit Ollama",
    ],
    route: "chat",
  },
  {
    title: "Konsistenz, die mitdenkt",
    eyebrow: "Lektor",
    desc: "Verve scannt im Hintergrund nach Widersprüchen — Augenfarben, Zeitlinien, Namen. Keine harten Fehler mehr im Druck.",
    bullets: [
      "Hintergrund-Lektor",
      "Severity-Stufen mit Vorschlag",
      "Springe zu A · B im Text",
      "Stil-Reviewer auf Knopfdruck",
    ],
    route: "consistency",
  },
];

function Features() {
  const [active, setActive] = React.useState(0);
  const f = FEATURES[active];

  // measure preview wrap for scaling
  const wrapRef = React.useRef(null);
  const [scale, setScale] = React.useState(1);
  React.useEffect(() => {
    function update() {
      const el = wrapRef.current;
      if (!el) return;
      setScale(Math.min(1, el.clientWidth / 1280));
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <section id="features" className="section-pad" data-screen-label="02 Features">
      <div className="container">
        <div className="features-head">
          <span className="eyebrow eyebrow-line">Funktionen</span>
          <h2 className="section-title">
            Ein Fenster.<br/>
            <em>Dein ganzes Werk.</em>
          </h2>
          <p className="section-sub">
            Verve trennt nicht zwischen Schreiben und Strukturieren — Editor,
            Figuren, Welt und Lektor leben im selben Raum, bleiben synchron, und gehen
            dir nicht im Weg.
          </p>
        </div>

        <div className="features-grid">
          <div className="features-list">
            {FEATURES.map((feat, i) => (
              <button
                key={feat.title}
                className={`feat ${active === i ? 'feat-active' : ''}`}
                onClick={() => setActive(i)}
              >
                <div className="feat-num">0{i+1}</div>
                <div className="feat-body">
                  <div className="feat-eyebrow">{feat.eyebrow}</div>
                  <div className="feat-title">{feat.title}</div>
                </div>
                <div className="feat-bar"/>
              </button>
            ))}
          </div>

          <div className="features-preview" ref={wrapRef}>
            <div className="features-narrative">
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <ul className="feat-bullets">
                {f.bullets.map(b => (
                  <li key={b}>
                    <span className="bullet-dot" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="feat-frame" style={{ height: 800 * scale }}>
              <div className="feat-frame-inner" style={{ transform: `scale(${scale})` }}>
                <VerveApp route={f.route} dark={true} accent="bordeaux" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .features-head { max-width: 720px; margin-bottom: 72px; }
        .eyebrow-line {
          display: inline-flex !important;
          padding: 0 !important;
          background: transparent !important;
          border: 0 !important;
          letter-spacing: 0.18em;
        }
        .eyebrow-line::before {
          content: "";
          display: inline-block !important;
          width: 24px;
          height: 1px;
          background: var(--accent);
          margin-right: 10px;
        }
        .section-title {
          font-size: clamp(40px, 5.2vw, 72px);
          line-height: 1.04;
          letter-spacing: -0.035em;
          font-weight: 500;
          margin: 16px 0 22px;
        }
        .section-title em { font-style: italic; font-weight: 300; color: var(--ink-dim); }
        .section-sub {
          font-family: var(--serif);
          font-weight: 300;
          font-size: 20px;
          color: var(--ink-dim);
          line-height: 1.55;
          max-width: 60ch;
        }

        .features-grid {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 48px;
          align-items: start;
        }
        @media (max-width: 1100px) { .features-grid { grid-template-columns: 1fr; } }

        .features-list {
          display: flex; flex-direction: column;
          position: sticky; top: 90px;
        }
        .feat {
          position: relative;
          display: grid;
          grid-template-columns: 28px 1fr;
          gap: 14px;
          padding: 18px 0;
          background: transparent;
          border: 0;
          border-top: 0.5px solid var(--rule);
          text-align: left;
          cursor: pointer;
          color: var(--ink-dim);
          transition: color 0.3s;
          font-family: inherit;
        }
        .feat:last-child { border-bottom: 0.5px solid var(--rule); }
        .feat:hover { color: var(--ink); }
        .feat-active { color: var(--ink); }
        .feat-num {
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 0.1em;
          color: var(--ink-faint);
          padding-top: 6px;
        }
        .feat-active .feat-num { color: var(--accent); }
        .feat-eyebrow {
          font-family: var(--mono);
          font-size: 10px;
          color: var(--ink-faint);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .feat-active .feat-eyebrow { color: var(--accent); }
        .feat-title { font-family: var(--serif); font-size: 19px; font-weight: 500; letter-spacing: -0.01em; line-height: 1.25; }
        .feat-bar {
          position: absolute; left: 0; top: -0.5px; height: 1.5px;
          background: var(--accent);
          width: 0;
          transition: width 0.5s cubic-bezier(0.2,0.8,0.2,1);
        }
        .feat-active .feat-bar { width: 100%; }

        .features-preview { position: relative; }
        .features-narrative {
          margin-bottom: 32px;
          max-width: 600px;
        }
        .features-narrative h3 {
          font-family: var(--serif);
          font-size: 28px;
          font-weight: 500;
          letter-spacing: -0.015em;
          margin: 0 0 12px;
        }
        .features-narrative p {
          font-family: var(--serif);
          font-weight: 300;
          font-size: 17px;
          color: var(--ink-dim);
          line-height: 1.6;
          margin: 0 0 20px;
        }
        .feat-bullets {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px 24px;
        }
        .feat-bullets li {
          font-size: 14px;
          color: var(--ink-dim);
          display: flex; gap: 8px; align-items: center;
        }
        .bullet-dot {
          width: 4px; height: 4px;
          background: var(--accent);
          border-radius: 50%;
          flex-shrink: 0;
        }

        .feat-frame {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
        }
        .feat-frame-inner {
          transform-origin: top left;
          width: 1280px;
        }
      `}</style>
    </section>
  );
}

// Capability strip — apple-style three-up between features and AI
function Capabilities() {
  const items = [
    { k: "⌘K", t: "Globale Palette", d: "Eine Tastenkombination — Werke, Figuren, Orte, Kapitel. Alles springt." },
    { k: "↻", t: "Auto-Versionen", d: "Verve schreibt im Hintergrund mit. Jede Sitzung ist eine Wiederholungsschleife." },
    { k: "✦", t: "Ghost-Text", d: "KI-Vorschläge inline — übernehmen, anhängen, verwerfen. Nie überschreiben." },
    { k: "⌥", t: "Wikilinks", d: "[[Aelara]] verlinkt automatisch zur Figur. Klick öffnet die Karte." },
  ];
  return (
    <section className="caps section-pad-sm" data-screen-label="02b Capabilities">
      <div className="container">
        <div className="caps-grid">
          {items.map(it => (
            <div key={it.t} className="cap-item">
              <div className="cap-k">{it.k}</div>
              <div className="cap-body">
                <div className="cap-t">{it.t}</div>
                <div className="cap-d">{it.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .section-pad-sm { padding: 80px 0 100px; }
        .caps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: var(--rule);
          border-top: 0.5px solid var(--rule);
          border-bottom: 0.5px solid var(--rule);
        }
        @media (max-width: 900px) { .caps-grid { grid-template-columns: repeat(2, 1fr); } }
        .cap-item {
          background: var(--bg);
          padding: 28px 24px;
          display: flex; gap: 16px; align-items: flex-start;
        }
        .cap-k {
          font-family: var(--serif);
          font-size: 28px;
          font-weight: 400;
          color: var(--accent);
          line-height: 1;
          flex-shrink: 0;
        }
        .cap-t { font-family: var(--serif); font-size: 16px; font-weight: 600; margin-bottom: 4px; }
        .cap-d { font-size: 13px; color: var(--ink-dim); line-height: 1.5; }
      `}</style>
    </section>
  );
}

// KI provider section
function AISection() {
  const [active, setActive] = React.useState("ollama");
  const providers = {
    ollama: {
      name: "Ollama",
      tag: "Lokal · empfohlen",
      desc: "Modelle laufen direkt auf deinem Mac. Kein Token, kein Upload, keine API. Dein Manuskript verlässt dein Gerät nicht.",
      models: ["llama3.1:8b", "mistral:7b", "qwen2.5:14b"],
      color: "#28c840",
    },
    openai: {
      name: "OpenAI",
      tag: "Optional · API-Key",
      desc: "Falls du GPT brauchst — der API-Key liegt im macOS-Keychain. Verve sendet nur deine Anfrage, niemals dein gesamtes Werk.",
      models: ["gpt-4o", "gpt-4o-mini", "o3-mini"],
      color: "#9ec1d4",
    },
    anthropic: {
      name: "Anthropic",
      tag: "Optional · API-Key",
      desc: "Claude für nuancierte literarische Arbeit. Wieder: Schlüssel im Keychain, nichts in der Cloud, nichts gespeichert.",
      models: ["claude-sonnet-4.5", "claude-opus-4", "claude-haiku-4.5"],
      color: "#c9a0d4",
    },
  };
  const p = providers[active];

  return (
    <section className="section-pad ai-section" data-screen-label="03 KI">
      <div className="container">
        <div className="ai-head">
          <span className="eyebrow eyebrow-line">KI-Schicht</span>
          <h2 className="section-title">
            Deine KI.<br/>
            <em>Deine Wahl.</em>
          </h2>
          <p className="section-sub">
            Smart-Import von Figuren, Beziehungs-Vorschläge, Wissens-Chat per RAG, Konsistenz-Check, Namen-Generator. Alles modular — und du bestimmst, wer rechnet.
          </p>
        </div>

        <div className="provider-switch">
          {Object.keys(providers).map(k => (
            <button
              key={k}
              className={`prov-tab ${active===k ? 'prov-tab-active' : ''}`}
              onClick={() => setActive(k)}
              style={{'--prov-color': providers[k].color}}
            >
              <div className="prov-dot" />
              <div className="prov-name">{providers[k].name}</div>
              <div className="prov-tag">{providers[k].tag}</div>
            </button>
          ))}
        </div>

        <div className="prov-detail" style={{'--prov-color': p.color}}>
          <div className="prov-text">
            <div className="prov-label">Aktiv: {p.name}</div>
            <p className="prov-desc">{p.desc}</p>
            <div className="prov-models">
              {p.models.map(m => <span key={m} className="prov-chip">{m}</span>)}
            </div>
          </div>
          <div className="prov-flow">
            <FlowDiagram active={active} />
          </div>
        </div>
      </div>

      <style>{`
        .ai-section { background: var(--bg-2); border-top: 0.5px solid var(--rule); border-bottom: 0.5px solid var(--rule); }
        .ai-head { max-width: 720px; margin-bottom: 56px; }
        .provider-switch {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 28px;
        }
        @media (max-width: 720px) { .provider-switch { grid-template-columns: 1fr; } }
        .prov-tab {
          background: var(--bg);
          border: 0.5px solid var(--rule);
          border-radius: 12px;
          padding: 16px 20px;
          text-align: left;
          color: var(--ink-dim);
          cursor: pointer;
          font-family: inherit;
          transition: all 0.25s;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 12px;
        }
        .prov-tab:hover { border-color: var(--rule-strong); color: var(--ink); }
        .prov-tab-active {
          border-color: var(--prov-color);
          color: var(--ink);
          background: color-mix(in srgb, var(--prov-color) 6%, var(--bg));
          box-shadow: 0 0 0 0.5px var(--prov-color);
        }
        .prov-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--prov-color);
          box-shadow: 0 0 12px var(--prov-color);
        }
        .prov-name { font-family: var(--serif); font-size: 17px; font-weight: 500; }
        .prov-tag { font-family: var(--mono); font-size: 10px; color: var(--ink-faint); letter-spacing: 0.08em; text-transform: uppercase; }

        .prov-detail {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 56px;
          padding: 40px;
          border: 0.5px solid var(--rule-strong);
          border-radius: 16px;
          background: var(--bg);
          align-items: center;
        }
        @media (max-width: 720px) { .prov-detail { grid-template-columns: 1fr; gap: 32px; padding: 24px; } }
        .prov-label {
          display: inline-block;
          font-family: var(--mono); font-size: 10px;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--prov-color);
          padding: 4px 10px;
          background: color-mix(in srgb, var(--prov-color) 12%, transparent);
          border-radius: 4px;
          margin-bottom: 18px;
        }
        .prov-desc { font-family: var(--serif); font-size: 21px; line-height: 1.5; color: var(--ink); font-weight: 300; margin: 0 0 22px; }
        .prov-models { display: flex; flex-wrap: wrap; gap: 8px; }
        .prov-chip {
          font-family: var(--mono); font-size: 11px;
          padding: 5px 10px;
          background: var(--bg-2);
          border: 0.5px solid var(--rule);
          border-radius: 6px;
          color: var(--ink-dim);
        }
      `}</style>
    </section>
  );
}

function FlowDiagram({ active }) {
  const stays = active === "ollama";
  return (
    <div className="flow">
      <div className="flow-node flow-mac">
        <div className="flow-icon">⌘</div>
        <div className="flow-label">Dein Mac</div>
        <div className="flow-sub">Manuskript</div>
      </div>
      <svg className="flow-line" viewBox="0 0 200 80" preserveAspectRatio="none">
        <defs>
          <linearGradient id="flowg" x1="0" x2="1">
            <stop offset="0" stopColor="var(--prov-color)" stopOpacity="0"/>
            <stop offset="0.5" stopColor="var(--prov-color)" stopOpacity="1"/>
            <stop offset="1" stopColor="var(--prov-color)" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d="M 0 40 Q 100 20 200 40" stroke="var(--rule-strong)" strokeWidth="1" fill="none"/>
        <path d="M 0 40 Q 100 20 200 40" stroke="url(#flowg)" strokeWidth="2" fill="none" strokeDasharray="4 6">
          <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1.5s" repeatCount="indefinite"/>
        </path>
      </svg>
      <div className="flow-node flow-prov">
        <div className="flow-icon">{active === "ollama" ? "◐" : "✦"}</div>
        <div className="flow-label">{active === "ollama" ? "Ollama lokal" : (active === "openai" ? "OpenAI" : "Anthropic")}</div>
        <div className="flow-sub">{stays ? "auf Gerät" : "via API-Key"}</div>
      </div>

      <div className={`flow-stamp ${stays ? 'stamp-good' : 'stamp-warn'}`}>
        {stays ? "✓ verlässt dein Gerät nicht" : "↗ nur deine Anfragen"}
      </div>

      <style>{`
        .flow {
          position: relative;
          height: 200px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 0;
        }
        .flow-node { text-align: center; }
        .flow-icon {
          width: 64px; height: 64px;
          border-radius: 16px;
          margin: 0 auto 10px;
          display: grid; place-items: center;
          font-family: var(--serif); font-size: 28px;
          background: var(--bg-2);
          border: 0.5px solid var(--rule-strong);
        }
        .flow-prov .flow-icon {
          color: var(--prov-color);
          border-color: var(--prov-color);
          background: color-mix(in srgb, var(--prov-color) 10%, var(--bg-2));
          box-shadow: 0 0 30px color-mix(in srgb, var(--prov-color) 30%, transparent);
        }
        .flow-label { font-family: var(--serif); font-size: 14px; font-weight: 500; }
        .flow-sub { font-family: var(--mono); font-size: 10px; color: var(--ink-faint); margin-top: 2px; letter-spacing: 0.08em; text-transform: uppercase; }
        .flow-line { width: 80px; height: 80px; }
        .flow-stamp {
          position: absolute;
          left: 50%; bottom: 0;
          transform: translateX(-50%);
          font-family: var(--mono); font-size: 10px;
          padding: 4px 10px;
          border-radius: 4px;
          letter-spacing: 0.06em;
        }
        .stamp-good { background: rgba(40,200,64,0.1); color: #4cd964; }
        .stamp-warn { background: var(--bg-2); color: var(--ink-dim); border: 0.5px solid var(--rule); }
      `}</style>
    </div>
  );
}

// Privacy section
function Privacy() {
  return (
    <section className="section-pad privacy" data-screen-label="04 Privacy">
      <div className="container privacy-inner">
        <span className="eyebrow eyebrow-line">Datenschutz</span>
        <h2 className="privacy-title">
          Lokal first.<br/>
          <em>Kompromisslos.</em>
        </h2>

        <div className="priv-grid">
          <div className="priv-card">
            <div className="priv-num">01</div>
            <h3>Auf deinem Mac</h3>
            <p>Werke, Figuren, Welt-Einträge, Inbox — alles in der lokalen SwiftData-Datenbank. Ein Ordner, ein Backup, fertig.</p>
            <code>~/Library/Application Support/Verve</code>
          </div>
          <div className="priv-card">
            <div className="priv-num">02</div>
            <h3>Keine Telemetrie</h3>
            <p>Kein Analytics, keine Tracker, kein Phone-Home. Verve weiß nicht, dass du es benutzt — und niemand sonst auch.</p>
            <code>0 ausgehende Verbindungen ohne dein OK</code>
          </div>
          <div className="priv-card">
            <div className="priv-num">03</div>
            <h3>Schlüssel im Keychain</h3>
            <p>API-Keys für Cloud-KI liegen im macOS-Keychain. Nicht in einer .env, nicht in iCloud, nicht im Klartext.</p>
            <code>Apple Keychain · Hardware-isoliert</code>
          </div>
          <div className="priv-card">
            <div className="priv-num">04</div>
            <h3>iCloud nur, wenn du willst</h3>
            <p>Standard: aus. Aktivierst du Sync, läuft er über deinen privaten CloudKit-Container — Ende-zu-Ende, ohne Mittler.</p>
            <code>iCloud.de.hartmann.verve · opt-in</code>
          </div>
        </div>
      </div>
      <style>{`
        .privacy-title { font-size: clamp(40px, 5vw, 64px); line-height: 1.05; letter-spacing: -0.03em; font-weight: 500; margin: 16px 0 56px; }
        .privacy-title em { font-style: italic; color: var(--ink-dim); font-weight: 300; }
        .priv-grid {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 0.5px; background: var(--rule);
          border: 0.5px solid var(--rule);
          border-radius: 16px;
          overflow: hidden;
        }
        @media (max-width: 720px) { .priv-grid { grid-template-columns: 1fr; } }
        .priv-card { background: var(--bg); padding: 36px 32px; }
        .priv-num { font-family: var(--mono); font-size: 11px; color: var(--accent); letter-spacing: 0.12em; margin-bottom: 16px; }
        .priv-card h3 { font-size: 24px; font-family: var(--serif); margin-bottom: 12px; font-weight: 500; }
        .priv-card p { color: var(--ink-dim); margin: 0 0 16px; line-height: 1.6; }
        .priv-card code { display: block; font-family: var(--mono); font-size: 11px; color: var(--ink-faint); padding: 8px 10px; background: var(--bg-2); border-radius: 6px; border: 0.5px solid var(--rule); }
      `}</style>
    </section>
  );
}

// Download section + system req
function Download() {
  return (
    <section id="download" className="section-pad download" data-screen-label="05 Download">
      <div className="container">
        <div className="dl-card">
          <div className="dl-glow" />
          <div className="dl-content">
            <span className="eyebrow eyebrow-line">Verve · v1.0</span>
            <h2 className="dl-title">
              Setz dich hin.<br/>
              <em>Schreib deinen Roman.</em>
            </h2>
            <p className="dl-sub">
              Universal Binary für Apple Silicon &amp; Intel. Notarisiert. Kostenlos. Ohne Account.
            </p>

            <div className="dl-actions">
              <a href="https://github.com/jahartmann/Verve/releases" className="btn btn-primary btn-large">
                <DownloadGlyph />
                Verve.dmg laden
                <span className="btn-meta">~24 MB</span>
              </a>
              <a href="https://github.com/jahartmann/Verve" className="btn btn-ghost btn-large">
                <GitHubGlyph />
                Auf GitHub ansehen
              </a>
            </div>

            <div className="dl-spec">
              <div className="dl-spec-row">
                <div className="spec-label">System</div>
                <div className="spec-val">macOS 14 Sonoma oder neuer</div>
              </div>
              <div className="dl-spec-row">
                <div className="spec-label">Architektur</div>
                <div className="spec-val">Apple Silicon · Intel</div>
              </div>
              <div className="dl-spec-row">
                <div className="spec-label">Sprache</div>
                <div className="spec-val">Deutsch</div>
              </div>
              <div className="dl-spec-row">
                <div className="spec-label">Bundle-ID</div>
                <div className="spec-val mono-val">de.hartmann.verve</div>
              </div>
              <div className="dl-spec-row">
                <div className="spec-label">Lizenz</div>
                <div className="spec-val">© 2026 Janik Hartmann · MIT</div>
              </div>
            </div>
          </div>

          <div className="dl-art">
            <DownloadOrb />
          </div>
        </div>
      </div>
      <style>{`
        .download { padding-bottom: 120px; }
        .dl-card {
          position: relative;
          padding: 64px;
          border-radius: 24px;
          background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 8%, var(--bg)), var(--bg-2));
          border: 0.5px solid var(--rule-strong);
          overflow: hidden;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 48px;
          align-items: center;
        }
        @media (max-width: 960px) { .dl-card { grid-template-columns: 1fr; padding: 40px 28px; } }
        .dl-glow {
          position: absolute;
          top: -200px; right: -200px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, color-mix(in srgb, var(--accent) 25%, transparent), transparent 70%);
          pointer-events: none;
        }
        .dl-content { position: relative; z-index: 2; }
        .dl-title { font-size: clamp(36px, 4.5vw, 56px); line-height: 1.05; letter-spacing: -0.03em; font-weight: 500; margin: 16px 0 16px; }
        .dl-title em { font-style: italic; color: var(--ink-dim); font-weight: 300; }
        .dl-sub { font-family: var(--serif); font-size: 19px; color: var(--ink-dim); line-height: 1.55; margin: 0 0 32px; max-width: 50ch; font-weight: 300; }
        .dl-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 40px; }
        .btn-large { padding: 14px 22px; font-size: 14px; }
        .btn-meta { margin-left: 4px; opacity: 0.7; font-family: var(--mono); font-size: 11px; }
        .dl-spec { border-top: 0.5px solid var(--rule); padding-top: 24px; display: flex; flex-direction: column; gap: 10px; }
        .dl-spec-row { display: grid; grid-template-columns: 130px 1fr; gap: 16px; font-size: 13px; }
        .spec-label { font-family: var(--mono); font-size: 11px; color: var(--ink-faint); letter-spacing: 0.08em; text-transform: uppercase; }
        .spec-val { color: var(--ink-dim); }
        .mono-val { font-family: var(--mono); font-size: 12px; color: var(--accent); }
        .dl-art { position: relative; z-index: 2; }
      `}</style>
    </section>
  );
}

function DownloadOrb() {
  return (
    <div className="dl-orb-wrap">
      <div className="dl-orb">
        <div className="orb-ring orb-ring-1"/>
        <div className="orb-ring orb-ring-2"/>
        <div className="orb-ring orb-ring-3"/>
        <div className="orb-core">
          <div className="orb-V">V</div>
        </div>
      </div>
      <style>{`
        .dl-orb-wrap { aspect-ratio: 1; max-width: 360px; margin: 0 auto; position: relative; display: grid; place-items: center; }
        .dl-orb { position: relative; width: 100%; height: 100%; display: grid; place-items: center; }
        .orb-ring {
          position: absolute; inset: 0;
          border: 0.5px solid color-mix(in srgb, var(--accent) 35%, transparent);
          border-radius: 50%;
          animation: orb-pulse 3s ease-in-out infinite;
        }
        .orb-ring-1 { inset: 20%; border-color: color-mix(in srgb, var(--accent) 50%, transparent); }
        .orb-ring-2 { inset: 10%; animation-delay: 0.4s; }
        .orb-ring-3 { inset: 0%; border-color: color-mix(in srgb, var(--accent) 18%, transparent); animation-delay: 0.8s; }
        @keyframes orb-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.04); opacity: 0.6; }
        }
        .orb-core {
          width: 45%; height: 45%;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, var(--accent-2), var(--accent) 50%, var(--accent-deep));
          display: grid; place-items: center;
          box-shadow:
            0 20px 60px -10px color-mix(in srgb, var(--accent) 60%, transparent),
            inset 0 -8px 20px rgba(0,0,0,0.3),
            inset 0 8px 20px rgba(255,255,255,0.18);
          position: relative;
        }
        .orb-V {
          font-family: var(--serif);
          font-size: 5em;
          font-weight: 400;
          font-style: italic;
          color: white;
          text-shadow: 0 1px 0 rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
}

function GitHubGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.34c-2.22.48-2.69-1.07-2.69-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.81.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.13 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.11.16 1.93.08 2.13.51.56.82 1.27.82 2.15 0 3.07-1.87 3.74-3.65 3.95.29.25.54.74.54 1.5v2.22c0 .21.15.46.55.38A8 8 0 0 0 8 0z"/>
    </svg>
  );
}

// Footer
function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="brand-mark">V</div>
          <div>
            <div style={{fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 600}}>Verve</div>
            <div style={{fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2}}>Werkstatt für Autoren</div>
          </div>
        </div>
        <div className="footer-cols">
          <div>
            <div className="foot-label">Projekt</div>
            <a href="https://github.com/jahartmann/Verve">GitHub</a>
            <a href="https://github.com/jahartmann/Verve/releases">Releases</a>
            <a href="https://github.com/jahartmann/Verve/issues">Issues</a>
          </div>
          <div>
            <div className="foot-label">Doku</div>
            <a href="#features">Features</a>
            <a href="#download">Download</a>
            <a href="https://github.com/jahartmann/Verve/blob/main/docs/legal/privacy.html">Datenschutz</a>
          </div>
          <div>
            <div className="foot-label">Kontakt</div>
            <span>Janik Hartmann</span>
            <span>de.hartmann.verve</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bot-inner">
          <span>© 2026 Janik Hartmann · Made with Verve</span>
          <span className="footer-tag">macOS Sequoia · v1.0</span>
        </div>
      </div>
      <style>{`
        .footer { border-top: 0.5px solid var(--rule); padding-top: 64px; }
        .footer-inner { display: grid; grid-template-columns: 1fr 2fr; gap: 56px; padding-bottom: 56px; }
        @media (max-width: 720px) { .footer-inner { grid-template-columns: 1fr; gap: 32px; } }
        .footer-brand { display: flex; gap: 14px; align-items: flex-start; }
        .footer-cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
        @media (max-width: 720px) { .footer-cols { grid-template-columns: repeat(2, 1fr); } }
        .footer-cols > div { display: flex; flex-direction: column; gap: 8px; }
        .foot-label { font-family: var(--mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-faint); margin-bottom: 6px; }
        .footer-cols a, .footer-cols span { font-size: 14px; color: var(--ink-dim); transition: color 0.2s; }
        .footer-cols a:hover { color: var(--accent); }
        .footer-bottom { border-top: 0.5px solid var(--rule); padding: 24px 0; font-family: var(--mono); font-size: 11px; color: var(--ink-faint); letter-spacing: 0.06em; }
        .footer-bot-inner { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
      `}</style>
    </footer>
  );
}

Object.assign(window, { Features, Capabilities, AISection, Privacy, Download, Footer, GitHubGlyph });
