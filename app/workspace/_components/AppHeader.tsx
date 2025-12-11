'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import React from 'react'

const AppHeader = () => {
  const handleProjectsClick = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className='flex items-center justify-between p-4 shadow-sm'>
      <SidebarTrigger />
      <div className='flex items-center gap-4'>
      <button
        onClick={handleProjectsClick}
        className='text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100'
      >
        Your Projects
      </button>
      <UserButton />
      </div>
    </div>
  )
}

export default AppHeader