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
    <nav className="w-full px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center flex-shrink-0">
          <Image src="/web-development.png" alt="Logo" width={48} height={48} className="w-8 h-8" />
        </div>

        {/* Center: Links - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
          <a href="#pricing" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
            Pricing
          </a>
          <a href="#contact" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
            Contact us
          </a>
        </div>

        {/* Right: CTA Button - Hidden on mobile, show hamburger instead */}
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <Link
                href="/workspace"
                className="hidden md:block px-5 py-2 text-sm border border-gray-500 rounded-full hover:bg-gray-50 transition-colors text-gray-800"
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
                <button className="hidden md:block px-5 py-2 text-sm border border-gray-500 rounded-full hover:bg-gray-50 transition-colors text-gray-800">
                  Logout
                </button>
              </SignOutButton>
            </>
          ) : (
            <SignInButton mode="modal" forceRedirectUrl={"/workspace"}>
              <button className="hidden md:block px-5 py-2 text-sm border border-gray-500 rounded-full hover:bg-gray-50 transition-colors text-gray-800">
                Get Started
              </button>
            </SignInButton>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-gray-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 flex flex-col gap-4">
          <a href="#pricing" className="text-sm text-gray-700 hover:text-gray-900 transition-colors py-2">
            Pricing
          </a>
          <a href="#contact" className="text-sm text-gray-700 hover:text-gray-900 transition-colors py-2">
            Contact us
          </a>
          {isSignedIn ? (
            <>
              <Link
                href="/workspace"
                className="px-5 py-2 text-sm border border-gray-500 rounded-full hover:bg-gray-50 transition-colors w-full text-gray-800 text-center"
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
                <button className="px-5 py-2 text-sm border border-gray-500 rounded-full hover:bg-gray-50 transition-colors w-full text-gray-800">
                  Logout
                </button>
              </SignOutButton>
            </>
          ) : (
            <SignInButton mode="modal" forceRedirectUrl={"/workspace"}>
              <button className="px-5 py-2 text-sm border border-gray-500 rounded-full hover:bg-gray-50 transition-colors w-full text-gray-800">
                Get Started
              </button>
            </SignInButton>
          )}
        </div>
      )}
    </nav>
  );
}
