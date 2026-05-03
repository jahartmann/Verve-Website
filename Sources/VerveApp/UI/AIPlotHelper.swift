import Foundation
import VerveCore

/// KI-Plot-Hilfen für das Plot-Board. Drei klar abgegrenzte Funktionen:
/// • **Synopse generieren** — liest den Kapitel-Text, schreibt 2–3 Sätze
/// • **Tension einschätzen** — gibt einen Wert 0–10 zurück
/// • **Plot-Diagnose** — analysiert alle Kapitel im Verhältnis zum Beat-
///   Sheet und meldet Lücken, Spannungs-Tiefen und unverknüpfte Beats
///
/// Alle Aufrufe sind Single-Shot mit dem Deep-Routing-Modell. Keine
/// Background-Coordinator-Jobs, weil das hier explizit auf Knopfdruck
/// passiert und der Autor das Ergebnis sofort sehen will.
@MainActor
public enum AIPlotHelper {

    public enum HelperError: Error {
        case noClient
        case empty
        case underlying(Error)
    }

    // MARK: - Synopse

    public static func generateSynopsis(for chapter: VChapter,
                                         ki: KIProviderStore) async throws -> String
    {
        guard let client = ki.makeClient(for: .deep) ?? ki.makeClient() else {
            throw HelperError.noClient
        }
        let preview = chapter.text.prefix(4000)
        let prompt = """
        Du bist Lektor. Schreib eine knappe Synopsis für dieses Kapitel —
        2 bis 3 Sätze, keine Vorrede, keine Anführungszeichen. Was passiert,
        wer treibt die Handlung, womit endet das Kapitel.

        Kapitel-Titel: \(chapter.title)
        \(chapter.pov.isEmpty ? "" : "POV: \(chapter.pov)")
        \(chapter.tense.isEmpty ? "" : "Tempus: \(chapter.tense)")

        Manuskript:
        \"\"\"
        \(preview)
        \"\"\"

        Antworte nur mit der Synopsis selbst, eine zusammenhängende Zeile
        oder ein kurzer Absatz.
        """
        let raw: String
        do {
            raw = try await client.generate(prompt: prompt)
        } catch {
            throw HelperError.underlying(error)
        }
        let cleaned = clean(raw)
        guard !cleaned.isEmpty else { throw HelperError.empty }
        return cleaned
    }

    // MARK: - Tension

