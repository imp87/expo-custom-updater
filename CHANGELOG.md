# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2024-11-03

### 🚀 Added
- **TypeScript Support**: Complete TypeScript definitions with interfaces for all configuration options
- **Enhanced Error Handling**: Specific error handling for all Expo Updates error codes:
  - `ERR_UPDATES_DISABLED`
  - `ERR_UPDATES_CHECK`
  - `ERR_UPDATES_FETCH`
  - `ERR_UPDATES_RELOAD`
  - `ERR_NOT_AVAILABLE_IN_DEV_CLIENT`
- **Update Progress Hook**: New `useUpdateProgress()` hook for real-time update status tracking
- **Update Info Utilities**: New `getUpdateInfo` object with methods:
  - `getCurrentUpdateInfo()` - Get current update metadata
  - `getUpdateLogs(maxAge)` - Retrieve update logs
- **Concurrent Update Protection**: Prevents multiple simultaneous update operations
- **Rollback Support**: Proper handling of rollback directives from update server

### 🔧 Enhanced
- **Improved API**: Better parameter handling and validation in `doUpdateIfAvailable`
- **Better Logging**: More detailed and structured logging throughout the update process
- **Hook Compliance**: Fixed React Hook rules violations from previous version
- **Documentation**: Enhanced inline code documentation and examples

### 🐛 Fixed
- **Hook Usage**: Removed invalid Hook usage in static methods
- **Progress Tracking**: Fixed progress state management in development mode
- **Error Propagation**: Improved error handling and propagation options

### 📦 Infrastructure
- **Package Updates**: Updated peer dependencies for expo-updates ~0.29.0
- **Build Config**: Added proper TypeScript configuration
- **File Exports**: Properly configured package.json exports

### 💔 Breaking Changes
None - This version is fully backward compatible with v2.0.0

### 🎯 Migration Guide
No migration needed from v2.0.0. All existing APIs work unchanged.

New features can be adopted incrementally:
```javascript
// Old way (still works)
import { useCustomUpdater } from 'expo-custom-updater'

// New features
import { useUpdateProgress, getUpdateInfo } from 'expo-custom-updater'
```

---

## [2.0.0] - Previous Release

### Breaking Changes from v1.x
- Migrated from class-based to hook-based architecture
- Updated to use modern Expo Updates API
- Improved error handling and logging

---

**Note**: This fork is maintained by [Steven Dautrich](https://github.com/imp87) and continues the excellent work started by [Umberto Ghio](https://github.com/umbertoghio).

For the complete original changelog, see the [original repository](https://github.com/umbertoghio/expo-custom-updater).
