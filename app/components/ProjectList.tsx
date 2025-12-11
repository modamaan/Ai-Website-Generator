"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Loader2, FileText, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useUser } from '@clerk/nextjs';

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

export default function ProjectList() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { isSignedIn, isLoaded } = useUser();

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            fetchProjects();
        } else if (isLoaded && !isSignedIn) {
            setLoading(false);
        }
    }, [isLoaded, isSignedIn]);

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

    const truncatePrompt = (prompt: string | null | undefined, maxLength: number = 50) => {
        if (!prompt) return "Untitled Project";
        if (prompt.length <= maxLength) return prompt;
        return prompt.substring(0, maxLength) + "...";
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="text-center py-12 px-4">
                <FileText className="w-12 h-12 mx-auto text-zinc-300 mb-4" />
                <h3 className="text-lg font-medium text-zinc-700 mb-2">No projects yet</h3>
                <p className="text-sm text-zinc-500">Create your first project by describing your website above</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id='projects'>
            <h2 className="text-2xl font-bold text-zinc-800 mb-6">Your Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        onClick={() => handleProjectClick(project)}
                        className="group bg-white border border-zinc-200 rounded-xl p-5 hover:border-zinc-300 hover:shadow-md transition-all cursor-pointer"
                    >
                        {/* Project Preview */}
                        <div className="aspect-video bg-zinc-100 rounded-lg mb-4 overflow-hidden">
                            {project.frame?.designCode ? (
                                <iframe
                                    srcDoc={project.frame.designCode}
                                    className="w-full h-full pointer-events-none scale-[0.25] origin-top-left"
                                    style={{ width: '400%', height: '400%' }}
                                    sandbox="allow-same-origin"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <FileText className="w-12 h-12 text-zinc-300" />
                                </div>
                            )}
                        </div>

                        {/* Project Info */}
                        <div className="space-y-2">
                            <h3 className="font-semibold text-zinc-800 group-hover:text-zinc-900 truncate">
                                {truncatePrompt(project.firstPrompt)}
                            </h3>
                            <div className="flex items-center text-xs text-zinc-500">
                                <Calendar className="w-3 h-3 mr-1" />
                                {format(new Date(project.createdOn), 'MMM d, yyyy')}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
