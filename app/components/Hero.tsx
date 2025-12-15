"use client";

import { useState } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { Image as ImageIcon, ArrowUp, LayoutDashboard, UserPlus, Home, User, Loader2 } from 'lucide-react';
import suggestions from '@/app/data/suggestions.json';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import PortfolioForm from './PortfolioForm';

// Icon mapping
const iconMap = {
  LayoutDashboard,
  UserPlus,
  Home,
  User,
};

export default function Hero() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  const handlePromptGenerated = (generatedPrompt: string) => {
    setPrompt(generatedPrompt);
  };

  const CreateNewProject = async () => {
    setLoading(true);
    const projectId = uuidv4();
    const frameId = generateRandomFrameNumber();
    const messages = [{
      role: "user",
      content: prompt,
    }];

    try {
      const response = await axios.post('/api/projects', {
        projectId: projectId,
        frameId: frameId,
        messages: messages,
      });

      console.log('Project API Response:', response.data);
      toast.success('Project created successfully');
      router.push(`/playground/${projectId}?frameId=${frameId}`);
      setLoading(false);
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Error creating project');
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestionPrompt: string) => {
    setPrompt(suggestionPrompt);
  };

  const handleSubmit = () => {
    if (!prompt.trim()) return;

    // TODO: Add your AI generation logic here
    console.log('Generating design for:', prompt);
    console.log('User:', user?.fullName);
  };

  return (
    <section className="relative flex flex-col items-center justify-center pt-16 sm:pt-20 md:pt-24 pb-20 sm:pb-28 md:pb-36 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-accent/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-smart-blue/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Main Heading with Gradient */}
      <div className="mb-4 sm:mb-5">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-3 sm:mb-4 max-w-5xl">
          <span className="text-gradient">Build Your Portfolio</span>
          <br />
          <span className="text-zinc-900">in Seconds</span>
        </h1>
      </div>
      
      <p className="text-lg sm:text-xl md:text-2xl text-zinc-600 mb-10 sm:mb-12 md:mb-14 max-w-3xl font-light leading-relaxed">
        Create a stunning professional portfolio with AI. Choose your style,
        <br className="hidden sm:block" />
        customize, and deploy with one click.
      </p>

      <PortfolioForm onPromptGenerated={handlePromptGenerated} />

      <div className="w-full max-w-3xl relative mb-8 sm:mb-10">
        <div className="relative group">
          <textarea
            className="w-full h-44 sm:h-52 md:h-60 p-5 sm:p-7 pr-14 sm:pr-18 pb-16 sm:pb-18 text-base sm:text-lg bg-white rounded-2xl sm:rounded-3xl border-2 border-zinc-200 resize-none focus:ring-4 focus:ring-purple-accent/20 focus:border-purple-accent focus:outline-none placeholder:text-zinc-400 text-zinc-800 shadow-lg transition-all duration-300 group-hover:shadow-xl"
            placeholder="Describe your portfolio design (or use the quick setup above)"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          />
          <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5">
            <button className="p-2.5 text-zinc-400 hover:text-purple-accent transition-all duration-200 hover:scale-110 rounded-lg hover:bg-purple-50">
              <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
          <div className="absolute bottom-4 sm:bottom-5 right-4 sm:right-5">
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <button
                className={`p-3 sm:p-3.5 rounded-full transition-all duration-300 transform ${prompt.trim()
                  ? 'gradient-primary text-white hover:scale-110 hover:shadow-lg shadow-purple-500/50 cursor-pointer'
                  : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                  }`}
                disabled={!prompt.trim()}
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </SignInButton>
          ) : (
            <button
              onClick={CreateNewProject}
              className={`p-3 sm:p-3.5 rounded-full transition-all duration-300 transform ${prompt.trim() && !loading
                ? 'gradient-primary text-white hover:scale-110 hover:shadow-lg shadow-purple-500/50 cursor-pointer'
                : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                }`}
              disabled={!prompt.trim() || loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ArrowUp className="w-5 h-5" />
              )}
            </button>
          )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 max-w-4xl">
        {suggestions.map((suggestion) => {
          const IconComponent = iconMap[suggestion.icon as keyof typeof iconMap];
          return (
            <PresetButton
              key={suggestion.label}
              icon={<IconComponent className="w-3 h-3 sm:w-4 sm:h-4" />}
              label={suggestion.label}
              prompt={suggestion.prompt}
              onClick={() => handleSuggestionClick(suggestion.prompt)}
            />
          );
        })}
      </div>
    </section>
  );
}

function PresetButton({ icon, label, prompt, onClick }: { icon: React.ReactNode; label: string; prompt: string; onClick: () => void }) {
  return (
    <button
      className="flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base font-medium text-zinc-700 bg-white border-2 border-zinc-200 rounded-full hover:border-purple-accent hover:text-purple-accent hover:shadow-md transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5"
      title={prompt}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}

const generateRandomFrameNumber = () => {
  return Math.floor(Math.random() * 1000000);
};
