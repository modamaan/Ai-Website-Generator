"use client"
import React, { useState, useRef } from 'react'
import { Upload, X, Check, Loader2, Image as ImageIcon } from 'lucide-react'
import { ImageKitAuthResponse, ImageKitUploadResponse } from '@/types/imagekit.types'

interface ImageUploadProps {
    onUploadComplete: (imageUrl: string, fileId: string) => void;
    onClose?: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadComplete, onClose }) => {
    const [isDragging, setIsDragging] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadedImage, setUploadedImage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const files = e.dataTransfer.files
        if (files.length > 0) {
            handleFileUpload(files[0])
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            handleFileUpload(files[0])
        }
    }

    const handleFileUpload = async (file: File) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file')
            return
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            setError('File size must be less than 10MB')
            return
        }

        setError(null)
        setUploading(true)
        setUploadProgress(0)

        try {
            // Prepare form data for server-side upload
            const formData = new FormData()
            formData.append('file', file)
            formData.append('fileName', file.name)

            // Upload through our Next.js API (bypasses CORS)
            const xhr = new XMLHttpRequest()

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const progress = Math.round((e.loaded / e.total) * 100)
                    setUploadProgress(progress)
                }
            })

            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    try {
                        const response: ImageKitUploadResponse = JSON.parse(xhr.responseText)
                        setUploadedImage(response.url)
                        setUploading(false)
                        onUploadComplete(response.url, response.fileId)
                    } catch (parseError) {
                        console.error('Failed to parse response:', xhr.responseText)
                        setError('Failed to parse upload response')
                        setUploading(false)
                    }
                } else {
                    console.error('Upload failed with status:', xhr.status, xhr.responseText)
                    let errorMessage = 'Upload failed'
                    try {
                        const errorData = JSON.parse(xhr.responseText)
                        errorMessage = errorData.error || errorMessage
                    } catch (e) {
                        errorMessage = xhr.responseText || errorMessage
                    }
                    setError(`Upload failed: ${errorMessage}`)
                    setUploading(false)
                }
            })

            xhr.addEventListener('error', (e) => {
                console.error('XHR error:', e)
                setError('Network error during upload. Please check your internet connection.')
                setUploading(false)
            })

            console.log('📤 Starting server-side upload')
            console.log('📝 File name:', file.name)
            console.log('📊 File size:', (file.size / 1024 / 1024).toFixed(2), 'MB')

            xhr.open('POST', '/api/imagekit-upload')
            xhr.send(formData)

        } catch (err) {
            console.error('Upload error:', err)
            setError(err instanceof Error ? err.message : 'Failed to upload image')
            setUploading(false)
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Upload Image
                </h3>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                )}
            </div>

            {/* Upload Area */}
            {!uploadedImage && (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                        border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
                        transition-all duration-200
                        ${isDragging
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                        }
                        ${uploading ? 'pointer-events-none opacity-50' : ''}
                    `}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    {uploading ? (
                        <div className="space-y-4">
                            <Loader2 className="w-12 h-12 mx-auto text-blue-500 animate-spin" />
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Upload className="w-12 h-12 mx-auto text-gray-400" />
                            <div>
                                <p className="text-base font-medium text-gray-700">
                                    Drop your image here or click to browse
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Supports: JPG, PNG, GIF, WebP (Max 10MB)
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Uploaded Image Preview */}
            {uploadedImage && (
                <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden border border-gray-200">
                        <img
                            src={uploadedImage}
                            alt="Uploaded"
                            className="w-full h-auto max-h-96 object-contain bg-gray-50"
                        />
                        <div className="absolute top-2 right-2 bg-green-500 text-white p-2 rounded-full">
                            <Check className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Image URL:</p>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={uploadedImage}
                                readOnly
                                className="flex-1 text-sm bg-white border border-gray-300 rounded px-3 py-2"
                            />
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(uploadedImage)
                                }}
                                className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                            >
                                Copy
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setUploadedImage(null)
                            setUploadProgress(0)
                        }}
                        className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                    >
                        Upload Another Image
                    </button>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}
        </div>
    )
}

export default ImageUpload
