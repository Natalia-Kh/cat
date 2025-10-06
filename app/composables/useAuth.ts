export const useAuth = () => {
  const user = useState<string | null>("user", () => null);

  const login = (username: string) => {
    if (typeof window !== "undefined") {
      user.value = username;
      localStorage.setItem("username", username);
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      user.value = null;
      localStorage.removeItem("username");
    }
  };

  const initUser = () => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("username");
      if (storedUser) {
        user.value = storedUser;
      }
    }
  };

  return {
    user: readonly(user),
    login,
    logout,
    initUser,
  };
};
