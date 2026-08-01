"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Role = "admin" | "lecturer";

type RoleContextType = {
  role: Role;
  setRole: (role: Role) => void;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>("admin");

  useEffect(() => {
    const savedRole = localStorage.getItem("user-role") as Role;
    if (savedRole === "admin" || savedRole === "lecturer") {
      setRoleState(savedRole);
    }
  }, []);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem("user-role", newRole);
  };

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
