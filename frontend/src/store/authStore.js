import { create } from "zustand";
import { useEffect } from "react";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,

  login: (user, token) => {
    console.log("Setting user:", user); // Debugging
    set({ user, token });
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },

  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
}));

export const useAuthInitializer = () => {
  const setUser = useAuthStore((state) => state.login);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(savedUser, savedToken);
    }
  }, [setUser]);
};

export default useAuthStore;
