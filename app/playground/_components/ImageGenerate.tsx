"use client"
import React, { useState } from 'react'
import { Sparkles, Loader2, Upload, Wand2 } from 'lucide-react'
import { ImageKitAuthResponse, ImageKitUploadResponse } from '@/types/imagekit.types'
import ImageTransform from './ImageTransform'

interface ImageGenerateProps {
    onGenerateComplete?: (imageUrl: string) => void;
}

const ImageGenerate: React.FC<ImageGenerateProps> = ({ onGenerateComplete }) => {
    const [prompt, setPrompt] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [showTransform, setShowTransform] = useState(false)

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt')
            return
        }

        setIsGenerating(true)
        setError(null)
        setGeneratedImageUrl(null)
        setUploadedImageUrl(null)
        setShowTransform(false)

        try {
            // Note: Using a placeholder API here. You can integrate with:
            // - OpenAI DALL-E
            // - Stability AI
            // - Midjourney API
            // - Or any other image generation service

            // For now, we'll use a placeholder that simulates image generation
            // In production, replace this with actual API call

            // Simulated API call
            await new Promise(resolve => setTimeout(resolve, 2000))

            // For demo purposes, using a placeholder image
            // Replace this with actual generated image from your AI service
            const demoImageUrl = `https://picsum.photos/seed/${Date.now()}/800/600`
            setGeneratedImageUrl(demoImageUrl)

            // Upload to ImageKit
            await uploadToImageKit(demoImageUrl, prompt)

        } catch (err) {
            console.error('Generation error:', err)
            setError(err instanceof Error ? err.message : 'Failed to generate image')
            setIsGenerating(false)
        }
    }

    const uploadToImageKit = async (imageUrl: string, fileName: string) => {
        setIsUploading(true)

        try {
            // Get authentication parameters
            const authResponse = await fetch('/api/imagekit-auth')
            const authData: ImageKitAuthResponse = await authResponse.json()

            if (!authResponse.ok) {
                throw new Error(authData.error || 'Failed to get authentication parameters')
            }

            // Fetch the generated image as blob
            const imageResponse = await fetch(imageUrl)
            const imageBlob = await imageResponse.blob()

            // Create file from blob
            const file = new File([imageBlob], `${fileName.slice(0, 30)}.png`, { type: 'image/png' })

            // Prepare form data
            const formData = new FormData()
            formData.append('file', file)
            formData.append('fileName', `ai-generated-${Date.now()}.png`)
            formData.append('publicKey', process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '')
            formData.append('signature', authData.signature)
            formData.append('expire', authData.expire.toString())
            formData.append('token', authData.token)

            // Upload to ImageKit
            const uploadEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
                ? `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/api/v1/files/upload`
                : 'https://upload.imagekit.io/api/v1/files/upload'

            const uploadResponse = await fetch(uploadEndpoint, {
                method: 'POST',
                body: formData
            })

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload to ImageKit')
            }

            const uploadData: ImageKitUploadResponse = await uploadResponse.json()
            setUploadedImageUrl(uploadData.url)

            if (onGenerateComplete) {
                onGenerateComplete(uploadData.url)
            }

        } catch (err) {
            console.error('Upload error:', err)
            setError(err instanceof Error ? err.message : 'Failed to upload generated image')
        } finally {
            setIsGenerating(false)
            setIsUploading(false)
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            {/* Generation Input */}
            <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    AI Image Generation
                </h3>

                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">
                        Describe the image you want to generate
                    </label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="E.g., A futuristic city skyline at sunset with flying cars..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        rows={4}
                        disabled={isGenerating || isUploading}
                    />
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || isUploading || !prompt.trim()}
                    className={`
                        w-full px-6 py-3 rounded-lg font-medium transition-all
                        flex items-center justify-center gap-2
                        ${!isGenerating && !isUploading && prompt.trim()
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }
                    `}
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Generating Image...
                        </>
                    ) : isUploading ? (
                        <>
                            <Upload className="w-5 h-5 animate-pulse" />
                            Uploading to ImageKit...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            Generate Image
                        </>
                    )}
                </button>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}
            </div>

            {/* Generated Image Preview */}
            {generatedImageUrl && (
                <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-gray-900">Generated Image</h4>
                        {uploadedImageUrl && (
                            <div className="flex items-center gap-2 text-sm text-green-600">
                                <Upload className="w-4 h-4" />
                                Uploaded to ImageKit
                            </div>
                        )}
                    </div>

                    <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                        <img
                            src={uploadedImageUrl || generatedImageUrl}
                            alt="Generated"
                            className="w-full h-auto max-h-96 object-contain"
                        />
                    </div>

                    {uploadedImageUrl && (
                        <div className="space-y-3">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">ImageKit URL:</p>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={uploadedImageUrl}
                                        readOnly
                                        className="flex-1 text-sm bg-white border border-gray-300 rounded px-3 py-2 font-mono"
                                    />
                                    <button
                                        onClick={() => navigator.clipboard.writeText(uploadedImageUrl)}
                                        className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowTransform(!showTransform)}
                                className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2"
                            >
                                <Wand2 className="w-4 h-4" />
                                {showTransform ? 'Hide' : 'Show'} AI Transformations
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Transformation Panel */}
            {showTransform && uploadedImageUrl && (
                <ImageTransform imageUrl={uploadedImageUrl} />
            )}
        </div>
    )
}

export default ImageGenerate
