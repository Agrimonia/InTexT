import * as consts from "../utils/consts";

const initialState = {
  data: null,
  isLoading: false
};

export default function userUpdate(state = initialState, { type, payload }) {
  switch (type) {
    case consts.USER_LOGGING_IN:
      return { ...initialState, isLoading: true };
    case consts.USER_LOGGED_IN:
      return { data: payload, isLoading: false };
    case consts.USER_LOGGED_OUT:
      return initialState;
    default:
      return state;
  }
}
