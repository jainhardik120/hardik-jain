"use client"

import { useContext, createContext, useEffect, useState } from "react";

interface IAuthContext {
  isLoggedIn: boolean,
  logOut: () => Promise<void>,
  refresh: () => Promise<void>
}

const AuthContext = createContext<IAuthContext | null>(null)

export const useAuthContext = () => {
  const state = useContext(AuthContext);
  if (!state) throw new Error("State not defined");
  return state;
}

export const AuthenticationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const getStatus = async () => {
    const response = await fetch("/api/auth/verify");
    if (response.ok) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }
  useEffect(() => {
    getStatus();
  }, [])

  const logout = async () => {
    const response = await fetch("/api/auth/logout");
    if (response.ok) {
      setIsLoggedIn(false);
    }
  }

  const refresh = async () => {
    await getStatus();
  }

  const providerValue: IAuthContext = {
    isLoggedIn: isLoggedIn,
    logOut: logout,
    refresh : refresh
  }

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  )
}

