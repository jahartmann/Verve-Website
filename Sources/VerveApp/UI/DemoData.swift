import Foundation
import SwiftUI

// MARK: - Welt-Kategorien (Sidebar-Reihenfolge & Anzeige)

public enum WorldKind: String, CaseIterable, Identifiable, Codable {
    // `plots` ist 2026-05-02 entfallen — Plot-Stränge leben jetzt im neuen
    // Plot-System (`VPlotStrand`). Migration läuft idempotent in
    // `VerveStore.migrateLegacyPlotsIfNeeded()`.
    case places, cities, magic, religions, items, factions, groups, relations, ideas, concepts
    public var id: String { rawValue }

    public var title: String {
        switch self {
        case .places:    return "Orte"
        case .cities:    return "Städte"
        case .magic:     return "Magie & Lore"
        case .religions: return "Religionen & Glaube"
        case .items:     return "Gegenstände"
        case .factions:  return "Fraktionen"
        case .groups:    return "Gruppen & Räte"
        case .relations: return "Beziehungen"
        case .ideas:     return "Ideen"
        case .concepts:  return "Konzepte"
        }
    }
    public var singular: String {
        switch self {
        case .places:    return "Ort"
        case .cities:    return "Stadt"
        case .magic:     return "Magie-Regel"
        case .religions: return "Religion"
        case .items:     return "Gegenstand"
        case .factions:  return "Fraktion"
        case .groups:    return "Gruppe"
        case .relations: return "Beziehung"
        case .ideas:     return "Idee"
        case .concepts:  return "Konzept"
        }
    }
    public var icon: String {
        switch self {
        case .places, .cities: return "map"
        case .magic:           return "sparkle"
        case .religions:       return "shield.check"
        case .items:           return "tag"
        case .factions, .groups: return "people"
        case .relations:       return "link"
        case .ideas:           return "lightbulb"
        case .concepts:        return "globe"
        }
    }
}

// MARK: - Inline-Highlights im Editor
//
// Wir leiten die Highlight-Liste direkt aus den vorhandenen Figuren / Welt-
// Einträgen ab. Damit gibt es keinen festen "Demo-Inhalt"; Highlights tauchen
// auf, sobald der Nutzer Entitäten anlegt, deren Name im Manuskript vorkommt.

public struct EditorEntity: Hashable {
    public let name: String
    public let kind: String
    public let color: Color
}

public enum EditorEntities {
    @MainActor
    public static func from(store: VerveStore) -> [EditorEntity] {
        guard let workID = store.activeWork?.id else { return [] }
        var out: [EditorEntity] = []
        // Figuren — Vor- und Nachnamen separat anbieten
        for c in store.characters where c.workID == workID {
            out.append(EditorEntity(name: c.name, kind: "Figur", color: c.swiftColor))
            let parts = c.name.split(separator: " ").map(String.init)
            for p in parts where p.count >= 3 && !out.contains(where: { $0.name == p }) {
                out.append(EditorEntity(name: p, kind: "Figur", color: c.swiftColor))
            }
        }
        // Welt — gleiches Schema, nach Kategorie eingefärbt
        let palette: [String: Color] = [
            "places":    Color(hex: "#3F7B5E")!,
            "cities":    Color(hex: "#3F7B5E")!,
            "magic":     Color(hex: "#7B3F7B")!,
            "religions": Color(hex: "#5A4A1A")!,
            "items":     Color(hex: "#7B5E3F")!,
            "factions":  Color(hex: "#5E3F7B")!,
            "groups":    Color(hex: "#5E3F7B")!,
            "relations": Color(hex: "#3F5E7B")!,
            "plots":     Color(hex: "#7B3F3F")!,
            "ideas":     Color(hex: "#B8602B")!,
            "concepts":  Color(hex: "#7B5E3F")!
        ]
        for w in store.world where w.workID == workID {
            let color = palette[w.kindRaw] ?? Color.accentColor
            let label = WorldKind(rawValue: w.kindRaw)?.singular ?? "Welt"
            // Nur "kurze" Titel als Highlight (mehrwörtige Plot-Titel würden zu groß werden)
            if w.title.count <= 24 {
                out.append(EditorEntity(name: w.title, kind: label, color: color))
            }
        }
        // Längere Namen zuerst — Greedy-Match findet sonst Teilnamen
        return out.sorted { $0.name.count > $1.name.count }
    }
}
