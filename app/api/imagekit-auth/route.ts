import { NextRequest, NextResponse } from 'next/server';
import ImageKit from 'imagekit';

export async function GET(req: NextRequest) {
    try {
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

        // Generate authentication parameters for client-side upload
        const authenticationParameters = imagekit.getAuthenticationParameters();

        return NextResponse.json(authenticationParameters);
    } catch (error) {
        console.error('Error generating ImageKit auth parameters:', error);
        return NextResponse.json(
            { error: 'Failed to generate authentication parameters' },
            { status: 500 }
        );
    }
}
