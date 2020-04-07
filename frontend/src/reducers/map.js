import { REFRESH_MAP } from "../actionTypes";

const initialState = {
  allIds: [],
  byIds: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case REFRESH_MAP: {
      return {
        state
      }
    }
    default:
      return state;
  }
}
