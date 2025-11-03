import { useRef, useEffect } from 'react'
import { AppState } from 'react-native'
import * as Updates from 'expo-updates'

const updater = {
  logs: [],
  lastTimeCheck: 0,
  showDebugInConsole: false,
  default_min_refresh_interval: 300,
  isUpdateInProgress: false
}

const log = (message) => {
  updater.logs.push(message)
  updater.showDebugInConsole && console.log(message)
}

const getUnixEpoch = () => Math.floor(Date.now() / 1000)

export const getUpdateLogs = () => updater.logs

export const doUpdateIfAvailable = async ({
  beforeDownloadCallback,
  throwUpdateErrors,
  force,
  onProgress
} = {}) => {
  updater.lastTimeCheck = getUnixEpoch()

  if (__DEV__) {
    log('doUpdateIfAvailable: Unable to update or check for updates in DEV')
    return false
  }

  if (updater.isUpdateInProgress) {
    log('doUpdateIfAvailable: Update already in progress, skipping')
    return false
  }

  updater.isUpdateInProgress = true

  try {
    log('doUpdateIfAvailable: Checking for updates...')
    const checkResult = await Updates.checkForUpdateAsync()

    log(`doUpdateIfAvailable: Update available? ${checkResult.isAvailable}`)

    // Handle rollback case
    if (checkResult.isRollBackToEmbedded) {
      log('doUpdateIfAvailable: Rollback to embedded update detected')
      await Updates.reloadAsync()
      return true
    }

    if (!checkResult.isAvailable && !force) {
      log(`doUpdateIfAvailable: No update available. Reason: ${checkResult.reason || 'Unknown'}`)
      return false
    }

    log('doUpdateIfAvailable: Fetching Update')
    beforeDownloadCallback && beforeDownloadCallback()

    const fetchResult = await Updates.fetchUpdateAsync()

    if (!fetchResult.isNew && !force) {
      log('doUpdateIfAvailable: Fetched update is not new')
      return false
    }

    log('doUpdateIfAvailable: Update fetched, reloading...')
    await Updates.reloadAsync()
    return true
  } catch (e) {
    log(`doUpdateIfAvailable: ERROR: ${e.message}`)

    // More specific error handling based on Expo Updates error codes
    switch (e.code) {
      case 'ERR_UPDATES_DISABLED':
        log('doUpdateIfAvailable: Updates are disabled in this build')
        break
      case 'ERR_UPDATES_CHECK':
        log('doUpdateIfAvailable: Error checking for updates - network or server issue')
        break
      case 'ERR_UPDATES_FETCH':
        log('doUpdateIfAvailable: Error fetching update - download failed')
        break
      case 'ERR_UPDATES_RELOAD':
        log('doUpdateIfAvailable: Error reloading app after update')
        break
      case 'ERR_NOT_AVAILABLE_IN_DEV_CLIENT':
        log('doUpdateIfAvailable: Updates not available in development client')
        break
      default:
        log(`doUpdateIfAvailable: Unexpected error: ${e.code || 'UNKNOWN_ERROR'}`)
    }

    if (throwUpdateErrors) throw e
    return false
  } finally {
    updater.isUpdateInProgress = false
  }
}

// Hook für Update-Progress (ersetzt die problematische Klasse)
export const useUpdateProgress = () => {
  if (__DEV__) {
    return {
      downloadProgress: null,
      isDownloading: false,
      isChecking: false,
      isUpdateAvailable: false,
      isUpdatePending: false
    }
  }

  return Updates.useUpdates()
}

// Update Info Utilities
export const getUpdateInfo = {
  async getCurrentUpdateInfo() {
    if (__DEV__) {
      log('getUpdateInfo: Unable to get update info in DEV')
      return null
    }

    return {
      updateId: Updates.updateId,
      createdAt: Updates.createdAt,
      manifest: Updates.manifest,
      isEmbeddedLaunch: Updates.isEmbeddedLaunch,
      channel: Updates.channel,
      runtimeVersion: Updates.runtimeVersion
    }
  },

  async getUpdateLogs(maxAge = 3600000) {
    if (__DEV__) {
      log('getUpdateInfo: Unable to get update logs in DEV')
      return []
    }

    try {
      return await Updates.readLogEntriesAsync(maxAge)
    } catch (error) {
      log(`getUpdateInfo: Error reading logs: ${error.message}`)
      return []
    }
  }
}

export const useCustomUpdater = ({
  updateOnStartup = true,
  minRefreshSeconds = updater.default_min_refresh_interval,
  showDebugInConsole = false,
  beforeCheckCallback = null,
  beforeDownloadCallback = null,
  afterCheckCallback = null,
  throwUpdateErrors = false
} = {}) => {
  const appState = useRef(AppState.currentState)

  updater.showDebugInConsole = showDebugInConsole

  useEffect(() => {
    // Check for updates on app startup, app will be restarted in case of success
    updateOnStartup && doUpdateIfAvailable({ beforeDownloadCallback, throwUpdateErrors })

    const subscription = AppState.addEventListener('change', _handleAppStateChange)
    return () => {
      subscription.remove()
    }
  }, [])

  const _handleAppStateChange = async (nextAppState) => {
    const isBackToApp = appState.current.match(/inactive|background/) && nextAppState === 'active'
    const isTimeToCheck = (getUnixEpoch() - updater.lastTimeCheck) > minRefreshSeconds

    appState.current = nextAppState
    log(`appStateChangeHandler: AppState: ${appState.current}, NeedToCheckForUpdate? ${isBackToApp && isTimeToCheck}`)

    if (!isTimeToCheck || !isBackToApp) {
      isBackToApp && !isTimeToCheck && log('appStateChangeHandler: Skip check, within refresh time')
      return false
    }

    beforeCheckCallback && beforeCheckCallback()
    await doUpdateIfAvailable({ beforeDownloadCallback, throwUpdateErrors })
    afterCheckCallback && afterCheckCallback()
  }
}
