import { NextRequest, NextResponse } from 'next/server';
import ImageKit from 'imagekit';

export async function POST(req: NextRequest) {
    try {
        // Check if environment variables are set
        if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
            return NextResponse.json(
                { error: 'ImageKit credentials not configured' },
                { status: 500 }
            );
        }

        // Initialize ImageKit
        const imagekit = new ImageKit({
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
        });

        // Get form data
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const fileName = formData.get('fileName') as string || file.name;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to ImageKit
        const uploadResponse = await imagekit.upload({
            file: buffer,
            fileName: fileName,
            useUniqueFileName: true,
        });

        return NextResponse.json({
            fileId: uploadResponse.fileId,
            name: uploadResponse.name,
            url: uploadResponse.url,
            thumbnailUrl: uploadResponse.thumbnailUrl,
            height: uploadResponse.height,
            width: uploadResponse.width,
            size: uploadResponse.size,
            filePath: uploadResponse.filePath,
            fileType: uploadResponse.fileType
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to upload image' },
            { status: 500 }
        );
    }
}

// Force dynamic rendering for file uploads
export const dynamic = 'force-dynamic';
