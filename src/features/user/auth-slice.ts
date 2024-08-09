import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Auth } from "../../types/auth";
import { User } from "../../types/user";
import { RootState } from "../../store";


export interface AuthState {
    auth: Auth
}

const initialState: AuthState = {
    auth: {} as Auth
};


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        authLogin: (state, action: PayloadAction<string>) => {
            const user_id = action.payload
            return {...state, auth: {...state.auth, user: user_id, last_authed_at: new Date(), status: true}}
        },
        authLogout: (state) => {
            return {...state, auth: {...state.auth, user: undefined, last_authed_at: undefined, status: false}}
        },
   }

})

export const selectCurrentUser = (state: RootState) => {
    const current_user = state.auth.auth.user
    if (!!!current_user) {
        return null
    }
    return state["user-list"][current_user]
}

export const { authLogin, authLogout } = authSlice.actions
export default authSlice.reducer;