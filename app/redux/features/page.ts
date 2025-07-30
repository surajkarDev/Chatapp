import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a more specific type for chats if possible
interface Chat {
  // Define chat structure here; using any for now
  [key: string]: any;
}
interface UserList {
  // Define chat structure here; using any for now
  [key: string]: any;
}

interface UserState {
  id: number;
  username: string;
  email: string;
  onlineStatus: boolean;
  chats?: Chat[];
  userList?:UserList[];
  toUserId?:Number;
}

const getInitialToUserId = ():number => {
  if(typeof window !== 'undefined'){
    const stored = localStorage.getItem('currentUserToChat');
    return stored ? JSON.parse(stored) : 0;
  }
  return 0;
}
const getInitialUser = (): any => {
  try {
    if (typeof window === "undefined") {
      // We're on the server
      return {};
    }
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : {};
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error);
    return {};
  }
};
const initialUser = getInitialUser();
const initialState: UserState = {
  id: initialUser.id || 0,
  username: '',
  email: '',
  onlineStatus: false,
  chats: [],
  userList:[],
  toUserId:getInitialToUserId()
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      return action.payload;
    },
    clearUser() {
      return initialState;
    },
    setOnlineStatus(state, action: PayloadAction<boolean>) {
      state.onlineStatus = action.payload;
    },
    callLoginUser(state, action: PayloadAction<UserState>) {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.onlineStatus = action.payload.onlineStatus;
      if(!state.onlineStatus){
       state.toUserId = 0
      }
    },
    setUserChats(state, action: PayloadAction<Chat[]>) {
      state.chats = action.payload.filter(x => x.fromUserId === state.id);
    },
    setUserList(state,action:PayloadAction<UserList[]>){
      state.userList = action.payload
    },
    selectUserToChat(state,action:PayloadAction<number>){
      state.toUserId = action.payload
    }
  }
});

// Thunk for fetching chats asynchronously
export const fetchUserChats = () => async (dispatch: any) => {
  try {
    const response = await fetch("http://localhost:3001/chats");
    if (response.ok) {
      const data = await response.json();
      dispatch(setUserChats(data));
    } else {
      console.error("Failed to fetch chats");
    }
  } catch (error) {
    console.error("Error fetching chats:", error);
  }
};

export const fetchAllUser = () => async (dispatch: any) => {
  try{
    const response = await fetch("http://localhost:3001/users");
    if(response.ok){
      const data = await response.json();
      dispatch(setUserList(data));
    }else {
      console.error("Failed to fetch chats");
    }
  }catch(error){
    console.error("Error Fetching Users:",error);
  }
}


export const { setUser, clearUser, setOnlineStatus, callLoginUser, setUserChats,setUserList,selectUserToChat } = userSlice.actions;
export default userSlice.reducer;

