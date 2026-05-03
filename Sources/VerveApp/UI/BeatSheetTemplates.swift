import Foundation

/// Vorgefertigte Beat-Sheet-Schablonen. Jede Schablone listet Beats mit
/// Label, knapper Beschreibung und einem typischen Position-Prozentwert,
/// damit die Pacing-Visualisierung die Beats sinnvoll auf der Buchachse
/// verorten kann. Bewusst kuratiert, nicht als KI-generiertes Label-
/// Bingo — der Wert dieser Sheets liegt in den klaren Wendepunkten.
public enum BeatSheetTemplate: String, CaseIterable, Identifiable, Sendable {
    case threeAct
    case saveTheCat
    case herosJourney

    public var id: String { rawValue }

    public var label: String {
        switch self {
        case .threeAct:     return "Drei-Akt-Struktur"
        case .saveTheCat:   return "Save the Cat (Snyder)"
        case .herosJourney: return "Heldenreise (Vogler)"
        }
    }

    public var summary: String {
        switch self {
        case .threeAct:     return "Klassische 7-Beat-Struktur — ideal für den ersten Aufbau."
        case .saveTheCat:   return "15 Beats à la Blake Snyder — sehr engmaschig, sehr hollywoodesk."
        case .herosJourney: return "12 Stationen nach Vogler — passt für Quests und Coming-of-Age."
        }
    }

    public struct BeatTemplate: Sendable {
        public let label: String
        public let description: String
        public let percent: Int
    }

    /// Akte der Schablone, je mit Label, Prozentbereich und Akzentfarbton
    /// (HSL-Hue-Versatz vom App-Akzent). Beats werden im Plot-Board nach
    /// dieser Range in Akt-Spalten einsortiert.
    public struct ActSpan: Sendable {
        public let label: String
        public let percentRange: ClosedRange<Int>
        public let hueShift: Double
    }

    public var acts: [ActSpan] {
        switch self {
        case .threeAct:
            return [
                .init(label: "Akt I — Aufbruch",   percentRange: 0...24,   hueShift: 0),
                .init(label: "Akt II — Konflikt",  percentRange: 25...74,  hueShift: 24),
                .init(label: "Akt III — Auflösung",percentRange: 75...100, hueShift: -16),
            ]
        case .saveTheCat:
            return [
                .init(label: "Akt I — Setup",       percentRange: 0...24,   hueShift: 0),
                .init(label: "Akt II A — Spaß",     percentRange: 25...49,  hueShift: 16),
                .init(label: "Akt II B — Druck",    percentRange: 50...74,  hueShift: 32),
                .init(label: "Akt III — Finale",    percentRange: 75...100, hueShift: -16),
            ]
        case .herosJourney:
            return [
                .init(label: "Gewohnte Welt",       percentRange: 0...24,   hueShift: 0),
                .init(label: "Reise in die Fremde", percentRange: 25...74,  hueShift: 24),
                .init(label: "Rückkehr",            percentRange: 75...100, hueShift: -16),
            ]
        }
    }

    public var beats: [BeatTemplate] {
        switch self {
        case .threeAct:
            return [
                .init(label: "Setup", description: "Welt, Figuren, Status quo etablieren.", percent: 0),
                .init(label: "Auslöser", description: "Etwas bricht in den Alltag ein und stellt eine Frage.", percent: 12),
                .init(label: "Plot Point I", description: "Die Hauptfigur bricht in den neuen Konflikt auf — kein Zurück.", percent: 25),
                .init(label: "Mittelpunkt", description: "Wendung in der Mitte — die Stakes ändern sich.", percent: 50),
                .init(label: "Plot Point II", description: "Tiefster Punkt; alles scheint verloren.", percent: 75),
                .init(label: "Höhepunkt", description: "Konfrontation, finale Entscheidung der Hauptfigur.", percent: 90),
                .init(label: "Auflösung", description: "Neue Normalität, Echo der Themen.", percent: 100),
            ]
        case .saveTheCat:
            return [
                .init(label: "Eröffnungsbild",   description: "Erster visueller Eindruck — Stimmung, Tonfall.",                       percent: 0),
                .init(label: "Thema",            description: "Das Thema des Werks wird ausgesprochen — leise.",                      percent: 5),
                .init(label: "Setup",            description: "Welt, Figuren, das, was sich gleich ändern wird.",                     percent: 10),
                .init(label: "Katalysator",      description: "Der Anlass — die Hauptfigur kann nicht mehr im Status quo bleiben.",  percent: 12),
                .init(label: "Debatte",          description: "Soll ich? — innerer Widerstand, Nachfrage.",                          percent: 18),
                .init(label: "Aufbruch in Akt 2",description: "Hauptfigur trifft die Entscheidung — neue Welt.",                     percent: 25),
                .init(label: "B-Story",          description: "Ein Nebenstrang öffnet sich, oft Liebes- oder Mentor-Linie.",         percent: 30),
                .init(label: "Spaß und Spiel",   description: "Das Versprechen des Genres — was hat den Leser angelockt?",           percent: 38),
                .init(label: "Mittelpunkt",      description: "Falscher Sieg oder falsche Niederlage. Alles dreht sich.",            percent: 50),
                .init(label: "Bösewichte ziehen an", description: "Druck steigt, Gegner formieren sich neu.",                        percent: 62),
                .init(label: "Alles verloren",   description: "Zusammenbruch — was bisher trug, trägt nicht mehr.",                  percent: 75),
                .init(label: "Dunkle Nacht",     description: "Innere Reflexion, Tiefpunkt der Hauptfigur.",                          percent: 80),
                .init(label: "Aufbruch in Akt 3",description: "Erkenntnis, neuer Plan, finale Mission.",                              percent: 85),
                .init(label: "Finale",           description: "Konfrontation, Anwendung des Gelernten.",                              percent: 95),
                .init(label: "Schlussbild",      description: "Spiegel zum Eröffnungsbild — wie weit ist die Figur gekommen?",       percent: 100),
            ]
        case .herosJourney:
            return [
                .init(label: "Gewohnte Welt",         description: "Status quo der Hauptfigur, ihre Welt.",                             percent: 0),
                .init(label: "Ruf des Abenteuers",    description: "Eine Aufgabe, ein Geheimnis, eine Notlage.",                        percent: 8),
                .init(label: "Weigerung",             description: "Die Figur zögert — Angst, Pflicht, Zweifel.",                       percent: 12),
                .init(label: "Begegnung mit dem Mentor", description: "Hilfe, Wissen, oder ein Werkzeug taucht auf.",                  percent: 18),
                .init(label: "Überschreiten der Schwelle", description: "Aufbruch in die fremde Welt.",                                 percent: 25),
                .init(label: "Prüfungen, Verbündete, Feinde", description: "Erste Lektionen in der neuen Realität.",                    percent: 35),
                .init(label: "Vordringen zur tiefsten Höhle", description: "Vorbereitung auf die zentrale Prüfung.",                    percent: 50),
                .init(label: "Entscheidende Prüfung", description: "Konfrontation mit dem Hauptkonflikt — mythologischer Tod.",        percent: 60),
                .init(label: "Belohnung",             description: "Erkenntnis, Schatz oder Verbündeter — was die Reise wert war.",     percent: 70),
                .init(label: "Rückweg",               description: "Verfolgung, Eskalation — Rückkehr ist nicht trivial.",              percent: 80),
                .init(label: "Auferstehung",          description: "Letzte Prüfung — die Figur beweist, was sie geworden ist.",         percent: 90),
                .init(label: "Rückkehr mit dem Elixier", description: "Heimkehr, neue Normalität, das Geschenk an die alte Welt.",      percent: 100),
            ]
        }
    }
}