    public static func estimateTension(for chapter: VChapter,
                                        ki: KIProviderStore) async throws -> Int
    {
        guard let client = ki.makeClient(for: .deep) ?? ki.makeClient() else {
            throw HelperError.noClient
        }
        let preview = chapter.text.prefix(3500)
        let prompt = """
        Schätz den Spannungs-Pegel dieses Kapitels auf einer Skala von 0 bis 10:
        0 = ruhig (Setup, Reflexion, Atmosphäre)
        5 = mittlere Spannung (Konflikt, Reibung)
        10 = Höhepunkt (Konfrontation, große Wendung, Lebensgefahr)

        Antworte mit GENAU einer Zahl zwischen 0 und 10. Kein Text, keine
        Vorrede, kein Kommentar — nur die Zahl.

        Kapitel: \(chapter.title)
        Auszug:
        \"\"\"
        \(preview)
        \"\"\"
        """
        let raw: String
        do {
            raw = try await client.generate(prompt: prompt)
        } catch {
            throw HelperError.underlying(error)
        }
        let trimmed = raw.trimmingCharacters(in: .whitespacesAndNewlines)
        if let n = Int(trimmed.prefix { $0.isNumber }) {
            return max(0, min(10, n))
        }
        // Fallback: erstes Match per Regex.
        if let r = trimmed.range(of: #"\d+"#, options: .regularExpression),
           let n = Int(trimmed[r])
        {
            return max(0, min(10, n))
        }
        throw HelperError.empty
    }

    // MARK: - Plot-Diagnose

    public struct DiagnosisIssue: Identifiable, Sendable {
        public enum Severity: String, Sendable { case warn, info }
        public let id = UUID()
        public let severity: Severity
        public let title: String
        public let detail: String
    }

    public static func analyzePlot(chapters: [VChapter], beats: [VBeat],
                                    ki: KIProviderStore) async throws -> [DiagnosisIssue]
    {
        var issues: [DiagnosisIssue] = []

        // Lokale Diagnostik — schnell und ohne KI:
        let unassignedBeats = beats.filter { $0.chapterID == nil }
        if !unassignedBeats.isEmpty {
            issues.append(DiagnosisIssue(
                severity: .warn,
                title: "\(unassignedBeats.count) Beats ohne Kapitel",
                detail: "Beats ohne Kapitel-Zuweisung verfehlen den Pacing-Anker. "
                    + "Betroffen: " + unassignedBeats.prefix(3).map(\.label).joined(separator: ", ")
                    + (unassignedBeats.count > 3 ? " …" : "")
            ))
        }

        let untaggedTension = chapters.filter { $0.tensionLevel == 0 }
        if untaggedTension.count >= 2 {
            issues.append(DiagnosisIssue(
                severity: .info,
                title: "\(untaggedTension.count) Kapitel ohne Spannungs-Wert",
                detail: "Pacing-Kurve hat Lücken, solange Tension 0 ist. "
                    + "Pflegen, oder per ✨ einschätzen lassen."
            ))
        }

        let lowTensionRun = longestRun(chapters: chapters,
                                        predicate: { (1...3).contains($0.tensionLevel) })
        if lowTensionRun >= 4 {
            issues.append(DiagnosisIssue(
                severity: .warn,
                title: "Lange ruhige Strecke (\(lowTensionRun) Kapitel)",
                detail: "Vier oder mehr Kapitel mit Tension ≤ 3 in Folge — "
                    + "der Leser könnte das Buch hier zur Seite legen."
            ))
        }

        let untaggedSynopsis = chapters.filter { $0.synopsis.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty }
        if untaggedSynopsis.count >= 3 {
            issues.append(DiagnosisIssue(
                severity: .info,
                title: "\(untaggedSynopsis.count) Kapitel ohne Synopsis",
                detail: "Eine kurze Synopsis hilft beim Plot-Refactoring — "
                    + "✨-Knopf an der Karte schreibt sie aus dem Manuskript."
            ))
        }

        // KI-Diagnose über die Synopsen — nur wenn es welche gibt.
        let synopsesText = chapters.enumerated()
            .compactMap { (i, c) -> String? in
                let syn = c.synopsis.trimmingCharacters(in: .whitespacesAndNewlines)
                guard !syn.isEmpty else { return nil }
                return "Kap. \(i + 1) (\(c.title)): \(syn)"
            }
            .joined(separator: "\n")
        guard !synopsesText.isEmpty,
              let client = ki.makeClient(for: .deep) ?? ki.makeClient()
        else { return issues }

        let prompt = """
        Du bist Plot-Doktor. Lies diese Kapitel-Synopsen in Erzähl-Reihenfolge
        und nenne maximal 3 strukturelle Probleme, die einer Lektorin in der
        ersten Lesefassung auffallen würden. Pro Problem ein Block:

        TITEL: <kurz, 4–8 Wörter>
        DETAIL: <ein oder zwei Sätze, konkret, mit Kapitel-Bezug>
        ---

        Was du suchst:
        • Spannungs-Plateaus (mehrere Kapitel in Folge ohne Eskalation)
        • Wiederholungen (gleiche Wendung zweimal)
        • fehlende Aufzahlung (Setup ohne Auflösung)
        • Unklare Stakes
        • Tempo-Brüche (zu schnell/zu langsam)

        Wenn alles passt, antworte mit dem Wort: PASST

        Synopsen:
        \(synopsesText)
        """

        let raw: String
        do {
            raw = try await client.generate(prompt: prompt)
        } catch {
            throw HelperError.underlying(error)
        }
        let body = raw.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !body.isEmpty, body.uppercased() != "PASST" else { return issues }

        let blocks = body.components(separatedBy: "---")
        for block in blocks.prefix(3) {
            var title = ""
            var detail = ""
            for line in block.split(whereSeparator: \.isNewline) {
                let s = String(line).trimmingCharacters(in: .whitespaces)
                if let r = s.range(of: #"(?i)^TITEL:\s*"#, options: .regularExpression) {
                    title = String(s[r.upperBound...]).trimmingCharacters(in: .whitespaces)
                } else if let r = s.range(of: #"(?i)^DETAIL:\s*"#, options: .regularExpression) {
                    detail = String(s[r.upperBound...]).trimmingCharacters(in: .whitespaces)
                } else if !s.isEmpty && !title.isEmpty && detail.isEmpty {
                    // Mehrzeiliges Detail.
                    detail = s
                }
            }
            if !title.isEmpty {
                issues.append(DiagnosisIssue(severity: .warn, title: title, detail: detail))
            }
        }
        return issues
    }

    // MARK: - Helpers

    private static func clean(_ raw: String) -> String {
        var s = raw.trimmingCharacters(in: .whitespacesAndNewlines)
        if s.uppercased() == "KEIN" { return "" }
        for prefix in ["Synopsis:", "Synopse:", "Antwort:", "Vorschlag:"] {
            if s.lowercased().hasPrefix(prefix.lowercased()) {
                s = String(s.dropFirst(prefix.count)).trimmingCharacters(in: .whitespacesAndNewlines)
            }
        }
        let openers: Set<Character> = ["\"", "'", "„", "«", "»"]
        let closers: Set<Character> = ["\"", "'", "“", "”", "«", "»"]
        if let first = s.first, openers.contains(first),
           let last = s.last, closers.contains(last),
           s.count >= 2
        {
            s = String(s.dropFirst().dropLast()).trimmingCharacters(in: .whitespaces)
        }
        return s
    }

    private static func longestRun(chapters: [VChapter],
                                    predicate: (VChapter) -> Bool) -> Int
    {
        var best = 0; var current = 0
        for c in chapters {
            if predicate(c) { current += 1; best = max(best, current) }
            else { current = 0 }
        }
        return best
    }

    // MARK: - fillCard

    public struct FillCardResult: Sendable {
        public let synopsis: String
        public let sceneGoal: String
        public let sceneConflict: String
        public let sceneOutcome: String
    }

    public static func buildFillCardPrompt(title: String, synopsis: String,
                                            context: String) -> String
    {
        var lines = [String]()
        lines.append("Du bist Plot-Dramaturg. Arbeite diese Szene aus —")
        lines.append("antworte in vier Feldern:")
        lines.append("")
        lines.append("SYNOPSIS: <2-3 Sätze, was passiert>")
        lines.append("ZIEL: <Was will die Hauptfigur erreichen?>")
        lines.append("KONFLIKT: <Was steht dem im Weg?>")
        lines.append("AUSGANG: <Wie endet die Szene? Was hat sich verändert?>")
        lines.append("")
        lines.append("Karten-Titel: \(title)")
        if !synopsis.isEmpty { lines.append("Vorlage: \(synopsis)") }
        if !context.isEmpty  { lines.append("Kontext: \(context)") }
        lines.append("")
        lines.append("Antworte NUR mit den vier Feldern, ohne Vorrede.")
        return lines.joined(separator: "\n")
    }

    public static func parseFillCardResponse(_ raw: String) throws -> FillCardResult {
        var synopsis = ""; var goal = ""; var conflict = ""; var outcome = ""
        for line in raw.split(whereSeparator: \.isNewline) {
            let s = String(line).trimmingCharacters(in: .whitespaces)
            if let r = s.range(of: #"^(?i)SYNOPSIS:\s*"#, options: .regularExpression) {
                synopsis = String(s[r.upperBound...]).trimmingCharacters(in: .whitespaces)
            } else if let r = s.range(of: #"^(?i)ZIEL:\s*"#, options: .regularExpression) {
                goal = String(s[r.upperBound...]).trimmingCharacters(in: .whitespaces)
            } else if let r = s.range(of: #"^(?i)KONFLIKT:\s*"#, options: .regularExpression) {
                conflict = String(s[r.upperBound...]).trimmingCharacters(in: .whitespaces)
            } else if let r = s.range(of: #"^(?i)AUSGANG:\s*"#, options: .regularExpression) {
                outcome = String(s[r.upperBound...]).trimmingCharacters(in: .whitespaces)
            }
        }
        return FillCardResult(synopsis: synopsis, sceneGoal: goal,
                              sceneConflict: conflict, sceneOutcome: outcome)
    }

    public static func fillCard(card: VPlotCard,
                                 ki: KIProviderStore) async throws -> FillCardResult
    {
        guard let client = ki.makeClient(for: .deep) ?? ki.makeClient() else {
            throw HelperError.noClient
        }
        let prompt = buildFillCardPrompt(title: card.title,
                                          synopsis: card.synopsis,
                                          context: "")
        let raw: String
        do { raw = try await client.generate(prompt: prompt) }
        catch { throw HelperError.underlying(error) }
        return try parseFillCardResponse(raw)
    }

    // MARK: - detectStrands

    public struct DetectedStrand: Sendable {
        public let title: String
        public let cardIndices: [Int]
    }

    public static func buildDetectStrandsPrompt(
        cards: [(title: String, synopsis: String)]
    ) -> String {
        let list = cards.enumerated()
            .map { "\($0.offset + 1). \($0.element.title): \($0.element.synopsis)" }
            .joined(separator: "\n")
        return """
        Du bist Plot-Architekt. Erkenne parallele Handlungsstränge in diesen Karten.
        Pro Strang ein Block:

        STRANG: <Name>
        KARTEN: <komma-getrennte Nummern>
        ---

        Karten:
        \(list)

        Antworte NUR mit den Strang-Blöcken. Maximal 5 Stränge.
        """
    }

    public static func parseDetectStrandsResponse(_ raw: String,
                                                    totalCards: Int) -> [DetectedStrand]
    {
        var result: [DetectedStrand] = []
        for block in raw.components(separatedBy: "---") {
            var title = ""
            var indices: [Int] = []
            for line in block.split(whereSeparator: \.isNewline) {
                let s = String(line).trimmingCharacters(in: .whitespaces)
                if let r = s.range(of: #"^(?i)STRANG:\s*"#, options: .regularExpression) {
                    title = String(s[r.upperBound...]).trimmingCharacters(in: .whitespaces)
                } else if let r = s.range(of: #"^(?i)KARTEN:\s*"#, options: .regularExpression) {
                    let nums = String(s[r.upperBound...])
                    indices = nums.components(separatedBy: ",")
                        .compactMap { Int($0.trimmingCharacters(in: .whitespaces)) }
                        .map { $0 - 1 }
                        .filter { $0 >= 0 && $0 < totalCards }
                }
            }
            if !title.isEmpty {
                result.append(DetectedStrand(title: title, cardIndices: indices))
            }
        }
        return result
    }

    public static func detectStrands(cards: [VPlotCard],
                                      ki: KIProviderStore) async throws -> [DetectedStrand]
    {
        guard !cards.isEmpty,
              let client = ki.makeClient(for: .deep) ?? ki.makeClient()
        else { throw HelperError.noClient }
        let input = cards.map { (title: $0.title, synopsis: $0.synopsis) }
        let prompt = buildDetectStrandsPrompt(cards: input)
        let raw: String
        do { raw = try await client.generate(prompt: prompt) }
        catch { throw HelperError.underlying(error) }
        return parseDetectStrandsResponse(raw, totalCards: cards.count)
    }

    // MARK: - analyzePacing

    public static func buildAnalyzePacingPrompt(
        cards: [(title: String, actPosition: Int, synopsis: String)]
    ) -> String {
        let list = cards.sorted(by: { $0.actPosition < $1.actPosition })
            .map { "\($0.actPosition) %  \($0.title): \($0.synopsis)" }
            .joined(separator: "\n")
        return """
        Du bist Lektor. Analysiere das Pacing der Plot-Karten.
        Maximal 3 Probleme. Pro Problem:

        PACING-PROBLEM: <kurz, 4-8 Wörter>
        DETAIL: <ein Satz, mit Prozent-Bereich>
        ---

        Wenn alles stimmig: antworte mit "PASST"

        Karten:
        \(list)
        """
    }

    public static func analyzePacing(cards: [VPlotCard],
                                      ki: KIProviderStore) async throws -> [DiagnosisIssue]
    {
        guard !cards.isEmpty,
              let client = ki.makeClient(for: .deep) ?? ki.makeClient()
        else { return [] }
        let input = cards.map { (title: $0.title,
                                 actPosition: $0.actPosition,
                                 synopsis: $0.synopsis) }
        let prompt = buildAnalyzePacingPrompt(cards: input)
        let raw: String
        do { raw = try await client.generate(prompt: prompt) }
        catch { throw HelperError.underlying(error) }
        let body = raw.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !body.isEmpty, body.uppercased() != "PASST" else { return [] }
        var issues: [DiagnosisIssue] = []
        for block in body.components(separatedBy: "---").prefix(3) {
            var title = ""; var detail = ""
            for line in block.split(whereSeparator: \.isNewline) {
                let s = String(line).trimmingCharacters(in: .whitespaces)
                if let r = s.range(of: #"^(?i)PACING-PROBLEM:\s*"#, options: .regularExpression) {
                    title = String(s[r.upperBound...]).trimmingCharacters(in: .whitespaces)
                } else if let r = s.range(of: #"^(?i)DETAIL:\s*"#, options: .regularExpression) {
                    detail = String(s[r.upperBound...]).trimmingCharacters(in: .whitespaces)
                }
            }
            if !title.isEmpty {
                issues.append(DiagnosisIssue(severity: .warn, title: title, detail: detail))
            }
        }
        return issues
    }

    // MARK: - analyzeCharacterArcs

    public struct CharacterArcIssue: Sendable, Identifiable {
        public let id = UUID()
        public let characterName: String
        public let issue: String
        public let suggestion: String
    }

    public static func buildAnalyzeCharacterArcsPrompt(
        characterNames: [String],
        cardSynopses: [String]
    ) -> String {
        let names = characterNames.joined(separator: ", ")
        let synopses = cardSynopses.enumerated()
            .map { "\($0.offset + 1). \($0.element)" }
            .joined(separator: "\n")
        return """
        Du bist Dramaturgin. Prüfe konsistente Entwicklungsbögen über die Plot-Karten.
        Pro Problem ein Block:

        FIGUR: <Name>
        PROBLEM: <ein Satz>
        VORSCHLAG: <ein Satz>
        ---

        Wenn alle Bögen stimmig: antworte mit "PASST"

        Figuren: \(names)

        Szenen:
        \(synopses)
        """
    }

    public static func analyzeCharacterArcs(characters: [String],
                                             cards: [VPlotCard],
                                             ki: KIProviderStore) async throws -> [CharacterArcIssue]
    {
        guard !characters.isEmpty, !cards.isEmpty,
              let client = ki.makeClient(for: .deep) ?? ki.makeClient()
        else { return [] }
        let synopses = cards.sorted(by: { $0.actPosition < $1.actPosition })
            .map { $0.synopsis.isEmpty ? $0.title : $0.synopsis }
        let prompt = buildAnalyzeCharacterArcsPrompt(
            characterNames: characters, cardSynopses: synopses
        )
        let raw: String
        do { raw = try await client.generate(prompt: prompt) }
        catch { throw HelperError.underlying(error) }
        let body = raw.trimmingCharacters(in: .whitespacesAndNewlines)
        guard body.uppercased() != "PASST" else { return [] }
        var result: [CharacterArcIssue] = []
        for block in body.components(separatedBy: "---").prefix(5) {
            var name = ""; var issue = ""; var suggestion = ""
            for line in block.split(whereSeparator: \.isNewline) {
                let s = String(line).trimmingCharacters(in: .whitespaces)
                if let r = s.range(of: #"^(?i)FIGUR:\s*"#, options: .regularExpression) {
                    name = String(s[r.upperBound...]).trimmingCharacters(in: .whitespaces)
                } else if let r = s.range(of: #"^(?i)PROBLEM:\s*"#, options: .regularExpression) {
                    issue = String(s[r.upperBound...]).trimmingCharacters(in: .whitespaces)
                } else if let r = s.range(of: #"^(?i)VORSCHLAG:\s*"#, options: .regularExpression) {
                    suggestion = String(s[r.upperBound...]).trimmingCharacters(in: .whitespaces)
                }
            }
            if !name.isEmpty {
                result.append(CharacterArcIssue(characterName: name,
                                                  issue: issue,
                                                  suggestion: suggestion))
            }
        }
        return result
    }

    // MARK: - Plot aus Manuskript extrahieren
    //
    // Liest die Synopsen / Kapiteltexte eines Werks und schlägt eine
    // komplette Plot-Struktur vor — Stränge mit Farbe + Karten je Strang,
    // jeweils einem Band (Reihen-Modus) oder einer Sektion (Werk-Modus)
    // zugeordnet. Damit kann ein Autor ein bestehendes Werk in die
    // Plot-Matrix hieven, ohne alles per Hand zu rekonstruieren.

    public struct ExtractedStrand: Sendable, Identifiable {
        public let id = UUID()
        public let title: String
        public let summary: String
        public let colorHex: String
        public let cards: [ExtractedCard]
    }

    public struct ExtractedCard: Sendable, Identifiable {
        public enum Function: String, Sendable { case normal, setup, payoff }
        public let id = UUID()
        public let title: String
        public let synopsis: String
        public let function: Function
        /// 1-basierter Band-Index. nil = Werk hat nur einen Band.
        public let bookIndex: Int?
        /// 1-basierter Sektions-Index. nil = keine Sektion zugeordnet.
        public let sectionIndex: Int?
    }

    public struct ChapterDigest: Sendable {
        public let bookIndex: Int       // 1-basiert
        public let bookTitle: String
        public let chapterIndex: Int    // 1-basiert pro Buch
        public let chapterTitle: String
        public let synopsis: String

        public init(bookIndex: Int, bookTitle: String,
                    chapterIndex: Int, chapterTitle: String,
                    synopsis: String)
        {
            self.bookIndex = bookIndex
            self.bookTitle = bookTitle
            self.chapterIndex = chapterIndex
            self.chapterTitle = chapterTitle
            self.synopsis = synopsis
        }
    }

    public static func buildExtractPrompt(
        digests: [ChapterDigest],
        sectionTitles: [String],
        bookCount: Int
    ) -> String
    {
        let linesByBook = Dictionary(grouping: digests, by: { $0.bookIndex })
            .sorted(by: { $0.key < $1.key })
        var manuscript = ""
        for (idx, group) in linesByBook {
            manuscript += "\nBand \(idx) — \(group.first?.bookTitle ?? "")\n"
            for c in group.sorted(by: { $0.chapterIndex < $1.chapterIndex }) {
                let snippet = c.synopsis.isEmpty ? "(keine Synopsis)" : c.synopsis
                manuscript += "  Kap. \(c.chapterIndex) – \(c.chapterTitle): \(snippet)\n"
            }
        }

        let sectionLine = sectionTitles.isEmpty
            ? ""
            : "Verfügbare Sektionen (1-basiert): " +
              sectionTitles.enumerated()
                .map { "\($0.offset + 1)=\($0.element)" }
                .joined(separator: ", ")
        let bookLine = bookCount > 1
            ? "Werk hat \(bookCount) Bänder (1-basiert)."
            : "Werk hat nur einen Band."

        return """
        Du bist Plot-Architekt. Analysiere das Manuskript und extrahiere die
        dramaturgische Struktur. Erkenne 3 bis 6 parallele Plot-Stränge
        (z. B. Hauptplot, Liebesplot, Antagonist, Familiengeheimnis) und pro
        Strang 3 bis 8 zentrale Plot-Karten.

        \(bookLine)
        \(sectionLine)

        Antwortformat – exakt einhalten:

        STRAND: <Kurzname>
        FARBE: <hex wie #7C3AED, #C2410C, #047857, #1D4ED8, #B45309, #92400E>
        ZUSAMMENFASSUNG: <ein Satz>
        KARTEN:
        - BAND:<n>|SEKTION:<n oder ->|FUNKTION:<setup|payoff|normal>|TITEL:<kurz>|SYNOPSIS:<ein Satz>
        - ...
        ---

        Regeln:
        - Wenn der Strang ein Setup hat, soll am Ende ein passender Payoff stehen.
        - Verwende nur Bänder, die existieren (1…\(bookCount)). „BAND:-" ist erlaubt für werk-übergreifende Karten.
        - Sektion ist optional. Wenn unklar, „SEKTION:-".
        - Halte Titel kurz (≤ 6 Wörter), Synopsis 1 Satz.

        Manuskript:
        \(manuscript)
        """
    }

    public static func parseExtractResponse(_ raw: String) -> [ExtractedStrand] {
        var strands: [ExtractedStrand] = []
        for block in raw.components(separatedBy: "---") {
            var title = ""; var color = "#7C3AED"; var summary = ""
            var cards: [ExtractedCard] = []
            var inCards = false
            for line in block.split(whereSeparator: \.isNewline) {
                let s = String(line).trimmingCharacters(in: .whitespaces)
                if let r = s.range(of: #"^(?i)STRAND:\s*"#, options: .regularExpression) {
                    title = String(s[r.upperBound...]).trimmingCharacters(in: .whitespaces)
                    inCards = false
                } else if let r = s.range(of: #"^(?i)FARBE:\s*"#, options: .regularExpression) {
                    let hex = String(s[r.upperBound...]).trimmingCharacters(in: .whitespaces)
                    if hex.hasPrefix("#") && hex.count >= 7 { color = String(hex.prefix(7)) }
                } else if let r = s.range(of: #"^(?i)ZUSAMMENFASSUNG:\s*"#, options: .regularExpression) {
                    summary = String(s[r.upperBound...]).trimmingCharacters(in: .whitespaces)
                } else if s.range(of: #"^(?i)KARTEN:"#, options: .regularExpression) != nil {
                    inCards = true
                } else if inCards, s.hasPrefix("-") {
                    let body = String(s.dropFirst()).trimmingCharacters(in: .whitespaces)
                    if let card = parseExtractCardLine(body) {
                        cards.append(card)
                    }
                }
            }
            if !title.isEmpty {
                strands.append(ExtractedStrand(title: title, summary: summary,
                                                colorHex: color, cards: cards))
            }
        }
        return strands
    }

    private static func parseExtractCardLine(_ body: String) -> ExtractedCard? {
        // Format: BAND:<n>|SEKTION:<n>|FUNKTION:<…>|TITEL:<…>|SYNOPSIS:<…>
        var book: Int? = nil
        var section: Int? = nil
        var fn: ExtractedCard.Function = .normal
        var title = ""
        var synopsis = ""
        for part in body.components(separatedBy: "|") {
            let kv = part.split(separator: ":", maxSplits: 1).map { String($0).trimmingCharacters(in: .whitespaces) }
            guard kv.count == 2 else { continue }
            let key = kv[0].uppercased()
            let val = kv[1]
            switch key {
            case "BAND":
                if let n = Int(val.prefix { $0.isNumber }), n > 0 { book = n }
            case "SEKTION":
                if let n = Int(val.prefix { $0.isNumber }), n > 0 { section = n }
            case "FUNKTION":
                switch val.lowercased() {
                case "setup":  fn = .setup
                case "payoff": fn = .payoff
                default:       fn = .normal
                }
            case "TITEL":
                title = val
            case "SYNOPSIS":
                synopsis = val
            default:
                continue
            }
        }
        guard !title.isEmpty else { return nil }
        return ExtractedCard(title: title, synopsis: synopsis,
                              function: fn,
                              bookIndex: book, sectionIndex: section)
    }

    public static func extractPlot(digests: [ChapterDigest],
                                    sectionTitles: [String],
                                    bookCount: Int,
                                    ki: KIProviderStore) async throws -> [ExtractedStrand]
    {
        guard !digests.isEmpty else { throw HelperError.empty }
        guard let client = ki.makeClient(for: .deep) ?? ki.makeClient() else {
            throw HelperError.noClient
        }
        let prompt = buildExtractPrompt(
            digests: digests,
            sectionTitles: sectionTitles,
            bookCount: bookCount
        )
        let raw: String
        do { raw = try await client.generate(prompt: prompt) }
        catch { throw HelperError.underlying(error) }
        let result = parseExtractResponse(raw)
        guard !result.isEmpty else { throw HelperError.empty }
        return result
    }

    // MARK: - Plot-Tipps (allgemeine Verbesserungsvorschläge)

    public struct PlotTip: Sendable, Identifiable {
        public enum Kind: String, Sendable {
            case strand    // fehlender / dünner Strang
            case pacing    // Pacing-Problem
            case payoff    // offener Faden
            case character // Figur unterbelichtet
            case general   // allgemeiner Hinweis
        }
        public let id = UUID()
        public let kind: Kind
        public let title: String
        public let detail: String
    }

    public static func buildTipsPrompt(
        strands: [(title: String, summary: String)],
        cardLines: [String],
        characterNames: [String],
        openSetups: [String]
    ) -> String
    {
        let strandList = strands.enumerated()
            .map { "\($0.offset + 1). \($0.element.title) — \($0.element.summary)" }
            .joined(separator: "\n")
        let cards = cardLines.enumerated()
            .map { "\($0.offset + 1). \($0.element)" }
            .joined(separator: "\n")
        let chars = characterNames.isEmpty ? "—" : characterNames.joined(separator: ", ")
        let openLine = openSetups.isEmpty
            ? ""
            : "Offene Setups (kein späterer Payoff):\n" +
              openSetups.map { "• \($0)" }.joined(separator: "\n")
        return """
        Du bist Lektorin. Schau dir den aktuellen Plot an und gib 3 bis 5
        konkrete Verbesserungsvorschläge. Pro Tipp ein Block:

        ART: <strand|pacing|payoff|character|general>
        TITEL: <kurz, 4-8 Wörter>
        DETAIL: <max. zwei Sätze, konkret und umsetzbar>
        ---

        Wenn alles solide wirkt: antworte mit "PASST".

        Stränge:
        \(strandList.isEmpty ? "—" : strandList)

        Karten (in Lese-Reihenfolge):
        \(cards.isEmpty ? "—" : cards)

        Figuren: \(chars)

        \(openLine)
        """
    }

    public static func parseTipsResponse(_ raw: String) -> [PlotTip] {
        let body = raw.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !body.isEmpty, body.uppercased() != "PASST" else { return [] }
        var tips: [PlotTip] = []
        for block in body.components(separatedBy: "---").prefix(6) {
            var kind: PlotTip.Kind = .general
            var title = ""; var detail = ""
            for line in block.split(whereSeparator: \.isNewline) {
                let s = String(line).trimmingCharacters(in: .whitespaces)
                if let r = s.range(of: #"^(?i)ART:\s*"#, options: .regularExpression) {
                    let val = String(s[r.upperBound...]).trimmingCharacters(in: .whitespaces).lowercased()
                    kind = PlotTip.Kind(rawValue: val) ?? .general
                } else if let r = s.range(of: #"^(?i)TITEL:\s*"#, options: .regularExpression) {
                    title = String(s[r.upperBound...]).trimmingCharacters(in: .whitespaces)
                } else if let r = s.range(of: #"^(?i)DETAIL:\s*"#, options: .regularExpression) {
                    detail = String(s[r.upperBound...]).trimmingCharacters(in: .whitespaces)
                }
            }
            if !title.isEmpty {
                tips.append(PlotTip(kind: kind, title: title, detail: detail))
            }
        }
        return tips
    }

    public static func suggestPlotImprovements(
        strands: [VPlotStrand],
        cards: [VPlotCard],
        cardOrder: (VPlotCard) -> (Int, Int, Int),
        characterNames: [String],
        openSetupTitles: [String],
        ki: KIProviderStore
    ) async throws -> [PlotTip] {
        guard let client = ki.makeClient(for: .deep) ?? ki.makeClient() else {
            throw HelperError.noClient
        }
        let strandInput = strands.map { (title: $0.title, summary: $0.summary) }
        let strandLookup = Dictionary(uniqueKeysWithValues: strands.map { ($0.id, $0.title) })
        let sortedCards = cards.sorted(by: { cardOrder($0) < cardOrder($1) })
        let cardLines = sortedCards.map { card -> String in
            let strand = card.strandID.flatMap { strandLookup[$0] } ?? "—"
            let fn = card.function == .normal ? "" : " [\(card.function.germanLabel)]"
            let synopsis = card.synopsis.isEmpty ? card.title : card.synopsis
            return "\(strand): \(card.title)\(fn) — \(synopsis)"
        }
        let prompt = buildTipsPrompt(
            strands: strandInput,
            cardLines: cardLines,
            characterNames: characterNames,
            openSetups: openSetupTitles
        )
        let raw: String
        do { raw = try await client.generate(prompt: prompt) }
        catch { throw HelperError.underlying(error) }
        return parseTipsResponse(raw)
    }

    // MARK: - Setup → Payoff

    public struct PayoffSuggestion: Sendable {
        public let title: String
        public let synopsis: String
    }

    public static func buildPayoffPrompt(
        setupTitle: String, setupSynopsis: String,
        strandTitle: String, strandSummary: String,
        strandCardsListing: String?,
        existingPayoffs: [String]?
    ) -> String {
        var blocks: [String] = []
        blocks.append("""
        Du bist Plot-Architekt. Schlage genau eine Payoff-Karte vor, die das
        folgende Setup im selben Strang sinnvoll auflöst — kein Cliffhanger,
        kein neues Setup, sondern eine konkrete Antwort. Die Karte muss zu
        den bereits vorhandenen Karten dieses Strangs passen und darf
        keine bestehende Auflösung wiederholen.
        """)
        blocks.append("Strang: \(strandTitle)\(strandSummary.isEmpty ? "" : " — \(strandSummary)")")
        if let listing = strandCardsListing, !listing.isEmpty {
            blocks.append("Andere Karten im Strang:\n\(listing)")
        }
        blocks.append("""
        Setup-Karte:
        Titel: \(setupTitle)
        Synopsis: \(setupSynopsis)
        """)
        if let payoffs = existingPayoffs, !payoffs.isEmpty {
            blocks.append("Bereits vorhandene Payoffs (NICHT duplizieren):\n" +
                          payoffs.map { "• \($0)" }.joined(separator: "\n"))
        }
        blocks.append("""
        Antwortformat – exakt einhalten, ohne Vorrede oder Markdown:
        TITEL: <kurz, 4-8 Wörter, konkret>
        SYNOPSIS: <ein Satz, was in der Karte passiert>
        """)
        return blocks.joined(separator: "\n\n")
    }

    public static func parsePayoffResponse(_ raw: String) throws -> PayoffSuggestion {
        var title = ""; var synopsis = ""
        for line in raw.split(whereSeparator: \.isNewline) {
            let s = String(line).trimmingCharacters(in: .whitespaces)
            if let r = s.range(of: #"^(?i)TITEL:\s*"#, options: .regularExpression) {
                title = String(s[r.upperBound...]).trimmingCharacters(in: .whitespaces)
            } else if let r = s.range(of: #"^(?i)SYNOPSIS:\s*"#, options: .regularExpression) {
                synopsis = String(s[r.upperBound...]).trimmingCharacters(in: .whitespaces)
            }
        }
        guard !title.isEmpty else { throw HelperError.empty }
        return PayoffSuggestion(title: title, synopsis: synopsis)
    }

    public static func suggestPayoff(
        setup: VPlotCard, strand: VPlotStrand?,
        ki: KIProviderStore
    ) async throws -> PayoffSuggestion {
        guard let client = ki.makeClient(for: .deep) ?? ki.makeClient() else {
            throw HelperError.noClient
        }
        let prompt = buildPayoffPrompt(
            setupTitle: setup.title.isEmpty ? "Ohne Titel" : setup.title,
            setupSynopsis: setup.synopsis,
            strandTitle: strand?.title ?? "—",
            strandSummary: strand?.summary ?? "",
            strandCardsListing: nil,
            existingPayoffs: nil
        )
        let raw: String
        do { raw = try await client.generate(prompt: prompt) }
        catch { throw HelperError.underlying(error) }
        return try parsePayoffResponse(raw)
    }
}

// MARK: - Kontext-basierte API
//
// Die folgenden Methoden bekommen den vollständigen `PlotAIContext` und
// produzieren reichhaltigere Prompts: bestehende Stränge / Sektionen werden
// referenziert (damit die KI nicht stumpf dupliziert), Kapitel-Digests
// tragen POV / Spannung / erkannte Figuren, fillCard sieht Nachbar-Karten
// im selben Strang, Payoff-Vorschläge kennen alle anderen Karten ihres
// Strangs. Außerdem läuft hinter jedem Aufruf eine Validierung, die offen-
// sichtliche Fehler in der KI-Antwort glättet (Indizes, Hex-Farben, Dupes)
// und bei nicht-parsebarer Antwort einen Retry mit strikterer Format-
// Erinnerung versucht.

@MainActor
public extension AIPlotHelper {

