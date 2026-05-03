import SwiftUI

// MARK: - SF-Symbols-Wrapper

/// Stroke-basiertes Icon-System. Alle UI-Stellen rufen `VIcon(name:)` auf —
/// die Mapping-Tabelle bildet Design-Namen auf SF Symbols ab, sodass macOS-Native-Icons
/// im richtigen Stil rauskommen.
public struct VIcon: View {
    public let name: String
    public var size: CGFloat = 14
    public var weight: Font.Weight = .regular

    public init(_ name: String, size: CGFloat = 14, weight: Font.Weight = .regular) {
        self.name = name
        self.size = size
        self.weight = weight
    }

    public var body: some View {
        Image(systemName: Self.symbol(for: name))
            .font(.system(size: size, weight: weight))
            .imageScale(.medium)
    }

    static func symbol(for name: String) -> String {
        switch name {
        case "books":         return "books.vertical"
        case "book":          return "book.closed"
        case "star":          return "star"
        case "archive":       return "archivebox"
        case "bubble":        return "bubble.left"
        case "doc":           return "doc"
        case "doc.text":      return "doc.text"
        case "person":        return "person"
        case "people":        return "person.2"
        case "map":           return "map"
        case "sparkle":       return "sparkles"
        case "wand":          return "wand.and.stars"
        case "tray":          return "tray"
        case "shield.check":  return "checkmark.shield"
        case "share":         return "square.and.arrow.up"
        case "search":        return "magnifyingglass"
        case "plus":          return "plus"
        case "command":       return "command"
        case "sidebar":       return "sidebar.left"
        case "inspector":     return "sidebar.right"
        case "focus":         return "viewfinder"
        case "moon":          return "moon"
        case "sun":           return "sun.max"
        case "settings":      return "gearshape"
        case "save":          return "tray.and.arrow.down"
        case "bolt":          return "bolt.fill"
        case "scribble":      return "scribble.variable"
        case "link":          return "link"
        case "checkmark":     return "checkmark"
        case "xmark":         return "xmark"
        case "chevron.right": return "chevron.right"
        case "chevron.down":  return "chevron.down"
        case "chevron.up":    return "chevron.up"
        case "rocket":        return "paperplane"
        case "lightbulb":     return "lightbulb"
        case "globe":         return "globe"
        case "folder":        return "folder"
        case "tag":           return "tag"
        case "image":         return "photo"
        case "paperclip":     return "paperclip"
        case "list":          return "list.bullet"
        case "grid":          return "square.grid.2x2"
        case "dots":          return "ellipsis"
        case "send":          return "paperplane.fill"
        case "info":          return "info.circle"
        case "warning":       return "exclamationmark.triangle"
        case "history":       return "clock.arrow.circlepath"
        case "trash":         return "trash"
        case "grip":          return "line.3.horizontal"
        case "calendar":      return "calendar"
        case "clock":         return "clock"
        case "pin":           return "pin"
        case "shield.fill":   return "shield.fill"
        case "checkmark.circle": return "checkmark.circle.fill"
        case "exclamation":   return "exclamationmark.circle"
        case "bold":          return "bold"
        case "italic":        return "italic"
        case "code":          return "chevron.left.forwardslash.chevron.right"
        case "quote":         return "quote.opening"
        // Plot-Matrix-spezifisch — eigenes Symbol, das nach Raster aussieht.
        case "matrix":        return "rectangle.split.3x3"
        case "mappin":        return "mappin"
        case "pin.fill":      return "pin.fill"
        case "flame":         return "flame"
        case "light":         return "light.max"
        case "sparkles":      return "sparkles"
        case "arrow.down":    return "arrow.down"
        case "arrow.right":   return "arrow.right"
        case "arrow.up.right": return "arrow.up.right"
        case "chevron.left":  return "chevron.left"
        // Fallback: generischer Punkt — sollte fast nie greifen, weil alle
        // benannten Icons oben gemappt sind. Wenn doch, ist das ein Hinweis,
        // dass ein neuer Eintrag fehlt.
        default:              return "questionmark.circle.dashed"
        }
    }
}

