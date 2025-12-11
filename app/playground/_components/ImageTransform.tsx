"use client"
import React, { useState, useEffect } from 'react'
import { Wand2, Copy, Check, Loader2, Crop, Maximize2, Eraser } from 'lucide-react'
import { TransformationOptions, TransformedImageResponse } from '@/types/imagekit.types'

interface ImageTransformProps {
    imageUrl: string;
    onTransformComplete?: (transformedUrl: string) => void;
}

const ImageTransform: React.FC<ImageTransformProps> = ({ imageUrl, onTransformComplete }) => {
    const [transformations, setTransformations] = useState<TransformationOptions>({
        smartCrop: false,
        width: undefined,
        height: undefined,
        removeBackground: false
    })
    const [transformedUrl, setTransformedUrl] = useState<string>('')
    const [isTransforming, setIsTransforming] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleTransform = async () => {
        setIsTransforming(true)
        setError(null)

        try {
            const response = await fetch('/api/imagekit-transform', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    imageUrl,
                    transformations
                })
            })

            if (!response.ok) {
                throw new Error('Failed to transform image')
            }

            const data: TransformedImageResponse = await response.json()
            setTransformedUrl(data.transformedUrl)

            if (onTransformComplete) {
                onTransformComplete(data.transformedUrl)
            }
        } catch (err) {
            console.error('Transformation error:', err)
            setError(err instanceof Error ? err.message : 'Failed to transform image')
        } finally {
            setIsTransforming(false)
        }
    }

    const handleCopyUrl = () => {
        const urlToCopy = transformedUrl || imageUrl
        navigator.clipboard.writeText(urlToCopy)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const hasTransformations = transformations.smartCrop ||
        transformations.width ||
        transformations.height ||
        transformations.removeBackground

    return (
        <div className="w-full space-y-6">
            {/* Transformation Controls */}
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-blue-500" />
                    AI Image Transformations
                </h3>

                {/* Smart Crop */}
                <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={transformations.smartCrop}
                            onChange={(e) => setTransformations(prev => ({
                                ...prev,
                                smartCrop: e.target.checked
                            }))}
                            className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex items-center gap-2">
                            <Crop className="w-4 h-4 text-gray-600 group-hover:text-blue-500 transition-colors" />
                            <span className="font-medium text-gray-700 group-hover:text-gray-900">Smart Crop</span>
                        </div>
                    </label>
                    <p className="text-sm text-gray-500 ml-8">
                        Automatically detect and crop to the most important part of the image
                    </p>
                </div>

                {/* Scale */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Maximize2 className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-700">Scale</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-600">Width (px)</label>
                            <input
                                type="number"
                                value={transformations.width || ''}
                                onChange={(e) => setTransformations(prev => ({
                                    ...prev,
                                    width: e.target.value ? parseInt(e.target.value) : undefined
                                }))}
                                placeholder="Auto"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                min="1"
                                max="4000"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-600">Height (px)</label>
                            <input
                                type="number"
                                value={transformations.height || ''}
                                onChange={(e) => setTransformations(prev => ({
                                    ...prev,
                                    height: e.target.value ? parseInt(e.target.value) : undefined
                                }))}
                                placeholder="Auto"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                min="1"
                                max="4000"
                            />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 ml-6">
                        Leave empty for auto-scaling while maintaining aspect ratio
                    </p>
                </div>

                {/* Background Removal */}
                <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={transformations.removeBackground}
                            onChange={(e) => setTransformations(prev => ({
                                ...prev,
                                removeBackground: e.target.checked
                            }))}
                            className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex items-center gap-2">
                            <Eraser className="w-4 h-4 text-gray-600 group-hover:text-blue-500 transition-colors" />
                            <span className="font-medium text-gray-700 group-hover:text-gray-900">Remove Background</span>
                        </div>
                    </label>
                    <p className="text-sm text-gray-500 ml-8">
                        AI-powered background removal for clean product images
                    </p>
                </div>

                {/* Transform Button */}
                <button
                    onClick={handleTransform}
                    disabled={!hasTransformations || isTransforming}
                    className={`
                        w-full px-6 py-3 rounded-lg font-medium transition-all
                        flex items-center justify-center gap-2
                        ${hasTransformations && !isTransforming
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }
                    `}
                >
                    {isTransforming ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Transforming...
                        </>
                    ) : (
                        <>
                            <Wand2 className="w-5 h-5" />
                            Apply Transformations
                        </>
                    )}
                </button>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}
            </div>

            {/* Image Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Original Image */}
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Original</h4>
                    <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                        <img
                            src={imageUrl}
                            alt="Original"
                            className="w-full h-64 object-contain"
                        />
                    </div>
                </div>

                {/* Transformed Image */}
                {transformedUrl && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Transformed</h4>
                        <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                            <img
                                src={transformedUrl}
                                alt="Transformed"
                                className="w-full h-64 object-contain"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* URL Display */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">
                        {transformedUrl ? 'Transformed URL' : 'Original URL'}
                    </p>
                    <button
                        onClick={handleCopyUrl}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4" />
                                Copy URL
                            </>
                        )}
                    </button>
                </div>
                <input
                    type="text"
                    value={transformedUrl || imageUrl}
                    readOnly
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm font-mono"
                />
            </div>
        </div>
    )
}

export default ImageTransform