    // MARK: extractPlot mit Kontext

    struct ExtractResult: Sendable {
        public let strands: [ExtractedStrand]
        /// Hinweise an den Autor nach der Validierung — z. B. „BAND 5 gibt
        /// es nicht, Karte als Pool eingefügt".
        public let warnings: [String]
        public init(strands: [ExtractedStrand], warnings: [String] = []) {
            self.strands = strands
            self.warnings = warnings
        }
    }

    /// Empfohlener Einstieg: nimm den vollständigen Kontext, baue einen
    /// reichen Prompt, validiere die Antwort. Bei `.singleBook(id)` wird
    /// nur dieser Band analysiert; Karten landen auf Sektionen, nicht auf
    /// Bändern.
    static func extractPlot(context: PlotAIContext,
                             scope: PlotAIContext.ExtractScope,
                             ki: KIProviderStore) async throws -> ExtractResult
    {
        guard let client = ki.makeClient(for: .deep) ?? ki.makeClient() else {
            throw HelperError.noClient
        }
        let prompt = buildExtractPromptV2(context: context, scope: scope)
        var raw: String
        do { raw = try await client.generate(prompt: prompt) }
        catch { throw HelperError.underlying(error) }
        var parsed = parseExtractResponse(raw)
        if parsed.isEmpty {
            // Retry mit Format-Erinnerung — manche kleinere Modelle schlucken
            // beim ersten Versuch das Schema. Einmaliger Retry, dann Aufgabe.
            let nudge = """

            Deine vorige Antwort war nicht im erwarteten Format. Antworte
            JETZT NUR mit den Strang-Blöcken im exakten Format:

            STRAND: <Name>
            FARBE: #XXXXXX
            ZUSAMMENFASSUNG: <ein Satz>
            KARTEN:
            - BAND:<n>|SEKTION:<n oder ->|FUNKTION:<setup|payoff|normal>|TITEL:<…>|SYNOPSIS:<…>
            ---
            """
            do { raw = try await client.generate(prompt: prompt + nudge) }
            catch { throw HelperError.underlying(error) }
            parsed = parseExtractResponse(raw)
        }
        guard !parsed.isEmpty else { throw HelperError.empty }
        return validateExtraction(parsed, context: context, scope: scope)
    }

