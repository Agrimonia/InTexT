import { autorun, computed, observable } from "mobx";
import { persist } from "mobx-persist";
import { APIClient } from "../utils/client";

class LoginStateStore {
  @persist @observable token = "";
  @persist @observable email = "";
  @persist @observable username = "";

  @computed
  get logined() {
    return this.token !== "";
  }

  login(username, email) {
    this.username = username;
    this.email = email;
  }
}
const store = new LoginStateStore();

autorun(() => {
  if (store.token) {
    APIClient.defaults.headers.common.Authorization = store.token;
  } else {
    APIClient.defaults.headers.common.Authorization = "";
  }
});

export default store;
