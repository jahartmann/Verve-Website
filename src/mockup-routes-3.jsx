// Additional routes: Plot-Matrix, Kapitelplanung, Kapitelkontext

// ════════════════ PLOT-MATRIX ════════════════
function RoutePlotMatrix() {
  const chapters = [
    { n: 1, t: "Der Telegrafist" },
    { n: 2, t: "Erster Brief" },
    { n: 3, t: "Vogelbahn-Depot" },
    { n: 4, t: "Naima" },
    { n: 5, t: "Aschemund-Pfad" },
    { n: 6, t: "Salm ermittelt" },
    { n: 7, t: "Brief am Bahnsteig", active: true },
    { n: 8, t: "Wagen vier" },
    { n: 9, t: "Hellberg" },
    { n: 10, t: "Verrat" },
  ];
  const threads = [
    { n: "Haupt­plot · Brief", c: "#7A1F2B", cells: [1,1,2,2,3,2,3,3,2,3] },
    { n: "Naima & Aleksander", c: "#5a8a6a", cells: [0,0,1,3,2,1,2,3,1,2] },
    { n: "Salm-Ermittlung", c: "#8a6a3a", cells: [0,1,1,1,1,3,2,1,2,3] },
    { n: "Vogelbahn-Politik", c: "#5a6a8a", cells: [1,2,3,1,2,1,2,2,3,2] },
    { n: "Backstory · Telegraf", c: "#6a4a6a", cells: [3,1,0,1,0,1,1,0,1,0] },
  ];
  return (
    <div className="vr-mat">
      <div className="vr-mat-head">
        <div>
          <div className="vr-mat-title">Plot-Matrix · Buch II — Salzwacht</div>
          <div className="vr-mat-sub">Fünf Erzählstränge · zehn Kapitel · ein Überblick</div>
        </div>
        <div className="vr-mat-legend">
          <span className="vr-mat-leg vr-mat-leg-3"><i/>tragend</span>
          <span className="vr-mat-leg vr-mat-leg-2"><i/>präsent</span>
          <span className="vr-mat-leg vr-mat-leg-1"><i/>angedeutet</span>
          <span className="vr-mat-leg vr-mat-leg-0"><i/>ruht</span>
        </div>
      </div>
      <div className="vr-mat-body">
        <div className="vr-mat-grid" style={{gridTemplateColumns: `220px repeat(${chapters.length}, 1fr)`}}>
          <div className="vr-mat-corner"/>
          {chapters.map(ch => (
            <div key={ch.n} className={`vr-mat-col ${ch.active ? "vr-mat-col-active" : ""}`}>
              <div className="vr-mat-col-n">Kap. {ch.n}</div>
              <div className="vr-mat-col-t">{ch.t}</div>
            </div>
          ))}
          {threads.map((th, ti) => (
            <React.Fragment key={ti}>
              <div className="vr-mat-row-h">
                <span className="vr-mat-dot" style={{background: th.c}}/>
                {th.n}
              </div>
              {th.cells.map((v, ci) => (
                <div key={ci} className={`vr-mat-cell vr-mat-c${v} ${chapters[ci].active ? "vr-mat-cell-active" : ""}`}
                     style={v > 0 ? {background: `${th.c}${v === 3 ? "" : v === 2 ? "aa" : "55"}`} : {}}>
                  {v === 3 ? "●" : v === 2 ? "●" : v === 1 ? "·" : ""}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="vr-mat-foot">
        <span><VIcon name="sparkle" size={11}/> Verve sieht: <em>„Backstory-Strang ruht zwischen Kapitel 5 und 9 — willst du eine Erinnerung einflechten?"</em></span>
      </div>

      <style>{`
        .vr-mat { height: 100%; display: flex; flex-direction: column; background: var(--t-window); }
        .vr-mat-head { padding: 18px 24px; border-bottom: 0.5px solid var(--t-divider); display: flex; align-items: center; justify-content: space-between; gap: 24px; }
        .vr-mat-title { font-family: "Iowan Old Style", Georgia, serif; font-size: 22px; font-weight: 500; color: var(--t-pri); }
        .vr-mat-sub { font-size: 12px; color: var(--t-ter); margin-top: 3px; }
        .vr-mat-legend { display: flex; gap: 14px; }
        .vr-mat-leg { font-size: 10.5px; color: var(--t-ter); display: flex; align-items: center; gap: 5px; }
        .vr-mat-leg i { width: 10px; height: 10px; border-radius: 2px; display: inline-block; }
        .vr-mat-leg-3 i { background: var(--t-accent); }
        .vr-mat-leg-2 i { background: var(--t-accent); opacity: 0.6; }
        .vr-mat-leg-1 i { background: var(--t-accent); opacity: 0.25; }
        .vr-mat-leg-0 i { background: var(--t-divider); }
        .vr-mat-body { flex: 1; overflow: auto; padding: 16px 24px; }
        .vr-mat-grid { display: grid; gap: 1px; background: var(--t-divider); border: 0.5px solid var(--t-divider); border-radius: 8px; overflow: hidden; }
        .vr-mat-corner { background: var(--t-card); }
        .vr-mat-col { background: var(--t-card); padding: 10px 6px 8px; text-align: center; }
        .vr-mat-col-active { background: var(--t-hover); }
        .vr-mat-col-n { font-size: 10px; letter-spacing: 0.05em; text-transform: uppercase; color: var(--t-ter); }
        .vr-mat-col-t { font-size: 10.5px; color: var(--t-pri); margin-top: 3px; line-height: 1.2; }
        .vr-mat-row-h { background: var(--t-card); padding: 10px 14px; font-size: 12px; color: var(--t-pri); display: flex; align-items: center; gap: 8px; }
        .vr-mat-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .vr-mat-cell { background: var(--t-card); height: 38px; display: flex; align-items: center; justify-content: center; font-size: 13px; color: rgba(255,255,255,0.85); }
        .vr-mat-c0 { color: var(--t-ter); opacity: 0.4; }
        .vr-mat-cell-active { outline: 1.5px solid var(--t-accent); outline-offset: -2px; }
        .vr-mat-foot { padding: 14px 24px; border-top: 0.5px solid var(--t-divider); font-size: 12px; color: var(--t-sec); display: flex; align-items: center; gap: 8px; }
        .vr-mat-foot em { color: var(--t-pri); font-style: italic; }
      `}</style>
    </div>
  );
}

// ════════════════ KAPITELPLANUNG ════════════════
function RouteChapterPlan() {
  const chapters = [
    { n: 1, t: "Der Telegrafist", words: 3120, status: "fertig", beats: ["Eröffnung", "Setup"] },
    { n: 2, t: "Erster Brief", words: 2890, status: "fertig", beats: ["Catalyst"] },
    { n: 3, t: "Vogelbahn-Depot", words: 2410, status: "fertig", beats: ["Break Into Two"] },
    { n: 4, t: "Naima", words: 2780, status: "fertig", beats: ["B-Story"] },
    { n: 5, t: "Aschemund-Pfad", words: 3340, status: "fertig", beats: ["Fun & Games"] },
    { n: 6, t: "Salm ermittelt", words: 2100, status: "fertig", beats: ["Fun & Games"] },
    { n: 7, t: "Brief am Bahnsteig", words: 1520, status: "wip", beats: ["Midpoint"], active: true, target: 2800 },
    { n: 8, t: "Wagen vier", words: 0, status: "geplant", beats: ["Bad Guys Close In"], synopsis: "Aleksander öffnet den Brief im fahrenden Zug. Naima taucht auf — sie weiß bereits." },
    { n: 9, t: "Hellberg", words: 0, status: "geplant", beats: ["All Is Lost"], synopsis: "Konfrontation auf dem Anwesen. Naima verschwindet." },
    { n: 10, t: "Verrat", words: 0, status: "skizze", beats: ["Dark Night"] },
  ];
  return (
    <div className="vr-cp">
      <div className="vr-cp-head">
        <div>
          <div className="vr-cp-title">Kapitelplanung · Buch II</div>
          <div className="vr-cp-sub">Salzwacht · 10 Kapitel · 18.160 / ≈ 28.000 Wörter</div>
        </div>
        <div className="vr-cp-actions">
          <button className="vr-cp-btn">+ Kapitel</button>
          <button className="vr-cp-btn vr-cp-btn-ghost">Drag · Sortieren</button>
        </div>
      </div>
      <div className="vr-cp-body">
        {chapters.map((ch) => (
          <div key={ch.n} className={`vr-cp-row vr-cp-${ch.status} ${ch.active ? "vr-cp-active" : ""}`}>
            <div className="vr-cp-grip">⋮⋮</div>
            <div className="vr-cp-num">Kap. {ch.n}</div>
            <div className="vr-cp-main">
              <div className="vr-cp-name">{ch.t}</div>
              {ch.synopsis && <div className="vr-cp-syn">{ch.synopsis}</div>}
              <div className="vr-cp-beats">
                {ch.beats.map(b => <span key={b} className="vr-cp-beat">{b}</span>)}
              </div>
            </div>
            <div className="vr-cp-words">
              {ch.words > 0 ? (
                <>
                  <div className="vr-cp-wnum">{ch.words.toLocaleString("de-DE")} W.</div>
                  {ch.target && <div className="vr-cp-wbar"><div style={{width: `${Math.min(100, ch.words/ch.target*100)}%`}}/></div>}
                </>
              ) : <div className="vr-cp-wnum vr-cp-wnum-empty">noch leer</div>}
            </div>
            <div className={`vr-cp-status vr-cp-st-${ch.status}`}>
              {ch.status === "fertig" ? "✓ fertig" : ch.status === "wip" ? "in Arbeit" : ch.status === "geplant" ? "geplant" : "Skizze"}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .vr-cp { height: 100%; display: flex; flex-direction: column; background: var(--t-window); }
        .vr-cp-head { padding: 18px 24px; border-bottom: 0.5px solid var(--t-divider); display: flex; align-items: center; justify-content: space-between; }
        .vr-cp-title { font-family: "Iowan Old Style", Georgia, serif; font-size: 22px; font-weight: 500; color: var(--t-pri); }
        .vr-cp-sub { font-size: 12px; color: var(--t-ter); margin-top: 3px; }
        .vr-cp-actions { display: flex; gap: 8px; }
        .vr-cp-btn { font-size: 11.5px; padding: 6px 12px; background: var(--t-card); border: 0.5px solid var(--t-divider); color: var(--t-pri); border-radius: 5px; cursor: pointer; }
        .vr-cp-btn-ghost { background: transparent; color: var(--t-sec); }
        .vr-cp-body { flex: 1; overflow-y: auto; padding: 12px 24px 24px; display: flex; flex-direction: column; gap: 4px; }
        .vr-cp-row {
          display: grid; grid-template-columns: 24px 70px 1fr 130px 90px;
          align-items: center; gap: 14px;
          padding: 14px 14px;
          border-bottom: 0.5px solid var(--t-divider);
        }
        .vr-cp-row:hover { background: var(--t-hover); }
        .vr-cp-active { background: var(--t-card); border-left: 2px solid var(--t-accent); padding-left: 12px; }
        .vr-cp-grip { color: var(--t-ter); opacity: 0.4; cursor: grab; font-size: 14px; }
        .vr-cp-num { font-family: "Iowan Old Style", Georgia, serif; font-size: 13px; color: var(--t-ter); }
        .vr-cp-name { font-size: 14px; color: var(--t-pri); font-weight: 500; }
        .vr-cp-syn { font-family: "Iowan Old Style", Georgia, serif; font-style: italic; font-size: 12.5px; color: var(--t-sec); margin-top: 3px; line-height: 1.45; }
        .vr-cp-beats { display: flex; gap: 5px; margin-top: 6px; }
        .vr-cp-beat { font-size: 9.5px; letter-spacing: 0.05em; text-transform: uppercase; color: var(--t-ter); padding: 2px 7px; border: 0.5px solid var(--t-divider); border-radius: 3px; }
        .vr-cp-words { text-align: right; }
        .vr-cp-wnum { font-size: 12px; color: var(--t-pri); }
        .vr-cp-wnum-empty { color: var(--t-ter); font-style: italic; }
        .vr-cp-wbar { width: 100%; height: 3px; background: var(--t-hover); border-radius: 2px; margin-top: 5px; overflow: hidden; }
        .vr-cp-wbar > div { height: 100%; background: var(--t-accent); }
        .vr-cp-status { font-size: 10.5px; letter-spacing: 0.04em; text-align: right; }
        .vr-cp-st-fertig { color: #5fa380; }
        .vr-cp-st-wip { color: var(--t-accent); }
        .vr-cp-st-geplant { color: var(--t-ter); }
        .vr-cp-st-skizze { color: var(--t-ter); opacity: 0.6; font-style: italic; }
      `}</style>
    </div>
  );
}

// ════════════════ KAPITELKONTEXT ════════════════
function RouteChapterContext() {
  return (
    <div className="vr-cc">
      <div className="vr-cc-doc">
        <div className="vr-cc-meta">Kapitel 7 · Brief am Bahnsteig · 1.520 Wörter</div>
        <h1 className="vr-cc-h1">Kapitel 7</h1>
        <h2 className="vr-cc-h2">Der Brief am Bahnsteig</h2>
        <p className="vr-cc-p">
          Es war kurz nach fünf, als <span className="vr-cc-ent">Aleksander Volkow</span> den Brief
          aus der Innentasche zog. Der Bahnhof von <span className="vr-cc-ent">Salzwacht</span> roch
          nach Kohle und nasser Wolle.
        </p>
        <p className="vr-cc-p">
          „Sie warten in Wagen vier", sagte die Frau hinter dem Schalter, ohne aufzusehen. Aleksander nickte,
          und als er sich umdrehte, sah er <span className="vr-cc-ent">Naima Vogt</span> auf der anderen Seite stehen.
        </p>
      </div>

      <aside className="vr-cc-side">
        <div className="vr-cc-side-head">
          <span className="vr-cc-eyebrow">Kapitelkontext</span>
          <span className="vr-cc-side-mini">automatisch · live</span>
        </div>

        <div className="vr-cc-block">
          <div className="vr-cc-block-t">In diesem Kapitel</div>
          <div className="vr-cc-pills">
            <span className="vr-cc-pill vr-cc-pill-char">Aleksander Volkow</span>
            <span className="vr-cc-pill vr-cc-pill-char">Naima Vogt</span>
            <span className="vr-cc-pill vr-cc-pill-place">Salzwacht</span>
            <span className="vr-cc-pill vr-cc-pill-place">Bahnhof</span>
            <span className="vr-cc-pill vr-cc-pill-thing">Der Brief</span>
          </div>
        </div>

        <div className="vr-cc-block">
          <div className="vr-cc-block-t">Wo wir stehen</div>
          <div className="vr-cc-stand">
            <div className="vr-cc-stand-row"><span>Plot-Beat</span><strong>Midpoint · Akt II</strong></div>
            <div className="vr-cc-stand-row"><span>Vorheriges Kapitel</span><strong>Salm ermittelt</strong></div>
            <div className="vr-cc-stand-row"><span>Geplant nächstes</span><strong>Wagen vier</strong></div>
          </div>
        </div>

        <div className="vr-cc-block">
          <div className="vr-cc-block-t">Verve erinnert sich</div>
          <ul className="vr-cc-recall">
            <li>Aleksander hat den Brief seit <em>Kapitel 2</em> bei sich, ungeöffnet.</li>
            <li>Naima trug den Mantel zuletzt im <em>Vogelbahn-Depot</em> (Kap. 3).</li>
            <li>Salms Ermittlung ist Aleksander noch nicht bekannt.</li>
          </ul>
        </div>

        <div className="vr-cc-block vr-cc-block-warn">
          <div className="vr-cc-block-t">
            <VIcon name="shield" size={11}/>
            Achtung
          </div>
          <div className="vr-cc-warn">
            Du hast Naimas <em>Augenfarbe</em> in Kap. 4 als grün beschrieben — hier nicht erwähnt.
            Wenn du sie ansiehst, wäre das eine natürliche Stelle.
          </div>
        </div>
      </aside>

      <style>{`
        .vr-cc { height: 100%; display: grid; grid-template-columns: 1fr 320px; background: var(--t-paper); }
        .vr-cc-doc { padding: 36px 56px; overflow-y: auto; font-family: "Iowan Old Style", "Charter", Georgia, serif; color: var(--t-pri); }
        .vr-cc-meta { font-size: 11px; color: var(--t-ter); margin-bottom: 24px; letter-spacing: 0.03em; }
        .vr-cc-h1 { font-size: 13px; font-style: italic; color: var(--t-ter); margin-bottom: 4px; }
        .vr-cc-h2 { font-size: 28px; font-weight: 500; color: var(--t-pri); margin-bottom: 28px; letter-spacing: -0.01em; }
        .vr-cc-p { font-size: 15px; line-height: 1.7; margin-bottom: 18px; }
        .vr-cc-ent { background: rgba(122, 31, 43, 0.12); padding: 0 2px; border-radius: 2px; }
        .vr-cc-side { background: var(--t-window); border-left: 0.5px solid var(--t-divider); padding: 24px 22px; overflow-y: auto; display: flex; flex-direction: column; gap: 22px; }
        .vr-cc-side-head { display: flex; align-items: baseline; justify-content: space-between; padding-bottom: 14px; border-bottom: 0.5px solid var(--t-divider); }
        .vr-cc-eyebrow { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--t-pri); }
        .vr-cc-side-mini { font-size: 9.5px; color: var(--t-ter); font-style: italic; }
        .vr-cc-block-t { font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--t-ter); margin-bottom: 9px; display: flex; align-items: center; gap: 5px; }
        .vr-cc-pills { display: flex; flex-wrap: wrap; gap: 5px; }
        .vr-cc-pill { font-size: 11px; padding: 3px 9px; border-radius: 11px; border: 0.5px solid var(--t-divider); color: var(--t-pri); }
        .vr-cc-pill-char { background: rgba(122, 31, 43, 0.10); border-color: rgba(122, 31, 43, 0.25); }
        .vr-cc-pill-place { background: rgba(90, 122, 138, 0.10); border-color: rgba(90, 122, 138, 0.25); }
        .vr-cc-pill-thing { background: rgba(138, 106, 58, 0.10); border-color: rgba(138, 106, 58, 0.25); }
        .vr-cc-stand { display: flex; flex-direction: column; gap: 7px; }
        .vr-cc-stand-row { display: flex; justify-content: space-between; font-size: 11.5px; }
        .vr-cc-stand-row > span { color: var(--t-ter); }
        .vr-cc-stand-row > strong { color: var(--t-pri); font-weight: 500; }
        .vr-cc-recall { list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .vr-cc-recall li { font-family: "Iowan Old Style", Georgia, serif; font-size: 12px; line-height: 1.5; color: var(--t-sec); padding-left: 12px; position: relative; }
        .vr-cc-recall li::before { content: "—"; position: absolute; left: 0; color: var(--t-accent); }
        .vr-cc-recall em { color: var(--t-pri); font-style: italic; }
        .vr-cc-block-warn { padding: 12px 14px; background: rgba(212, 165, 116, 0.08); border: 0.5px solid rgba(212, 165, 116, 0.25); border-radius: 8px; margin-top: -4px; }
        .vr-cc-block-warn .vr-cc-block-t { color: #c89968; margin-bottom: 6px; }
        .vr-cc-warn { font-family: "Iowan Old Style", Georgia, serif; font-size: 12px; line-height: 1.5; color: var(--t-sec); }
        .vr-cc-warn em { font-style: italic; color: var(--t-pri); }
        @media (max-width: 900px) {
          .vr-cc { grid-template-columns: 1fr; }
          .vr-cc-side { border-left: none; border-top: 0.5px solid var(--t-divider); }
        }
      `}</style>
    </div>
  );
}

Object.assign(window, { RoutePlotMatrix, RouteChapterPlan, RouteChapterContext });
