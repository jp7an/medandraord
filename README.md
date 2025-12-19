# Med Andra Ord

Ett klassiskt ordspel i React Native + Expo för Android. Spela offline med vänner i lag - förklara ord med andra ord!

## 🎮 Spelspecifikation

### Översikt
Med Andra Ord är ett festspel där lag tävlar om att förklara ord. En spelare i laget läser ordet på skärmen och förklarar det med andra ord, medan resten av laget gissar.

### Spelflöde
1. **Spelare**: Lägg till minst 2 spelare
2. **Lag**: Automatisk uppdelning i 2-personers lag (ett lag får 3 om udda antal). Manuell redigering möjlig.
3. **Inställningar**: Välj spelläge, tur-tid, målpoäng och maxantal pass
4. **Tur**: Starta med nedräkning (3-2-1), sedan visas ord med timer
5. **Granskning**: Korrigera status på alla visade ord
6. **Poängtavla**: Se ställningen och starta nästa tur
7. **Vinst**: När målpoängen nås och rotationen är klar

### Spellägen

#### Läge A - Begränsade Pass
- Max antal pass per tur (standard 3)
- **Rätt** = +1 poäng
- **Pass** = 0 poäng (förbrukar pass)
- **Regelbrott** = 0 poäng

#### Läge B - Oändliga Pass med Minuspoäng
- Obegränsat antal pass
- **Rätt** = +1 poäng
- **Pass** = -0.5 poäng
- **Regelbrott** = -1 poäng
- Negativa totalpoäng tillåtna

### Tur-regler
- Standard tur-tid: 45 sekunder (inställningsbart: 30/45/60/90s)
- Varning vid 10 sekunder kvar
- När tiden är slut avslutas turen direkt
- Under tur visas antal "Rätt" hittills
- Varje tryck på knapp (RÄTT/PASS/REGELBROTT) visar nästa ord direkt

### Granskning (Viktigt!)
Efter varje tur kan du:
- Se ALL historik av ord som visades
- Ändra status på vilket ord som helst
- Korrigera feltryck
- Lägga till missade rätt svar (ändra Ogiltig → Rätt)
- Poängen räknas om automatiskt

### Ordtyper & Färger
- 🔵 **Substantiv** (blå)
- 🟠 **Adjektiv** (orange)
- 🔴 **Verb** (röd)
- 🌸 **Personer** (rosa)
- 🟡 **Platser** (gul)

### Vinstlogik
- Målpoäng: standard 30 (inställningsbart: 20/30/40/50)
- Rotationer: alla lag får lika många turer
- Om lag når målpoäng mitt i rotation: rotationen spelas klart
- **Ingen oavgjord slutställning**: Om flera lag delar ledningen fortsätter spelet med tiebreaker-turer endast för topplagen

### Ord-hantering
- Inga repetitioner per match: visade ord markeras som "used"
- Om alla ord är använda tillåts repetition som fallback
- Ordlista innehåller 50 placeholder-ord (v1)

## 🚀 Kom igång

### Krav
- Node.js 18+ och npm
- Android Studio (för Android emulator) eller en fysisk Android-enhet
- Expo Go-appen (för test på fysisk enhet)

### Installation

```bash
# Klona repot
git clone https://github.com/jp7an/medandraord.git
cd medandraord

# Installera dependencies
npm install

# Starta Expo
npm start
```

### Kör på Android

**Alternativ 1: Android Emulator**
```bash
npm run android
```

**Alternativ 2: Fysisk enhet**
1. Installera Expo Go från Google Play Store
2. Kör `npm start`
3. Scanna QR-koden med Expo Go

### TypeScript Check
```bash
npm run typecheck
```

## 🏗️ Projektstruktur

```
src/
├── screens/          # Alla spelskärmar
│   ├── StartScreen.tsx
│   ├── PlayersScreen.tsx
│   ├── TeamsScreen.tsx
│   ├── SettingsScreen.tsx
│   ├── TurnScreen.tsx
│   ├── ReviewScreen.tsx
│   ├── ScoreScreen.tsx
│   ├── VictoryScreen.tsx
│   └── HistoryScreen.tsx
├── state/            # State management
│   ├── types.ts
│   ├── gameReducer.ts
│   └── GameContext.tsx
├── components/       # Återanvändbara komponenter
│   ├── BigButton.tsx
│   ├── Timer.tsx
│   └── WordCard.tsx
├── data/             # Ord-databas och data-hantering
│   ├── words.ts
│   └── database.ts   # expo-sqlite wrapper
└── theme/            # UI-tema och färger
    └── theme.ts
```

## 🎨 UI/UX Design

### Mörkt Tema
- Bakgrund: #121212
- Ytor: #1e1e1e
- Hög kontrast för festmiljö

### Stora Knappar (Touch-vänligt)
- **RÄTT-knapp**: Grön (#4caf50) med svart text
- **PASS-knapp**: Svart (#000000) med vit text
- **REGELBROTT-knapp**: Neutral grå (#9e9e9e) med svart text

### Ordtyp-färger
Varje ord har en färgkodad bakgrund baserat på ordtyp för visuell vägledning.

## 🔧 Teknisk Stack

- **Framework**: Expo 52 (managed workflow)
- **Language**: TypeScript (strict mode)
- **UI**: React Native
- **Navigation**: React Navigation (native stack)
- **State Management**: React Context + useReducer
- **Database**: expo-sqlite (förberedd för 30k ord)
- **Platform**: Android-only

## 📝 Known Limitations (v1)

### Inte implementerat än:
- [ ] Riktiga ljudfiler för timer-varningar (använder console.log)
- [ ] Fullständig ord-databas med 30,000 ord (50 placeholder-ord finns)
- [ ] Tiebreaker-logik som endast inkluderar topplagen (fortsätter med alla lag)
- [ ] Custom ikoner och splash screen
- [ ] Mer avancerad statistik och grafer
- [ ] Export/import av matchhistorik
- [ ] Inställningar för volym och ljud

### Förbättringar för framtiden:
- Animationer vid turväxling och poänguppdatering
- Bättre team-namn redigering
- Möjlighet att pausa match
- Mer detaljerad matchhistorik (ord-för-ord statistik)
- Achievements och milstolpar

## 🧪 Testing

Appen har testats manuellt genom komplett spelflöde:
- ✅ Start → Spelare → Lag → Inställningar
- ✅ Tur med timer och nedräkning
- ✅ Granskning med status-ändring
- ✅ Poängtavla och rotation-hantering
- ✅ Vinst-logik med målpoäng
- ✅ Historik-sparande

## 🤝 Bidra

Bidrag är välkomna! Skapa en issue eller pull request.

## 📄 Licens

MIT License - se LICENSE för detaljer

## 🎯 Roadmap

### v1.1
- Riktiga ljudeffekter
- Seed initial word database med fler ord
- Förbättrad tiebreaker-logik

### v1.2
- Detaljerad statistik per spelare
- Anpassningsbara ordkategorier
- Svårighetsgrader på ord

### v2.0
- Multiplayer över nätverk
- Custom ordlistor
- Replay-funktion

---

Gjord med ❤️ för festliga stunder!