import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, signedIn }: { children: React.ReactNode; signedIn: boolean }) {
    if (!signedIn) {
        return <Navigate to="/signin" replace />;
    }
    return children;
}