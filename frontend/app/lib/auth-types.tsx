export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
};

export interface RegisterData {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    passwordConfirmation: string;
    adminCode?: string;
}

export interface AuthContextValue {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
};