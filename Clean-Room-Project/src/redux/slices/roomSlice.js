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
  savedRooms: [],
  isFormVisible: false,
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    updateRoomFormField: (state, action) => {
      const { field, value } = action.payload;
      state.form[field] = value;
    },
    resetRoomForm: (state) => {
      state.form = { ...initialState.form };
      state.isFormVisible = false;
    },
    setFormVisible: (state, action) => {
      state.isFormVisible = action.payload;
    },
    saveRoom: (state, action) => {
      state.savedRooms.push(action.payload);
      state.form = { ...initialState.form };
      state.isFormVisible = false;
    },
    removeRoom: (state, action) => {
      state.savedRooms = state.savedRooms.filter(
        (room) => room.id !== action.payload
      );
    },
    openNewRoomForm: (state) => {
      state.form = { ...initialState.form };
      state.isFormVisible = true;
    },
    // Only clears form — savedRooms preserved 
    resetRoomFormOnly: (state) => {
      state.form = { ...initialState.form };
      state.isFormVisible = false;
    },
    // Clears everything including savedRooms (used after final submit)
    resetRoom: () => initialState,
  },
});

export const {
  updateRoomFormField,
  resetRoomForm,
  resetRoomFormOnly,
  setFormVisible,
  saveRoom,
  removeRoom,
  openNewRoomForm,
  resetRoom,
} = roomSlice.actions;

export default roomSlice.reducer;