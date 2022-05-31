import { Instance, SnapshotOut, types } from 'mobx-state-tree';

export const logLevelArray = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'];
export const logLevelArrayAsConst = [
  'DEBUG',
  'INFO',
  'WARN',
  'ERROR',
  'FATAL',
] as const;

export type LogLevel = typeof logLevelArrayAsConst[number];

export const LogMessageModel = types.model('Application').props({
  id: types.string,
  level: types.enumeration(logLevelArray),
  date: types.string,
  message: types.string,
  applicationId: types.string,
});

export type LogMessageType = Instance<typeof LogMessageModel>;
export interface LogMessage extends LogMessageType {}
export type LogMessageSnapshotType = SnapshotOut<typeof LogMessageModel>;
export interface LogMessageSnapshot extends LogMessageSnapshotType {}
