"use client"
import React from 'react'

const ImageKitDebug = () => {
    const checkEnvVars = () => {
        const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
        const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT

        console.log('=== ImageKit Environment Check ===')
        console.log('NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY:', publicKey ? `✅ Set (${publicKey.substring(0, 10)}...)` : '❌ Missing')
        console.log('NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT:', urlEndpoint ? `✅ Set (${urlEndpoint})` : '❌ Missing')
        console.log('================================')

        return {
            publicKey: !!publicKey,
            urlEndpoint: !!urlEndpoint,
            publicKeyValue: publicKey,
            urlEndpointValue: urlEndpoint
        }
    }

    const env = checkEnvVars()

    return (
        <div className="p-4 bg-gray-100 rounded-lg space-y-2 text-sm font-mono">
            <h4 className="font-bold text-gray-900">ImageKit Configuration Check</h4>

            <div className="space-y-1">
                <div className={`flex items-center gap-2 ${env.publicKey ? 'text-green-600' : 'text-red-600'}`}>
                    <span>{env.publicKey ? '✅' : '❌'}</span>
                    <span>NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY</span>
                </div>
                {env.publicKeyValue && (
                    <div className="ml-6 text-xs text-gray-600">
                        {env.publicKeyValue.substring(0, 20)}...
                    </div>
                )}

                <div className={`flex items-center gap-2 ${env.urlEndpoint ? 'text-green-600' : 'text-red-600'}`}>
                    <span>{env.urlEndpoint ? '✅' : '❌'}</span>
                    <span>NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT</span>
                </div>
                {env.urlEndpointValue && (
                    <div className="ml-6 text-xs text-gray-600">
                        {env.urlEndpointValue}
                    </div>
                )}
            </div>

            {(!env.publicKey || !env.urlEndpoint) && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                    <p className="font-bold">⚠️ Missing Environment Variables</p>
                    <p className="mt-1">Add these to your .env file and restart the dev server:</p>
                    <pre className="mt-2 bg-white p-2 rounded overflow-x-auto">
                        {`NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_public_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id`}
                    </pre>
                </div>
            )}
        </div>
    )
}

export default ImageKitDebug
