'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { SIGN_IN, SIGN_UP } from '@/graphql/mutations';
import { User, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'epaper_auth_token';
const AUTH_USER_KEY = 'epaper_auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const [signInMutation] = useMutation(SIGN_IN);
    const [signUpMutation] = useMutation(SIGN_UP);

    useEffect(() => {
        // Check for existing session
        const storedUser = localStorage.getItem(AUTH_USER_KEY);
        const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);

        if (storedUser && storedToken) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                localStorage.removeItem(AUTH_USER_KEY);
                localStorage.removeItem(AUTH_TOKEN_KEY);
            }
        }
        setLoading(false);
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            // const { data }: any = await signInMutation({
            //     variables: { email, password },
            // });

            // if (data?.signIn?.error) {
            //     return { error: new Error(data.signIn.error) };
            // }

            // if (data?.signIn?.user && data?.signIn?.token) {
            const user = {
                "id": "user_1",
                "email": "john@example.com",
                "password": "password123",
                "username": "johndoe",
                "createdAt": "2024-01-15T10:00:00Z"
            }
            setUser(user);
            localStorage.setItem(AUTH_TOKEN_KEY, 'token');
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
            // localStorage.setItem(AUTH_TOKEN_KEY, data.signIn.token);
            // localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.signIn.user));
            // }

            return { error: null };
        } catch (err) {
            return { error: err as Error };
        }
    };

    const signUp = async (email: string, password: string, username: string) => {
        try {
            const { data }: any = await signUpMutation({
                variables: { email, password, username },
            });

            if (data?.signUp?.error) {
                return { error: new Error(data.signUp.error) };
            }

            if (data?.signUp?.user && data?.signUp?.token) {
                setUser(data.signUp.user);
                localStorage.setItem(AUTH_TOKEN_KEY, data.signUp.token);
                localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.signUp.user));
            }

            return { error: null };
        } catch (err) {
            return { error: err as Error };
        }
    };

    const signOut = () => {
        setUser(null);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
