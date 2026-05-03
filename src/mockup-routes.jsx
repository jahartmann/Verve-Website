// Verve mockup — route content. Each route fills the full canvas.

function VerveRoute({ route }) {
  const map = {
    editor: "RouteEditor", characters: "RouteCharacters", places: "RoutePlaces",
    magic: "RouteMagic", concepts: "RouteConcepts", factions: "RouteFactions",
    timeline: "RouteTimeline", notes: "RouteNotes", inbox: "RouteInbox",
    consistency: "RouteConsistency", chat: "RouteChat", style: "RouteStyle",
    plot: "RoutePlot", "plot-matrix": "RoutePlotMatrix", "chapter-plan": "RouteChapterPlan", "chapter-context": "RouteChapterContext",
    library: "RouteLibrary", book: "RouteBook", dashboard: "RouteDashboard",
  };
  const Comp = window[map[route] || "RouteEditor"] || window.RouteEditor;
  return Comp ? <Comp /> : null;
}

// ════════════════ EDITOR ════════════════
function RouteEditor() {
  return (
    <div className="vr-editor">
      <div className="vr-ed-meta">
        <span>Buch II · Salzwacht</span>
        <span className="vr-ed-dot">·</span>
        <span>Akt II · Wendepunkt</span>
        <span className="vr-ed-dot">·</span>
        <span>2.341 Wörter</span>
        <span className="vr-ed-dot">·</span>
        <span>≈ 9 Min Lesezeit</span>
        <span className="vr-ed-dot">·</span>
        <span>v12 · vor 4 Min</span>
      </div>

      <div className="vr-ed-page">
        <h1 className="vr-ed-h1">Kapitel 7</h1>
        <h2 className="vr-ed-h2">Der Brief am Bahnsteig</h2>

        <p className="vr-ed-p vr-ed-first">
          Es war kurz nach fünf, als <span className="ent ent-char">Aleksander Volkow</span> den Brief
          aus der Innentasche zog. Der Bahnhof von <span className="ent ent-place">Salzwacht</span> roch
          nach Kohle und nasser Wolle, und der Wind, der durch die offene Halle strich, schmeckte nach Eisen.
          Er hatte den Umschlag dreimal in der Hand gehalten, ohne ihn zu öffnen — beim Frühstück, am Pult, jetzt zum letzten Mal.
        </p>

        <p className="vr-ed-p">
          „Sie warten in Wagen vier", sagte die Frau hinter dem Schalter, ohne aufzusehen.
          <span className="vr-ed-marked">Aleksander nickte, weil ihm nichts Besseres einfiel</span>, und als er sich umdrehte,
          sah er <span className="ent ent-char">Naima Vogt</span> auf der anderen Seite des Gleises stehen, in jenem viel zu großen
          Mantel, den er zuletzt im <span className="ent ent-place">Vogelbahn-Depot</span> gesehen hatte.
        </p>

        <p className="vr-ed-p">
          Sie sah ihn nicht. Oder sie tat so. Die Lokomotive kreischte, der Zug schob sich heran, und der Brief
          war plötzlich das Schwerste, was er je in der Hand gehalten hatte.
        </p>

        <div className="vr-ed-aiblock">
          <div className="vr-ed-aiblock-head">
            <VIcon name="sparkle" size={12}/>
            <span>Stil-Reviewer · 3 Vorschläge</span>
            <span className="vr-ed-aiblock-spacer"/>
            <button className="vr-ed-aiblock-btn">Alle übernehmen</button>
            <button className="vr-ed-aiblock-btn vr-ed-aiblock-btn-ghost">Verwerfen</button>
          </div>
          <div className="vr-ed-aibody">
            <span className="vr-ed-strike">„Aleksander nickte, weil ihm nichts Besseres einfiel"</span>
            <span className="vr-ed-arrow">→</span>
            <span className="vr-ed-replace">„Aleksander nickte stumm, sein Blick auf den Bahnsteig geheftet."</span>
          </div>
          <div className="vr-ed-aifoot">aktiver, weniger Erklärung · Stilprofil: nüchtern · auf Kapitel anwendbar</div>
        </div>

        <p className="vr-ed-p">
          Hinter ihm sagte ein Mann etwas auf <span className="ent ent-concept">Vogelbahn-Slang</span>, und ein Junge lachte.
          <span className="vr-ed-mark-comment">Der Brief in seiner Hand fühlte sich an wie ein Versprechen, das jemand anderes gegeben hatte.</span>
        </p>

        <p className="vr-ed-p">
          Er stieg ein. Wagen vier roch nach Tabak, nach kaltem Tee. Auf dem Klapptisch lag bereits eine Karte —
          eine Karte des <span className="ent ent-place">Aschemundes</span>, mit roten Linien quer über die alten Salzbahnen,
          und in der Ecke, in jener winzigen, fast schiefen Schrift, die er kannte: <em>Sie wissen es.</em>
        </p>
      </div>

      <div className="vr-ed-statusbar">
        <span><VIcon name="checkmark.circle" size={11}/> Rechtschreibung ok</span>
        <span><VIcon name="shield" size={11}/> 2 Konsistenz-Hinweise</span>
        <span style={{marginLeft: "auto"}}>Lokal · Llama 3.1 8B · 14 Tokens/s</span>
      </div>

      <style>{`
        .vr-editor {
          height: 100%;
          display: flex; flex-direction: column;
          background: linear-gradient(180deg, var(--t-paper), var(--t-window));
        }
        .vr-ed-meta {
          padding: 10px 28px;
          border-bottom: 0.5px solid var(--t-divider);
          font-size: 11.5px;
          color: var(--t-ter);
          display: flex; gap: 8px; align-items: center;
        }
        .vr-ed-dot { color: var(--t-ter); opacity: 0.5; }
        .vr-ed-page {
          flex: 1; overflow-y: auto;
          padding: 40px 96px 40px;
          max-width: 760px;
          margin: 0 auto;
          width: 100%;
          font-family: "Iowan Old Style", "Charter", "Source Serif Pro", Georgia, serif;
          color: var(--t-pri);
        }
        .vr-ed-h1 {
          font-family: inherit;
          font-weight: 400;
          font-style: italic;
          font-size: 14px;
          color: var(--t-ter);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin: 0 0 4px;
        }
        .vr-ed-h2 {
          font-family: inherit;
          font-weight: 500;
          font-size: 28px;
          margin: 0 0 28px;
          letter-spacing: -0.01em;
        }
        .vr-ed-p {
          font-size: 16px;
          line-height: 1.7;
          margin: 0 0 18px;
          text-wrap: pretty;
        }
        .vr-ed-first::first-letter {
          font-size: 52px;
          line-height: 0.85;
          float: left;
          margin: 4px 8px 0 0;
          font-weight: 500;
          color: var(--t-accent);
          font-family: "Iowan Old Style", Georgia, serif;
        }
        .ent {
          border-bottom: 1px dotted;
          padding-bottom: 1px;
          cursor: pointer;
        }
        .ent-char { color: #e0a875; border-color: rgba(224,168,117,0.5); }
        .ent-place { color: #7fb89c; border-color: rgba(127,184,156,0.5); }
        .ent-concept { color: #b58cc7; border-color: rgba(181,140,199,0.5); font-style: italic; }
        :root[data-theme="light"] .ent-char { color: #b8732a; }
        :root[data-theme="light"] .ent-place { color: #2d6a4f; }
        :root[data-theme="light"] .ent-concept { color: #6b3c8e; }
        .vr-ed-marked {
          background: linear-gradient(180deg, transparent 60%, rgba(224,168,117,0.18) 60%);
          padding: 0 2px;
        }
        .vr-ed-mark-comment {
          background: rgba(255,228,140,0.10);
          border-left: 2px solid rgba(255,228,140,0.5);
          padding: 0 6px 0 8px;
          margin-left: -8px;
        }
        :root[data-theme="light"] .vr-ed-mark-comment { background: rgba(184,96,43,0.10); border-color: rgba(184,96,43,0.4); }
        .vr-ed-aiblock {
          margin: 24px 0;
          padding: 14px 16px;
          background: var(--t-card);
          border: 0.5px solid var(--t-border);
          border-left: 2px solid var(--t-accent);
          border-radius: 6px;
          font-family: -apple-system, "SF Pro Text", system-ui, sans-serif;
        }
        .vr-ed-aiblock-head {
          display: flex; align-items: center; gap: 8px;
          font-size: 11.5px;
          color: var(--t-sec);
          margin-bottom: 10px;
        }
        .vr-ed-aiblock-head svg { color: var(--t-accent); }
        .vr-ed-aiblock-spacer { flex: 1; }
        .vr-ed-aiblock-btn {
          padding: 3px 10px;
          font-size: 11px;
          background: var(--t-accent);
          color: white;
          border: 0;
          border-radius: 4px;
          cursor: pointer;
          font-family: inherit;
        }
        .vr-ed-aiblock-btn-ghost {
          background: transparent;
          color: var(--t-sec);
          border: 0.5px solid var(--t-border);
        }
        .vr-ed-aibody {
          font-family: "Iowan Old Style", Georgia, serif;
          font-size: 14.5px;
          line-height: 1.6;
          display: flex; gap: 8px; align-items: flex-start; flex-wrap: wrap;
        }
        .vr-ed-strike { text-decoration: line-through; color: var(--t-ter); }
        .vr-ed-arrow { color: var(--t-ter); }
        .vr-ed-replace { color: var(--t-pri); background: rgba(127,184,156,0.10); padding: 0 4px; border-radius: 2px; }
        .vr-ed-aifoot { font-size: 11px; color: var(--t-ter); margin-top: 8px; }
        .vr-ed-statusbar {
          height: 28px;
          padding: 0 24px;
          background: var(--t-toolbar);
          border-top: 0.5px solid var(--t-divider);
          display: flex; align-items: center; gap: 16px;
          font-size: 11px;
          color: var(--t-ter);
          flex-shrink: 0;
        }
        .vr-ed-statusbar svg { vertical-align: -1px; margin-right: 4px; }
      `}</style>
    </div>
  );
}

