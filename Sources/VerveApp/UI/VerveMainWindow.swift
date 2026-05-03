import SwiftData
import SwiftUI

// MARK: - Navigation

public enum LibraryFilter: String, Hashable, CaseIterable {
    case all, favorites, archive
    public var title: String {
        switch self {
        case .all:        return "Alle Werke"
        case .favorites:  return "Favoriten"
        case .archive:    return "Archiv"
        }
    }
}

public enum VerveRoute: Hashable {
    case welcome
    case library(LibraryFilter)
    case dashboard
    /// Detail-Ansicht eines einzelnen Buchs — zeigt Cover, Titel, Inhaltsverzeichnis,
    /// Statistiken. Klick auf ein Kapitel öffnet den Editor.
    case book(UUID)
    case editor, characters, characterDetail(UUID)
    case world(WorldKind), inbox, consistency, chat, templates, export
    /// Globale Plot-Matrix — Werk- und Band-Auswahl passieren in der View
    /// selbst. Es gibt nur einen Sidebar-Eintrag, kein „erst Werk wählen,
    /// dann Plot anklicken".
    case plot
    /// Liste aller Setup-Karten ohne späteren Payoff. Werk wird ebenfalls
    /// in der View gewählt (oder über `store.activeWorkID` vorbelegt).
    case openThreads
    /// Kapitelplanung — Master-Detail-Übersicht aller Kapitel des aktiven
    /// Werks mit Inspector und Analyse.
    case chapterPlanning

    var isLibrary: Bool { if case .library = self { return true }; return false }
}

@MainActor
@Observable
public final class VerveRouter {
    public var route: VerveRoute = .welcome
    public var commandPaletteOpen: Bool = false
    public var focusMode: Bool = false
    /// Zeigt das Profil-Bearbeiten-Sheet (von der Sidebar oder dem Welcome-Screen aus aufrufbar).
    public var editingProfile: Bool = false
    /// Wenn beim Wechsel auf eine Welt-Kategorie ein bestimmter Eintrag geöffnet werden soll.
    public var pendingWorldEntryID: UUID? = nil

    public init() {}

    /// Springt zu einem Welt-Eintrag, egal von wo.
    public func openWorldEntry(_ id: UUID, kind: WorldKind) {
        pendingWorldEntryID = id
        route = .world(kind)
    }
}

// MARK: - Hauptfenster

public struct VerveMainWindow: View {
    @Environment(\.modelContext) private var modelContext
    @Environment(\.openSettings) private var openSettings
    @Environment(TweaksStore.self) private var tweaks
    @Environment(KIProviderStore.self) private var ki
    @Environment(VerveUpdaterCenter.self) private var updaterCenter
    @State private var router = VerveRouter()
    @State private var store: VerveStore?
    @State private var showingShortcuts: Bool = false
    @State private var showingAIFeatures: Bool = false
    @State private var showingFeedback: Bool = false
    @State private var showingAbout: Bool = false
    @State private var showingPrivacy: Bool = false
    @State private var showingVersionsHint: Bool = false
    @State private var noticeTitle: String = ""
    @State private var noticeMessage: String = ""
    @State private var showingNotice: Bool = false
    /// Hintergrund-KI-Coordinator — prozessweiter Singleton, damit
    /// MainWindow + Settings-Scene dieselbe Instanz nutzen. Ohne diese
    /// Bridge crasht das Settings-Fenster beim Öffnen, weil sein Memory-Tab
    /// den Coordinator aus dem Environment liest.
    private let aiBackground = AIBackgroundCoordinator.shared
    /// Multi-Chat-Sessions-Store. Wird bei Store-Aufbau initialisiert und
    /// per Environment durchgereicht.
    @State private var chatStore: ChatStore?

    public init() {}

    public var body: some View {
        Group {
            if let store, let chatStore {
                content(store: store)
                    .environment(chatStore)
            } else {
                Color.clear.task {
                    let s = VerveStore(context: modelContext)
                    store = s
                    chatStore = ChatStore(store: s)
                }
            }
        }
        .preferredColorScheme(tweaks.dark ? .dark : .light)
        .environment(aiBackground)
    }

