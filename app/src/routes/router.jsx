import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";

const Dashboard = lazy(() => import("@/pages/dashboard"));
const Login = lazy(() => import("@/pages/login"));

export default function Routing() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}