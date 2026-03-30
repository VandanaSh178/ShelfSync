import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addNewAdminPopup: false,
  settingPopup: false,
  addBookPopup: false,
  readBookPopup: false,
  recordBookPopup: false,
  returnBookPopup: false,
};

const popUpSlice = createSlice({
  name: "popups",
  initialState,
  reducers: {
    toggleAddNewAdminPopup: (state) => {
      state.addNewAdminPopup = !state.addNewAdminPopup;
    },
    toggleSettingPopup: (state) => {
      state.settingPopup = !state.settingPopup;
    },
    toggleAddBookPopup: (state) => {
      state.addBookPopup = !state.addBookPopup;
    },
    toggleRecordBookPopup: (state) => {
      state.recordBookPopup = !state.recordBookPopup;
    },
    toggleReadBookPopup: (state) => {
      state.readBookPopup = !state.readBookPopup;
    },
    toggleReturnBookPopup: (state) => {
      state.returnBookPopup = !state.returnBookPopup;
    },
    closeAllPopups: (state) => {
      state.addNewAdminPopup = false;
      state.settingPopup = false;
      state.addBookPopup = false;
      state.readBookPopup = false;
      state.recordBookPopup = false;
      state.returnBookPopup = false;
    }
  },
});

// ✅ Export ALL actions so you can use them in your components
export const { 
  toggleAddNewAdminPopup, 
  toggleSettingPopup, 
  toggleAddBookPopup, 
  toggleRecordBookPopup, 
  toggleReadBookPopup, 
  toggleReturnBookPopup, 
  closeAllPopups 
} = popUpSlice.actions;

export default popUpSlice.reducer;