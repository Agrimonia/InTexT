import * as consts from "../utils/consts";

export const login = data => dispatch => {
  dispatch({
    type: consts.USER_LOGGING_IN
  });
  // Wait 2 seconds before "logging in"
  setTimeout(() => {
    dispatch({
      type: consts.USER_LOGGED_IN,
      payload: data
    });
  }, 2000);
};

export function logout() {
  return {
    type: consts.USER_LOGGED_OUT
  };
}
