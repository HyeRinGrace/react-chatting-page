import {configureStore} from "@reduxjs/toolkit";
import userReducer from './userSlice';
import chatRoomSlice from "./chatRoomSlice";

export const store = configureStore({
    reducer:{
        user: userReducer,
        chatRoom: chatRoomSlice
    }
})