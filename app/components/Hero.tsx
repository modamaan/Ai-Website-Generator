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
    <section className="flex flex-col items-center justify-center pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-24 md:pb-32 px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black mb-3 sm:mb-4 max-w-4xl">
        Build Your Portfolio in Seconds
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-zinc-500 mb-8 sm:mb-10 md:mb-12 max-w-2xl">
        Create a stunning professional portfolio with AI. Choose your style, customize, and deploy with one click.
      </p>

      <PortfolioForm onPromptGenerated={handlePromptGenerated} />

      <div className="w-full max-w-2xl relative mb-6 sm:mb-8">
        <textarea
          className="w-full h-40 sm:h-48 md:h-56 p-4 sm:p-6 pr-12 sm:pr-16 pb-14 sm:pb-16 text-base sm:text-lg bg-zinc-50 rounded-2xl sm:rounded-3xl border-none resize-none focus:ring-2 focus:ring-zinc-200 focus:outline-none placeholder:text-zinc-400 text-zinc-800"
          placeholder="Describe your portfolio design (or use the quick setup above)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
        />
        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
          <button className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors">
            <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4">
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <button
                className={`p-2 sm:p-2.5 rounded-full transition-colors ${prompt.trim()
                  ? 'bg-black text-white hover:bg-zinc-800 cursor-pointer'
                  : 'bg-zinc-300 text-zinc-500 cursor-not-allowed'
                  }`}
                disabled={!prompt.trim()}
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </SignInButton>
          ) : (
            <button
              onClick={CreateNewProject}
              className={`p-2 sm:p-2.5 rounded-full transition-colors ${prompt.trim() && !loading
                ? 'bg-black text-white hover:bg-zinc-800 cursor-pointer'
                : 'bg-zinc-300 text-zinc-500 cursor-not-allowed'
                }`}
              disabled={!prompt.trim() || loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowUp className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-3xl">
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
      className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-full hover:bg-zinc-50 transition-colors"
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
