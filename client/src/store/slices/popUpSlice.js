import { createSlice } from "@reduxjs/toolkit"; // Fixed import path

const initialState = {
  settingPopup: false,
  addBookPopup: false,
  readBookPopup: false,
  recordBookPopup: false,
  returnBookPopup: false,
  addNewAdminPopup: false,
};

const popupSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    toggleSettingPopup(state) {
      state.settingPopup = !state.settingPopup;
    },
    toggleAddBookPopup(state) {
      state.addBookPopup = !state.addBookPopup; // Fixed "Satellite" to "state"
    },
    toggleReadBookPopup(state) {
      state.readBookPopup = !state.readBookPopup;
    },
    toggleRecordBookPopup(state) {
      state.recordBookPopup = !state.recordBookPopup;
    },
    toggleReturnBookPopup(state) {
      state.returnBookPopup = !state.returnBookPopup;
    },
    toggleAddNewAdminPopup(state) {
      state.addNewAdminPopup = !state.addNewAdminPopup;
    },
    // 🔥 Bonus: Close everything at once
    closeAllPopups(state) {
      Object.keys(state).forEach((key) => {
        state[key] = false;
      });
    },
  },
});

export const {
  toggleSettingPopup,
  toggleAddBookPopup,
  toggleReadBookPopup,
  toggleRecordBookPopup,
  toggleReturnBookPopup,
  toggleAddNewAdminPopup,
  closeAllPopups,
} = popupSlice.actions;

export default popupSlice.reducer;