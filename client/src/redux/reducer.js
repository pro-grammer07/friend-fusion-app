import { combineReducers } from "@reduxjs/toolkit";

import userSlice from "./userSlice";
import themeSlice from "./theme";
import postSlice from "./postSlice";
import searchSlice from "./searchSlice";

const rootReducer = combineReducers({
  user: userSlice,
  theme: themeSlice,
  posts: postSlice,
  search: searchSlice,
});

export { rootReducer };