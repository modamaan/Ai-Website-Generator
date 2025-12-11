'use client'

import React, { useState, useEffect } from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Loader2 } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useUserDetail } from "@/app/context/UserDetailContext"
import { useRouter, usePathname } from "next/navigation"
import axios from "axios"

interface Frame {
    id: number;
    frameId: string;
    designCode: string | null;
    projectId: string;
    createdOn: string;
}

interface Project {
    id: number;
    projectId: string;
    createdBy: string;
    createdOn: string;
    frame: Frame | null;
    firstPrompt?: string | null;
}

const AppSidebar = () => {
    const { userDetail } = useUserDetail();
    const userCredits = userDetail?.credits ?? 0;
    const maxCredits = 2;
    const creditPercentage = (userCredits / maxCredits) * 100;

    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('/api/projects');
            if (response.data.success) {
                setProjects(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProjectClick = (project: Project) => {
        if (project.frame) {
            router.push(`/playground/${project.projectId}?frameId=${project.frame.frameId}`);
        }
    };

    const isActiveProject = (projectId: string) => {
        return pathname.includes(projectId);
    };

    const truncatePrompt = (prompt: string | null | undefined, maxLength: number = 40) => {
        if (!prompt) return "Untitled Project";
        if (prompt.length <= maxLength) return prompt;
        return prompt.substring(0, maxLength) + "...";
    };

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
                    <div className='px-2 py-1 space-y-1'>
                        {loading ? (
                            <div className='flex justify-center items-center py-8'>
                                <Loader2 className='w-5 h-5 animate-spin text-gray-400' />
                            </div>
                        ) : projects.length === 0 ? (
                            <div className='text-center py-8 px-2'>
                                <FileText className='w-8 h-8 mx-auto text-gray-300 mb-2' />
                                <p className='text-xs text-gray-500'>No projects yet</p>
                            </div>
                        ) : (
                            projects.map((project) => (
                                <button
                                    key={project.id}
                                    onClick={() => handleProjectClick(project)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${isActiveProject(project.projectId)
                                        ? 'bg-gray-200 text-gray-900 font-medium'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <FileText className='w-4 h-4 flex-shrink-0' />
                                    <span className='truncate'>{truncatePrompt(project.firstPrompt)}</span>
                                </button>
                            ))
                        )}
                    </div>
                </SidebarGroup>
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