    static func buildExtractPromptV2(context: PlotAIContext,
                                      scope: PlotAIContext.ExtractScope) -> String
    {
        let scopeText: String = {
            switch scope {
            case .wholeWork:
                return context.books.count > 1
                    ? "Werk-übergreifend — Karten verteilen sich auf die Bände (BAND:1…\(context.books.count))."
                    : "Einzelbuch-Werk — alle Karten im einen Band."
            case .singleBook(let id):
                let title = context.books.first(where: { $0.id == id })?.title ?? "Band"
                return "Nur dieser eine Band: „\(title)\". Karten verteilen sich auf SEKTIONEN, kein BAND-Index."
            }
        }()
        let bookCount = context.books.count
        let sectionCount = context.sections.count
        let bookGuidance = bookCount == 0
            ? "BAND immer „-\""
            : "BAND nur 1…\(bookCount) oder „-\""
        let sectionGuidance = sectionCount == 0
            ? "SEKTION immer „-\""
            : "SEKTION nur 1…\(sectionCount) oder „-\""

        var blocks: [String] = []
        blocks.append("""
        Du bist Plot-Architekt. Analysiere das Manuskript und extrahiere die
        dramaturgische Struktur. Ziel: 3–6 parallele Plot-Stränge (z. B.
        Hauptplot, Liebesplot, Antagonist, Familiengeheimnis), pro Strang
        3–8 zentrale Plot-Karten. Jeder Setup-Karte muss ein passender
        Payoff im selben Strang folgen.
        """)
        blocks.append(context.workHeader)
        blocks.append("Auswertungs-Bereich: \(scopeText)")
        blocks.append(context.renderBooks())
        blocks.append(context.renderSections())
        let strandsBlock = context.renderExistingStrands()
        if !strandsBlock.isEmpty { blocks.append(strandsBlock) }
        let chars = context.renderCharacters()
        if !chars.isEmpty { blocks.append(chars) }
        blocks.append("MANUSKRIPT (Kapitel-Synopsen mit Meta):\n" +
                      context.renderManuscript(scope: scope))

        blocks.append("""
        Antwortformat – pro Strang ein Block, Trenner „---":

        STRAND: <Kurzname>
        FARBE: #XXXXXX (sinnvolle, gut unterscheidbare Hex-Farbe)
        ZUSAMMENFASSUNG: <ein Satz>
        KARTEN:
        - BAND:<n>|SEKTION:<n>|FUNKTION:<setup|payoff|normal>|TITEL:<kurz>|SYNOPSIS:<ein Satz>
        - …
        ---

        Regeln:
        - \(bookGuidance).
        - \(sectionGuidance).
        - Wenn ein bestehender Strang oben aufgeführt ist und thematisch passt,
          übernimm seinen Namen exakt — sonst denkt das Tool, der Vorschlag wäre neu.
        - Halte Titel kurz (≤ 6 Wörter), Synopsis ist genau ein Satz.
        - Nenne Figuren mit ihren oben gelisteten Namen, nicht generisch.
        - Keine Vorrede, keine Erklärung, kein Markdown — nur die Strang-Blöcke.
        """)
        return blocks.joined(separator: "\n\n")
    }

    /// Validiert die KI-Antwort: Bands/Sektionen werden gegen den Kontext
    /// gegen-geprüft, Hex-Farben normalisiert, Duplikate entschärft. Bei
    /// `.singleBook` werden Bands ignoriert (alle Karten landen im
    /// gewählten Band, Spalten = Sektionen).
    static func validateExtraction(_ raw: [ExtractedStrand],
                                    context: PlotAIContext,
                                    scope: PlotAIContext.ExtractScope) -> ExtractResult
    {
        var warnings: [String] = []
        let bookCount = context.books.count
        let sectionCount = context.sections.count

        // Strang-Titel duplizieren? Nur den ersten behalten, gleiche Titel
        // (case-insensitive) später in Apply-Phase ohnehin per Match
        // wiederverwendet.
        var seenStrandKey = Set<String>()
        var cleanedStrands: [ExtractedStrand] = []
        for s in raw {
            let key = s.title.lowercased()
            guard !seenStrandKey.contains(key) else {
                warnings.append("Doppelter Strang „\(s.title)“ wurde zusammengefasst.")
                continue
            }
            seenStrandKey.insert(key)

            let color = normalizeHex(s.colorHex)
            var seenCardKey = Set<String>()
            var cleanedCards: [ExtractedCard] = []
            for c in s.cards {
                let body = (c.title + "|" + c.synopsis).lowercased()
                if seenCardKey.contains(body) {
                    warnings.append("Doppelte Karte „\(c.title)“ in „\(s.title)“ entfernt.")
                    continue
                }
                seenCardKey.insert(body)

                var book = c.bookIndex
                var section = c.sectionIndex
                if let b = book {
                    if b < 1 || b > bookCount {
                        warnings.append("Karte „\(c.title)“: BAND \(b) existiert nicht — als Pool eingeordnet.")
                        book = nil
                    }
                }
                if let s2 = section {
                    if s2 < 1 || s2 > sectionCount {
                        warnings.append("Karte „\(c.title)“: SEKTION \(s2) existiert nicht — ohne Sektion eingeordnet.")
                        section = nil
                    }
                }
                // In .singleBook scope, force bookIndex to that book.
                if case .singleBook(let id) = scope,
                   let idx = context.books.firstIndex(where: { $0.id == id })
                {
                    book = idx + 1
                }
                cleanedCards.append(ExtractedCard(
                    title: c.title, synopsis: c.synopsis,
                    function: c.function,
                    bookIndex: book, sectionIndex: section
                ))
            }
            cleanedStrands.append(ExtractedStrand(
                title: s.title, summary: s.summary,
                colorHex: color, cards: cleanedCards
            ))
        }

        // Setup ohne Payoff im selben Strang → Warnung (nicht-blockierend).
        for s in cleanedStrands {
            let hasSetup = s.cards.contains { $0.function == .setup }
            let hasPayoff = s.cards.contains { $0.function == .payoff }
            if hasSetup && !hasPayoff {
                warnings.append("Strang „\(s.title)“ hat ein Setup, aber keinen Payoff im Vorschlag.")
            }
        }
        return ExtractResult(strands: cleanedStrands, warnings: warnings)
    }

