import { api } from "./api/baseApi";
import { clearAllStoredAuthData } from "./api/authStorage";
import { store } from "./store";

export const performLogout = () => {
  clearAllStoredAuthData();
  store.dispatch(api.util.resetApiState());
};