// MARK: - Markdown-Render-Helfer
//
// Wandelt einen Markdown-String in eine AttributedString um, sodass `**bold**`,
// `*italic*` & Co. in Read-Only-Views (Preview-Karten, Findings-Listen) gerendert
// werden, statt als Rohzeichen zu erscheinen. Schlägt das Parsen fehl, fallen wir
// auf den unveränderten String zurück.
public enum MarkdownRender {
    public static func attributed(_ raw: String) -> AttributedString {
        guard !raw.isEmpty else { return AttributedString() }
        var options = AttributedString.MarkdownParsingOptions()
        options.interpretedSyntax = .inlineOnlyPreservingWhitespace
        if let parsed = try? AttributedString(markdown: raw, options: options) {
            return parsed
        }
        return AttributedString(raw)
    }
}

// MARK: - Pill / Tag

public struct Pill: View {
    public let text: String
    public var systemIcon: String?
    public var accent: Bool = false
    public var soft: Bool = false
    public let theme: VerveTheme

    public init(_ text: String, icon: String? = nil, accent: Bool = false, soft: Bool = false, theme: VerveTheme) {
        self.text = text
        self.systemIcon = icon
        self.accent = accent
        self.soft = soft
        self.theme = theme
    }

    public var body: some View {
        HStack(spacing: 4) {
            if let systemIcon { VIcon(systemIcon, size: 9, weight: .semibold) }
            Text(text).font(.system(size: 11, weight: .medium))
        }
        .padding(.horizontal, 7).padding(.vertical, 2)
        .background(soft ? theme.accentSoft : theme.hoverBg, in: Capsule())
        .foregroundStyle(accent ? theme.accentColor : theme.textSec)
    }
}

// MARK: - Card

public struct VCard<Content: View>: View {
    public var theme: VerveTheme
    public var padding: CGFloat = 16
    public var radius: CGFloat = 10
    @ViewBuilder public var content: () -> Content

    public var body: some View {
        content()
            .padding(padding)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(theme.cardBg, in: RoundedRectangle(cornerRadius: radius))
            .overlay(
                RoundedRectangle(cornerRadius: radius)
                    .stroke(theme.border, lineWidth: 0.5)
            )
    }
}

// MARK: - Buttons

public struct PrimaryButton: View {
    public let title: String
    public var icon: String?
    public var fullWidth: Bool = false
    public let theme: VerveTheme
    public let action: () -> Void

    public init(_ title: String, icon: String? = nil, fullWidth: Bool = false, theme: VerveTheme, action: @escaping () -> Void) {
        self.title = title
        self.icon = icon
        self.fullWidth = fullWidth
        self.theme = theme
        self.action = action
    }

    public var body: some View {
        Button(action: action) {
            HStack(spacing: 6) {
                if fullWidth { Spacer(minLength: 0) }
                if let icon { VIcon(icon, size: 11) }
                Text(title).font(.system(size: 12.5, weight: .medium))
                if fullWidth { Spacer(minLength: 0) }
            }
            .padding(.horizontal, 12).padding(.vertical, 6)
            .background(theme.accentColor, in: RoundedRectangle(cornerRadius: 6))
            .foregroundStyle(.white)
        }
        .buttonStyle(.plain)
    }
}

public struct SecondaryButton: View {
    public let title: String
    public var icon: String?
    public var tint: Color? = nil
    public let theme: VerveTheme
    public let action: () -> Void

    public init(_ title: String, icon: String? = nil, tint: Color? = nil, theme: VerveTheme, action: @escaping () -> Void) {
        self.title = title
        self.icon = icon
        self.tint = tint
        self.theme = theme
        self.action = action
    }

