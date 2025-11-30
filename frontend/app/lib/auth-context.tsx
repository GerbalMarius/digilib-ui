'use client';

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { axiosClient, axiosAuth } from "./axios-client";
import { setTokens, clearTokens, getAccessToken } from "./token-service";

type User = {
    id: string;
    email: string;
};

type AuthContextValue = {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: { email: string; password: string; name?: string }) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function init() {
            try {
                const access = getAccessToken();
                if (access) {
                    const res = await axiosClient.get("/auth/me");
                    setUser(res.data as User);
                }
            } catch (err) {
                clearTokens();
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        }

        init();
    }, []);

    async function login(email: string, password: string) {
        // Login without Authorization header
        const res = await axiosAuth.post("/auth/login", { email, password });
        const { accessToken } = res.data;

        // Set access token in storage so axiosClient can use it
        setTokens(accessToken, "null");

        // Fetch full user from /auth/me
        const me = await axiosClient.get("/auth/me");
        setUser(me.data as User);
    }

    async function register(data: { email: string; password: string; name?: string }) {
        const res = await axiosAuth.post("/auth/register", data);
        const { accessToken } = res.data;

        setTokens(accessToken, "null");

        const me = await axiosClient.get("/auth/me");
        setUser(me.data as User);
    }


    async function logout() {
        try {
            await axiosClient.post("/auth/logout");
        } catch {
            // ignore
        } finally {
            clearTokens();
            setUser(null);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}
