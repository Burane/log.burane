import { types, Instance } from "mobx-state-tree"

export type RootStoreModel = Instance<typeof RootStore>
export type RootStoreEnv = {
}

const RootStore = types.model("RootStore", {
})

export default RootStore