    static func normalizeHex(_ raw: String) -> String {
        let trim = raw.trimmingCharacters(in: .whitespaces)
        let withHash = trim.hasPrefix("#") ? trim : "#\(trim)"
        let core = withHash.replacingOccurrences(of: "#", with: "")
        let valid = core.count == 6 &&
            core.allSatisfy { $0.isHexDigit }
        return valid ? "#" + core.uppercased() : "#7C3AED"
    }

    // MARK: fillCard mit Kontext

    static func fillCard(card: VPlotCard,
                          context: PlotAIContext,
                          ki: KIProviderStore) async throws -> FillCardResult
    {
        guard let client = ki.makeClient(for: .deep) ?? ki.makeClient() else {
            throw HelperError.noClient
        }
        let prompt = buildFillCardPromptV2(card: card, context: context)
        let raw: String
        do { raw = try await client.generate(prompt: prompt) }
        catch { throw HelperError.underlying(error) }
        return try parseFillCardResponse(raw)
    }

    static func buildFillCardPromptV2(card: VPlotCard,
                                       context: PlotAIContext) -> String
    {
        let titleLine = card.title.isEmpty ? "(noch ohne Titel)" : card.title
        let synopsisHint = card.synopsis.isEmpty
            ? "(noch keine Synopsis — bitte einen Vorschlag machen)"
            : card.synopsis
        let functionHint: String = {
            switch card.function {
            case .setup:  return "Diese Karte ist ein SETUP — sie pflanzt etwas, das später eingelöst wird."
            case .payoff: return "Diese Karte ist ein PAYOFF — sie löst ein vorheriges Setup ein."
            case .normal: return ""
            }
        }()
        var blocks: [String] = []
        blocks.append("""
        Du bist Lektor. Arbeite die folgende Plot-Karte aus. Bleib im Stil
        und Kontext des Werks; halte dich an die anderen Karten desselben
        Strangs (keine Doppelung). Schreib aus Sicht des Werks, nicht im
        Pitch-Slang.
        """)
        blocks.append(context.workHeader)
        let chars = context.renderCharacters(limit: 8)
        if !chars.isEmpty { blocks.append(chars) }
        let cardCtx = context.renderCardContext(card: card)
        if !cardCtx.isEmpty { blocks.append(cardCtx) }
        var cardBlock = """
        Diese Karte:
        Titel: \(titleLine)
        Bisherige Synopsis: \(synopsisHint)
        """
        if !functionHint.isEmpty { cardBlock += "\n\(functionHint)" }
        blocks.append(cardBlock)
        blocks.append("""
        Antwortformat – exakt einhalten, ohne Vorrede:

        SYNOPSIS: <2-3 Sätze, was in der Karte passiert>
        ZIEL: <was die Figur in dieser Karte will, ein Satz>
        KONFLIKT: <was im Weg steht, ein Satz>
        AUSGANG: <wie die Karte endet, ein Satz>
        """)
        return blocks.joined(separator: "\n\n")
    }

