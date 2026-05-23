import { Inertia } from "@/wayfinder/types";
import { createContext, useContext } from "react";

const authContext = createContext<Inertia.SharedData["auth"] | null>(null);

export const AuthProvider = ({
    children,
    auth,
}: {
    children: React.ReactNode;
    auth: Inertia.SharedData["auth"];
}) => {
    return (
        <authContext.Provider value={auth}>{children}</authContext.Provider>
    );
}

export const useAuth = () => {
    const auth = useContext(authContext);
    if (!auth) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return auth;
}