// ════════════════ INSPECTOR (only when shown) ════════════════
function VerveInspector() {
  return (
    <aside className="vinsp">
      <div className="vinsp-tabs">
        <button className="vinsp-tab vinsp-tab-active">Wissen</button>
        <button className="vinsp-tab">Notizen</button>
        <button className="vinsp-tab">Versionen</button>
      </div>
      <div className="vinsp-section">
        <div className="vinsp-card">
          <div className="vinsp-card-head">
            <span className="vinsp-pill vinsp-pill-char">Figur</span>
            <strong>Aleksander Volkow</strong>
          </div>
          <p className="vinsp-card-body">35 J., Kurier · Vogelbahn. Ehem. Salzbahn-Telegrafist. Loyal, vorsichtig.</p>
          <div className="vinsp-card-meta">7 Auftritte · Beziehung: Naima (Vertraut)</div>
        </div>
        <div className="vinsp-card">
          <div className="vinsp-card-head">
            <span className="vinsp-pill vinsp-pill-place">Ort</span>
            <strong>Salzwacht</strong>
          </div>
          <p className="vinsp-card-body">Hafenstadt am Aschemund. Bahnknoten. Salzraffinerie.</p>
        </div>
      </div>
      <style>{`
        .vinsp {
          width: 280px;
          background: var(--t-sidebar);
          border-left: 0.5px solid var(--t-divider);
          flex-shrink: 0;
          display: flex; flex-direction: column;
        }
        .vinsp-tabs { display: flex; padding: 8px 10px; gap: 4px; border-bottom: 0.5px solid var(--t-divider); }
        .vinsp-tab {
          padding: 4px 10px; font-size: 11.5px;
          background: transparent; border: 0; border-radius: 4px;
          color: var(--t-sec); cursor: pointer; font-family: inherit;
        }
        .vinsp-tab-active { background: var(--t-sel); color: var(--t-pri); }
        .vinsp-section { padding: 12px; display: flex; flex-direction: column; gap: 10px; }
        .vinsp-card { padding: 10px; background: var(--t-card); border: 0.5px solid var(--t-border); border-radius: 6px; }
        .vinsp-card-head { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; font-size: 12.5px; }
        .vinsp-pill { font-size: 9.5px; padding: 2px 6px; border-radius: 3px; text-transform: uppercase; letter-spacing: 0.5px; }
        .vinsp-pill-char { background: rgba(224,168,117,0.15); color: #e0a875; }
        .vinsp-pill-place { background: rgba(127,184,156,0.15); color: #7fb89c; }
        .vinsp-card-body { margin: 0; font-size: 11.5px; color: var(--t-sec); line-height: 1.5; }
        .vinsp-card-meta { font-size: 10.5px; color: var(--t-ter); margin-top: 6px; }
      `}</style>
    </aside>
  );
}