    // MARK: suggestPayoff mit Kontext

    static func suggestPayoff(setup: VPlotCard,
                               context: PlotAIContext,
                               ki: KIProviderStore) async throws -> PayoffSuggestion
    {
        guard let client = ki.makeClient(for: .deep) ?? ki.makeClient() else {
            throw HelperError.noClient
        }
        let strand = setup.strandID
            .flatMap { id in context.strands.first(where: { $0.id == id }) }
        let strandListing = setup.strandID
            .map { context.renderStrandCards($0, excluding: setup.id) } ?? nil
        let existingPayoffs: [String]? = setup.strandID.map { sid in
            context.cards
                .filter { $0.strandID == sid && $0.function == .payoff && $0.id != setup.id }
                .map { $0.title.isEmpty ? "Ohne Titel" : $0.title }
        }
        let prompt = buildPayoffPrompt(
            setupTitle: setup.title.isEmpty ? "Ohne Titel" : setup.title,
            setupSynopsis: setup.synopsis,
            strandTitle: strand?.title ?? "—",
            strandSummary: strand?.summary ?? "",
            strandCardsListing: strandListing,
            existingPayoffs: existingPayoffs
        )
        let raw: String
        do { raw = try await client.generate(prompt: prompt) }
        catch { throw HelperError.underlying(error) }
        return try parsePayoffResponse(raw)
    }

    // MARK: suggestPlotImprovements mit Kontext

    static func suggestPlotImprovements(context: PlotAIContext,
                                         ki: KIProviderStore) async throws -> [PlotTip]
    {
        guard let client = ki.makeClient(for: .deep) ?? ki.makeClient() else {
            throw HelperError.noClient
        }
        let prompt = buildTipsPromptV2(context: context)
        var raw: String
        do { raw = try await client.generate(prompt: prompt) }
        catch { throw HelperError.underlying(error) }
        var tips = parseTipsResponse(raw)
        if tips.isEmpty && !raw.uppercased().contains("PASST") {
            // Retry mit strenger Format-Erinnerung.
            let nudge = """

            Deine vorige Antwort hatte nicht das vorgegebene Format.
            Antworte JETZT NUR mit Tipp-Blöcken (ART/TITEL/DETAIL) oder
            dem einzelnen Wort PASST. Keine Vorrede, kein Markdown.
            """
            do { raw = try await client.generate(prompt: prompt + nudge) }
            catch { throw HelperError.underlying(error) }
            tips = parseTipsResponse(raw)
        }
        return tips
    }

    // MARK: – Kapitelplanung: Zweck + Beats

    /// Schlägt einen kompakten Zweck für das Kapitel vor — eine Zeile, was
    /// das Kapitel beim Leser bewirken soll. Kontext: Werk + Stränge des
    /// Kapitels + erkannte Figuren + Synopsis-Excerpt.
    static func suggestChapterPurpose(chapter: VChapter,
                                       context: PlotAIContext,
                                       ki: KIProviderStore) async throws -> String
    {
        guard let client = ki.makeClient(for: .deep) ?? ki.makeClient() else {
            throw HelperError.noClient
        }
        let prompt = buildChapterPurposePrompt(chapter: chapter, context: context)
        let raw: String
        do { raw = try await client.generate(prompt: prompt) }
        catch { throw HelperError.underlying(error) }
        let cleaned = clean(raw)
        guard !cleaned.isEmpty else { return "" }
        // Zweck soll knapp sein: nimm den ersten Absatz, max. ~240 Zeichen.
        let firstParagraph = cleaned
            .split(separator: "\n", omittingEmptySubsequences: true)
            .first.map(String.init) ?? cleaned
        return String(firstParagraph.prefix(240))
            .trimmingCharacters(in: .whitespacesAndNewlines)
    }

    static func buildChapterPurposePrompt(chapter: VChapter,
                                           context: PlotAIContext) -> String
    {
        let strandTitles = chapter.linkedStrandIDs
            .compactMap { id in context.strands.first(where: { $0.id == id })?.title }
        let enriched = context.chapterEnriched
            .first(where: { $0.chapterID == chapter.id })
        var blocks: [String] = []
        blocks.append("""
        Du bist Lektorin. Schlag einen knappen Zweck für dieses Kapitel vor —
        also was es beim Leser bewirken soll, was sich verändert. EINEN
        klaren Satz, maximal 1–2 Sätze. Kein Pitch, keine Vorrede.
        """)
        blocks.append(context.workHeader)
        if !strandTitles.isEmpty {
            blocks.append("Verknüpfte Stränge: \(strandTitles.joined(separator: ", "))")
        }
        let chars = context.renderCharacters(limit: 6)
        if !chars.isEmpty { blocks.append(chars) }
        var lines: [String] = []
        lines.append("Titel: \(chapter.title.isEmpty ? "Ohne Titel" : chapter.title)")
        if !chapter.pov.isEmpty { lines.append("POV: \(chapter.pov)") }
        if !chapter.place.isEmpty { lines.append("Ort: \(chapter.place)") }
        if let e = enriched, !e.synopsisOrExcerpt.isEmpty {
            lines.append("Inhalt: \(e.synopsisOrExcerpt)")
        }
        if !chapter.beats.isEmpty {
            let formatted = chapter.beats.prefix(8).enumerated()
                .map { "\($0.offset + 1). \($0.element)" }
                .joined(separator: " | ")
            lines.append("Beats: \(formatted)")
        }
        blocks.append("Kapitel:\n" + lines.joined(separator: "\n"))
        blocks.append("""
        Antworte NUR mit dem Zweck — ohne Anführungszeichen, ohne Vorrede,
        ohne „Zweck: " davor.
        """)
        return blocks.joined(separator: "\n\n")
    }

