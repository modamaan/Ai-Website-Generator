"use client";

import React from 'react';
import Image from 'next/image';
import { Save } from 'lucide-react';

const PlaygroundHeader = () => {
    const handleSave = () => {
        // TODO: Implement save functionality
        console.log('Saving project...');
    };

    return (
        <header className="w-full border-b border-zinc-200 bg-white">
            <nav className="flex items-center justify-between px-6 py-4">
                {/* Logo/Brand */}
                <div className="flex items-center gap-2">
                    <Image src="/web-development.png" alt="Logo" width={48} height={48} className="w-7 h-7" />
                    <h1 className="text-xl font-bold text-black">
                        AI Website Builder
                    </h1>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-zinc-800 transition-colors"
                >
                    <Save className="w-4 h-4" />
                    Save
                </button>
            </nav>
        </header>
    );
};

export default PlaygroundHeader;