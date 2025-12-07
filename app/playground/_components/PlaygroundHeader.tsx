"use client";

import React from 'react';
import Image from 'next/image';
import { Save } from 'lucide-react';
import Link from 'next/link';

const PlaygroundHeader = () => {
    const handleSave = () => {
        // TODO: Implement save functionality
        console.log('Saving project...');
    };

    return (
        <header className="w-full border-b border-zinc-200 bg-white">
            <nav className="flex items-center justify-between px-3 md:px-6 py-3 md:py-4">
                {/* Logo/Brand */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-1.5 md:gap-2">
                        <Image src="/web-development.png" alt="Logo" width={48} height={48} className="w-6 h-6 md:w-7 md:h-7" />
                        <h1 className="text-base md:text-xl font-bold text-black">
                            AI Website Builder
                        </h1>
                    </Link>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-white bg-black rounded-lg hover:bg-zinc-800 transition-colors"
                >
                    <Save className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">Save</span>
                </button>
            </nav>
        </header>
    );
};

export default PlaygroundHeader;