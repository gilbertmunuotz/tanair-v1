import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { selectUserRole } from "../assets/authSlice";

interface RoleBasedRouteProps {
    children: ReactNode;
    allowedRole: string; // The role allowed to access this route
}

export function RoleBasedRoute({ children, allowedRole }: RoleBasedRouteProps) {
    const userRole = useSelector(selectUserRole);

    return userRole === allowedRole ? <>{children}</> : <Navigate to="/" />;
}