    @ViewBuilder
    private func content(store: VerveStore) -> some View {
        let theme = tweaks.theme
        ZStack {
            theme.windowBg.ignoresSafeArea()

            HStack(spacing: 0) {
                if showSidebar {
                    MainSidebar(store: store, router: router, tweaks: tweaks, theme: theme,
                                openSettings: { openSettings() })
                        .frame(width: tweaks.compactSidebar ? 200 : 240)
                        .background(theme.sidebarBg)
                        .overlay(alignment: .trailing) {
                            Rectangle().fill(theme.divider).frame(width: 0.5)
                        }
                }

                VStack(spacing: 0) {
                    if !router.focusMode {
                        MainToolbar(store: store, router: router, tweaks: tweaks, theme: theme,
                                    openSettings: { openSettings() },
                                    showSidebarLightsRoom: !showSidebar)
                            .frame(height: 44)
                            .padding(.horizontal, 12)
                            .padding(.leading, showSidebar ? 0 : 76)
                            .background(theme.titleBar)
                            .overlay(alignment: .bottom) {
                                Rectangle().fill(theme.divider).frame(height: 0.5)
                            }
                    }
                    HStack(spacing: 0) {
                        mainContent(store: store, theme: theme)
                            .frame(maxWidth: .infinity, maxHeight: .infinity)
                        if showInspector {
                            Rectangle().fill(theme.divider).frame(width: 0.5)
                            EditorInspectorView(store: store, theme: theme)
                                .frame(width: 320)
                                .background(theme.sidebarBg)
                        }
                    }
                }
            }
            .ignoresSafeArea()

            if router.commandPaletteOpen {
                CommandPaletteOverlay(store: store, router: router, theme: theme,
                                      openSettings: { openSettings() })
                    .transition(.opacity.combined(with: .scale(scale: 0.97)))
                    .zIndex(40)
            }
        }
        .background(KeyEventCatcher { keyDown(event: $0) })
        .onAppear {
            if store.works.isEmpty { router.route = .welcome }
            else if router.route == .welcome { router.route = .dashboard }
        }
        // Auto-Snapshot beim App-Wegklicken: sichert die aktuelle
        // Tagesarbeit ohne dass der Nutzer einen manuellen Snapshot
        // anlegen muss. Throttle auf 30 min im Store.
        .onReceive(NotificationCenter.default.publisher(
            for: NSApplication.didResignActiveNotification
        )) { _ in
            if let id = store.activeChapterID {
                store.autoSnapshotIfNeeded(forChapterID: id)
            }
        }
        // Beim Wiederaktivieren der App nach Pause: leiser Update-Check,
        // wenn die letzte Prüfung zu lange her ist. Ergibt zusammen mit dem
        // Start-Check, dass der Badge auch dann auftaucht, wenn die App
        // tagelang offen liegt.
        .onReceive(NotificationCenter.default.publisher(
            for: NSApplication.didBecomeActiveNotification
        )) { _ in
            updaterCenter.backgroundCheckIfDue()
        }
        // Auto-Snapshot beim Kapitel-Wechsel: das vorher aktive Kapitel
        // wird gesichert, falls verändert. Den vorherigen Wert holen wir
        // im Closure-Parameter `old` ab.
        .onChange(of: store.activeChapterID) { old, _ in
            if let id = old {
                store.autoSnapshotIfNeeded(forChapterID: id)
            }
        }
        .onReceive(NotificationCenter.default.publisher(for: .openCommandPalette)) { _ in
            router.commandPaletteOpen = true
        }
        .onReceive(NotificationCenter.default.publisher(for: .verveOpenCharacter)) { note in
            if let id = note.object as? UUID {
                router.route = .characterDetail(id)
            }
        }
        .onReceive(NotificationCenter.default.publisher(for: .verveOpenWorldEntry)) { note in
            if let req = note.object as? VerveOpenWorldRequest {
                router.openWorldEntry(req.id, kind: req.kind)
            }
        }
        .onReceive(NotificationCenter.default.publisher(for: .verveOpenWikilink)) { note in
            guard let name = (note.object as? NSString) as String? else { return }
            resolveWikilink(name: name, store: store)
        }
        .modifier(MenuBusModifier(store: store, router: router, tweaks: tweaks) { title, message in
            noticeTitle = title
            noticeMessage = message
            showingNotice = true
        })
        .sheet(isPresented: $router.editingProfile) {
            ProfileEditorSheet(store: store, theme: theme)
        }
        .sheet(isPresented: Binding(
            get: { updaterCenter.isPresented },
            set: { updaterCenter.isPresented = $0 }
        )) {
            UpdateSheet(updater: updaterCenter.updater, theme: theme)
        }
        .sheet(isPresented: $showingShortcuts) {
            ShortcutsSheet().environment(tweaks)
        }
        .sheet(isPresented: $showingAIFeatures) {
            AIFeaturesSheet().environment(tweaks)
        }
        .sheet(isPresented: $showingFeedback) {
            FeedbackBoardSheet().environment(tweaks)
        }
        .sheet(isPresented: $showingAbout) {
            AboutVerveSheet().environment(tweaks)
        }
        .sheet(isPresented: $showingPrivacy) {
            PrivacySheet().environment(tweaks)
        }
        .alert(noticeTitle, isPresented: $showingNotice, presenting: noticeMessage) { _ in
            Button("OK") {}
        } message: { msg in
            Text(msg)
        }
        .onReceive(NotificationCenter.default.publisher(for: .verveMenuOpenShortcuts)) { _ in
            showingShortcuts = true
        }
        .onReceive(NotificationCenter.default.publisher(for: .verveMenuOpenAIFeatures)) { _ in
            showingAIFeatures = true
        }
        .onReceive(NotificationCenter.default.publisher(for: .verveMenuOpenFeedback)) { _ in
            showingFeedback = true
        }
        .onReceive(NotificationCenter.default.publisher(for: .verveMenuOpenAbout)) { _ in
            showingAbout = true
        }
        .onReceive(NotificationCenter.default.publisher(for: .verveMenuOpenPrivacy)) { _ in
            showingPrivacy = true
        }
        .onReceive(NotificationCenter.default.publisher(for: .verveMenuOpenVersions)) { _ in
            handleVersionsMenu()
        }
        .alert("Versionen sind im Editor verfügbar",
               isPresented: $showingVersionsHint) {
            Button("OK") {}
        } message: {
            Text("Öffne ein Kapitel im Editor — die Uhr-Pille im Header zeigt alle Versionen, klick auf 'Versionen' im Menü öffnet das Popover dort.")
        }
        .foregroundStyle(theme.textPri)
    }