    public var body: some View {
        Button(action: action) {
            HStack(spacing: 6) {
                if let icon { VIcon(icon, size: 11) }
                Text(title).font(.system(size: 12.5))
            }
            .padding(.horizontal, 12).padding(.vertical, 6)
            .background(theme.cardBg, in: RoundedRectangle(cornerRadius: 6))
            .overlay(RoundedRectangle(cornerRadius: 6).stroke(tint ?? theme.border, lineWidth: 0.5))
            .foregroundStyle(tint ?? theme.textPri)
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Karten-Layout
//
// Zentrale Konstanten für alle Karten-Grids in der App. Damit Übersichten
// (Werke, Figuren, Welt-Einträge, Ideen, …) optisch wie Geschwister wirken:
// gleiche Spaltenbreiten, gleiche Abstände, gleiche Eckradien.

public enum CardLayout {
    /// Adaptive Spalten — passen sich der Fensterbreite an, halten aber die
    /// Mindest- und Maximalbreite konstant. Wird in allen Übersichts-Grids
    /// genutzt (Library, Charaktere, Welt-Kategorien …).
    public static let columns: [GridItem] = [GridItem(.adaptive(minimum: 220, maximum: 260), spacing: 20)]
    /// Vertikaler Abstand zwischen Karten-Reihen.
    public static let rowSpacing: CGFloat = 24
    /// Bild-Verhältnis für Sach-Karten (Figuren, Welt, Ideen). Bücher behalten
    /// ihre eigene 2:3-Proportion über `BookCover`.
    public static let imageAspect: CGFloat = 4.0 / 3.0
    /// Festhöhe des Text-Bereichs unter dem Bild — sorgt für gleich hohe
    /// Karten in einer Reihe, auch wenn Beschreibungen unterschiedlich lang
    /// sind. In Punkten.
    public static let textAreaHeight: CGFloat = 78
    /// Eckradius aller Karten.
    public static let cornerRadius: CGFloat = 10
}

/// Speichern-Button mit transientem „Gespeichert"-Feedback. Klick führt die
/// `action`-Closure aus, dann wechselt das Label für ~1,4 s auf „Gespeichert"
/// mit grünem Häkchen und leichter Skalierung — danach kehrt der Button
/// zurück. So sieht der User auf einen Blick, dass etwas passiert ist.
public struct SaveButton: View {
    public let title: String
    public let savedTitle: String
    public let theme: VerveTheme
    public let action: () -> Void

    @State private var saved: Bool = false
    @State private var resetTask: Task<Void, Never>? = nil

    private static let savedColor = Color(red: 0.16, green: 0.62, blue: 0.30)

    public init(title: String = "Speichern",
                savedTitle: String = "Gespeichert",
                theme: VerveTheme,
                action: @escaping () -> Void)
    {
        self.title = title
        self.savedTitle = savedTitle
        self.theme = theme
        self.action = action
    }

    public var body: some View {
        Button(action: trigger) {
            HStack(spacing: 6) {
                VIcon(saved ? "checkmark.circle" : "checkmark", size: 11)
                Text(saved ? savedTitle : title).font(.system(size: 12.5, weight: saved ? .semibold : .regular))
                    .contentTransition(.opacity)
            }
            .padding(.horizontal, 12).padding(.vertical, 6)
            .background(saved ? Self.savedColor.opacity(0.12) : theme.cardBg, in: RoundedRectangle(cornerRadius: 6))
            .overlay(RoundedRectangle(cornerRadius: 6).stroke(saved ? Self.savedColor : theme.border, lineWidth: 0.5))
            .foregroundStyle(saved ? Self.savedColor : theme.textPri)
            .scaleEffect(saved ? 1.05 : 1.0)
        }
        .buttonStyle(.plain)
        .animation(.spring(response: 0.32, dampingFraction: 0.62), value: saved)
    }

    private func trigger() {
        action()
        saved = true
        resetTask?.cancel()
        resetTask = Task { @MainActor in
            try? await Task.sleep(nanoseconds: 1_400_000_000)
            if !Task.isCancelled { saved = false }
        }
    }
}

public struct ToolbarIconButton: View {
    public let icon: String
    public var label: String? = nil
    public var active: Bool = false
    public let theme: VerveTheme
    public let action: () -> Void

    public var body: some View {
        Button(action: action) {
            HStack(spacing: 6) {
                VIcon(icon, size: 13)
                if let label { Text(label).font(.system(size: 12.5)) }
            }
            .padding(.horizontal, label == nil ? 0 : 10)
            .frame(minWidth: label == nil ? 26 : 0, minHeight: 26)
            .background(active ? theme.sidebarSel : Color.clear, in: RoundedRectangle(cornerRadius: 6))
            .foregroundStyle(active ? theme.textPri : theme.textSec)
            .contentShape(RoundedRectangle(cornerRadius: 6))
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Sidebar

public struct SidebarGroup<Content: View>: View {
    public let title: String
    public let theme: VerveTheme
    @ViewBuilder public var content: () -> Content

    public var body: some View {
        VStack(alignment: .leading, spacing: 1) {
            Text(title.uppercased())
                .font(.system(size: 11, weight: .semibold))
                .tracking(0.6)
                .foregroundStyle(theme.textTer)
                .padding(.horizontal, 12).padding(.bottom, 4).padding(.top, 4)
            content()
        }
        .padding(.bottom, 14)
    }
}

public struct SidebarItem: View {
    public let icon: String
    public let label: String
    public var badge: Int? = nil
    public var active: Bool = false
    public var indent: Int = 0
    public let theme: VerveTheme
    public let action: () -> Void

    @State private var hover = false

    public var body: some View {
        Button(action: action) {
            HStack(spacing: 8) {
                VIcon(icon, size: 14)
                    .foregroundStyle(active ? theme.accentColor : theme.textSec)
                    .frame(width: 16)
                Text(label)
                    .font(.system(size: 13, weight: active ? .medium : .regular))
                    .lineLimit(1)
                    .truncationMode(.tail)
                Spacer(minLength: 0)
                if let badge {
                    Text("\(badge)")
                        .font(.system(size: 11).monospacedDigit())
                        .foregroundStyle(theme.textTer)
                }
            }
            .padding(.leading, CGFloat(10 + indent * 14))
            .padding(.trailing, 10)
            .padding(.vertical, 5)
            .background(
                active ? theme.sidebarSel : (hover ? theme.hoverBg : .clear),
                in: RoundedRectangle(cornerRadius: 6)
            )
            .foregroundStyle(active ? theme.textPri : theme.textSec)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .onHover { hover = $0 }
        .padding(.bottom, 1)
    }
}

// MARK: - Macros: Verkehrslichter (Window-Buttons)

public struct TrafficLights: View {
    public var body: some View {
        HStack(spacing: 8) {
            dot(Color(red: 1.00, green: 0.37, blue: 0.34))
            dot(Color(red: 1.00, green: 0.74, blue: 0.18))
            dot(Color(red: 0.16, green: 0.78, blue: 0.25))
        }
    }
    private func dot(_ color: Color) -> some View {
        Circle().fill(color).frame(width: 12, height: 12)
            .overlay(Circle().stroke(.black.opacity(0.15), lineWidth: 0.5))
    }
}

// MARK: - Window-Frame (zentrale Schale, die Sidebar/Toolbar/Main/Inspector verbindet)

public struct WindowFrame<Sidebar: View, Toolbar: View, Main: View, Inspector: View>: View {
    public let theme: VerveTheme
    public var sidebarWidth: CGFloat = 240
    public var inspectorWidth: CGFloat = 320
    public var showSidebar: Bool = true
    public var showInspector: Bool = false
    public var focusMode: Bool = false
    @ViewBuilder public var sidebar: () -> Sidebar
    @ViewBuilder public var toolbar: () -> Toolbar
    @ViewBuilder public var main: () -> Main
    @ViewBuilder public var inspector: () -> Inspector

    public var body: some View {
        ZStack {
            theme.windowBg.ignoresSafeArea()
            HStack(spacing: 0) {
                if showSidebar && !focusMode {
                    sidebar()
                        .frame(width: sidebarWidth)
                        .background(theme.sidebarBg)
                        .overlay(alignment: .trailing) {
                            Rectangle().fill(theme.divider).frame(width: 0.5)
                        }
                }

                VStack(spacing: 0) {
                    if !focusMode {
                        toolbar()
                            .frame(height: 44)
                            .padding(.horizontal, 12)
                            .background(theme.titleBar)
                            .overlay(alignment: .bottom) {
                                Rectangle().fill(theme.divider).frame(height: 0.5)
                            }
                    }
                    HStack(spacing: 0) {
                        main()
                            .frame(maxWidth: .infinity, maxHeight: .infinity)
                        if showInspector && !focusMode {
                            Rectangle().fill(theme.divider).frame(width: 0.5)
                            inspector()
                                .frame(width: inspectorWidth)
                                .background(theme.sidebarBg)
                        }
                    }
                }
            }
        }
        .foregroundStyle(theme.textPri)
        .preferredColorScheme(theme.isDark ? .dark : .light)
    }
}

// MARK: - Field & FieldGroup (Charakter-Editor-artige Felder)

public struct FieldGroup<Content: View>: View {
    public let title: String
    public let icon: String
    public let theme: VerveTheme
    @ViewBuilder public var content: () -> Content

    public var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 6) {
                VIcon(icon, size: 12)
                Text(title.uppercased())
                    .font(.system(size: 12, weight: .semibold))
                    .tracking(0.6)
            }
            .foregroundStyle(theme.textSec)

            VStack(alignment: .leading, spacing: 8) {
                content()
            }
        }
        .padding(.bottom, 18)
        .overlay(alignment: .bottom) { Rectangle().fill(theme.divider).frame(height: 0.5) }
        .padding(.bottom, 4)
    }
}

public struct FieldRow: View {
    public let label: String
    public let value: String
    public var multiline: Bool = false
    public let theme: VerveTheme

    public var body: some View {
        HStack(alignment: multiline ? .top : .center, spacing: 12) {
            Text(label)
                .font(.system(size: 12))
                .foregroundStyle(theme.textSec)
                .frame(width: 120, alignment: .leading)
                .padding(.top, multiline ? 6 : 0)
            ZStack(alignment: .topTrailing) {
                Text(value.isEmpty ? "—" : value)
                    .font(.system(size: 13))
                    .foregroundStyle(theme.textPri)
                    .frame(maxWidth: .infinity, minHeight: multiline ? 56 : 26, alignment: .topLeading)
                    .padding(.horizontal, 10)
                    .padding(.vertical, multiline ? 8 : 5)
                    .background(theme.cardBg, in: RoundedRectangle(cornerRadius: 6))
                    .overlay(RoundedRectangle(cornerRadius: 6).stroke(theme.border, lineWidth: 0.5))
            }
        }
    }
}

// MARK: - KI Ghost-Text State

public enum AIFieldState: Equatable {
    case idle
    case loading
    /// Streaming aktiv — Text wächst während der KI-Call läuft. UI rendert
    /// einen pulsierenden Cursor am Ende, damit der Autor sieht: hier kommt
    /// noch was. Buttons (Übernehmen/Anhängen) erscheinen erst bei `.suggesting`.
    case streaming(String)
    case suggesting(String)
    case error(String)
}

/// Dezenter Indicator in der Editor-Statusleiste, wenn der `AIBackgroundCoordinator`
/// gerade einen stillen Hintergrund-Job laufen hat (Memory-Distillation,
/// Stil-Lektor o. ä.). Pulsiert leicht, zeigt das `currentJobLabel` als
/// Tooltip — der Autor weiß, dass im Hintergrund was passiert, wird aber
/// nicht abgelenkt.
public struct AIBackgroundBadge: View {
    @Bindable var coordinator: AIBackgroundCoordinator
    let theme: VerveTheme
    @State private var pulse: Bool = false

    public init(coordinator: AIBackgroundCoordinator, theme: VerveTheme) {
        self.coordinator = coordinator
        self.theme = theme
    }

    public var body: some View {
        HStack(spacing: 4) {
            Circle()
                .fill(theme.accentColor)
                .frame(width: 6, height: 6)
                .opacity(pulse ? 0.45 : 1.0)
            Text(coordinator.currentJobLabel ?? "KI im Hintergrund")
                .font(.system(size: 11)).foregroundStyle(theme.textSec)
                .lineLimit(1)
                .truncationMode(.tail)
        }
        .help(coordinator.currentJobLabel ?? "Hintergrund-Aufgabe läuft")
        .onAppear {
            withAnimation(.easeInOut(duration: 0.7).repeatForever(autoreverses: true)) {
                pulse = true
            }
        }
    }
}

/// Pulsierender Cursor für `AIFieldState.streaming(_)` — signalisiert „Da
/// kommt noch was rein". 1 px schmaler Strich, der zwischen 0.2 und 1.0
/// Opacity wechselt. Wird neben dem partiellen Text gerendert.
struct StreamingCursor: View {
    let theme: VerveTheme
    @State private var opacity: Double = 1.0
    var body: some View {
        Rectangle()
            .fill(theme.accentColor)
            .frame(width: 1.5, height: 14)
            .opacity(opacity)
            .onAppear {
                withAnimation(.easeInOut(duration: 0.5).repeatForever(autoreverses: true)) {
                    opacity = 0.2
                }
            }
    }
}

/// Zeigt Ghost-Text und Aktions-Buttons unterhalb eines Feldes.
/// Zustand wird vom Aufrufer als einfacher Wert übergeben (kein Binding).
public struct AIFieldSuggestion: View {
    let state: AIFieldState
    let hasExistingContent: Bool
    let theme: VerveTheme
    let onAccept: (String) -> Void
    let onAppend: ((String) -> Void)?
    let onDismiss: () -> Void

    public var body: some View {
        switch state {
        case .idle:
            EmptyView()
        case .loading:
            HStack(spacing: 8) {
                ProgressView().controlSize(.small)
                Text("KI denkt…")
                    .font(.system(size: 11))
                    .foregroundStyle(theme.textTer)
            }
            .padding(.top, 4)
        case .streaming(let text):
            // Text-only-Block mit pulsierendem Cursor — keine Buttons, weil der
            // Vorschlag noch wächst. Übergang zu .suggesting(finalText) macht
            // der Aufrufer am Ende des Streams.
            HStack(alignment: .top, spacing: 0) {
                Text(text)
                    .font(.system(size: 13).italic())
                    .foregroundStyle(theme.textSec)
                StreamingCursor(theme: theme)
                    .padding(.leading, 1)
            }
            .padding(10)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(theme.accentSoft, in: RoundedRectangle(cornerRadius: 6))
            .overlay(RoundedRectangle(cornerRadius: 6).stroke(theme.accentColor.opacity(0.25), lineWidth: 0.5))
            .padding(.top, 4)
        case .suggesting(let text):
            VStack(alignment: .leading, spacing: 6) {
                Text(text)
                    .font(.system(size: 13).italic())
                    .foregroundStyle(theme.textSec)
                    .padding(10)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(theme.accentSoft, in: RoundedRectangle(cornerRadius: 6))
                    .overlay(RoundedRectangle(cornerRadius: 6).stroke(theme.accentColor.opacity(0.25), lineWidth: 0.5))
                HStack(spacing: 8) {
                    Button("Übernehmen") { onAccept(text) }
                        .buttonStyle(.borderedProminent)
                        .controlSize(.small)
                    if hasExistingContent, let onAppend {
                        Button("Anhängen") { onAppend(text) }
                            .controlSize(.small)
                    }
                    Button("Verwerfen") { onDismiss() }
                        .controlSize(.small)
                }
            }
            .padding(.top, 4)
        case .error(let msg):
            Text(msg)
                .font(.system(size: 12))
                .foregroundStyle(.orange)
                .padding(8)
                .background(Color.orange.opacity(0.08), in: RoundedRectangle(cornerRadius: 6))
                .padding(.top, 4)
        }
    }
}
