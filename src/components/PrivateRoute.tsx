import { useSelector } from "react-redux";
import { isAuthenticated } from "../assets/authSlice";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface PrivateRouteProps {
    children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
    const isUserAuth = useSelector(isAuthenticated);

    return isUserAuth ? <>{children}</> : <Navigate to="/login" />;
}