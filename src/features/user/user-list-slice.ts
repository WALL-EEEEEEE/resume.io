import {  createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/user"
import { v7 as uuidv7 } from "uuid"

type UserListState = {
    [id: string]: User,
}

const initialState: UserListState= {};

const userListSlice = createSlice({
    name: "resume",
    initialState,
    reducers: {
        addUser: (state, action: PayloadAction<User>) => {
            const user = action.payload
            let user_id: string = user.id;
            if (user_id === "") {
                user_id = uuidv7()
            }
            if (state[user_id] !== undefined ) {
                return
            }
            state[user_id] = {...user}
        },
        delUser: (state, action: PayloadAction<string>) => {
            //to plain object
            const user_id = action.payload
            delete state[user_id] 
        },
   }

})

export const { addUser, delUser} = userListSlice.actions

export default userListSlice.reducer;