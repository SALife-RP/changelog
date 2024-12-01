# 🎮 SALife Changelog

All notable changes to the SALife project will be documented in this changelog.

For more information about server rules and features, visit our [Discord](https://discord.gg/salife).

## [Unreleased] - 2024-12-01

### 🆕 New Features

- **npcs:** Add dialog branch to rob store clerks with many choices to make to determine investigatory outcome

## [0.1.15] - 2024-12-01

### 🆕 New Features

- **inventory:** New item: radio (requirement for radio radial, given to characters on creation)

- **items:** Persistent drops now create an interaction point to pick-up easier
@image(ft/c80svorx.bmp)

- **r_grab:** Update version with some improvements to collision/range
@image(ft/0jcc3zgc.bmp)

### 🔧 Bug Fixes

- **hud:** Default hud state to true for hud toggling purposes

## [0.1.14] - 2024-11-30

### 🆕 New Features

- **fivem-appearance:** Make the categories make more sense
@image(ft/64fgbt8h.bmp)

## [0.1.13] - 2024-11-30

### 🆕 New Features

- **npcs:** Add npc blip toggle to settings menu
@image(ft/8qdjhw9i.bmp)

### 🔧 Bug Fixes

- **names:** Health display now accurate represents health

## [0.1.12] - 2024-11-30

### 🆕 New Features

- **connect:** Add mugshot for regular non-early alt characters

### ⚖️ Balance Changes

- **pickpocket:** Reduce chance to pickpocket nothing

- **pickpocket:** Buff rewards for pickpocket further

- **pickpocket:** Increase pouch gains

## [0.1.11] - 2024-11-28

### 🆕 New Features

- **npcs:** Add npc blip toggle to settings menu

- **connect:** Add mugshot for regular non-early alt characters

- Web access to more item info

- **mdt:** New method to take screenshots for mugshots

- New method to grab screens of vehicles

- **connect:** Add screenshot posting to community discord

- **web:** Add inventory compat to web

- **connect:** Discord requirement to create account/login

- Add vehicle limit data for access to the playsalife.com website

- Early character creation system to allow players to create characters ahead of launch

- **config:** Add indestructable_props resource

- **names:** When masked, name is "Stranger"

- **types:** Add vehicle and dealer spot type definitions

- **types:** Add metadata annotation to garages.lua

- **banking2:** Add offline cash balance adjustment function

- **changelog:** Update changelog configuration and content

### 📚 Documentation

- **cursorrules:** Update data storage recommendations

### 📜 Script Updates

- **vimage:** Update vehicle image creator for use with the new website

- **modlights:** Fix bug with keybinds when not in vehicle

- **modlights:** Refactor siren system and optimize performance

- **cmds:** Remove debugging

- **realism:** Fix bug

- **realism:** Fix a typo causing script not to load

- **salrp:** Add export definition

- **oxinv:** Documentation for export functions added

- **names:** Add settings for names systems to radial

- **hud:** Refactor HUD visibility and status management

### 🔧 Bug Fixes

- **connect:** Webhook sending to community discord removal for now

- **connect:** Search for appropriate discord roles from community discord for connection

- **connect:** Add discord check to existing account also

- Discord links

- **survival:** Fix bug causing death on spawn-in

- **prison:** CaseId spam fix

- **build:** Fix build script completely

### 🚗 Vehicle Changes

- **garage:** System updates, optimization especially related to vehicle mods

- Ensure engine smoothly remains on when vehicle is abandoned

---

### 📝 Commit Types

- 🆕 `feat`: New features
- 🔧 `fix`: Bug fixes
- ⚖️ `balance`: Game balance changes
- 🗺️ `map`: Map/location changes
- 💼 `job`: Job system updates
- 🚗 `vehicle`: Vehicle changes
- 💰 `economy`: Economy adjustments
- 📜 `script`: Script updates
- 👮 `admin`: Admin tools
- 🛡️ `security`: Security updates
- ⚡ `perf`: Performance improvements
- 📚 `doc`: Documentation
- 🔖 `changelog`: Changelog updates
- 🎒 `items`: Items updates
- 📜 `mission`: Missions updates

💡 For more information, visit our [Discord](https://discord.gg/salife)
