// Verve mockup — additional routes (chat, consistency, style, plot, etc.)

// ════════════════ CHAT ════════════════
function RouteChat() {
  return (
    <div className="vr-chat">
      <div className="vr-chat-header">
        <div>
          <div className="vr-chat-title">Wissens-Chat</div>
          <div className="vr-chat-sub">Antworten ausschließlich aus deinem Werk · Llama 3.1 8B (lokal)</div>
        </div>
        <div className="vr-chat-modes">
          <button className="vr-chat-mode vr-chat-mode-active">Werk</button>
          <button className="vr-chat-mode">Kapitel</button>
          <button className="vr-chat-mode">Auswahl</button>
        </div>
      </div>
      <div className="vr-chat-body">
        <div className="vr-msg vr-msg-user">
          <div className="vr-msg-bubble">Wer hat den Brief in Kapitel 7 geschrieben — und gibt es vorher Hinweise darauf?</div>
        </div>
        <div className="vr-msg vr-msg-ai">
          <div className="vr-msg-avatar"><VIcon name="sparkle" size={11}/></div>
          <div className="vr-msg-content">
            <div className="vr-msg-bubble">
              <p>Der Brief stammt von <strong>Onkel Bregor</strong>. Drei Indizien stützen das:</p>
              <ol>
                <li>Die Karte des Aschemundes mit roten Linien — Bregor zeichnet so seit Buch I, Kap. 3.</li>
                <li>Die Schrift ist beschrieben als {'\u201Ewinzig, fast schief\u201C'} — identisch zur Notiz in Kap. 4.</li>
                <li>Bregor sagt Aleksander am Ende von Kap. 5: {'\u201EEs kommt etwas, das nicht ich bringe.\u201C'}</li>
              </ol>
            </div>
            <div className="vr-msg-cites">
              <a className="vr-cite"><VIcon name="doc" size={10}/> Buch I · Kap. 3 · S. 41</a>
              <a className="vr-cite"><VIcon name="doc" size={10}/> Buch II · Kap. 4 · S. 18</a>
              <a className="vr-cite"><VIcon name="doc" size={10}/> Buch II · Kap. 5 · S. 27</a>
              <a className="vr-cite"><VIcon name="person.2" size={10}/> Figur · Onkel Bregor</a>
            </div>
          </div>
        </div>
        <div className="vr-msg vr-msg-user">
          <div className="vr-msg-bubble">Hat sich Bregors Sprachstil über die Bücher verändert?</div>
        </div>
        <div className="vr-msg vr-msg-ai">
          <div className="vr-msg-avatar"><VIcon name="sparkle" size={11}/></div>
          <div className="vr-msg-content">
            <div className="vr-msg-bubble vr-msg-streaming">
              <p>Ja — in Buch I dominieren kurze Imperative ({'\u201EGeh.\u201C'}, {'\u201EFrag nicht.\u201C'}). Ab Buch II Kap. 2 wechselt er häufiger ins Konjunktiv-Präteritum, ein Hinweis auf seine</p>
              <span className="vr-typing"><span/><span/><span/></span>
            </div>
          </div>
        </div>
      </div>
      <div className="vr-chat-input">
        <div className="vr-chat-input-box">
          <span className="vr-chat-prefix">@</span>
          <span className="vr-chat-placeholder">Frage stellen, Figur erwähnen…</span>
          <span className="vr-chat-spacer"/>
          <button className="vr-chat-icon"><VIcon name="paperclip" size={12}/></button>
          <button className="vr-chat-send"><VIcon name="send" size={11}/></button>
        </div>
        <div className="vr-chat-hint">⌘↵ senden · @ Figur · # Ort · / Befehl</div>
      </div>
      <style>{`
        .vr-chat { height: 100%; display: flex; flex-direction: column; background: var(--t-window); }
        .vr-chat-header {
          padding: 16px 24px;
          border-bottom: 0.5px solid var(--t-divider);
          display: flex; align-items: center; justify-content: space-between;
        }
        .vr-chat-title { font-family: "Iowan Old Style", Georgia, serif; font-size: 19px; font-weight: 500; color: var(--t-pri); }
        .vr-chat-sub { font-size: 11.5px; color: var(--t-ter); margin-top: 2px; }
        .vr-chat-modes { display: flex; gap: 4px; padding: 3px; background: var(--t-hover); border-radius: 6px; }
        .vr-chat-mode { padding: 4px 12px; font-size: 11.5px; background: transparent; border: 0; border-radius: 4px; color: var(--t-sec); cursor: pointer; font-family: inherit; }
        .vr-chat-mode-active { background: var(--t-card); color: var(--t-pri); box-shadow: 0 0 0 0.5px var(--t-border); }
        .vr-chat-body { flex: 1; overflow-y: auto; padding: 22px 28px; max-width: 820px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; gap: 18px; }
        .vr-msg { display: flex; gap: 10px; }
        .vr-msg-user { justify-content: flex-end; }
        .vr-msg-user .vr-msg-bubble { background: var(--t-accent); color: white; border-radius: 12px 12px 3px 12px; max-width: 70%; }
        .vr-msg-ai .vr-msg-bubble { background: var(--t-card); color: var(--t-pri); border: 0.5px solid var(--t-border); border-radius: 12px 12px 12px 3px; }
        .vr-msg-bubble { padding: 10px 14px; font-size: 13px; line-height: 1.55; }
        .vr-msg-bubble p { margin: 0 0 6px; }
        .vr-msg-bubble p:last-child { margin: 0; }
        .vr-msg-bubble ol { margin: 6px 0 0; padding-left: 18px; font-size: 12.5px; line-height: 1.6; }
        .vr-msg-bubble ol li { margin-bottom: 3px; }
        .vr-msg-avatar { width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(135deg, var(--t-accent), var(--t-accent)); color: white; display: grid; place-items: center; flex-shrink: 0; margin-top: 2px; }
        .vr-msg-content { max-width: 80%; }
        .vr-msg-cites { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
        .vr-cite {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 8px;
          font-size: 10.5px;
          background: var(--t-card2);
          border: 0.5px solid var(--t-border);
          color: var(--t-sec);
          border-radius: 4px;
          cursor: pointer;
        }
        .vr-typing { display: inline-flex; gap: 3px; vertical-align: middle; margin-left: 2px; }
        .vr-typing span { width: 4px; height: 4px; border-radius: 50%; background: var(--t-ter); animation: vrt 1.2s infinite; }
        .vr-typing span:nth-child(2) { animation-delay: 0.2s; }
        .vr-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes vrt { 0%, 80% { opacity: 0.3; } 40% { opacity: 1; } }
        .vr-chat-input { padding: 14px 24px 18px; border-top: 0.5px solid var(--t-divider); max-width: 820px; margin: 0 auto; width: 100%; }
        .vr-chat-input-box {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 10px 8px 14px;
          background: var(--t-card);
          border: 0.5px solid var(--t-border-strong);
          border-radius: 10px;
        }
        .vr-chat-prefix { color: var(--t-accent); font-weight: 500; }
        .vr-chat-placeholder { color: var(--t-ter); font-size: 13px; flex: 1; }
        .vr-chat-spacer { flex: 1; }
        .vr-chat-icon { background: transparent; border: 0; color: var(--t-ter); cursor: pointer; padding: 4px; }
        .vr-chat-send {
          width: 26px; height: 26px;
          background: var(--t-accent);
          color: white;
          border: 0;
          border-radius: 6px;
          display: grid; place-items: center;
          cursor: pointer;
        }
        .vr-chat-hint { font-size: 10.5px; color: var(--t-ter); margin-top: 8px; padding: 0 4px; }
      `}</style>
    </div>
  );
}

