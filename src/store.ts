import { configureStore } from "@reduxjs/toolkit";
import resumeListReducer from "./features/panel/resume-list-slice"
import draftResumeListReducer from "./features/resume/draft-resume-list-slice"
import draftCoverLetterListReducer from "./features/cover-letter/cover-letter-slice"
import userListReducer from "./features/user/user-list-slice";
import coverLetterListReducer from "./features/panel/cover-letter-list-slice";
import authReducer from "./features/user/auth-slice";
import createIdbStorage from '@piotr-cz/redux-persist-idb-storage'
import { persistStore, persistReducer  } from "redux-persist";
import localStorage from 'redux-persist/lib/storage'

const storage = createIdbStorage({
    name: "resume.io",
    storeName: "resume.io",
})

const userListPersistConfig = {
    key: "users",
    storage,
    serialize: false,
    deserialize: false
}

const resumeListPersistConfig = {
    key: "resumes",
    storage,
    serialize: false,
    deserialize: false
}
const coverLetterListPersistConfig = {
    key: "cover-letters",
    storage,
    serialize: false,
    deserialize: false
}
const authPersistConfig = {
    key: "auth",
    storage,
    serialize: false,
    deserialize: false
}
const draftResumeListPersistConfig = {
    key: "draft-resumes",
    storage: localStorage,
}

const authPersistedReducer = persistReducer(authPersistConfig, authReducer)
const userListPersistedReducer = persistReducer(userListPersistConfig, userListReducer)
const resumeListPersistedReducer = persistReducer(resumeListPersistConfig, resumeListReducer)
const coverLetterListPersistReducer = persistReducer(coverLetterListPersistConfig, coverLetterListReducer)
const draftResumeListPersistReducer = persistReducer(draftResumeListPersistConfig, draftResumeListReducer)

//configure the store
export const store = configureStore({
    reducer: {
        "user-list": userListPersistedReducer,
        "resume-list": resumeListPersistedReducer,
        "cover-letter-list": coverLetterListPersistReducer,
        "auth": authPersistedReducer,
        "draft-resume-list": draftResumeListPersistReducer,
        "draft-coverLetter-list": draftCoverLetterListReducer,
    }
});
export const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;

