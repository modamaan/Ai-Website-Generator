import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { Sparkles, Zap, Shield, Layers } from 'lucide-react'

export default function Page() {
    return (
        <div className="min-h-screen flex">
            {/* Left Side - Branding & Features */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-12 flex-col justify-between relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                {/* Logo */}
                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3 text-white group">
                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-all">
                            <Layers className="w-8 h-8" />
                        </div>
                        <span className="text-2xl font-bold">AI Web Generator</span>
                    </Link>
                </div>

                {/* Features */}
                <div className="relative z-10 space-y-8">
                    <div>
                        <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
                            Design websites with the power of AI
                        </h1>
                        <p className="text-xl text-white/90">
                            Transform your ideas into beautiful, functional websites in seconds.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <FeatureItem
                            icon={<Sparkles className="w-5 h-5" />}
                            title="AI-Powered Design"
                            description="Generate stunning layouts with natural language"
                        />
                        <FeatureItem
                            icon={<Zap className="w-5 h-5" />}
                            title="Lightning Fast"
                            description="From concept to code in seconds"
                        />
                        <FeatureItem
                            icon={<Shield className="w-5 h-5" />}
                            title="Production Ready"
                            description="Export clean, optimized code instantly"
                        />
                    </div>
                </div>

                {/* Testimonial */}
                <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <p className="text-white/90 italic mb-3">
                        "This tool has revolutionized how we build landing pages. What used to take days now takes minutes."
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full"></div>
                        <div>
                            <p className="text-white font-semibold">Sarah Chen</p>
                            <p className="text-white/70 text-sm">Product Designer at TechCorp</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Sign In Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-8 text-center">
                        <Link href="/" className="inline-flex items-center gap-2 text-gray-900 group">
                            <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl">
                                <Layers className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold">AI Web Generator</span>
                        </Link>
                    </div>

                    {/* Welcome Text */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome back
                        </h2>
                        <p className="text-gray-600">
                            Sign in to continue creating amazing websites
                        </p>
                    </div>

                    {/* Clerk SignIn Component */}
                    <div className="flex justify-center">
                        <SignIn
                            appearance={{
                                elements: {
                                    rootBox: "w-full",
                                    card: "shadow-xl border-0 rounded-2xl",
                                    headerTitle: "hidden",
                                    headerSubtitle: "hidden",
                                    socialButtonsBlockButton: "border-gray-200 hover:bg-gray-50 transition-all",
                                    formButtonPrimary: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all",
                                    footerActionLink: "text-indigo-600 hover:text-indigo-700",
                                    formFieldInput: "rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500",
                                    identityPreviewEditButton: "text-indigo-600 hover:text-indigo-700"
                                }
                            }}
                        />
                    </div>

                    {/* Additional Links */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link href="/sign-up" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
                                Sign up for free
                            </Link>
                        </p>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center mb-4">Trusted by designers worldwide</p>
                        <div className="flex items-center justify-center gap-8 opacity-40">
                            <div className="text-2xl font-bold text-gray-400">ACME</div>
                            <div className="text-2xl font-bold text-gray-400">TECH</div>
                            <div className="text-2xl font-bold text-gray-400">DESIGN</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="flex items-start gap-4 text-white">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg flex-shrink-0">
                {icon}
            </div>
            <div>
                <h3 className="font-semibold mb-1">{title}</h3>
                <p className="text-white/80 text-sm">{description}</p>
            </div>
        </div>
    )
}