// ════════════════ Helper: Header for entity grids ════════════════
function GridHeader({ count, label, filters, sort = "Zuletzt geändert" }) {
  return (
    <div className="vgh">
      <div className="vgh-left">
        <span className="vgh-count">{count}</span>
        <span className="vgh-label">{label}</span>
      </div>
      <div className="vgh-filters">
        {filters.map((f, i) => (
          <button key={i} className={`vgh-chip ${f.active ? "vgh-chip-active" : ""}`}>{f.label} {f.count != null && <span className="vgh-chip-num">{f.count}</span>}</button>
        ))}
      </div>
      <div className="vgh-right">
        <button className="vgh-iconbtn"><VIcon name="grid" size={13}/></button>
        <button className="vgh-iconbtn vgh-iconbtn-active"><VIcon name="square.grid" size={13}/></button>
        <div className="vgh-divider"/>
        <span className="vgh-sort">{sort} <VIcon name="chevron.down" size={9}/></span>
        <button className="vgh-add"><VIcon name="plus" size={11}/> Neu</button>
      </div>
      <style>{`
        .vgh {
          padding: 14px 24px;
          border-bottom: 0.5px solid var(--t-divider);
          display: flex; align-items: center; gap: 18px;
          flex-shrink: 0;
        }
        .vgh-left { display: flex; align-items: baseline; gap: 8px; }
        .vgh-count { font-family: "Iowan Old Style", Georgia, serif; font-size: 26px; font-weight: 500; color: var(--t-pri); }
        .vgh-label { font-size: 12px; color: var(--t-ter); }
        .vgh-filters { display: flex; gap: 4px; padding-left: 12px; border-left: 0.5px solid var(--t-divider); }
        .vgh-chip {
          padding: 4px 10px;
          font-size: 11.5px;
          background: transparent;
          border: 0;
          border-radius: 4px;
          color: var(--t-sec);
          cursor: pointer;
          font-family: inherit;
          display: inline-flex; align-items: center; gap: 5px;
        }
        .vgh-chip-active { background: var(--t-sel); color: var(--t-pri); }
        .vgh-chip-num { font-size: 10.5px; color: var(--t-ter); }
        .vgh-right { margin-left: auto; display: flex; align-items: center; gap: 8px; font-size: 11.5px; color: var(--t-sec); }
        .vgh-iconbtn { padding: 4px 6px; background: transparent; border: 0; border-radius: 4px; color: var(--t-sec); cursor: pointer; }
        .vgh-iconbtn-active { background: var(--t-sel); color: var(--t-pri); }
        .vgh-divider { width: 1px; height: 16px; background: var(--t-divider); }
        .vgh-sort { display: inline-flex; align-items: center; gap: 4px; cursor: pointer; }
        .vgh-add {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 4px 10px;
          background: var(--t-accent);
          color: white;
          border: 0;
          border-radius: 5px;
          font-size: 11.5px;
          cursor: pointer;
          font-family: inherit;
        }
      `}</style>
    </div>
  );
}