    /// Versucht einen Wikilink (`[[Name]]`) auf eine Figur oder einen
    /// Welt-Eintrag im aktiven Werk zu lösen. Fallback: case-insensitive
    /// Substring-Match. Wenn nichts passt, passiert nichts — der Klick wirkt
    /// dann wie ein normaler Text-Klick.
    private func resolveWikilink(name: String, store: VerveStore) {
        let needle = name.trimmingCharacters(in: .whitespaces).lowercased()
        guard !needle.isEmpty else { return }
        let activeWorkID = store.activeWorkID
        // Charaktere zuerst — Eigennamen sind im Manuskript der Hauptfall.
        let chars = store.characters.filter { c in
            (activeWorkID == nil || c.workID == activeWorkID)
        }
        if let hit = chars.first(where: { $0.name.lowercased() == needle })
            ?? chars.first(where: { $0.aliases.contains(where: { $0.lowercased() == needle }) })
            ?? chars.first(where: { $0.name.lowercased().contains(needle) })
        {
            router.route = .characterDetail(hit.id)
            return
        }
        let world = store.world.filter { e in
            activeWorkID == nil || e.workID == activeWorkID
        }
        if let hit = world.first(where: { $0.title.lowercased() == needle })
            ?? world.first(where: { $0.title.lowercased().contains(needle) })
        {
            let kind = WorldKind(rawValue: hit.kindRaw) ?? .places
            router.openWorldEntry(hit.id, kind: kind)
        }
    }

    /// Versionen-Menüpunkt: das Versions-Popover hängt am Editor. Hat der
    /// Nutzer kein Kapitel offen, springen wir auf das aktive Kapitel des
    /// aktiven Werks (oder das erste verfügbare Kapitel). Findet sich gar
    /// keines, zeigen wir einen erklärenden Hinweis.
    private func handleVersionsMenu() {
        guard let store else { return }
        // Schon im Editor mit aktivem Kapitel? Notification fängt EditorView selbst.
        if case .editor = router.route, store.activeChapter != nil {
            return
        }
        // Aktives Kapitel vorhanden? Springe in den Editor — Notification feuert
        // gleich erneut, EditorView ist dann gemountet.
        if let chap = store.activeChapter {
            store.activeChapterID = chap.id
            router.route = .editor
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.15) {
                NotificationCenter.default.post(name: .verveMenuOpenVersions, object: nil)
            }
            return
        }
        // Kein aktives Kapitel — erstes Kapitel im aktiven Werk suchen.
        if let work = store.activeWork,
           let chapter = store.chapters.first(where: { $0.workID == work.id })
        {
            store.activeChapterID = chapter.id
            router.route = .editor
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.15) {
                NotificationCenter.default.post(name: .verveMenuOpenVersions, object: nil)
            }
            return
        }
        // Komplett ohne Kapitel: Hinweis zeigen.
        showingVersionsHint = true
    }

    private var showSidebar: Bool {
        guard tweaks.showSidebar else { return false }
        switch router.route {
        case .welcome: return false
        default: return true
        }
    }

    private var showInspector: Bool {
        guard tweaks.showInspector else { return false }
        return router.route == .editor
    }

    @ViewBuilder
    private func mainContent(store: VerveStore, theme: VerveTheme) -> some View {
        switch router.route {
        case .welcome:
            WelcomeView(store: store, router: router, tweaks: tweaks, theme: theme)
        case .library(let filter):
            LibraryGridView(store: store, router: router, theme: theme, filter: filter)
        case .dashboard:
            DashboardView(store: store, router: router, theme: theme)
        case .book(let id):
            BookDetailView(store: store, router: router, theme: theme, bookID: id)
        case .plot:
            PlotMatrixView(store: store, router: router, theme: theme)
        case .openThreads:
            OpenThreadsView(store: store, router: router, theme: theme)
        case .chapterPlanning:
            ChapterPlanningView(store: store, router: router, theme: theme)
        case .editor:
            EditorView(store: store, router: router, tweaks: tweaks, theme: theme)
        case .characters:
            CharactersListView(store: store, router: router, ki: ki, theme: theme)
        case .characterDetail(let id):
            CharacterDetailView(store: store, router: router, ki: ki, theme: theme, characterID: id)
        case .world(let kind):
            WorldView(store: store, router: router, ki: ki, theme: theme, kind: kind)
        case .inbox:
            InboxView(store: store, theme: theme)
        case .consistency:
            ConsistencyView(store: store, ki: ki, theme: theme)
        case .chat:
            ChatView(store: store, ki: ki, router: router, theme: theme)
        case .templates:
            TemplatesView(store: store, router: router, theme: theme)
        case .export:
            ExportView(store: store, router: router, theme: theme)
        }
    }

    private func keyDown(event: NSEvent) {
        if event.modifierFlags.contains(.command) && event.charactersIgnoringModifiers == "k" {
            router.commandPaletteOpen.toggle()
        }
        if event.modifierFlags.contains(.command) && event.charactersIgnoringModifiers == "." {
            router.focusMode.toggle()
        }
    }
}

