import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function AuthLayout({ children }: Props) {
  return (
    <div className="h-screen flex items-center justify-center">{children}</div>
  );
}

export default AuthLayout;