// ════════════════ FIGUREN — Fullscreen Grid ════════════════
function RouteCharacters() {
  const chars = [
    { name: "Aleksander Volkow", role: "Protagonist", desc: "Kurier · Vogelbahn. Ehemaliger Salzbahn-Telegrafist.", arc: "Akt II · Wendepunkt", count: 47, img: "linear-gradient(135deg, #5a3a2a, #2a1a14)", initials: "AV", tags: ["POV", "Buch I+II"] },
    { name: "Naima Vogt", role: "Deuteragonistin", desc: "Schmugglerin, Fragmenten-Sammlerin. Naimas Mantel.", arc: "Akt II · Komplikation", count: 31, img: "linear-gradient(135deg, #4a3a5a, #1a1424)", initials: "NV", tags: ["POV", "Buch II"] },
    { name: "Inspektor Henrik Salm", role: "Antagonist", desc: "Eisenbahn-Polizei. Sucht den Brief seit drei Wochen.", arc: "Akt II · Druck", count: 19, img: "linear-gradient(135deg, #3a2a2a, #181010)", initials: "HS", tags: ["Buch II"] },
    { name: "Mira Volkow", role: "Hintergrund", desc: "Aleksanders Schwester. Liest die Briefe als Letzte.", arc: "Erinnerung", count: 8, img: "linear-gradient(135deg, #5a4a3a, #2a201a)", initials: "MV", tags: ["Buch I"] },
    { name: "Onkel Bregor", role: "Mentor", desc: "Stationsmeister Aschemund. Kennt jeden Fahrplan auswendig.", arc: "Wegweiser", count: 14, img: "linear-gradient(135deg, #3a4a3a, #14201a)", initials: "OB", tags: ["Buch I+II"] },
    { name: "Die Hellbergin", role: "Mysterium", desc: "Auftraggeberin. Niemand kennt ihr Gesicht.", arc: "Verborgen", count: 6, img: "linear-gradient(135deg, #1a1a1a, #050505)", initials: "?", tags: ["Buch II+III"] },
    { name: "Pjotr Salm", role: "Nebenfigur", desc: "Henriks jüngerer Bruder. Auf der falschen Seite der Linie.", arc: "Akt I-II", count: 9, img: "linear-gradient(135deg, #4a3a4a, #20141c)", initials: "PS", tags: ["Buch II"] },
    { name: "Ilse Markhoff", role: "Nebenfigur", desc: "Wirtin der Salzwacht. Hört alles, sagt nichts.", arc: "Konstante", count: 11, img: "linear-gradient(135deg, #5a4a2a, #2a1f10)", initials: "IM", tags: ["Buch II"] },
    { name: "Cesar Drey", role: "Nebenfigur", desc: "Vogelbahn-Lokführer. Schuldet Aleksander einen Gefallen.", arc: "Akt II", count: 5, img: "linear-gradient(135deg, #3a3a4a, #14141c)", initials: "CD", tags: ["Buch II"] },
    { name: "Frau Halbach", role: "Hintergrund", desc: "Schalterfrau Salzwacht-Bahnhof. Sieht mehr als sie zugibt.", arc: "Beobachterin", count: 4, img: "linear-gradient(135deg, #4a4a3a, #20201c)", initials: "FH", tags: ["Buch II"] },
    { name: "Junker Aldris", role: "Nebenfigur", desc: "Junger Erbe der Hellberg-Familie. Naiv, ehrlich.", arc: "Akt III", count: 3, img: "linear-gradient(135deg, #5a5a4a, #2a2a20)", initials: "JA", tags: ["Buch II+III"] },
    { name: "Die Stimme", role: "Mysterium", desc: "Telegrafische Botschaft. Identität unbekannt.", arc: "Verborgen", count: 7, img: "linear-gradient(135deg, #2a2a2a, #0a0a0a)", initials: "—", tags: ["Buch I+II+III"] },
  ];
  return (
    <div className="vr-grid">
      <GridHeader
        count={17}
        label="Figuren · 17 Einträge · 5 mit POV"
        filters={[
          { label: "Alle", count: 17, active: true },
          { label: "POV", count: 2 },
          { label: "Hauptfiguren", count: 6 },
          { label: "Mysterien", count: 2 },
        ]}
      />
      <div className="vr-grid-body">
        <div className="vr-grid-cards">
          {chars.map((c, i) => <CharCard key={i} {...c} />)}
        </div>
      </div>
      <style>{`
        .vr-grid { height: 100%; display: flex; flex-direction: column; background: var(--t-window); }
        .vr-grid-body { flex: 1; overflow-y: auto; padding: 20px 24px 24px; }
        .vr-grid-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .vr-grid-cards-3 { grid-template-columns: repeat(3, 1fr); }
      `}</style>
    </div>
  );
}