// MARK: - Sidebar

struct MainSidebar: View {
    @Bindable var store: VerveStore
    @Bindable var router: VerveRouter
    @Bindable var tweaks: TweaksStore
    let theme: VerveTheme
    let openSettings: () -> Void
    @State private var collapsedSeries: Set<UUID> = []

    var body: some View {
        VStack(spacing: 0) {
            // Header — Platz für macOS-Verkehrsampeln links, dann Update-Badge
            // (falls verfügbar) und Profil rechts.
            HStack(spacing: 8) {
                // Verkehrsampeln-Reservat (macOS rendert sie selbst über das Fenster)
                Color.clear.frame(width: 64, height: 28)
                Spacer(minLength: 0)
                UpdateBadge(theme: theme)
                Button(action: { router.editingProfile = true }) {
                    HStack(spacing: 6) {
                        Circle().fill(theme.accentColor).frame(width: 22, height: 22)
                            .overlay(Text(initialsForHeader).font(.system(size: 10.5, weight: .semibold)).foregroundStyle(.white))
                        Text(displayName)
                            .font(.system(size: 12)).foregroundStyle(theme.textSec)
                            .lineLimit(1)
                            .truncationMode(.tail)
                    }
                }
                .buttonStyle(.plain)
                .help(store.author.name.isEmpty ? "Profil einrichten" : "Profil bearbeiten")
            }
            .frame(height: 44).padding(.horizontal, 10)
            .overlay(alignment: .bottom) { Rectangle().fill(theme.divider).frame(height: 0.5) }

            // Aktives Werk
            if let w = store.activeWork {
                Button(action: { router.route = .dashboard }) {
                    HStack(spacing: 10) {
                        BookSpineMini(work: w)
                        VStack(alignment: .leading, spacing: 1) {
                            Text(w.title).font(.system(size: 12, weight: .semibold)).lineLimit(1).foregroundStyle(theme.textPri)
                            Text("\(store.books.filter({ $0.workID == w.id }).count) Bücher")
                                .font(.system(size: 10.5)).foregroundStyle(theme.textSec)
                        }
                        Spacer()
                        VIcon("chevron.down", size: 10).foregroundStyle(theme.textTer)
                    }
                    .padding(.horizontal, 10).padding(.vertical, 8)
                    .background(theme.cardBg, in: RoundedRectangle(cornerRadius: 8))
                    .overlay(RoundedRectangle(cornerRadius: 8).stroke(theme.border, lineWidth: 0.5))
                }
                .buttonStyle(.plain)
                .padding(.horizontal, 10).padding(.top, 12).padding(.bottom, 6)
            }

            // Suche
            Button(action: { router.commandPaletteOpen = true }) {
                HStack(spacing: 6) {
                    VIcon("search", size: 12)
                    Text("Suchen…").font(.system(size: 12))
                    Spacer()
                    Text("⌘K").font(.system(size: 10.5))
                }
                .foregroundStyle(theme.textTer)
                .padding(.horizontal, 10).padding(.vertical, 5)
                .background(theme.hoverBg, in: RoundedRectangle(cornerRadius: 6))
            }
            .buttonStyle(.plain)
            .padding(.horizontal, 10).padding(.bottom, 8)

            ScrollView {
                VStack(alignment: .leading, spacing: 0) {
                    SidebarGroup(title: "Bibliothek", theme: theme) {
                        SidebarItem(icon: "books", label: "Alle Werke",
                                    badge: store.works.filter({ !$0.isArchived }).count,
                                    active: router.route == .library(.all),
                                    theme: theme, action: { router.route = .library(.all) })
                        SidebarItem(icon: "star", label: "Favoriten",
                                    badge: store.works.filter(\.isFavorite).count,
                                    active: router.route == .library(.favorites),
                                    theme: theme, action: { router.route = .library(.favorites) })
                        SidebarItem(icon: "archive", label: "Archiv",
                                    badge: store.works.filter(\.isArchived).count,
                                    active: router.route == .library(.archive),
                                    theme: theme, action: { router.route = .library(.archive) })
                    }

                    SidebarGroup(title: "Plot & Kapitel", theme: theme) {
                        SidebarItem(
                            icon: "matrix",
                            label: "Plot-Matrix",
                            active: router.route == .plot,
                            theme: theme,
                            action: { router.route = .plot }
                        )
                        SidebarItem(
                            icon: "doc.text",
                            label: "Kapitelplanung",
                            active: router.route == .chapterPlanning,
                            theme: theme,
                            action: { router.route = .chapterPlanning }
                        )
                        SidebarItem(
                            icon: "lightbulb",
                            label: "Offene Fäden",
                            badge: store.activeWork.map { store.openThreadCount(forWork: $0.id) },
                            active: router.route == .openThreads,
                            theme: theme,
                            action: { router.route = .openThreads }
                        )
                    }

                    if let w = store.activeWork {
                        SidebarGroup(title: w.title, theme: theme) {
                            // „Übersicht" mit warmem Werkstatt-Icon — eine
                            // leere Seite war zu trostlos, eine Bücher-
                            // Schräge fühlt sich nach Schreibtisch an.
                            SidebarItem(icon: "books", label: "Übersicht",
                                        active: router.route == .dashboard, theme: theme,
                                        action: { router.route = .dashboard })
                            ForEach(store.series.filter({ $0.workID == w.id }), id: \.id) { s in
                                let collapsed = collapsedSeries.contains(s.id)
                                SidebarItem(
                                    icon: collapsed ? "chevron.right" : "chevron.down",
                                    label: shortSeriesTitle(s.title, work: w),
                                    badge: store.books.filter({ $0.seriesID == s.id }).count,
                                    theme: theme,
                                    action: {
                                        if collapsed { collapsedSeries.remove(s.id) } else { collapsedSeries.insert(s.id) }
                                    }
                                )
                                if !collapsed {
                                    let seriesBooks = store.books.filter({ $0.seriesID == s.id }).sorted(by: { $0.orderIndex < $1.orderIndex })
                                    ForEach(seriesBooks, id: \.id) { b in
                                        SidebarItem(
                                            icon: "book",
                                            label: b.title,
                                            active: isBookActive(b),
                                            indent: 1,
                                            theme: theme,
                                            action: { openBook(b, in: w) }
                                        )
                                    }
                                }
                            }
                            let strays = store.books.filter({ $0.workID == w.id && $0.seriesID == nil })
                                .sorted(by: { $0.orderIndex < $1.orderIndex })
                            ForEach(strays, id: \.id) { b in
                                SidebarItem(icon: "book", label: b.title,
                                            active: isBookActive(b),
                                            theme: theme,
                                            action: { openBook(b, in: w) })
                            }
                        }

                        SidebarGroup(title: "Werk-Wissen", theme: theme) {
                            SidebarItem(icon: "people", label: "Figuren",
                                        badge: store.characters.filter({ $0.workID == w.id }).count,
                                        active: routeIsCharacters,
                                        theme: theme, action: { router.route = .characters })
                            ForEach(WorldKind.allCases) { k in
                                let count = store.world.filter({ $0.workID == w.id && $0.kindRaw == k.rawValue }).count
                                SidebarItem(icon: k.icon, label: k.title, badge: count,
                                            active: { if case .world(let cur) = router.route, cur == k { return true }; return false }(),
                                            theme: theme, action: { router.route = .world(k) })
                            }
                        }

                        SidebarGroup(title: "Werkzeuge", theme: theme) {
                            SidebarItem(icon: "tray", label: "Inbox",
                                        badge: store.inbox.filter({ $0.status == "open" }).count,
                                        active: router.route == .inbox, theme: theme,
                                        action: { router.route = .inbox })
                            SidebarItem(icon: "shield.check", label: "Konsistenz",
                                        badge: store.consistency.filter({ $0.severity != "resolved" }).count,
                                        active: router.route == .consistency, theme: theme,
                                        action: { router.route = .consistency })
                            SidebarItem(icon: "bubble", label: "Wissens-Chat",
                                        active: router.route == .chat, theme: theme, action: { router.route = .chat })
                            SidebarItem(icon: "share", label: "Export",
                                        active: router.route == .export, theme: theme, action: { router.route = .export })
                            SidebarItem(icon: "grid", label: "Vorlagen",
                                        active: router.route == .templates, theme: theme, action: { router.route = .templates })
                        }
                    }
                }
                .padding(.horizontal, 6).padding(.vertical, 4)
            }

            FooterStatus(theme: theme, openSettings: openSettings)
        }
    }

