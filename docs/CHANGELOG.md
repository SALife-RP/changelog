# 🎮 SALife Changelog

All notable changes to the SALife project will be documented in this changelog.

For more information about server rules and features, visit our [Discord](https://discord.gg/salife).

## [Unreleased] - 2025-1-15

### 🆕 New Features

- **streetsales**: Added random dispatch calls for suspicious activity (30% chance)
  - Enhanced realism with dynamic police notifications

## [0.3.0] - 2025-1-15

### 🆕 New Features

- **bank**: Added new dialog options including dialog option to deposit money
- **house**: Updated robbery loot tables with new items
- **police**: Enhanced MDT with new charges system
- **inventory**: Added new item "C4 Briefcase"
- **streetsales**: Implemented street sales system with NPC interactions
- **pickpocket**: Added interaction option for offering products
- **voice**: Enhanced radio functionality with improved audio effects
- **jobs**: Added Los Santos Fire Department (LSFR)
  - Multiple firefighter ranks with salary tiers
  - Custom LSFR nameplates in HUD
  - Firefighter promotion system
- **police**: Enhanced officer promotion system
  - New cadet promotion management
  - Improved promotion dialog options
- **jobs/lsfr**: Enhanced fire management system
  - Added dumpster fire generation system
  - Implemented fire location blips
  - Added LSFR-specific notifications
  - Implemented detailed rank progression
  - Added promotion dialog options
  - Improved rank-based permissions
  - Enhanced salary scaling with ranks
- **anim**: Improved sitting and laying animations
  - Updated registration process
  - Enhanced player positioning
- **inventory**: Added "FAPS" (Fire Advancement Points)
  - New performance-based currency for firefighters
  - Reward system for fire extinguishment

### 🚗 Vehicle Changes

- Enhanced horn command system with model-specific configurations
- Refined speed setting logic for better maintainability
- Improved vehicle drafting mechanics
- Updated Miami-style license plate format
- Implemented dynamic modification pricing system based on vehicle class

### 👮 Police Features

- Added bank investigation system for law enforcement
  - New dialog options for investigating bank-related crimes

### 🔧 Bug Fixes

- **client**: Added delay for DUI loading on player spawn
- **database**: Updated vehicle insertion logic
- **pickpocketing**: Fixed issue with pickpocketing on server start
- **garage**: Fixed custom plates issue
- **vehicles**: Fixed car class and max speed settings
- **housing**: Fixed player movement when entering properties
- Resolve issue with crafting blueprint data
- **configs**:
  - Updated MySQL connection string for remote database
  - Adjusted default audio volume settings for radio and calls

### 🔄 Changes

- **core**: Implemented standardized notification system
  - Enhanced group join/leave notifications
  - Improved notification styling
- **weapons**: Updated weapon presets and configurations
- **core**: Updated fire management data structures
- **jobs**: Enhanced firefighter gameplay dynamics
- **connect**: Enhanced player spawn and loading mechanics
  - Improved spawn handling
  - Optimized property interactions
- **hud**: Streamlined HUD functionality
  - Improved minimap handling
  - Enhanced overall performance
- **siren**: Enhanced state handling and notification system
- **npcs**:
  - Removed unused NPC scripts
  - Optimized client-side interactions
  - Updated evidence NPC with rank structure
  - Added unique NPC greetings

### 🧹 Cleanup

- Removed legacy drug management scripts
- Improved code formatting and readability in connect.lua

## [0.2.5] - 2025-1-6

### 🏠 House Robbery Update

- Break into houses across the city with unique interiors
- Find and use house keys with different rarity tiers (from common to mythic) while pickpocketing
- Team up with other players to rob houses together
- Use your phone to disable house alarms
- Houses remain in a robbed state for a limited time
- Police will be notified of break-ins
- Use the house keys in your inventory to find potential target houses

### 💊 New Items

- Added new drug items:
  - Marijuana (weed)
  - Xanax
  - Oxycodone
  - Fentanyl

### 👮 Police Updates

- Improved arrest menu and functionality
- Enhanced police grab mechanics
- Better dispatch notification formatting
- Dropped money now appears as money bags

### 🔧 Bug Fixes

- Fixed various issues with pickpocketing
- Improved police grab reliability
- Enhanced dispatch system formatting

## [0.2.4] - 2025-1-5

### 🆕 New Features

- **police**: New police vehicle(s)
- **modlights**: Improved greatly environmental lighting
- **pickpocketing**: Improve system and implement level scaling
- **inventory**: Car keys from pickpocketing now fully implemented with police and MDT integration

## Bug Fixes

- **police**: Resolve some issues with MDT

## [0.2.3] - 2025-1-3

### 🆕 New Features

- **Emergency Vehicles**: Enhanced lighting system with new siren options
- **Lucky Plucker**: New crafting system
  - Make flour
  - Produce sunflower oil
  - Cook fried chicken
- **Shops**: Added sales dialog to pawn shop
- **Items**: Added new craftable items
  - Pestle and mortar
  - Flour
  - Sunflower oil
  - Fried chicken

### 🔄 Changes

- Cola now increases run energy and adds regeneration effect
- Updated police frisk/search system
- Improved vehicle dealer and garage interactions

## [0.2.2] - 2024-1-2

### 🆕 New Features

- Improved weapon sling system
- New persistent item drop system
- New train system with map visibility
- Added percentage display for status effects
- Quality-based crafting system
- Vehicle flip feature
- Enhanced NPC conversations
- New Ammunation shops
- New item: Ammobox (50 rounds)

## [0.2.1] - 2024-12-29

### 🆕 New Features

- Emergency light pattern selection (Press J)
- Store clerk robbery system
- Weapon sling system
@image(ft/sling.png)

## [0.2.0] - 2024-12-28

### 🆕 New Features

- LSPD armory reorganized with separate sections
- New shared stash at Lucky Plucker
- New farming system with:
  - Public farming area in legion square
  - All crop types available
  - Seed shop with dynamic prices
  - New chicken gathering at Lucky Plucker
@image(ft/crops.png)
@image(ft/chicken.png)

### 🔧 Bug Fixes

- Fixed medkit revive issues
- Fixed death animation issues
