import React, { useEffect, useRef, useState } from 'react'
import { Monitor, Tablet, Smartphone } from 'lucide-react'

type Props = {
  generatedCode?: string
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile'

const WebsiteDesign = ({ generatedCode }: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop')

  useEffect(() => {
    if (iframeRef.current && generatedCode) {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document
      if (iframeDoc) {
        iframeDoc.open()
        iframeDoc.write(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Generated Website</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <link href="https://cdn.jsdelivr.net/npm/flowbite@2.5.1/dist/flowbite.min.css" rel="stylesheet" />
            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
            <script src="https://unpkg.com/@popperjs/core@2"></script>
            <script src="https://unpkg.com/tippy.js@6"></script>
          </head>
          <body>
            ${generatedCode}
            <script src="https://cdn.jsdelivr.net/npm/flowbite@2.5.1/dist/flowbite.min.js"></script>
          </body>
          </html>
        `)
        iframeDoc.close()
      }
    }
  }, [generatedCode])

  const getIframeWidth = () => {
    switch (deviceMode) {
      case 'mobile':
        return 'max-w-[375px]'
      case 'tablet':
        return 'max-w-[768px]'
      default:
        return 'w-full'
    }
  }

  return (
    <div className='flex-1 flex flex-col bg-white border-l border-slate-200 h-[calc(100vh-73px)] lg:h-[91vh]'>
      {/* Device Mode Selector - Hidden on mobile, shown on desktop */}
      {generatedCode && (
        <div className='hidden md:flex items-center gap-2 p-3 border-b border-slate-200 bg-slate-50'>
          <span className='text-xs font-medium text-slate-600 mr-2'>Preview:</span>
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${deviceMode === 'desktop'
                ? 'bg-purple-500 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
          >
            <Monitor className='w-3.5 h-3.5' />
            Desktop
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${deviceMode === 'tablet'
                ? 'bg-purple-500 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
          >
            <Tablet className='w-3.5 h-3.5' />
            Tablet
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${deviceMode === 'mobile'
                ? 'bg-purple-500 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
          >
            <Smartphone className='w-3.5 h-3.5' />
            Mobile
          </button>
        </div>
      )}

      {/* Preview Area */}
      <div className='flex-1 overflow-auto bg-slate-100 p-2 md:p-4'>
        {generatedCode ? (
          <div className={`mx-auto h-full ${getIframeWidth()} transition-all duration-300`}>
            <iframe
              ref={iframeRef}
              className='w-full h-full border-0 bg-white shadow-lg rounded-lg'
              title='Website Preview'
              sandbox='allow-scripts allow-same-origin allow-forms'
            />
          </div>
        ) : (
          <div className='flex items-center justify-center h-full'>
            <div className='text-center px-4'>
              <div className='w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center'>
                <svg className='w-6 h-6 md:w-8 md:h-8 text-purple-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' />
                </svg>
              </div>
              <h3 className='text-base md:text-lg font-semibold text-slate-800 mb-2'>No Website Generated Yet</h3>
              <p className='text-xs md:text-sm text-slate-500 max-w-sm'>
                Start by describing what you want to build in the chat, and your website will appear here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WebsiteDesign