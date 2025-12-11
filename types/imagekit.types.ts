export interface ImageKitAuthResponse {
    token: string;
    expire: number;
    signature: string;
    error?: string;
}

export interface ImageKitUploadResponse {
    fileId: string;
    name: string;
    url: string;
    thumbnailUrl: string;
    height: number;
    width: number;
    size: number;
    filePath: string;
    fileType: string;
}

export interface TransformationOptions {
    smartCrop?: boolean;
    width?: number;
    height?: number;
    removeBackground?: boolean;
}

export interface TransformedImageResponse {
    originalUrl: string;
    transformedUrl: string;
    transformations: TransformationOptions;
}
