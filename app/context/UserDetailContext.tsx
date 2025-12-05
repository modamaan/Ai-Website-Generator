'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the user type based on your database schema
export interface UserDetail {
    id: number;
    clerkId: string;
    name: string;
    email: string;
    credits: number | null;
}

// Define the context type
interface UserDetailContextType {
    userDetail: UserDetail | null;
    setUserDetail: (user: UserDetail | null) => void;
    updateCredits: (credits: number) => void;
}

// Create the context with undefined as default
const UserDetailContext = createContext<UserDetailContextType | undefined>(undefined);

// Provider component
export const UserDetailProvider = ({ children }: { children: ReactNode }) => {
    const [userDetail, setUserDetail] = useState<UserDetail | null>(null);

    // Helper function to update credits
    const updateCredits = (credits: number) => {
        if (userDetail) {
            setUserDetail({
                ...userDetail,
                credits,
            });
        }
    };

    return (
        <UserDetailContext.Provider value={{ userDetail, setUserDetail, updateCredits }}>
            {children}
        </UserDetailContext.Provider>
    );
};

// Custom hook to use the context
export const useUserDetail = () => {
    const context = useContext(UserDetailContext);
    if (context === undefined) {
        throw new Error('useUserDetail must be used within a UserDetailProvider');
    }
    return context;
};
