import { configureStore } from "@reduxjs/toolkit";
import resumeReducer from "./features/resume/resume-slice"
import coverLetterReducer from "./features/cover-letter/cover-letter-slice";
import localStorage from "redux-persist/lib/storage";
import createIdbStorage from '@piotr-cz/redux-persist-idb-storage'
import { persistStore, persistReducer, PersistConfig} from "redux-persist";

const storage = createIdbStorage({
    name: "resume.io", 
    storeName: "resome.io",
}
)//localStorage


const resumePersistConfig = {
    key: "resume.io/resume",
    storage,
    serialize: false,
    deserialize: false
}
const coverLetterPersistConfig = {
    key: "resume.io/cover-letter",
    storage,
    serialize: false,
    deserialize: false
}

const resumePersistedReducer = persistReducer(resumePersistConfig, resumeReducer)
const coverLetterPersistReducer = persistReducer(coverLetterPersistConfig, coverLetterReducer)

//configure the store
export const store = configureStore({
    reducer: { 
        "resume": resumePersistedReducer,
        "cover-letter": coverLetterPersistReducer,
    }
});
export const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;