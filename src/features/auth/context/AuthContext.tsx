import { createContext, useContext, useState } from "react";

interface SpotifyUser {
  display_name?: string;
  images?: { url: string }[];
  product?: string; // premium / free
}

interface AuthContextType {
  user: SpotifyUser | null;
  setUser: (u: SpotifyUser) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SpotifyUser | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
