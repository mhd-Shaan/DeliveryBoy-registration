import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  boy: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginuser: (state, action) => {
      state.user = action.payload;
 
    },
    
    
    logoutuser: (state) => {
      state.user = null;
    },
    // updateUserCity: (state, action) => {
    //   if (state.boy) {
      
    //     state.boy = action.payload;
        
        
    //   }
    // },
  },
});

export const { loginuser, logoutuser } = userSlice.actions;
export default userSlice.reducer;