'use client';
import React, { useEffect } from 'react'
import axios from 'axios'
import { useUser } from '@clerk/nextjs'
import { UserDetailProvider, useUserDetail } from './context/UserDetailContext'

const ProviderContent = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const { user } = useUser();
    const { setUserDetail } = useUserDetail();

    const CreateNewUser = async () => {
        try {
            const response = await axios.post('/api/users');
            console.log('User API Response:', response.data);

            // Set user details in context
            if (response.data.success && response.data.user) {
                setUserDetail(response.data.user);
            }
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    useEffect(() => {
        if (user) {
            CreateNewUser();
        }
    }, [user]);

    return <>{children}</>;
}

const Provider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <UserDetailProvider>
            <ProviderContent>{children}</ProviderContent>
        </UserDetailProvider>
    )
}

export default Provider