    private var displayName: String {
        if !store.author.pseudonym.isEmpty { return store.author.pseudonym }
        if !store.author.name.isEmpty      { return store.author.name }
        return "Profil einrichten"
    }
    private var initialsForHeader: String {
        if !store.author.initials.isEmpty { return store.author.initials }
        return "?"
    }

    private var routeIsCharacters: Bool {
        if case .characters = router.route { return true }
        if case .characterDetail = router.route { return true }
        return false
    }

    private func isBookActive(_ b: VBook) -> Bool {
        if case .book(let id) = router.route, id == b.id { return true }
        if case .editor = router.route, let chap = store.activeChapter, chap.bookID == b.id { return true }
        return false
    }

    private func shortSeriesTitle(_ title: String, work: VWork) -> String {
        var t = title
        let prefix = "\(work.title) — "
        if t.hasPrefix(prefix) { t.removeFirst(prefix.count) }
        return t
    }

    private func openBook(_ b: VBook, in w: VWork) {
        // Aktives Werk konsistent halten — das Buch könnte zu einem anderen Werk
        // gehören (z. B. wenn der Nutzer aus der Bibliothek heraus springt).
        store.activeWorkID = b.workID
        store.touchWork(b.workID)
        // Sidebar-Klick öffnet die Buch-Detail-View, nicht direkt den Editor.
        // So sieht der Autor Inhaltsverzeichnis und Statistik, bevor er reinspringt.
        router.route = .book(b.id)
    }
}