    /// Schlägt 4–7 kurze Beats für das Kapitel vor. Ein Beat = ein
    /// einzeiliger Planungspunkt. Kein Szenen-Roman, keine Markdown-Liste.
    static func suggestChapterBeats(chapter: VChapter,
                                     context: PlotAIContext,
                                     ki: KIProviderStore) async throws -> [String]
    {
        guard let client = ki.makeClient(for: .deep) ?? ki.makeClient() else {
            throw HelperError.noClient
        }
        let prompt = buildChapterBeatsPrompt(chapter: chapter, context: context)
        let raw: String
        do { raw = try await client.generate(prompt: prompt) }
        catch { throw HelperError.underlying(error) }
        return parseBeatsResponse(raw)
    }

    static func buildChapterBeatsPrompt(chapter: VChapter,
                                         context: PlotAIContext) -> String
    {
        let strandTitles = chapter.linkedStrandIDs
            .compactMap { id in context.strands.first(where: { $0.id == id })?.title }
        let enriched = context.chapterEnriched
            .first(where: { $0.chapterID == chapter.id })
        var blocks: [String] = []
        blocks.append("""
        Du bist Plot-Architekt. Schlage 4 bis 7 BEATS für dieses Kapitel vor.
        Ein Beat ist EIN einzeiliger Planungspunkt — eine kurze Aktion oder
        ein dramaturgisches Ereignis. KEINE Szenenbeschreibung, KEIN
        Stilbruch, kein Konjunktiv.

        Beispiel-Stil:
        - Mira betritt den verbotenen Markt.
        - Kael erkennt das Zeichen auf ihrer Tasche.
        - Ein Händler warnt sie vor dem Schwur.
        """)
        blocks.append(context.workHeader)
        if !strandTitles.isEmpty {
            blocks.append("Verknüpfte Stränge: \(strandTitles.joined(separator: ", "))")
        }
        var meta: [String] = []
        meta.append("Titel: \(chapter.title.isEmpty ? "Ohne Titel" : chapter.title)")
        if !chapter.purpose.isEmpty { meta.append("Zweck: \(chapter.purpose)") }
        if !chapter.pov.isEmpty { meta.append("POV: \(chapter.pov)") }
        if !chapter.place.isEmpty { meta.append("Ort: \(chapter.place)") }
        if !chapter.openingQuestion.isEmpty {
            meta.append("Einstiegsfrage: \(chapter.openingQuestion)")
        }
        if !chapter.endingHook.isEmpty {
            meta.append("Ende/Hook: \(chapter.endingHook)")
        }
        if let e = enriched, !e.synopsisOrExcerpt.isEmpty {
            meta.append("Inhalt: \(e.synopsisOrExcerpt)")
        }
        blocks.append("Kapitel:\n" + meta.joined(separator: "\n"))
        let chars = context.renderCharacters(limit: 6)
        if !chars.isEmpty { blocks.append(chars) }
        blocks.append("""
        Antwortformat – exakt einhalten:

        - <Beat in einem Satz, im Aussagesatz>
        - <…>
        - <…>

        Nichts vor oder nach der Liste. Keine Nummerierung, kein Markdown,
        keine Überschriften.
        """)
        return blocks.joined(separator: "\n\n")
    }

    static func parseBeatsResponse(_ raw: String) -> [String] {
        var out: [String] = []
        for line in raw.split(whereSeparator: \.isNewline) {
            var s = String(line).trimmingCharacters(in: .whitespaces)
            // Akzeptiere "- ...", "* ...", "1. ...", "1) ..."
            if s.hasPrefix("-") || s.hasPrefix("*") || s.hasPrefix("•") {
                s = String(s.dropFirst()).trimmingCharacters(in: .whitespaces)
            } else if let r = s.range(of: #"^\d+[\.\)]\s*"#, options: .regularExpression) {
                s = String(s[r.upperBound...]).trimmingCharacters(in: .whitespaces)
            }
            // Anführungszeichen abstreifen.
            if s.hasPrefix("\"") && s.hasSuffix("\"") && s.count > 2 {
                s = String(s.dropFirst().dropLast())
            }
            if s.isEmpty { continue }
            // Skip Header / Floskeln.
            let lower = s.lowercased()
            if lower.hasPrefix("beats") || lower.hasPrefix("beat:") { continue }
            if lower.contains("antwort") && lower.contains(":") { continue }
            out.append(s)
            if out.count >= 8 { break }
        }
        return out
    }

    static func buildTipsPromptV2(context: PlotAIContext) -> String {
        // Pacing-Signal: Karten pro Band.
        let cardsPerBook: String = {
            guard !context.books.isEmpty else { return "" }
            let counts = context.books.map { b -> String in
                let n = context.cards.filter { $0.bookID == b.id }.count
                return "\(b.title): \(n)"
            }
            return "Karten pro Band: " + counts.joined(separator: ", ")
        }()
        // Figur-Coverage: in wie vielen Strängen taucht eine Figur auf?
        let figureCoverage: String = {
            guard !context.characters.isEmpty,
                  !context.cards.isEmpty
            else { return "" }
            let strandTitle: [UUID: String] = Dictionary(uniqueKeysWithValues:
                context.strands.map { ($0.id, $0.title) })
            var rows: [String] = []
            for c in context.characters.prefix(8) {
                var strandsHit = Set<String>()
                let needle = c.name.lowercased()
                for card in context.cards {
                    var blob = card.title
                    blob.append(" "); blob.append(card.synopsis)
                    blob.append(" "); blob.append(card.sceneGoal)
                    blob.append(" "); blob.append(card.sceneConflict)
                    blob.append(" "); blob.append(card.sceneOutcome)
                    let lower = blob.lowercased()
                    if lower.contains(needle),
                       let sid = card.strandID,
                       let st = strandTitle[sid]
                    {
                        strandsHit.insert(st)
                    }
                }
                if !strandsHit.isEmpty {
                    rows.append("\(c.name): \(strandsHit.sorted().joined(separator: ", "))")
                }
            }
            return rows.isEmpty ? "" : "Figuren-Stränge:\n" + rows.joined(separator: "\n")
        }()

        var blocks: [String] = []
        blocks.append("""
        Du bist Lektorin. Schau dir den aktuellen Plot des Werks an und gib
        3 bis 5 KONKRETE Verbesserungsvorschläge — keine Plattitüden, sondern
        umsetzbare Hinweise (z. B. „Strang X verschwindet zwischen Band 1 und 3,
        plane einen Mittelpunkt-Beat dort"). Pro Tipp ein Block:

        ART: <strand|pacing|payoff|character|general>
        TITEL: <kurz, 4-8 Wörter>
        DETAIL: <max. zwei Sätze, konkret und umsetzbar — nenne Strang/Band/Figur namentlich>
        ---

        Wenn alles solide wirkt, antworte allein mit dem Wort PASST.
        """)
        blocks.append(context.workHeader)
        blocks.append(context.renderBooks())
        blocks.append(context.renderSections())
        let chars = context.renderCharacters()
        if !chars.isEmpty { blocks.append(chars) }
        let strandBlock = context.renderExistingStrands()
        if !strandBlock.isEmpty { blocks.append(strandBlock) }
        if !cardsPerBook.isEmpty { blocks.append(cardsPerBook) }
        if !figureCoverage.isEmpty { blocks.append(figureCoverage) }
        blocks.append("KARTEN (chronologisch):\n" + context.renderCardListing())
        let openSetups = context.renderOpenSetups()
        if !openSetups.isEmpty { blocks.append(openSetups) }
        return blocks.joined(separator: "\n\n")
    }
}
