import RootStore, { RootStoreModel, RootStoreEnv } from "./root.store"
import { SnapshotIn } from "mobx-state-tree"


export const createStore = (): RootStoreModel => {
  // const publishedPolls = PublishedPolls.create({
  //   polls: [publishedPollData]
  // })
  // const pollDraft = PollDraft.create({
  //   choices: [{ id: shortid(), value: "" }]
  // })

  const env: RootStoreEnv = {  }

  const rootStore = RootStore.create(
    {
      // pollDraft,
      // publishedPolls
    },
    env
  )

  return rootStore
}
