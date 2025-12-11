"use client";

import React, { useRef, useState, useEffect } from "react";
import { Image as ImageIcon, Crop, Expand, Image as ImageUpscale, ImageMinus, Upload, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
    selectedEl: HTMLImageElement | null;
    onUpdateStyle: (property: string, value: string) => void;
    onUpdateAttribute: (attribute: string, value: string) => void;
};

const transformOptions = [
    { label: "Smart Crop", value: "smartcrop", icon: <Crop /> },
    { label: "Resize", value: "resize", icon: <Expand /> },
    { label: "Upscale", value: "upscale", icon: <ImageUpscale /> },
    { label: "BG Remove", value: "bgremove", icon: <ImageMinus /> },
];

function ImageSettingSection({ selectedEl, onUpdateStyle, onUpdateAttribute }: Props) {
    const [altText, setAltText] = useState("");
    const [width, setWidth] = useState<number>(300);
    const [height, setHeight] = useState<number>(200);
    const [borderRadius, setBorderRadius] = useState<string>("0px");
    const [preview, setPreview] = useState("");
    const [activeTransforms, setActiveTransforms] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isTransforming, setIsTransforming] = useState(false);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
    const [imagePrompt, setImagePrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Update state when selectedEl changes
    useEffect(() => {
        if (selectedEl) {
            setAltText(selectedEl.alt || "");
            setWidth(selectedEl.width || 300);
            setHeight(selectedEl.height || 200);
            setBorderRadius(selectedEl.style?.borderRadius || "0px");
            setPreview(selectedEl.src || "");
            setUploadedImageUrl(selectedEl.src || "");
        }
    }, [selectedEl]);

    // Toggle Transform Buttons and apply in real-time
    const toggleTransform = (value: string) => {
        setActiveTransforms((prev) => {
            const newTransforms = prev.includes(value)
                ? prev.filter((t) => t !== value)
                : [...prev, value];
            return newTransforms;
        });
    };

    // Apply transformations in real-time whenever activeTransforms changes
    useEffect(() => {
        if (!uploadedImageUrl || !uploadedImageUrl.includes('ik.imagekit.io')) {
            return; // Only apply to ImageKit URLs
        }

        // Build transformations array
        const transformations: string[] = [];

        if (activeTransforms.includes('resize')) {
            transformations.push(`w-${width},h-${height}`);
        }

        if (activeTransforms.includes('smartcrop')) {
            transformations.push('fo-auto');
        }

        if (activeTransforms.includes('upscale')) {
            transformations.push('q-100,dpr-2');
        }

        if (activeTransforms.includes('bgremove')) {
            transformations.push('e-background_removal');
        }

        // Build transformed URL
        let transformedUrl = uploadedImageUrl;

        if (transformations.length > 0) {
            // Remove any existing transformations
            const urlWithoutTransform = uploadedImageUrl.replace(/\/tr:[^\/]+\//g, '/');

            // ImageKit URL format: https://ik.imagekit.io/your_id/tr:transformations/image.jpg
            const urlParts = urlWithoutTransform.split('/');
            const imageKitIndex = urlParts.findIndex(part => part.includes('ik.imagekit.io'));

            if (imageKitIndex !== -1) {
                // Insert transformations after imagekit.io/your_id
                urlParts.splice(imageKitIndex + 2, 0, `tr:${transformations.join(',')}`);
                transformedUrl = urlParts.join('/');
            }
        } else {
            // No transformations, use original URL
            transformedUrl = uploadedImageUrl.replace(/\/tr:[^\/]+\//g, '/');
        }

        // Update preview and iframe image in real-time
        setPreview(transformedUrl);
        onUpdateAttribute('src', transformedUrl);

        console.log('🔄 Real-time transformation applied:', transformedUrl);
        if (transformations.length > 0) {
            console.log('📋 Active transformations:', transformations.join(','));
        }
    }, [activeTransforms, width, height, uploadedImageUrl]); // Re-run when any of these change

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);

        try {
            // Upload to ImageKit via our API route
            const formData = new FormData();
            formData.append('file', file);
            formData.append('fileName', file.name);

            const response = await fetch('/api/imagekit-upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();

            // Update preview with uploaded image URL
            setPreview(data.url);
            setUploadedImageUrl(data.url);

            // Update the actual image in the iframe
            onUpdateAttribute('src', data.url);

            console.log('✅ Image uploaded successfully:', data);
        } catch (error) {
            console.error('❌ Upload error:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const applyTransformations = async () => {
        if (!uploadedImageUrl || activeTransforms.length === 0) {
            alert('Please upload an image and select at least one transformation.');
            return;
        }

        setIsTransforming(true);

        try {
            // Build ImageKit transformation URL
            const transformations: string[] = [];

            // Add transformations based on active selections
            if (activeTransforms.includes('resize')) {
                transformations.push(`w-${width},h-${height}`);
            }

            if (activeTransforms.includes('smartcrop')) {
                transformations.push('fo-auto');
            }

            if (activeTransforms.includes('upscale')) {
                transformations.push('q-100,dpr-2');
            }

            if (activeTransforms.includes('bgremove')) {
                transformations.push('bg-transparent');
            }

            // Apply transformations to ImageKit URL
            let transformedUrl = uploadedImageUrl;

            if (transformations.length > 0) {
                // Check if URL is from ImageKit
                if (!uploadedImageUrl.includes('ik.imagekit.io')) {
                    console.warn('⚠️ Transformations only work with ImageKit URLs');
                    alert('AI Transformations only work with images uploaded to ImageKit. Please upload the image first.');
                    setIsTransforming(false);
                    return;
                }

                // Remove any existing transformations
                const urlWithoutTransform = uploadedImageUrl.replace(/\/tr:[^\/]+\//g, '/');

                // ImageKit URL format: https://ik.imagekit.io/your_id/tr:transformations/image.jpg
                const urlParts = urlWithoutTransform.split('/');
                const imageKitIndex = urlParts.findIndex(part => part.includes('ik.imagekit.io'));

                if (imageKitIndex !== -1) {
                    // Insert transformations after imagekit.io/your_id
                    urlParts.splice(imageKitIndex + 2, 0, `tr:${transformations.join(',')}`);
                    transformedUrl = urlParts.join('/');
                }
            }

            // Update preview and iframe image
            setPreview(transformedUrl);
            onUpdateAttribute('src', transformedUrl);

            console.log('✅ Transformations applied:', transformedUrl);
            console.log('📋 Transformation parameters:', transformations.join(','));
        } catch (error) {
            console.error('❌ Transformation error:', error);
            alert('Failed to apply transformations. Please try again.');
        } finally {
            setIsTransforming(false);
        }
    };

    const handleGenerateAIImage = async () => {
        if (!imagePrompt.trim()) {
            alert('Please enter a prompt for image generation.');
            return;
        }

        setIsGenerating(true);

        try {
            // Step 1: Generate image using AI
            // NOTE: Replace this with your actual AI image generation API
            // Options: OpenAI DALL-E, Stability AI, Midjourney, etc.

            // For demo, using a placeholder image service
            // In production, replace with actual AI generation API call
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

            const demoImageUrl = `https://picsum.photos/seed/${Date.now()}/800/600`;

            // Step 2: Upload generated image to ImageKit
            const imageResponse = await fetch(demoImageUrl);
            const imageBlob = await imageResponse.blob();

            const file = new File([imageBlob], `ai-generated-${Date.now()}.png`, { type: 'image/png' });

            const formData = new FormData();
            formData.append('file', file);
            formData.append('fileName', `ai-${imagePrompt.slice(0, 30)}-${Date.now()}.png`);

            const uploadResponse = await fetch('/api/imagekit-upload', {
                method: 'POST',
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error('Upload failed');
            }

            const data = await uploadResponse.json();

            // Step 3: Update preview and iframe image
            setPreview(data.url);
            setUploadedImageUrl(data.url);
            onUpdateAttribute('src', data.url);

            // Update alt text with the prompt
            setAltText(imagePrompt);
            onUpdateAttribute('alt', imagePrompt);

            console.log('✅ AI Image generated and uploaded:', data);
        } catch (error) {
            console.error('❌ AI Generation error:', error);
            alert('Failed to generate AI image. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    // Apply border radius changes
    useEffect(() => {
        if (selectedEl) {
            onUpdateStyle('borderRadius', borderRadius);
        }
    }, [borderRadius]);

    // Apply alt text changes
    useEffect(() => {
        if (selectedEl && altText !== selectedEl.alt) {
            onUpdateAttribute('alt', altText);
        }
    }, [altText]);

    const openFileDialog = () => fileInputRef.current?.click();

    if (!selectedEl) {
        return (
            <div className="w-80 bg-white border-l border-slate-200 p-6 flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-2">No Image Selected</h3>
                    <p className="text-xs text-slate-500">
                        Click on an image in the preview to edit it
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-80 bg-white border-l border-slate-200 overflow-y-auto h-full">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 sticky top-0 bg-white z-10">
                <h2 className="flex gap-2 items-center font-semibold text-slate-800">
                    <ImageIcon className="w-5 h-5" /> Image Settings
                </h2>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-mono mt-2 inline-block">
                    &lt;img&gt;
                </span>
            </div>

            <div className="p-4 space-y-4">
                {/* Preview */}
                <div className="flex justify-center">
                    {preview ? (
                        <img
                            src={preview}
                            alt="preview"
                            className="max-h-40 object-contain border rounded cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={openFileDialog}
                        />
                    ) : (
                        <div
                            className="max-h-40 w-40 h-40 border-2 border-dashed border-slate-300 rounded flex items-center justify-center cursor-pointer hover:border-slate-400 transition-colors"
                            onClick={openFileDialog}
                        >
                            <div className="text-center">
                                <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                <p className="text-xs text-slate-500">Click to upload</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Hidden File Input */}
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                />

                {/* Upload Button */}
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={openFileDialog}
                    disabled={isUploading}
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload New Image
                        </>
                    )}
                </Button>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-slate-500">Or</span>
                    </div>
                </div>

                {/* AI Image Generation */}
                <div className="space-y-3 p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <ImageUpscale className="w-4 h-4 text-purple-600" />
                        AI Image Generation
                    </label>
                    <Input
                        type="text"
                        value={imagePrompt}
                        onChange={(e) => setImagePrompt(e.target.value)}
                        placeholder="Describe the image you want to generate..."
                        className="bg-white"
                        disabled={isGenerating}
                    />
                    <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        onClick={handleGenerateAIImage}
                        disabled={isGenerating || !imagePrompt.trim()}
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <ImageUpscale className="w-4 h-4 mr-2" />
                                Generate AI Image
                            </>
                        )}
                    </Button>
                </div>

                {/* Transform Buttons */}
                <div>
                    <label className="text-sm mb-2 block font-medium text-slate-700">
                        AI Transform (Real-time)
                    </label>

                    <TooltipProvider>
                        <div className="flex gap-2 flex-wrap">
                            {transformOptions.map((opt) => {
                                const applied = activeTransforms.includes(opt.value);
                                return (
                                    <Tooltip key={opt.value}>
                                        <TooltipTrigger asChild>
                                            <Button
                                                type="button"
                                                variant={applied ? "default" : "outline"}
                                                onClick={() => toggleTransform(opt.value)}
                                                className="flex items-center justify-center p-2"
                                            >
                                                {opt.icon}
                                            </Button>
                                        </TooltipTrigger>

                                        <TooltipContent>
                                            {opt.label} {applied && "✓ Active"}
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            })}
                        </div>
                    </TooltipProvider>
                </div>

                {/* Conditional Resize */}
                {activeTransforms.includes("resize") && (
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="text-sm font-medium text-slate-700">Width</label>
                            <Input
                                type="number"
                                value={width}
                                onChange={(e) => setWidth(Number(e.target.value))}
                                className="mt-1"
                            />
                        </div>

                        <div className="flex-1">
                            <label className="text-sm font-medium text-slate-700">Height</label>
                            <Input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(Number(e.target.value))}
                                className="mt-1"
                            />
                        </div>
                    </div>
                )}

                {/* Real-time transformation info */}
                {activeTransforms.length > 0 && (
                    <div className="text-xs text-slate-500 bg-blue-50 border border-blue-200 rounded p-2">
                        ✨ Transformations applied in real-time
                    </div>
                )}

                {/* Border Radius */}
                <div>
                    <label className="text-sm font-medium text-slate-700">Border Radius</label>
                    <Input
                        type="text"
                        value={borderRadius}
                        onChange={(e) => setBorderRadius(e.target.value)}
                        placeholder="e.g. 8px or 50%"
                        className="mt-1"
                    />
                </div>
            </div>
        </div>
    );
}

export default ImageSettingSection;