// ════════════════ CONSISTENCY ════════════════
function RouteConsistency() {
  const items = [
    { sev: "warn", title: "Augenfarbe Aleksander", body: "In Buch I Kap. 3 als \u201Egrau\u201C beschrieben, in Buch II Kap. 2 als \u201Eblaugr\u00FCn\u201C.",
      refs: ["Buch I · Kap. 3", "Buch II · Kap. 2"], status: "Offen" },
    { sev: "warn", title: "Naimas Mantel", body: "\u201EMarineblau\u201C (Kap. 1), \u201Edunkelgr\u00FCn\u201C (Kap. 4), \u201Eviel zu gro\u00DF\u201C (Kap. 7).",
      refs: ["Buch II · Kap. 1, 4, 7"], status: "Offen" },
    { sev: "info", title: "Vogelbahn-Depot · Geographie", body: "Lage einmal als \u201En\u00F6rdlich Salzwacht\u201C, einmal als \u201Ewestlich Aschemund\u201C.",
      refs: ["Buch II · Kap. 5", "Buch I · Kap. 9"], status: "Offen" },
    { sev: "ok",   title: "Henrik Salm · Alter", body: "Konsistent 42 J. (Kap. 2, 6, 11).",
      refs: ["Buch II · Kap. 2, 6, 11"], status: "Geprüft" },
    { sev: "ok",   title: "Eiserne Strecke · Stilllegung", body: "1893 in allen Erwähnungen.",
      refs: ["Buch I · Kap. 3", "Buch II · Kap. 4"], status: "Geprüft" },
  ];
  return (
    <div className="vr-cons">
      <GridHeader
        count={5}
        label="Konsistenz-Hinweise · 3 offen · 2 geprüft"
        filters={[
          { label: "Alle", count: 5, active: true },
          { label: "Offen", count: 3 },
          { label: "Geprüft", count: 2 },
        ]}
        sort="Schweregrad"
      />
      <div className="vr-cons-body">
        {items.map((it, i) => (
          <div key={i} className={`vr-cons-row vr-cons-${it.sev}`}>
            <div className={`vr-cons-icon vr-cons-icon-${it.sev}`}>
              <VIcon name={it.sev === "warn" ? "warning" : it.sev === "ok" ? "checkmark.circle" : "info"} size={14}/>
            </div>
            <div className="vr-cons-content">
              <div className="vr-cons-title">{it.title}</div>
              <div className="vr-cons-body-text">{it.body}</div>
              <div className="vr-cons-refs">
                {it.refs.map((r, j) => <span key={j} className="vr-cons-ref">{r}</span>)}
              </div>
            </div>
            <div className="vr-cons-actions">
              <span className={`vr-cons-status vr-cons-status-${it.sev}`}>{it.status}</span>
              <button className="vr-cons-btn">Springen</button>
              <button className="vr-cons-btn">Lösen</button>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .vr-cons { height: 100%; display: flex; flex-direction: column; background: var(--t-window); }
        .vr-cons-body { flex: 1; overflow-y: auto; padding: 8px 24px 24px; }
        .vr-cons-row {
          display: flex; gap: 14px; align-items: flex-start;
          padding: 14px 16px;
          border-bottom: 0.5px solid var(--t-divider);
        }
        .vr-cons-row:hover { background: var(--t-hover); }
        .vr-cons-icon { width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; flex-shrink: 0; }
        .vr-cons-icon-warn { background: rgba(231,167,76,0.12); color: #e7a74c; }
        .vr-cons-icon-info { background: rgba(94,151,201,0.12); color: #5e97c9; }
        .vr-cons-icon-ok { background: rgba(95,163,128,0.12); color: #5fa380; }
        .vr-cons-content { flex: 1; min-width: 0; }
        .vr-cons-title { font-size: 13px; font-weight: 600; color: var(--t-pri); margin-bottom: 3px; }
        .vr-cons-body-text { font-size: 12px; color: var(--t-sec); line-height: 1.5; margin-bottom: 6px; }
        .vr-cons-refs { display: flex; gap: 6px; flex-wrap: wrap; }
        .vr-cons-ref {
          font-size: 10.5px;
          padding: 2px 8px;
          background: var(--t-card2);
          border: 0.5px solid var(--t-border);
          color: var(--t-sec);
          border-radius: 3px;
        }
        .vr-cons-actions { display: flex; align-items: center; gap: 6px; }
        .vr-cons-status { font-size: 10.5px; padding: 3px 8px; border-radius: 3px; }
        .vr-cons-status-warn { background: rgba(231,167,76,0.12); color: #e7a74c; }
        .vr-cons-status-info { background: rgba(94,151,201,0.12); color: #5e97c9; }
        .vr-cons-status-ok { background: rgba(95,163,128,0.12); color: #5fa380; }
        .vr-cons-btn {
          padding: 4px 10px; font-size: 11px;
          background: transparent;
          border: 0.5px solid var(--t-border);
          border-radius: 4px;
          color: var(--t-sec); cursor: pointer; font-family: inherit;
        }
      `}</style>
    </div>
  );
}

// ════════════════ STYLE REVIEWER ════════════════
function RouteStyle() {
  return (
    <div className="vr-style">
      <div className="vr-style-head">
        <div>
          <div className="vr-style-title">Stil-Reviewer</div>
          <div className="vr-style-sub">Buch II · Kapitel 7 · Stilprofil „nüchtern" · 12 Vorschläge</div>
        </div>
        <div className="vr-style-stat">
          <span>Lesbarkeit</span>
          <strong>72</strong>
          <span className="vr-style-stat-delta">↑ 6</span>
        </div>
      </div>
      <div className="vr-style-body">
        {[
          { tag: "Tempo", from: "Aleksander nickte, weil ihm nichts Besseres einfiel.", to: "Aleksander nickte stumm, sein Blick auf den Bahnsteig geheftet.", reason: "aktiver, weniger Erklärung" },
          { tag: "Adverbien", from: "Sie sah ihn überraschenderweise direkt an.", to: "Ihre Augen trafen ihn ohne Umweg.", reason: "Adverb in Bild aufgelöst" },
          { tag: "Wortwiederholung", from: "…der Brief. Der Brief war schwer.", to: "…der Brief. Er war schwer geworden.", reason: "Pronomen statt Wiederholung" },
          { tag: "Satzanfang", from: "Es war kurz nach fünf, als er den Brief…", to: "Kurz nach fünf zog er den Brief…", reason: "starkes Verb am Anfang" },
        ].map((s, i) => (
          <div key={i} className="vr-style-card">
            <div className="vr-style-card-head">
              <span className="vr-style-tag">{s.tag}</span>
              <span className="vr-style-line">Kap. 7 · Zeile {12 + i*4}</span>
              <span style={{flex: 1}}/>
              <button className="vr-style-btn vr-style-btn-prim">Übernehmen</button>
              <button className="vr-style-btn">Verwerfen</button>
              <button className="vr-style-btn">Lernen</button>
            </div>
            <div className="vr-style-diff">
              <div className="vr-style-from">{s.from}</div>
              <div className="vr-style-to">{s.to}</div>
            </div>
            <div className="vr-style-reason">{s.reason}</div>
          </div>
        ))}
      </div>
      <style>{`
        .vr-style { height: 100%; display: flex; flex-direction: column; background: var(--t-window); }
        .vr-style-head { padding: 18px 24px; border-bottom: 0.5px solid var(--t-divider); display: flex; align-items: center; justify-content: space-between; }
        .vr-style-title { font-family: "Iowan Old Style", Georgia, serif; font-size: 22px; font-weight: 500; color: var(--t-pri); }
        .vr-style-sub { font-size: 12px; color: var(--t-ter); margin-top: 3px; }
        .vr-style-stat { display: flex; align-items: baseline; gap: 8px; padding: 8px 16px; background: var(--t-card); border: 0.5px solid var(--t-border); border-radius: 8px; }
        .vr-style-stat span { font-size: 11px; color: var(--t-ter); }
        .vr-style-stat strong { font-family: "Iowan Old Style", Georgia, serif; font-size: 26px; color: var(--t-pri); }
        .vr-style-stat-delta { color: #5fa380 !important; font-size: 11px; }
        .vr-style-body { flex: 1; overflow-y: auto; padding: 16px 24px; display: flex; flex-direction: column; gap: 12px; }
        .vr-style-card { padding: 14px 16px; background: var(--t-card); border: 0.5px solid var(--t-border); border-radius: 8px; }
        .vr-style-card-head { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
        .vr-style-tag {
          font-size: 10.5px; padding: 2px 8px;
          background: var(--t-accent-soft); color: var(--t-accent);
          border-radius: 3px;
          letter-spacing: 0.02em;
        }
        .vr-style-line { font-size: 11px; color: var(--t-ter); }
        .vr-style-btn {
          padding: 4px 10px; font-size: 11px;
          background: transparent;
          border: 0.5px solid var(--t-border);
          border-radius: 4px;
          color: var(--t-sec); cursor: pointer; font-family: inherit;
        }
        .vr-style-btn-prim { background: var(--t-accent); border-color: var(--t-accent); color: white; }
        .vr-style-diff { font-family: "Iowan Old Style", Georgia, serif; font-size: 13.5px; line-height: 1.55; }
        .vr-style-from { color: var(--t-ter); text-decoration: line-through; padding: 6px 10px; background: rgba(231,76,76,0.06); border-radius: 4px; margin-bottom: 4px; }
        .vr-style-to { color: var(--t-pri); padding: 6px 10px; background: rgba(95,163,128,0.08); border-radius: 4px; }
        .vr-style-reason { font-size: 11px; color: var(--t-ter); margin-top: 8px; font-style: italic; }
      `}</style>
    </div>
  );
}

// ════════════════ PLOT-HELFER ════════════════
function RoutePlot() {
  return (
    <div className="vr-plot">
      <div className="vr-plot-head">
        <div>
          <div className="vr-plot-title">Plot-Helfer · Beat-Sheet</div>
          <div className="vr-plot-sub">Save the Cat! · Buch II — Salzwacht</div>
        </div>
        <div className="vr-plot-progress">
          <span>Akt II · 64% geschrieben</span>
          <div className="vr-plot-bar"><div style={{width: "64%"}}/></div>
        </div>
      </div>
      <div className="vr-plot-body">
        {[
          { act: "I", beat: "Opening Image", title: "Aleksander beim Telegrafen, allein", written: true, pct: 100 },
          { act: "I", beat: "Setup", title: "Vogelbahn-Routine, Naima taucht auf", written: true, pct: 100 },
          { act: "I", beat: "Catalyst", title: "Erster Brief im Depot", written: true, pct: 100 },
          { act: "II", beat: "Break Into Two", title: "Aleksander nimmt den Auftrag an", written: true, pct: 100 },
          { act: "II", beat: "B Story", title: "Naima & Aleksander · Annäherung", written: true, pct: 80 },
          { act: "II", beat: "Fun & Games", title: "Schmugglerpfade durch den Aschemund", written: true, pct: 100 },
          { act: "II", beat: "Midpoint", title: "Brief am Bahnsteig — Wendepunkt", written: "wip", pct: 65, note: "Du arbeitest hier gerade." },
          { act: "II", beat: "Bad Guys Close In", title: "Henrik Salm findet das Depot", written: false, pct: 0 },
          { act: "II", beat: "All Is Lost", title: "Naima verschwindet", written: false, pct: 0 },
          { act: "III", beat: "Finale", title: "Konfrontation · Hellberg-Anwesen", written: false, pct: 0, note: "AI-Vorschlag verfügbar" },
        ].map((b, i) => (
          <div key={i} className={`vr-beat ${b.written === true ? "vr-beat-done" : b.written === "wip" ? "vr-beat-wip" : "vr-beat-todo"}`}>
            <div className="vr-beat-act">Akt {b.act}</div>
            <div className="vr-beat-name">{b.beat}</div>
            <div className="vr-beat-title">{b.title}</div>
            <div className="vr-beat-status">
              <div className="vr-beat-bar"><div style={{width: `${b.pct}%`}}/></div>
              <span>{b.pct}%</span>
            </div>
            {b.note && <div className="vr-beat-note">{b.note}</div>}
          </div>
        ))}
      </div>
      <style>{`
        .vr-plot { height: 100%; display: flex; flex-direction: column; background: var(--t-window); }
        .vr-plot-head { padding: 18px 24px; border-bottom: 0.5px solid var(--t-divider); display: flex; align-items: center; justify-content: space-between; }
        .vr-plot-title { font-family: "Iowan Old Style", Georgia, serif; font-size: 22px; font-weight: 500; color: var(--t-pri); }
        .vr-plot-sub { font-size: 12px; color: var(--t-ter); margin-top: 3px; }
        .vr-plot-progress { display: flex; flex-direction: column; gap: 6px; align-items: flex-end; min-width: 200px; }
        .vr-plot-progress > span { font-size: 11px; color: var(--t-sec); }
        .vr-plot-bar { width: 200px; height: 4px; background: var(--t-hover); border-radius: 2px; overflow: hidden; }
        .vr-plot-bar > div { height: 100%; background: var(--t-accent); }
        .vr-plot-body { flex: 1; overflow-y: auto; padding: 8px 24px 24px; }
        .vr-beat {
          display: grid; grid-template-columns: 56px 140px 1fr 180px;
          align-items: center; gap: 16px;
          padding: 12px 14px;
          border-bottom: 0.5px solid var(--t-divider);
        }
        .vr-beat:hover { background: var(--t-hover); }
        .vr-beat-act { font-family: "Iowan Old Style", Georgia, serif; font-size: 18px; color: var(--t-ter); }
        .vr-beat-name { font-size: 11px; letter-spacing: 0.03em; text-transform: uppercase; color: var(--t-sec); }
        .vr-beat-title { font-size: 13px; color: var(--t-pri); }
        .vr-beat-status { display: flex; align-items: center; gap: 8px; }
        .vr-beat-bar { flex: 1; height: 3px; background: var(--t-hover); border-radius: 2px; overflow: hidden; }
        .vr-beat-bar > div { height: 100%; background: var(--t-ter); }
        .vr-beat-status > span { font-size: 11px; color: var(--t-ter); width: 32px; text-align: right; }
        .vr-beat-done .vr-beat-bar > div { background: #5fa380; }
        .vr-beat-wip .vr-beat-bar > div { background: var(--t-accent); }
        .vr-beat-wip { background: var(--t-card); }
        .vr-beat-note { grid-column: 3 / -1; font-size: 11px; color: var(--t-accent); font-style: italic; margin-top: 2px; }
      `}</style>
    </div>
  );
}

// ════════════════ Library — Werke-Übersicht ════════════════
function RouteLibrary() {
  const works = [
    { title: "Die Eiserne Stunde", sub: "Reihe · 3 Bücher · 2024–", words: 187420, status: "in Arbeit", spine: "linear-gradient(135deg, #5a1f29, #2d1318)", initials: "ES", active: true },
    { title: "Salzlieder", sub: "Erzählband · 12 Geschichten", words: 41330, status: "Lektorat", spine: "linear-gradient(135deg, #2a3a4a, #14202a)", initials: "SL" },
    { title: "Brief an Anna", sub: "Novelle · 1 Buch · 2023", words: 28110, status: "Veröffentlicht", spine: "linear-gradient(135deg, #3a4a3a, #1a2a1a)", initials: "BA" },
    { title: "Der lange Sommer", sub: "Roman · Entwurf", words: 11200, status: "Entwurf", spine: "linear-gradient(135deg, #4a3a2a, #2a201a)", initials: "LS" },
    { title: "Werkstatt-Notizen", sub: "Tagebuch · seit 2021", words: 64200, status: "fortlaufend", spine: "linear-gradient(135deg, #3a3a3a, #1a1a1a)", initials: "WN" },
  ];
  return (
    <div className="vr-grid">
      <GridHeader
        count={5}
        label="Alle Werke · 332.260 Wörter gesamt"
        filters={[
          { label: "Alle", count: 5, active: true },
          { label: "In Arbeit", count: 2 },
          { label: "Veröffentlicht", count: 1 },
        ]}
      />
      <div className="vr-grid-body">
        <div className="vr-lib-grid">
          {works.map((w, i) => (
            <div key={i} className={`vr-libcard ${w.active ? "vr-libcard-active" : ""}`}>
              <div className="vr-libspine" style={{background: w.spine}}>
                <span>{w.initials}</span>
              </div>
              <div className="vr-libmeta">
                <div className="vr-libname">{w.title}</div>
                <div className="vr-libsub">{w.sub}</div>
                <div className="vr-libstats">
                  <span>{w.words.toLocaleString("de-DE")} Wörter</span>
                  <span className="vr-libdot">·</span>
                  <span>{w.status}</span>
                </div>
              </div>
              {w.active && <span className="vr-libactive-badge">Aktiv</span>}
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .vr-lib-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
        .vr-libcard {
          display: flex; gap: 14px; align-items: center;
          padding: 16px;
          background: var(--t-card);
          border: 0.5px solid var(--t-border);
          border-radius: 8px;
          position: relative;
          cursor: pointer;
        }
        .vr-libcard:hover { border-color: var(--t-border-strong); }
        .vr-libcard-active { border-color: var(--t-accent); background: linear-gradient(135deg, var(--t-accent-soft), var(--t-card)); }
        .vr-libspine {
          width: 56px; height: 80px;
          border-radius: 4px;
          display: grid; place-items: center;
          color: rgba(255,255,255,0.85);
          font-family: "Iowan Old Style", Georgia, serif;
          font-size: 19px;
          font-weight: 500;
          box-shadow: 1px 0 0 rgba(0,0,0,0.4), inset 0 0 0 0.5px rgba(255,255,255,0.08);
          flex-shrink: 0;
        }
        .vr-libmeta { flex: 1; min-width: 0; }
        .vr-libname { font-family: "Iowan Old Style", Georgia, serif; font-size: 18px; color: var(--t-pri); }
        .vr-libsub { font-size: 12px; color: var(--t-sec); margin-top: 2px; }
        .vr-libstats { font-size: 11px; color: var(--t-ter); margin-top: 8px; display: flex; gap: 6px; }
        .vr-libdot { opacity: 0.5; }
        .vr-libactive-badge {
          position: absolute; top: 12px; right: 12px;
          font-size: 10px; padding: 2px 8px;
          background: var(--t-accent); color: white;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}

// Stubs that reuse grid for items we don't fully detail
function RouteMagic() {
  const items = [
    { name: "Salzschriften", type: "System", desc: "Bindung durch beschriftetes Salz. Funktioniert nur am Aschemund.", img: "linear-gradient(135deg, #4a4a3a, #20201a)", icon: "✺", tags: ["Hard Magic"] },
    { name: "Vogelbahn-Lieder", type: "Ritus", desc: "Mündliche Codes der Schmuggler. Ähnliche Logik wie Sprechgesang.", img: "linear-gradient(135deg, #3a3a4a, #1a1a24)", icon: "♪", tags: ["Soft"] },
    { name: "Eiserne Bindungen", type: "Effekt", desc: "Eisen wirkt unterdrückend. Henrik trägt einen Ring.", img: "linear-gradient(135deg, #2a2a2a, #0a0a0a)", icon: "⛓", tags: ["Antagonist"] },
    { name: "Hellberg-Pakte", type: "System", desc: "Familiäre Bindungen über Generationen. Nicht freiwillig auflösbar.", img: "linear-gradient(135deg, #4a3030, #20141a)", icon: "✠", tags: ["Lore"] },
  ];
  return (
    <div className="vr-grid">
      <GridHeader count={4} label="Magie & Systeme · 4 Einträge"
        filters={[{label: "Alle", count: 4, active: true}, {label: "Hard", count: 2}, {label: "Soft", count: 2}]} />
      <div className="vr-grid-body">
        <div className="vr-grid-cards">{items.map((p, i) => <PlaceCard key={i} {...p} scenes={3+i} />)}</div>
      </div>
    </div>
  );
}

function RouteConcepts() {
  const items = [
    { name: "Vogelschneise", desc: "Hochland-Region · politisch eigenständig · Vogelbahn-Heimat", count: 14 },
    { name: "Eiserne Linie", desc: "Stillgelegte Bahn · Symbol des alten Regimes", count: 19 },
    { name: "Aschemund-Salz", desc: "Wirtschaftliche Grundlage Salzwachts", count: 22 },
    { name: "Die Stunde", desc: "Titel-Konzept · namensgebende Übergangsphase", count: 9 },
    { name: "Hellberg-Familie", desc: "Adelsdynastie · Eigentümer der Salzraffinerie", count: 17 },
    { name: "Vogelbahn-Slang", desc: "Sprache der Schmuggler · 80+ Begriffe dokumentiert", count: 31 },
    { name: "Telegrafische Codes", desc: "Aleksanders Berufswelt · 12 Codes im Werk", count: 12 },
    { name: "Briefe als Motiv", desc: "Wiederkehrend in jedem Akt", count: 8 },
    { name: "Naimas Mantel", desc: "Bedeutung wechselt durchs Buch", count: 6 },
  ];
  return (
    <div className="vr-grid">
      <GridHeader count={9} label="Konzepte · 9 Einträge"
        filters={[{label: "Alle", count: 9, active: true}, {label: "Welt", count: 5}, {label: "Motive", count: 4}]} sort="Häufigkeit" />
      <div className="vr-grid-body">
        <div className="vr-concept-grid">
          {items.map((c, i) => (
            <div key={i} className="vr-concept">
              <div className="vr-concept-name">{c.name}</div>
              <div className="vr-concept-desc">{c.desc}</div>
              <div className="vr-concept-count">{c.count} Erwähnungen</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .vr-concept-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .vr-concept { padding: 14px 16px; background: var(--t-card); border: 0.5px solid var(--t-border); border-radius: 8px; }
        .vr-concept-name { font-family: "Iowan Old Style", Georgia, serif; font-size: 15px; color: var(--t-pri); margin-bottom: 4px; }
        .vr-concept-desc { font-size: 11.5px; color: var(--t-sec); line-height: 1.45; }
        .vr-concept-count { font-size: 10.5px; color: var(--t-ter); margin-top: 8px; }
      `}</style>
    </div>
  );
}

// generic stubs use inbox-style list
function RouteFactions() { return <RouteGenericList title="Fraktionen" count={4} items={[
  {n: "Eisenbahn-Polizei", d: "Inspektor Salm · Gegenspieler-Organisation", b: "32 Auftritte"},
  {n: "Vogelbahn", d: "Schmuggler-Netz · Aleksanders Auftraggeber", b: "47 Auftritte"},
  {n: "Hellberg-Familie", d: "Adelsdynastie · Auftraggeber im Hintergrund", b: "11 Auftritte"},
  {n: "Lichtsucher", d: "Religiöse Sekte · Buch III relevant", b: "3 Auftritte"},
]}/>; }

function RouteTimeline() { return <RouteGenericList title="Zeitlinie" count={28} items={[
  {n: "1893", d: "Stilllegung der Eisernen Strecke", b: "vor Buch I"},
  {n: "1898", d: "Aleksander beginnt bei Telegrafenamt", b: "Backstory"},
  {n: "1905, Frühjahr", d: "Aleksander wechselt zur Vogelbahn", b: "Buch I, Kap. 1"},
  {n: "1906, August", d: "Erste Begegnung mit Naima", b: "Buch II, Kap. 1"},
  {n: "1906, Oktober", d: "Brief am Bahnsteig", b: "Buch II, Kap. 7 · aktuell"},
  {n: "1906, November", d: "Konfrontation Hellberg", b: "Buch III, Kap. 4 · geplant"},
]}/>; }

function RouteNotes() { return <RouteGenericList title="Notizen & Recherche" count={23} items={[
  {n: "Telegrafentechnik um 1900", d: "Recherchenotiz · 4 Quellen", b: "Buch I+II"},
  {n: "Salzgewinnung Aschemund", d: "Geologie · Wirtschaft · Sozialgefüge", b: "Buch II"},
  {n: "Schmuggler-Slang", d: "Vokabular-Liste · 80 Begriffe", b: "alle Bücher"},
  {n: "Vogel-Symbolik", d: "Motivische Notizen", b: "alle Bücher"},
  {n: "Karte: Aschemund-Region", d: "Skizze · digital nachgezeichnet", b: "Buch I+II"},
  {n: "Lektorat-Hinweise (Buch I)", d: "23 offene Punkte vom Lektor", b: "Buch I"},
]}/>; }

function RouteInbox() { return <RouteGenericList title="Inbox" count={3} items={[
  {n: "Kapitel-Idee: Naimas Mutter", d: "Sprachmemo · 2 Min", b: "vor 4 h"},
  {n: "Recherche: Bahnpolizei-Uniformen 1906", d: "Web-Clip", b: "vor 2 d"},
  {n: "Notiz: \u201Eder Brief war schwer geworden\u201C", d: "Schnellnotiz", b: "vor 5 d"},
]}/>; }

function RouteGenericList({ title, count, items }) {
  return (
    <div className="vr-grid">
      <GridHeader count={count} label={`${title} · ${count} Einträge`}
        filters={[{label: "Alle", count, active: true}]} />
      <div className="vr-grid-body">
        <div className="vr-glist">
          {items.map((it, i) => (
            <div key={i} className="vr-glist-row">
              <div className="vr-glist-dot"/>
              <div className="vr-glist-main">
                <div className="vr-glist-name">{it.n}</div>
                <div className="vr-glist-desc">{it.d}</div>
              </div>
              <div className="vr-glist-meta">{it.b}</div>
              <button className="vr-glist-arrow"><VIcon name="chevron.right" size={11}/></button>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .vr-glist { background: var(--t-card); border: 0.5px solid var(--t-border); border-radius: 8px; }
        .vr-glist-row {
          display: flex; align-items: center; gap: 14px;
          padding: 12px 16px;
          border-bottom: 0.5px solid var(--t-divider);
        }
        .vr-glist-row:last-child { border-bottom: 0; }
        .vr-glist-row:hover { background: var(--t-hover); }
        .vr-glist-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--t-accent); flex-shrink: 0; }
        .vr-glist-main { flex: 1; min-width: 0; }
        .vr-glist-name { font-size: 13px; color: var(--t-pri); }
        .vr-glist-desc { font-size: 11.5px; color: var(--t-sec); margin-top: 2px; }
        .vr-glist-meta { font-size: 11px; color: var(--t-ter); }
        .vr-glist-arrow { background: transparent; border: 0; color: var(--t-ter); cursor: pointer; padding: 4px; }
      `}</style>
    </div>
  );
}

// Dashboard / Book
function RouteDashboard() {
  return (
    <div className="vr-dash">
      <div className="vr-dash-hero">
        <div>
          <div className="vr-dash-eyebrow">Aktiv · zuletzt vor 4 Min</div>
          <h1 className="vr-dash-title">Buch II — Salzwacht</h1>
          <div className="vr-dash-sub">Reihe „Die Eiserne Stunde" · Akt II · 64% geschrieben</div>
        </div>
        <button className="vr-dash-resume"><VIcon name="rocket" size={12}/> Weiter schreiben</button>
      </div>
      <div className="vr-dash-grid">
        {[
          {l: "Wörter", v: "67.420", d: "+1.842 diese Woche"},
          {l: "Kapitel", v: "11 / 17", d: "geschrieben / geplant"},
          {l: "Figuren", v: "17", d: "5 mit POV"},
          {l: "Konsistenz", v: "3", d: "offene Hinweise"},
        ].map((s, i) => (
          <div key={i} className="vr-dash-stat">
            <div className="vr-dash-stat-l">{s.l}</div>
            <div className="vr-dash-stat-v">{s.v}</div>
            <div className="vr-dash-stat-d">{s.d}</div>
          </div>
        ))}
      </div>
      <style>{`
        .vr-dash { padding: 28px 32px; height: 100%; overflow-y: auto; background: var(--t-window); }
        .vr-dash-hero { display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 28px; border-bottom: 0.5px solid var(--t-divider); margin-bottom: 28px; }
        .vr-dash-eyebrow { font-size: 11px; color: var(--t-ter); letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 6px; }
        .vr-dash-title { font-family: "Iowan Old Style", Georgia, serif; font-size: 42px; font-weight: 500; margin: 0; color: var(--t-pri); }
        .vr-dash-sub { font-size: 13px; color: var(--t-sec); margin-top: 6px; }
        .vr-dash-resume {
          display: inline-flex; gap: 6px; align-items: center;
          padding: 8px 16px;
          background: var(--t-accent); color: white;
          border: 0; border-radius: 6px;
          font-size: 12.5px; font-weight: 500; cursor: pointer; font-family: inherit;
        }
        .vr-dash-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .vr-dash-stat { padding: 16px 18px; background: var(--t-card); border: 0.5px solid var(--t-border); border-radius: 8px; }
        .vr-dash-stat-l { font-size: 11px; color: var(--t-ter); letter-spacing: 0.04em; text-transform: uppercase; }
        .vr-dash-stat-v { font-family: "Iowan Old Style", Georgia, serif; font-size: 32px; font-weight: 500; color: var(--t-pri); margin-top: 4px; }
        .vr-dash-stat-d { font-size: 11px; color: var(--t-sec); margin-top: 4px; }
      `}</style>
    </div>
  );
}

function RouteBook() { return <RouteDashboard />; }

Object.assign(window, { RouteChat, RouteConsistency, RouteStyle, RoutePlot, RouteLibrary, RouteMagic, RouteConcepts, RouteFactions, RouteTimeline, RouteNotes, RouteInbox, RouteDashboard, RouteBook, RouteGenericList });