struct FooterStatus: View {
    @Environment(\.cloudActive) private var cloud
    let theme: VerveTheme
    let openSettings: () -> Void
    var body: some View {
        HStack(spacing: 8) {
            Circle().fill(cloud ? Color(red: 0.16, green: 0.78, blue: 0.25) : theme.textTer).frame(width: 6, height: 6)
            Text(cloud ? "iCloud · synchronisiert" : "Lokal · gespeichert")
                .font(.system(size: 11)).foregroundStyle(theme.textTer)
            Spacer()
            Button(action: {
                NotificationCenter.default.post(name: .verveMenuOpenFeedback, object: nil)
            }) {
                VIcon("sparkles", size: 12).foregroundStyle(theme.textTer)
            }
            .buttonStyle(.plain)
            .help("Feedback & Ideen")
            Button(action: openSettings) {
                VIcon("settings", size: 12).foregroundStyle(theme.textTer)
            }
            .buttonStyle(.plain)
            .help("Einstellungen öffnen")
        }
        .padding(.horizontal, 14).padding(.vertical, 8)
        .overlay(alignment: .top) { Rectangle().fill(theme.divider).frame(height: 0.5) }
    }
}

struct BookSpineMini: View {
    let work: VWork
    var body: some View {
        RoundedRectangle(cornerRadius: 3)
            .fill(LinearGradient(colors: [work.coverFromColor, work.coverToColor], startPoint: .topLeading, endPoint: .bottomTrailing))
            .frame(width: 28, height: 36)
            .overlay(
                Text(work.coverGlyph).font(.custom("Georgia", size: 14)).foregroundStyle(.white.opacity(0.92))
            )
            .shadow(color: .black.opacity(0.15), radius: 2, x: 0, y: 1)
    }
}

// MARK: - Toolbar

struct MainToolbar: View {
    @Bindable var store: VerveStore
    @Bindable var router: VerveRouter
    @Bindable var tweaks: TweaksStore
    let theme: VerveTheme
    let openSettings: () -> Void
    /// Wenn keine Sidebar sichtbar ist: Toolbar enthält selbst den Sidebar-Toggle ganz links.
    let showSidebarLightsRoom: Bool

    var body: some View {
        HStack(spacing: 6) {
            ToolbarIconButton(icon: "sidebar", active: tweaks.showSidebar, theme: theme) { tweaks.showSidebar.toggle() }
            Rectangle().fill(theme.divider).frame(width: 1, height: 18).padding(.horizontal, 4)
            Text(viewLabel).font(.system(size: 12.5, weight: .semibold)).foregroundStyle(theme.textPri)
            if let w = store.activeWork, !router.route.isLibrary, router.route != .welcome {
                Text("· \(w.title)").font(.system(size: 12)).foregroundStyle(theme.textTer)
            }
            Spacer()
            if router.route == .editor {
                ToolbarIconButton(icon: "focus", label: "Focus", active: router.focusMode, theme: theme) { router.focusMode.toggle() }
                ToolbarIconButton(
                    icon: tweaks.allChaptersMode ? "books" : "doc.text",
                    label: tweaks.allChaptersMode ? "Fortlaufend" : "Einzelnes Kapitel",
                    active: tweaks.allChaptersMode,
                    theme: theme
                ) { tweaks.allChaptersMode.toggle() }
                .help(tweaks.allChaptersMode
                      ? "Wechseln zu „Einzelnes Kapitel“ — fokussiert nur das aktuelle Kapitel."
                      : "Wechseln zu „Fortlaufend“ — alle Kapitel des Buchs in einem Scroll mit fetten Kapitel-Trennern.")
                Rectangle().fill(theme.divider).frame(width: 1, height: 18).padding(.horizontal, 4)
            }
            ToolbarIconButton(icon: "bubble", theme: theme) { router.route = .chat }
            ToolbarIconButton(icon: "shield.check", theme: theme) { router.route = .consistency }
            ToolbarIconButton(icon: "share", theme: theme) { router.route = .export }
            if router.route == .editor {
                ToolbarIconButton(icon: "inspector", active: tweaks.showInspector, theme: theme) { tweaks.showInspector.toggle() }
            }
            ToolbarIconButton(icon: "settings", theme: theme) { openSettings() }
        }
    }