function CharCard({ name, role, desc, arc, count, img, initials, tags }) {
  return (
    <div className="ccard">
      <div className="ccard-portrait" style={{background: img}}>
        <span className="ccard-initials">{initials}</span>
        <span className="ccard-role-badge">{role}</span>
      </div>
      <div className="ccard-body">
        <div className="ccard-name">{name}</div>
        <div className="ccard-desc">{desc}</div>
        <div className="ccard-meta">
          {tags.map((t, i) => <span key={i} className="ccard-tag">{t}</span>)}
        </div>
        <div className="ccard-foot">
          <span className="ccard-arc">{arc}</span>
          <span className="ccard-count">{count} Auftritte</span>
        </div>
      </div>
      <style>{`
        .ccard {
          background: var(--t-card);
          border: 0.5px solid var(--t-border);
          border-radius: 8px;
          overflow: hidden;
          display: flex; flex-direction: column;
          transition: border-color 0.15s, transform 0.15s;
          cursor: pointer;
        }
        .ccard:hover { border-color: var(--t-border-strong); transform: translateY(-1px); }
        .ccard-portrait {
          aspect-ratio: 4 / 3;
          position: relative;
          display: grid; place-items: center;
          color: rgba(255,255,255,0.85);
          font-family: "Iowan Old Style", Georgia, serif;
        }
        .ccard-initials {
          font-size: 36px; font-weight: 500; letter-spacing: 0.02em;
          opacity: 0.7;
        }
        .ccard-role-badge {
          position: absolute; top: 8px; left: 8px;
          font-size: 10px;
          padding: 2px 7px;
          background: rgba(0,0,0,0.45);
          color: rgba(255,255,255,0.92);
          border-radius: 3px;
          font-family: -apple-system, system-ui;
          letter-spacing: 0.02em;
        }
        .ccard-body { padding: 10px 12px 12px; }
        .ccard-name { font-size: 13px; font-weight: 600; color: var(--t-pri); margin-bottom: 4px; }
        .ccard-desc { font-size: 11.5px; color: var(--t-sec); line-height: 1.4; height: 32px; overflow: hidden; }
        .ccard-meta { display: flex; gap: 4px; margin-top: 8px; }
        .ccard-tag {
          font-size: 9.5px;
          padding: 2px 6px;
          background: var(--t-hover);
          color: var(--t-sec);
          border-radius: 3px;
          letter-spacing: 0.02em;
        }
        .ccard-foot {
          margin-top: 8px;
          padding-top: 8px;
          border-top: 0.5px solid var(--t-divider);
          display: flex; justify-content: space-between;
          font-size: 10.5px;
          color: var(--t-ter);
        }
        .ccard-arc { font-style: italic; }
      `}</style>
    </div>
  );
}

