"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  authApi,
  User,
  SignUpRequest,
  SignInRequest,
  AuthResponse,
} from "@/lib/api/auth";
import { tokenStorage } from "@/lib/auth/tokenStorage";
import { apiClient } from "@/lib/api/client";
import { ApiErrorCode } from "@/lib/types/api";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: (data: SignUpRequest) => Promise<void>;
  signIn: (data: SignInRequest) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const token = tokenStorage.getToken();

    if (token) {
      // Set token in API client
      apiClient.setAuthToken(token);

      // Restore user info from localStorage
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("timegrave_user");

        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          } catch (error) {
            console.error("Failed to parse stored user:", error);
            // If user data is corrupted, clear everything
            tokenStorage.removeToken();
            localStorage.removeItem("timegrave_user");
            apiClient.removeAuthToken();
          }
        } else {
          // Token exists but no user data - clear token and require re-login
          console.warn("Token found but no user data. Please log in again.");
          tokenStorage.removeToken();
          apiClient.removeAuthToken();
        }
      }
    }
    setIsLoading(false);
  }, []);

  const signUp = useCallback(async (data: SignUpRequest) => {
    try {
      const response = await authApi.signUp(data);
      // Sign up doesn't return a token, user needs to sign in
      // Just return success
    } catch (error) {
      console.error("Sign up failed:", error);
      throw error;
    }
  }, []);

  const signIn = useCallback(async (data: SignInRequest) => {
    try {
      const response = await authApi.signIn(data);
      const authData: AuthResponse = response.data;

      // Store token in localStorage
      tokenStorage.setToken(authData.sessionToken, authData.expiresAt);

      // Store user info in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("timegrave_user", JSON.stringify(authData.user));
      }

      // Set token in API client for subsequent requests
      apiClient.setAuthToken(authData.sessionToken);

      // Update user state
      setUser(authData.user);
    } catch (error) {
      console.error("Sign in failed:", error);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      // Call backend sign out endpoint
      await authApi.signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
      // Continue with local cleanup even if backend call fails
    } finally {
      // Remove token from localStorage
      tokenStorage.removeToken();

      // Remove user info from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("timegrave_user");
      }

      // Remove token from API client
      apiClient.removeAuthToken();

      // Clear user state
      setUser(null);
    }
  }, []);

  const deleteAccount = useCallback(async () => {
    try {
      await authApi.deleteAccount();

      // Remove token from localStorage
      tokenStorage.removeToken();

      // Remove user info from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("timegrave_user");
      }

      // Remove token from API client
      apiClient.removeAuthToken();

      // Clear user state
      setUser(null);
    } catch (error) {
      console.error("Delete account failed:", error);
      throw error;
    }
  }, []);

  const isAuthenticated = user !== null || tokenStorage.getToken() !== null;

  const value: AuthContextValue = {
    user,
    isAuthenticated,
    isLoading,
    signUp,
    signIn,
    signOut,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