    private var viewLabel: String {
        switch router.route {
        case .welcome:           return "Willkommen"
        case .library(let f):    return f.title
        case .dashboard:         return "Werk"
        case .book(let id):      return store.books.first(where: { $0.id == id })?.title ?? "Buch"
        case .plot:               return "Plot-Matrix"
        case .openThreads:        return "Offene Fäden"
        case .chapterPlanning:    return "Kapitelplanung"
        case .editor:            return store.activeChapter?.title ?? "Editor"
        case .characters:        return "Figuren"
        case .characterDetail:   return "Figur"
        case .world(let k):      return k.title
        case .inbox:             return "Inbox"
        case .consistency:       return "Konsistenz-Check"
        case .chat:              return "Wissens-Chat"
        case .templates:         return "Vorlagen"
        case .export:            return "Export"
        }
    }
}

// MARK: - Profile Editor Sheet

struct ProfileEditorSheet: View {
    @Bindable var store: VerveStore
    let theme: VerveTheme
    @Environment(\.dismiss) private var dismiss
    @State private var name: String = ""
    @State private var pseudonym: String = ""

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Profil").font(.system(size: 18, weight: .semibold))
                Spacer()
                Button(action: { dismiss() }) { VIcon("xmark", size: 11) }.buttonStyle(.plain).foregroundStyle(theme.textTer)
            }
            VStack(alignment: .leading, spacing: 8) {
                Text("Voller Name").font(.system(size: 11, weight: .semibold)).foregroundStyle(theme.textTer)
                TextField("Vor- und Nachname", text: $name).textFieldStyle(.roundedBorder)
                Text("Pseudonym (auf dem Cover)").font(.system(size: 11, weight: .semibold)).foregroundStyle(theme.textTer)
                TextField("z. B. Initialen + Nachname", text: $pseudonym).textFieldStyle(.roundedBorder)
                Text("Beides wird in der Sidebar, in den Buchcovern und im Export verwendet.")
                    .font(.system(size: 11)).foregroundStyle(theme.textTer)
            }
            HStack {
                if !store.author.name.isEmpty {
                    Button(role: .destructive) {
                        store.updateAuthor(name: "", pseudonym: "")
                        dismiss()
                    } label: { Text("Profil entfernen") }
                }
                Spacer()
                Button("Abbrechen") { dismiss() }
                Button("Speichern") {
                    store.updateAuthor(name: name, pseudonym: pseudonym)
                    dismiss()
                }
                .keyboardShortcut(.defaultAction)
                .disabled(name.trimmingCharacters(in: .whitespaces).isEmpty)
            }
        }
        .padding(20)
        .frame(width: 460)
        .background(theme.windowBg)
        .onAppear {
            name = store.author.name
            pseudonym = store.author.pseudonym
        }
    }
}

// MARK: - Globaler Tastatur-Hook

struct KeyEventCatcher: NSViewRepresentable {
    let onKeyDown: (NSEvent) -> Void

    func makeNSView(context: Context) -> KeyView {
        let v = KeyView()
        v.onKeyDown = onKeyDown
        return v
    }
    func updateNSView(_ nsView: KeyView, context: Context) { nsView.onKeyDown = onKeyDown }

    final class KeyView: NSView {
        var onKeyDown: ((NSEvent) -> Void)?
        override var acceptsFirstResponder: Bool { true }
        override func viewDidMoveToWindow() { window?.makeFirstResponder(self) }
        override func keyDown(with event: NSEvent) { onKeyDown?(event); super.keyDown(with: event) }
    }
}

// MARK: - Menüleisten-Bus
//
// Sammelt alle Menü-Notifications in einem ViewModifier — der SwiftUI-
// Type-Checker schafft den langen Modifier-Chain in `content` sonst nicht
// in zumutbarer Zeit. Die Aktionen selber sind hier ganz schlicht: Routes
// setzen, Tweaks toggeln, gelegentlich was im Store anlegen.
private struct MenuBusModifier: ViewModifier {
    @Bindable var store: VerveStore
    @Bindable var router: VerveRouter
    @Bindable var tweaks: TweaksStore
    let showNotice: (String, String) -> Void

    func body(content: Content) -> some View {
        content
            .modifier(MenuBusFileEdit(store: store, router: router, showNotice: showNotice,
                                      openOrCreateChapter: openOrCreateChapter))
            .modifier(MenuBusViewTools(router: router, tweaks: tweaks,
                                       openLibrary: openLibrary,
                                       openDashboard: openDashboard,
                                       openChapterPlanning: openChapterPlanning,
                                       togglePref: togglePref))
    }

