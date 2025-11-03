export interface UpdateConfig {
  beforeDownloadCallback?: () => void;
  throwUpdateErrors?: boolean;
  force?: boolean;
  onProgress?: (progress: number) => void;
}

export interface CustomUpdaterConfig {
  updateOnStartup?: boolean;
  minRefreshSeconds?: number;
  showDebugInConsole?: boolean;
  beforeCheckCallback?: () => void;
  beforeDownloadCallback?: () => void;
  afterCheckCallback?: () => void;
  throwUpdateErrors?: boolean;
}

export interface UpdateInfo {
  updateId: string | null;
  createdAt: Date | null;
  manifest: any;
  isEmbeddedLaunch: boolean;
  channel: string | null;
  runtimeVersion: string | null;
}

export interface UseUpdateProgressReturn {
  downloadProgress: number | null;
  isDownloading: boolean;
  isChecking: boolean;
  isUpdateAvailable: boolean;
  isUpdatePending: boolean;
}

export interface UpdatesLogEntry {
  timestamp: number;
  message: string;
  code: string;
  level: string;
  updateId?: string;
  assetId?: string;
  stacktrace?: string[];
}

// Main functions
export function getUpdateLogs(): string[];
export function doUpdateIfAvailable(config?: UpdateConfig): Promise<boolean>;
export function useUpdateProgress(): UseUpdateProgressReturn;
export function useCustomUpdater(config?: CustomUpdaterConfig): void;

// Update info utilities
export const getUpdateInfo: {
  getCurrentUpdateInfo(): Promise<UpdateInfo | null>;
  getUpdateLogs(maxAge?: number): Promise<UpdatesLogEntry[]>;
};
