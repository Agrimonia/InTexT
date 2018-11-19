import { create } from "mobx-persist";

import LoginState from "./LoginStateStore";

const persistStore = create();

export default persistStore("login", LoginState);
