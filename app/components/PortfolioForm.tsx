"use client";

import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface PortfolioFormProps {
    onPromptGenerated: (prompt: string) => void;
}

const professions = [
    'Software Engineer',
    'Computer Engineer',
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'UI/UX Designer',
    'Product Designer',
    'Graphic Designer',
    'Product Manager',
    'Data Scientist',
    'DevOps Engineer',
    'Mobile Developer',
    'Game Developer',
    'Photographer',
    'Writer',
    'Content Creator',
];

const styles = [
    'Modern',
    'Minimal',
    'Creative',
    'Professional',
    'Bold',
    'Elegant',
    'Playful',
    'Dark Mode',
    'Glassmorphism',
    'Neumorphic',
];

const colorThemes = [
    { name: 'Blue & White', value: 'blue and white', gradient: 'from-blue-500 to-blue-100' },
    { name: 'Dark Mode', value: 'dark with purple accents', gradient: 'from-gray-900 to-purple-900' },
    { name: 'Vibrant', value: 'vibrant multi-color', gradient: 'from-pink-500 via-purple-500 to-indigo-500' },
    { name: 'Pastel', value: 'soft pastel', gradient: 'from-pink-200 via-purple-200 to-blue-200' },
    { name: 'Monochrome', value: 'black and white', gradient: 'from-gray-900 to-gray-100' },
    { name: 'Green & Fresh', value: 'green and fresh', gradient: 'from-green-500 to-emerald-100' },
    { name: 'Warm Sunset', value: 'warm orange and pink', gradient: 'from-orange-500 to-pink-500' },
    { name: 'Ocean Blue', value: 'deep blue and teal', gradient: 'from-blue-600 to-teal-400' },
];

export default function PortfolioForm({ onPromptGenerated }: PortfolioFormProps) {
    const [profession, setProfession] = useState('');
    const [style, setStyle] = useState('');
    const [colorTheme, setColorTheme] = useState('');

    const generatePrompt = () => {
        if (!profession || !style || !colorTheme) {
            return;
        }

        const selectedTheme = colorThemes.find(theme => theme.value === colorTheme);
        const prompt = `Create a ${style.toLowerCase()} portfolio website for a ${profession}. Use a ${selectedTheme?.value} color scheme with smooth gradients and modern aesthetics.

Include the following sections:
- Hero section with a professional introduction, name, and title with a captivating tagline
- About Me section highlighting background, expertise, and passion
- Skills showcase with visual icons or progress bars
- Project Portfolio featuring 3-4 impressive projects with images, descriptions, and tech stack
- Contact section with email, social media links, and a contact form

Design requirements:
- Fully responsive and mobile-friendly
- Smooth animations and hover effects
- Modern typography using professional fonts
- Clean, organized layout with proper spacing
- Professional yet visually striking design
- Include subtle micro-interactions for enhanced UX`;

        onPromptGenerated(prompt);
    };

    const isFormComplete = profession && style && colorTheme;

    return (
        <div className="w-full max-w-2xl mb-6 sm:mb-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-zinc-200 p-4 sm:p-6 shadow-sm">
                <h3 className="text-lg sm:text-xl font-semibold text-zinc-800 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    Quick Portfolio Setup
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {/* Profession Selector */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">
                            Your Profession
                        </label>
                        <select
                            value={profession}
                            onChange={(e) => setProfession(e.target.value)}
                            className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-800 focus:ring-2 focus:ring-purple-200 focus:border-purple-300 focus:outline-none transition-all"
                        >
                            <option value="">Select profession...</option>
                            {professions.map((prof) => (
                                <option key={prof} value={prof}>
                                    {prof}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Style Selector */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">
                            Design Style
                        </label>
                        <select
                            value={style}
                            onChange={(e) => setStyle(e.target.value)}
                            className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-800 focus:ring-2 focus:ring-purple-200 focus:border-purple-300 focus:outline-none transition-all"
                        >
                            <option value="">Select style...</option>
                            {styles.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Color Theme Selector */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-zinc-700 mb-3">
                        Color Theme
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                        {colorThemes.map((theme) => (
                            <button
                                key={theme.value}
                                onClick={() => setColorTheme(theme.value)}
                                className={`relative p-3 rounded-xl border-2 transition-all ${colorTheme === theme.value
                                        ? 'border-purple-500 shadow-md'
                                        : 'border-zinc-200 hover:border-zinc-300'
                                    }`}
                            >
                                <div className={`w-full h-8 rounded-lg bg-gradient-to-r ${theme.gradient} mb-2`} />
                                <p className="text-xs font-medium text-zinc-700 text-center">
                                    {theme.name}
                                </p>
                                {colorTheme === theme.value && (
                                    <div className="absolute top-1 right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Generate Button */}
                <button
                    onClick={generatePrompt}
                    disabled={!isFormComplete}
                    className={`w-full py-3 px-6 rounded-xl font-medium transition-all ${isFormComplete
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-md hover:shadow-lg'
                            : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                        }`}
                >
                    <span className="flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Generate Portfolio Prompt
                    </span>
                </button>
            </div>
        </div>
    );
}
