'use client'

import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useUserDetail } from "@/app/context/UserDetailContext"

const AppSidebar = () => {
    const { userDetail } = useUserDetail();
    const userCredits = userDetail?.credits ?? 0;
    const maxCredits = 2;
    const creditPercentage = (userCredits / maxCredits) * 100;

    return (
        <Sidebar>
            <SidebarHeader>
                <div className='p-3 sm:p-4 space-y-3'>
                    <div className='flex items-center gap-2 sm:gap-3'>
                        <div className="flex items-center justify-center flex-shrink-0 bg-blue-600 rounded-lg p-1.5 sm:p-2">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                className="sm:w-6 sm:h-6"
                            >
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                                <path d="M2 17L12 22L22 17" />
                                <path d="M2 12L12 17L22 12" />
                            </svg>
                        </div>
                        <h2 className='text-base sm:text-lg font-bold leading-tight whitespace-nowrap'>Ai Website Builder</h2>
                    </div>
                    <Button className='w-full text-sm sm:text-base'>
                        <Plus className='w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2' /> Add New Project
                    </Button>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Projects</SidebarGroupLabel>
                </SidebarGroup>
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter>
                <div className='p-3 sm:p-4 space-y-3'>
                    <Separator />
                    {/* Remaining Credits Section */}
                    <div className='space-y-2'>
                        <div className='flex items-center justify-between'>
                            <span className='text-sm font-medium text-gray-700'>Remaining Credits</span>
                            <span className='text-sm font-bold text-gray-900'>{userCredits}</span>
                        </div>
                        <Progress value={creditPercentage} className='h-2' />
                        <Button className='w-full text-sm sm:text-base bg-black hover:bg-gray-800 text-white'>
                            Upgrade to Unlimited
                        </Button>
                    </div>
                    <Separator />
                    {/* User Button */}
                    <div className='flex items-center gap-2 sm:gap-3'>
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "w-8 h-8 sm:w-10 sm:h-10"
                                }
                            }}
                        />
                        <span className='text-sm font-medium text-gray-700'>Settings</span>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar