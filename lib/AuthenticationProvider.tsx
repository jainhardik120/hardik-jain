"use client"

import { useContext, createContext, useEffect, useState } from "react";

interface IAuthContext {
  loading: boolean,
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
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const getStatus = async () => {
    setLoading(true);
    const response = await fetch("/api/auth/verify");
    if (response.ok) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    setLoading(false);
  }
  useEffect(() => {
    getStatus();
  }, [])

  const logout = async () => {
    setLoading(true);
    const response = await fetch("/api/auth/logout");
    if (response.ok) {
      setIsLoggedIn(false);
    }
    setLoading(false);
  }

  const refresh = async () => {
    await getStatus();
  }

  const providerValue: IAuthContext = {
    loading,
    isLoggedIn: isLoggedIn,
    logOut: logout,
    refresh: refresh
  }

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  )
}