// ════════════════ ORTE — Fullscreen Grid ════════════════
function RoutePlaces() {
  const places = [
    { name: "Salzwacht", type: "Stadt", desc: "Hafen am Aschemund. Bahnknoten, Salzraffinerie. Sitz der Eisenbahn-Polizei.", scenes: 23, img: "linear-gradient(160deg, #2a3a4a 0%, #4a5a6a 50%, #6a7a8a 100%)", icon: "🏛", tags: ["Hauptort"] },
    { name: "Aschemund", type: "Region", desc: "Vulkanisches Tiefland zwischen Eisernem Land und Vogelschneise. Karg, salzig.", scenes: 14, img: "linear-gradient(160deg, #3a2a2a, #5a3a2a, #2a1a14)", icon: "⛰", tags: ["Setting"] },
    { name: "Vogelbahn-Depot", type: "Schauplatz", desc: "Geheimer Umschlagplatz nördlich von Salzwacht. Letztes Drittel Buch II.", scenes: 8, img: "linear-gradient(160deg, #1a1a14, #2a2418, #3a3220)", icon: "🚂", tags: ["Schauplatz"] },
    { name: "Hellberg-Anwesen", type: "Schauplatz", desc: "Stammhaus der Hellberg-Familie. Kalkstein, Eisengitter, Bibliothek.", scenes: 6, img: "linear-gradient(160deg, #4a4040, #6a5858, #3a3030)", icon: "🏰", tags: ["Buch II+III"] },
    { name: "Eiserne Strecke", type: "Pfad", desc: "Alte Salzbahn-Linie. Stillgelegt, aber nicht vergessen.", scenes: 11, img: "linear-gradient(160deg, #2a2a2a, #4a4a4a, #1a1a1a)", icon: "🛤", tags: ["wiederkehrend"] },
    { name: "Kapelle der Lichtsucher", type: "Schauplatz", desc: "Zerstörte Kapelle am Aschemund. Spiritueller Schlüsselort.", scenes: 4, img: "linear-gradient(160deg, #3a3a4a, #5a5a6a, #2a2a3a)", icon: "✠", tags: ["Buch III"] },
    { name: "Markthalle Salzwacht", type: "Schauplatz", desc: "Drehscheibe für Gerüchte und geschmuggelte Karten.", scenes: 5, img: "linear-gradient(160deg, #4a3a2a, #6a5040, #2a201a)", icon: "🏪", tags: ["Buch II"] },
    { name: "Nordpassage", type: "Pfad", desc: "Gebirgspass nach Vogelschneise. Drei Wochen Marsch im Sommer.", scenes: 7, img: "linear-gradient(160deg, #4a4a5a, #6a6a7a, #2a2a3a)", icon: "❄", tags: ["Buch I+II"] },
    { name: "Bahnhof Salzwacht", type: "Schauplatz", desc: "Eröffnet Kapitel 7. Wendepunkt-Schauplatz.", scenes: 3, img: "linear-gradient(160deg, #3a2a3a, #5a4050, #2a1a2a)", icon: "🚉", tags: ["Pivot"] },
    { name: "Hafen Salzwacht", type: "Schauplatz", desc: "Salzlagerhäuser, Schmugglerpfad. Naimas Revier.", scenes: 6, img: "linear-gradient(160deg, #1a3a4a, #2a5a6a, #143040)", icon: "⚓", tags: ["Buch II"] },
    { name: "Vogelschneise", type: "Region", desc: "Bewaldetes Hochland nördlich des Aschemunds. Heimat der Vogelbahn.", scenes: 9, img: "linear-gradient(160deg, #2a3a2a, #4a5a4a, #1a201a)", icon: "🌲", tags: ["Buch II+III"] },
    { name: "Telegrafenturm Eiserne", type: "Schauplatz", desc: "Aleksanders alter Arbeitsplatz. Nur einmal in Buch II besucht.", scenes: 2, img: "linear-gradient(160deg, #4a4a3a, #6a6a4a, #20201a)", icon: "📡", tags: ["Erinnerung"] },
  ];
  return (
    <div className="vr-grid">
      <GridHeader
        count={12}
        label="Orte · 12 Einträge · 4 Hauptschauplätze"
        filters={[
          { label: "Alle", count: 12, active: true },
          { label: "Städte", count: 1 },
          { label: "Regionen", count: 3 },
          { label: "Schauplätze", count: 6 },
          { label: "Pfade", count: 2 },
        ]}
      />
      <div className="vr-grid-body">
        <div className="vr-grid-cards">
          {places.map((p, i) => <PlaceCard key={i} {...p} />)}
        </div>
      </div>
    </div>
  );
}

