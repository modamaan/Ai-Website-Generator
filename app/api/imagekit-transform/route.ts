import { NextRequest, NextResponse } from 'next/server';
import ImageKit from 'imagekit';
import { TransformationOptions, TransformedImageResponse } from '@/types/imagekit.types';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { imageUrl, transformations } = body as {
            imageUrl: string;
            transformations: TransformationOptions;
        };

        if (!imageUrl) {
            return NextResponse.json(
                { error: 'Image URL is required' },
                { status: 400 }
            );
        }

        // Check if environment variables are set
        if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
            return NextResponse.json(
                { error: 'ImageKit credentials not configured. Please add IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT to your .env file.' },
                { status: 500 }
            );
        }

        // Initialize ImageKit instance only when credentials are available
        const imagekit = new ImageKit({
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
        });

        // Build transformation array for ImageKit
        const transformationArray: any[] = [];

        if (transformations.smartCrop) {
            transformationArray.push({
                focus: 'auto'
            });
        }

        if (transformations.width || transformations.height) {
            transformationArray.push({
                width: transformations.width?.toString(),
                height: transformations.height?.toString()
            });
        }

        if (transformations.removeBackground) {
            transformationArray.push({
                bg: 'remove'
            });
        }

        // Generate transformed URL using ImageKit URL generation
        const transformedUrl = imagekit.url({
            src: imageUrl,
            transformation: transformationArray
        });

        const response: TransformedImageResponse = {
            originalUrl: imageUrl,
            transformedUrl,
            transformations
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error transforming image:', error);
        return NextResponse.json(
            { error: 'Failed to transform image' },
            { status: 500 }
        );
    }
}
