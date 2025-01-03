# 🎮 SALife Changelog

All notable changes to the SALife project will be documented in this changelog.

For more information about server rules and features, visit our [Discord](https://discord.gg/salife).

## [Unreleased] - 2024-1-2 <--> 2025-1-3

### 🆕 New Features

- **modlights:** Enhanced emergency vehicle systems
  - Bone-based emergency light positioning system
  - Enhanced siren sound options with new audio banks
  - Static pattern support for qls16fpis vehicle

- **luckyplucker:** Added new crafting recipes
  - Flour production
  - Sunflower oil production
  - Fried chicken preparation
- **inventory:** Added new items
  - Pestle and mortar
  - Flour
  - Sunflower oil
  - Fried chicken
- **shop:** Added sales dialog option to pawn shop
- **crafting:** Improved blueprint description formatting

### 🔧 Bug Fixes

- **luckyplucker:** Adjusted shop location for better accessibility
- **shop:** Added small delay before opening shop inventories to prevent UI issues

### 🔄 Changes

- **modlights:** Improved emergency lighting systems
  - Optimized light rendering parameters and positioning
  - Streamlined siren audio file configuration
  - Improved light rendering performance with bone-based system
- **cleanup:** Removed unused emergency vehicle audio files

- **system:** Reorganized clothing resources into dedicated section in server config
- **core:** Improved interaction system initialization reliability
- **weapons:** Fixed weapon sling system attachment handling and state storage
- **items:** Enhanced cola effects and functionality to increase run energy and add a regeneration effect
- **core:** Migrated from ox_target to sleepless_interact
  - Updated police frisk/search interactions
  - Revised vehicle dealer and garage interactions
  - Restructured player and vehicle targeting system
- **utils:** Added new color utility exports
  - hexToRGB conversion
  - RGBToHex conversion
  - getColorDescription function
- **vehicle:** Added database lookup by vehicle hash
- **system:** Updated resource load order in server config

### 🔧 Bug Fixes

- **core:** Fixed lib initialization check in utils.lua
- **vehicle:** Removed redundant carjacking thread (moved to separate script)

## [0.2.2] - 2024-1-2

### 🔄 Changes

- **core:** Updated animation system for improved emote functionality and performance
- **core:** Migrated interaction systems across some resources
- **core:** Refined interaction point behaviors with new enter/exit/nearby options
- **core:** Improved persistence handling for interaction points
- **core:** Enhanced dialog system with better entity handling

### 🆕 New Features

- **weapons:** Improvements to sling
- **inventory:** Add several new persistent drop item models
- **train:** Added new train system with improved configurations and map visibility
- **hud:** Added percentage display support for status effects
- **crafting:** Implemented quality-based crafting system with metadata
- **vehicle:** Added vehicle flip functionality
- **npcs:** Enhanced NPC interaction system with improved dialog handling
- **ammunation:** Added new Ammunation shop using new shop system
- **inventory:** New item: ammobox (contains 50 rounds of whatever ammo)

### ⚡ Performance Improvements

- **modlights:** Improved emergency vehicle lighting system through optimized caching and batch updates
- **modlights:** Added vehicle detection and cleanup threads for better resource management
- **modlights:** Implemented efficient batch property updates for vehicle modifications
- **modlights:** Disabled overly restrictive state bag rate limiting
- **core:** Optimized resource dependencies
- **core:** Updated build configuration for web resources
- **core:** Improved state management for interactions
- **crafting:** Enhanced blueprint and metadata handling for crafting system

### 📜 Script Updates

- **modlights:** Added support for new light pattern "test" for qls10cvpi vehicle
- **modlights:** Adjusted default light pattern tick rate from 400ms to 100ms
- **crafting:** Updated recipes and quality calculations

## [0.2.1] - 2024-12-29

### 🆕 New Features

- **modlights:** Add pattern selection menu default: J

- **robbery:** Store clerk robberies system (approach with a gun)

- **weapons:** Weapon sling system
@image(ft/sling.png)

- **garage:** Added a system to handle default vehicle positions for persistent vehicles

- **garage:** Added a button for cops to reset persistent vehicles with default positions if not busy

### 📜 Script Updates

- **modlights:** Add a sound effect to toggling emergency lights

- **inventory:** Remove default trunk interaction

## [0.2.0] - 2024-12-28

### 🆕 New Features

- **lspd:** Separate sections for equipment and firearms in armory
- **luckyplucker:** New shared stash location added
- **shop:** Added job rank requirements for certain items
- **inventory:** Improved system stability and security
- **weapons:** Fixed issues with serial numbers and metadata

### 🗺️ Location Updates

- **luckyplucker:** New stash location at coordinates (142, -1475, 29)

### 🔧 Bug Fixes

- **lspd:** Fix armory shops

- **inventory:** Fix bug with medkit not reviving as expected

- **inventory:** Fix bug with group permissioned stashes not opening properly

- **survival:** Fix bug with dead players standing up when dead and other issues related to death

- **modlights:** Fix bugs related to emergency lighting

### 🆕 New Features

- **lspd:** Armory shops now use new shop system

- **luckyplucker:** Added a job/group shared stash

- **gta:** Update to latest version of GTA V (Agents of Sabotage)

- **garage:** 3 new police vehicles

- **farming:** Return of farming system
@image(ft/crops.png)

- **farming:** Public farming area in legion square

- **farming:** All crop types can be planted in the public area

- **npcs:** Add new npc to farm area to sell seeds

- **farming:** Seed shop dynamic restocking/pricing system

- **luckyplucker:** Add chicken NPC to gather chicken carcasses
@image(ft/chicken.png)

- **survival:** New death animations

### 📜 Script Updates

- **weapons:** Pepper spray is removed when emptied

- **skills:** Add farming and Lucky Plucker skills to skills system

- **crafting:** Implement new crafting recipes for chicken-based items

- **inventory:** Add various crop items and farming-related inventory items

- **npcs:** Update NPC interactions for Lucky Plucker desk

- **shop:** Adjust shop and inventory systems for new features

- **system:** Optimize dialog systems and interaction distances

- **skills:** Update skill XP and level calculation functions

## [0.1.17] - 2024-12-08

### 🆕 New Features

- **mission:** Basic gang initiation missions for Lost MC, Vagos, and Ballas including starter vehicles

- **mission:** Joining the lost now awards a starter motorbike

- **mission:** Added Mission Content for LSPD Human Resources Contact

- **job:** Added Points Metric System and expenditure shop for police

- **job:** Added promotional paths for LSPD

- **garage:** interaction with dealership purchases switched to 3d interaction
@image(ft/pd5ox1vp.bmp)

- **discord:** rich presence updates
@image(ft/zcrv30tz.bmp)

- **names:** add disconnect icon for voice chat being off or broken
@image(ft/s3b6uti5.bmp)

- **names:** add nice voice icon when speaking
@image(ft/lzlw85ox.bmp)

- **names:** add nice icon for radio usage
@image(ft/m65tlntf.bmp)

- **names:** improvements to names system including status effect overhead support
@image(ft/h3mfya91.bmp)

- **names:** scale voice indicator with proximity distance
@image(ft/38vth237.bmp)

### 📜 Script Updates

- **names:** stranger/masked info improvements
@image(ft/7kqph2qg.bmp)

- **cmds:** fix veh command not placing inside of vehicle (dev only)

### 🔧 Bug Fixes

- **mission:** fix(mission): lspd hr dialog logic preventing exam checks

- **salrp:** better mask check function

## [0.1.16] - 2024-12-01

### 🆕 New Features

- **npcs:** Add dialog branch to rob store clerks with many choices to make to determine investigatory outcome

- **npcs:** Store clerk advanced robberies with AI and police statement generation

- **npcs:** Add additional informational gathering to store clerk robberies

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
