import { Instance, SnapshotOut, types } from 'mobx-state-tree';

export const logLevelArray = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'];

export const logMessagesCountModel = types.model('LogMessagesCount').props({
  _count: types.number,
  level: types.enumeration(logLevelArray),
});

export type logMessagesCountType = Instance<typeof logMessagesCountModel>;
export interface logMessagesCount extends logMessagesCountType {}
export type logMessagesCountSnapshotType = SnapshotOut<
  typeof logMessagesCountModel
>;
export interface logMessagesCountSnapshot
  extends logMessagesCountSnapshotType {}

export const ApplicationModel = types.model('Application').props({
  id: types.string,
  name: types.string,
  description: types.string,
  userId: types.number,
  logMessagesCount: types.array(logMessagesCountModel),
});

export type ApplicationType = Instance<typeof ApplicationModel>;
export interface Application extends ApplicationType {}
export type ApplicationSnapshotType = SnapshotOut<typeof ApplicationModel>;
export interface ApplicationSnapshot extends ApplicationSnapshotType {}