    private func openLibrary() {
        router.route = .library(.all)
    }

    private func openDashboard() {
        guard store.activeWork != nil else { return }
        router.route = .dashboard
    }

    private func openChapterPlanning() {
        router.route = .chapterPlanning
    }

    private func openOrCreateChapter() {
        if let chap = store.activeChapter,
           let book = store.books.first(where: { $0.id == chap.bookID })
        {
            let new = store.addChapter(workID: book.workID, bookID: book.id, title: "Neues Kapitel")
            store.activeChapterID = new.id
            router.route = .editor
            return
        }
        if let w = store.activeWork,
           let book = store.books.first(where: { $0.workID == w.id })
        {
            let new = store.addChapter(workID: w.id, bookID: book.id, title: "Kapitel 1")
            store.activeChapterID = new.id
            router.route = .editor
        }
    }

    private func openPlot() {
        router.route = .plot
    }

    private func togglePref(_ key: String) {
        let cur = UserDefaults.standard.bool(forKey: key)
        UserDefaults.standard.set(!cur, forKey: key)
        NotificationCenter.default.post(name: .verveEditorStyleMarksChanged, object: nil)
    }
}

// Sub-Modifier — der gemeinsame Receiver-Chain wäre zu groß für den
// SwiftUI-Type-Checker. Splitten in zwei kleinere Modifier hält die
// Compile-Zeit unter Kontrolle, ohne die Logik zu zersplittern.

private struct MenuBusFileEdit: ViewModifier {
    @Bindable var store: VerveStore
    @Bindable var router: VerveRouter
    let showNotice: (String, String) -> Void
    let openOrCreateChapter: () -> Void

    func body(content: Content) -> some View {
        content
            .onReceive(NotificationCenter.default.publisher(for: .verveMenuNewWork)) { _ in
                router.route = .library(.all)
            }
            .onReceive(NotificationCenter.default.publisher(for: .verveMenuNewBook)) { _ in
                guard let w = store.activeWork else { return }
                let book = store.addBook(workID: w.id, seriesID: nil, title: "Neues Buch")
                router.route = .book(book.id)
            }
            .onReceive(NotificationCenter.default.publisher(for: .verveMenuNewChapter)) { _ in
                openOrCreateChapter()
            }
            .onReceive(NotificationCenter.default.publisher(for: .verveMenuImportMarkdown)) { _ in
                guard let result = InboxMarkdownImporter.pickFolderAndImport(into: store) else { return }
                router.route = .inbox
                showNotice(result.title, result.message)
            }
            .onReceive(NotificationCenter.default.publisher(for: .verveMenuExportWork)) { _ in
                router.route = .export
            }
            .onReceive(NotificationCenter.default.publisher(for: .verveMenuOpenPlot)) { _ in
                router.route = .plot
            }
            .onReceive(NotificationCenter.default.publisher(for: .verveMenuOpenInbox)) { _ in
                router.route = .inbox
            }
            .onReceive(NotificationCenter.default.publisher(for: .verveMenuOpenChat)) { _ in
                router.route = .chat
            }
            .onReceive(NotificationCenter.default.publisher(for: .verveMenuOpenConsistency)) { _ in
                router.route = .consistency
            }
    }
}

private struct MenuBusViewTools: ViewModifier {
    @Bindable var router: VerveRouter
    @Bindable var tweaks: TweaksStore
    let openLibrary: () -> Void
    let openDashboard: () -> Void
    let openChapterPlanning: () -> Void
    let togglePref: (String) -> Void

    func body(content: Content) -> some View {
        content
            .onReceive(NotificationCenter.default.publisher(for: .verveMenuToggleSidebar)) { _ in
                tweaks.showSidebar.toggle()
            }
            .onReceive(NotificationCenter.default.publisher(for: .verveMenuToggleInspector)) { _ in
                tweaks.showInspector.toggle()
            }
            .onReceive(NotificationCenter.default.publisher(for: .verveMenuToggleFocus)) { _ in
                router.focusMode.toggle()
            }
            .onReceive(NotificationCenter.default.publisher(for: .verveMenuToggleMarks)) { _ in
                togglePref(EditorMarksApplier.preferenceKey)
            }
            .onReceive(NotificationCenter.default.publisher(for: .verveMenuToggleLinks)) { _ in
                togglePref(EditorEntityLinker.preferenceKey)
            }
            .onReceive(NotificationCenter.default.publisher(for: .verveMenuOpenLibrary)) { _ in
                openLibrary()
            }
            .onReceive(NotificationCenter.default.publisher(for: .verveMenuOpenDashboard)) { _ in
                openDashboard()
            }
            .onReceive(NotificationCenter.default.publisher(for: .verveMenuOpenChapterPlanning)) { _ in
                openChapterPlanning()
            }
    }
}
