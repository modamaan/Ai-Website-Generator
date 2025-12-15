"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { SignInButton, SignOutButton, useUser, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn } = useUser();

  return (
    <nav className="w-full px-4 sm:px-6 lg:px-8 py-5 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-zinc-100">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center flex-shrink-0 group">
          <div className="relative">
            <Image 
              src="/web-development.png" 
              alt="Logo" 
              width={48} 
              height={48} 
              className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" 
            />
          </div>
        </Link>

        {/* Center: Links - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-10 absolute left-1/2 transform -translate-x-1/2">
          <a href="#pricing" className="text-sm font-medium text-zinc-700 hover:text-purple-600 transition-all duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-purple-600 after:transition-all after:duration-300 hover:after:w-full">
            Pricing
          </a>
          <a href="#contact" className="text-sm font-medium text-zinc-700 hover:text-purple-600 transition-all duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-purple-600 after:transition-all after:duration-300 hover:after:w-full">
            Contact us
          </a>
        </div>

        {/* Right: CTA Button - Hidden on mobile, show hamburger instead */}
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <Link
                href="/workspace"
                className="hidden md:block px-6 py-2.5 text-sm font-medium border-2 border-zinc-300 rounded-full hover:bg-zinc-50 hover:border-zinc-400 transition-all duration-200 text-zinc-800"
              >
                Projects
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
              <SignOutButton>
                <button className="hidden md:block px-6 py-2.5 text-sm font-medium border-2 border-zinc-300 rounded-full hover:bg-zinc-50 hover:border-zinc-400 transition-all duration-200 text-zinc-800">
                  Logout
                </button>
              </SignOutButton>
            </>
          ) : (
            <SignInButton mode="modal" forceRedirectUrl={"/workspace"}>
              <button className="hidden md:block px-6 py-2.5 text-sm font-semibold gradient-primary text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300">
                Get Started
              </button>
            </SignInButton>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-zinc-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-6 pb-6 flex flex-col gap-4 border-t border-zinc-100 pt-6">
          <a href="#pricing" className="text-sm font-medium text-zinc-700 hover:text-purple-600 transition-colors py-2.5 px-3 rounded-lg hover:bg-purple-50">
            Pricing
          </a>
          <a href="#contact" className="text-sm font-medium text-zinc-700 hover:text-purple-600 transition-colors py-2.5 px-3 rounded-lg hover:bg-purple-50">
            Contact us
          </a>
          {isSignedIn ? (
            <>
              <Link
                href="/workspace"
                className="px-5 py-3 text-sm font-medium border-2 border-zinc-300 rounded-full hover:bg-zinc-50 transition-all w-full text-zinc-800 text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Projects
              </Link>
              <div className="flex items-center justify-center py-2">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10"
                    }
                  }}
                />
              </div>
              <SignOutButton>
                <button className="px-5 py-3 text-sm font-medium border-2 border-zinc-300 rounded-full hover:bg-zinc-50 transition-all w-full text-zinc-800">
                  Logout
                </button>
              </SignOutButton>
            </>
          ) : (
            <SignInButton mode="modal" forceRedirectUrl={"/workspace"}>
              <button className="px-5 py-3 text-sm font-semibold gradient-primary text-white rounded-full hover:shadow-lg transition-all w-full">
                Get Started
              </button>
            </SignInButton>
          )}
        </div>
      )}
    </nav>
  );
}
