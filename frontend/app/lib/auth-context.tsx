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
import { AuthContextValue, RegisterData, User } from "./auth-types";



const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function init() {
            try {
                const access = getAccessToken();
                if (access) {
                    const res = await axiosClient.get("/users/me");
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
        
        const res = await axiosAuth.post("/auth/login", { email, password });
        const { accessToken } = res.data;

       
        setTokens(accessToken, "null");

        
        const me = await axiosClient.get("/users/me");
        setUser(me.data as User);
    }

    async function register(data: RegisterData) {
        const res = await axiosAuth.post("/auth/register", data);
        const { accessToken } = res.data;

        setTokens(accessToken, "null");

        const me = await axiosClient.get("/users/me");
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
