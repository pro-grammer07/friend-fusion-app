import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  term: "",
  people: [],
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearch(state, action) {
      state.term = action.payload.term;
      state.people = action.payload.people;
    },
    clearSearch(state) {
      state.term = "";
      state.people = [];
    },
  },
});

export default searchSlice.reducer;

export function SetSearch(payload) {
  return (dispatch, getState) => {
    dispatch(searchSlice.actions.setSearch(payload));
  };
}

export function ClearSearch() {
  return (dispatch, getState) => {
    dispatch(searchSlice.actions.clearSearch());
  };
}
