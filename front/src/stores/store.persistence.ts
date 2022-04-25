import { onSnapshot } from 'mobx-state-tree';
import { RootStoreModel, RootStore } from './root.store';
import { Environment } from './environment';
import * as storage from '../utils/storage/storage';
import { createStore } from './index';

/**
 * The key we'll be saving our state as within async storage.
 */
const ROOT_STATE_STORAGE_KEY = 'root';

/**
 * Setup the environment that all the models will be sharing.
 *
 * The environment includes other functions that will be picked from some
 * of the models that get created later. This is how we loosly couple things
 * like events between models.
 */
export function createEnvironment() {
  const env = new Environment();
  env.setup();
  return env;
}

/**
 * Setup the root state.
 */
export function setupRootStore() {
  let rootStore: RootStoreModel;
  let data: any;

  // prepare the environment that will be associated with the RootStore.
  const env = createEnvironment();
  try {
    // load data from storage
    data = storage.load(ROOT_STATE_STORAGE_KEY) || {};
    rootStore = RootStore.create(data, env);
  } catch (e: any) {
    // if there's any problems loading, then let's at least fallback to an empty state
    // instead of crashing.
    rootStore = createStore();

    // but please inform us what happened
    console.error(e.message, null);
  }

  // track changes & save to storage
  onSnapshot(rootStore, (snapshot) =>
    storage.save(ROOT_STATE_STORAGE_KEY, snapshot),
  );

  return rootStore;
}
