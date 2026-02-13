import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  form: {
    roomName: "",
    length: "",
    width: "",
    height: "",
    occupancy: "",
    equipmentLoad: "",
    lightingLoad: "",
    infiltrationsPerHour: "",
    freshAirPercent: "",
    exhaustAir: "",
  },
  savedRooms: [],       // Each room: { ...form, id: "unique", acph: 18 }
  isFormVisible: false,
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    // Update one form field at a time
    updateRoomFormField: (state, action) => {
      const { field, value } = action.payload;
      state.form[field] = value;
    },

    // Clear all form inputs (Clear button)
    resetRoomForm: (state) => {
      state.form = { ...initialState.form };
    },

    // Show or hide the form
    setFormVisible: (state, action) => {
      state.isFormVisible = action.payload;
    },

    // Save room to savedRooms array
    // action.payload = { ...form, id: "unique", acph: 18 }
    saveRoom: (state, action) => {
      state.savedRooms.push(action.payload);
      state.form = { ...initialState.form };
      state.isFormVisible = false;
    },

    // Delete one saved room by unique id
    removeRoom: (state, action) => {
      state.savedRooms = state.savedRooms.filter(
        (room) => room.id !== action.payload
      );
    },

    // Reset form and show it (Add Room button)
    openNewRoomForm: (state) => {
      state.form = { ...initialState.form };
      state.isFormVisible = true;
    },

    // Clear everything (used on logout)
    resetRoom: () => initialState,
  },
});

export const {
  updateRoomFormField,
  resetRoomForm,
  setFormVisible,
  saveRoom,
  removeRoom,
  openNewRoomForm,
  resetRoom,
} = roomSlice.actions;

export default roomSlice.reducer;