function PlaceCard({ name, type, desc, scenes, img, icon, tags }) {
  return (
    <div className="pcard">
      <div className="pcard-image" style={{background: img}}>
        <span className="pcard-icon">{icon}</span>
        <span className="pcard-type">{type}</span>
      </div>
      <div className="pcard-body">
        <div className="pcard-name">{name}</div>
        <div className="pcard-desc">{desc}</div>
        <div className="pcard-foot">
          <span className="pcard-tags">{tags.map((t, i) => <span key={i} className="pcard-tag">{t}</span>)}</span>
          <span className="pcard-scenes">{scenes} Szenen</span>
        </div>
      </div>
      <style>{`
        .pcard {
          background: var(--t-card);
          border: 0.5px solid var(--t-border);
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: border-color 0.15s, transform 0.15s;
        }
        .pcard:hover { border-color: var(--t-border-strong); transform: translateY(-1px); }
        .pcard-image {
          aspect-ratio: 4 / 3;
          position: relative;
          display: grid; place-items: center;
        }
        .pcard-icon {
          font-size: 32px;
          opacity: 0.55;
          filter: grayscale(0.3);
        }
        .pcard-type {
          position: absolute; top: 8px; left: 8px;
          font-size: 10px;
          padding: 2px 7px;
          background: rgba(0,0,0,0.45);
          color: rgba(255,255,255,0.92);
          border-radius: 3px;
          letter-spacing: 0.02em;
        }
        .pcard-body { padding: 10px 12px 12px; }
        .pcard-name { font-size: 13px; font-weight: 600; color: var(--t-pri); margin-bottom: 4px; }
        .pcard-desc { font-size: 11.5px; color: var(--t-sec); line-height: 1.4; height: 32px; overflow: hidden; }
        .pcard-foot {
          margin-top: 8px;
          padding-top: 8px;
          border-top: 0.5px solid var(--t-divider);
          display: flex; justify-content: space-between; align-items: center;
        }
        .pcard-tags { display: flex; gap: 4px; }
        .pcard-tag {
          font-size: 9.5px;
          padding: 2px 6px;
          background: var(--t-hover);
          color: var(--t-sec);
          border-radius: 3px;
        }
        .pcard-scenes { font-size: 10.5px; color: var(--t-ter); }
      `}</style>
    </div>
  );
}

Object.assign(window, { VerveRoute, RouteEditor, RouteCharacters, RoutePlaces, GridHeader, VerveInspector, CharCard, PlaceCard });
