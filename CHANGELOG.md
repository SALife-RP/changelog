# 🎮 SALife Changelog

All notable changes to the SALife project will be documented here.

## [0.1.6] - 2024-11-19

### 🆕 New Features

- **names:** Add network entity existence check

### 📜 Script Updates

- **core:** Add skills system to server configuration
- **core:** Add skills system to server configuration

### 🗺️ Map Changes

- **cayoperico:** Cayo perico island will now be available on startup
- **cayoperico:** Add cayo perico seemless loading system

## [0.1.5] - 2024-11-17

### 🆕 New Features

- **mission:** New on start func for mission steps

### 📜 Missions

- **smuggling:** Implement vehicle-based smuggling missions

### 🔖 Changelog

- Add items and mission commit types

## [0.1.3] - 2024-11-17

### 🔖 Changelog

- Testing

## [0.1.0] - 2024-11-17

### ⚡ Performance

- :wastebasket: remove duplicate code as this occurs on connect now I believe

### 🆕 New Features

- Add git command tool for changelog generation
- Major updates to missions, NPCs, and vehicle handling
- **velo_customs:** UI improvements and admin menu
- Update vehicle customs and inventory systems
- **items:** Add fallback model for items without modelname
- **items:** Improve weapon model handling for persistent drops
- **items:** Add persistent drops system with instance support
- **items:** New items resource WIP, will handle item usages
- **banking:** Add GetAccounts export function
- Implement votekick command functionality
- **jobs:** Improve job management system and utilities
- **mdt:** Add multi-framework support for ESX, QBCore, QBOX and SALife
- **utils:** Add type-safe statebag utilities and improve nationality selection
- **garage:** Update vehicle spots based dealership
- **banking:** Add money loss sound effects and cleanup code
- Update HUD visibility in ps-housing
- Multiple system updates and improvements
- Support nationality identity field
- Support nationality during registration
- :sparkles: add invoking resource
- :wrench: implement debugging stuff
- :safety_vest: add some core debugging feat
- **mission:** CreateProp for mission objective usage
- Send client script errors to Discord webhook
- Add error handling for client script errors
- Add check for player being a cop before allowing interaction with gun
- Add ability to return leases using third-eye while inside the dealer zone if the dealer zone models list matches the vehicle model and the vehicle is a rental

### 💼 Job Updates

- Job guy dialog
- Job shit
- Job clock status spam prevent

### 📚 Documentation

- Docs
- Documentation
- Docs

### 📜 Missions

- Mission content and config
- Mission fixes and junk
- Mission/npc updates
- Mission objective tracker blip fix, support for on-screen waypoint display
- Mission tracker updates, blips improvements, mission settings
- Mission settings, tracking/active mission, radial menu for missions, ability to set missions as tracked

### 🔧 Bug Fixes

- **modlights:** Resolve issue with props resetting themselves
- Fix lods in legion
- **items:** Clean up inventory after picking up persistent drops
- **items:** Add player check before model assignment
- Dashcam export after working with pp people
- **realtor:** Update user identity lookup in tenant name retrieval
- Improve ps-housing integration and character selection
- :bug: additional shop breaker
- :bug: typo broke shgps
- :bug: pp-mdt update
- :safety_vest: remove old leaderboard code causing every user to load seperately as a query on server launch for no reason
- :bug: Update for new MDT fixing stuff
- :bug: fix bug with r_grab resource/update r_grab
- Fix props for temp vehicles
- Fix fires init bug
- Fix car spawn colors
- Fix floor access for elevators
- Fix bugs and new spot for character selection
- Fix typo with function call
- Fix spam involving player who hasnt selected a character yet getting selected as an entity owner
- Fix some annoying dead scripts
- Fixes
- Fix for generating voices without audio designation
- Fix remote db connection
- Fix issues with action mode, very usable now on multiple resolutions
- Fixed broken textures on pd cars
- Fix
- Fix nil checks on mission settings
- Fix jobcenters, add jobcenter, event for onOpen
- Fix some issues with mission checks
- Fix server runtime for mission objectives
- Fix phone usage
- Fix some admin bullshit
- Fix icon for mailbox notification
- Fix ped/vehicle spawns so they are more natural, add lspd archetype, basic lspd functionality, change door locks to only lock out players, improve driving abilities, new ped task scheduling, several new tasks, lspd tasks basic, lspd respsonse to dispatches, fix racer blips, new deletion logic, ped survival stats, peds will seek food at food locations, added vending machines across the state to food locations, basic RMC controls (ask me), vehicle garage points for certain tasks
- Fix mark for impound
- Fix issue with realism ped spawns / peds that need vehicles
- Fix bug with rth causing rth loop to not close if not in a car after leaving a car
- Fix for "mark for impound"
- Fix desync with passengers over 145 (needs testing)
- Fix issue with monitor from operating
- Fix undefined container for ox_inventory
- Fix paycheck processing animation
- Fix paycheck detachment after processing
- Fix apartment spawn walking around and exiting shit
- Fix possible break case in items collection
- Fix formatting issue with paycheck, do not send out $0 paychecks
- Fix light issues in jamestown
- Fix issue where cashex paycheck processing wouldn't drop the prop
- Fix random connection bug that popped up
- Fix courthouse lod lights
- Fix spawns

### 🗺️ Map Changes

- Map fixes
- Map confg
- Map
- Map bs
- Maps n shit

### 🚗 Vehicle Changes

- Vehicle suppression system and blimp added, fire persistence loading disabled for now
- Vehicle assets
- Vehicle car class display on hud
- Vehicle cfg

### 🛡️ Security Updates

- Security car base colors
- Security meta

---
💡 For more information about server rules and features, visit our [Discord](https://discord.gg/salife).
