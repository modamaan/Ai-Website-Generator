import React, { useEffect, useRef, useState } from 'react'
import { Monitor, Tablet, Smartphone, Eye, Download, Edit3, X } from 'lucide-react'
import { getSelectionScript } from '@/app/utils/selectionScript'
import { SelectedElement } from '../[projectId]/page'

type Props = {
  generatedCode?: string
  isEditMode?: boolean
  onToggleEditMode?: () => void
  onElementSelect?: (element: SelectedElement) => void
  selectedElement?: SelectedElement | null
  onUpdateStyle?: (property: string, value: string) => void
  onUpdateText?: (text: string) => void
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile'

const WebsiteDesign = ({
  generatedCode,
  isEditMode = false,
  onToggleEditMode,
  onElementSelect,
  selectedElement,
  onUpdateStyle,
  onUpdateText
}: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop')

  const handleViewInNewWindow = () => {
    if (!generatedCode) return;

    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
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
      `);
      newWindow.document.close();
    }
  };

  const handleDownload = () => {
    if (!generatedCode) return;

    const fullHTML = `<!DOCTYPE html>
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
</html>`;

    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `website-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Load HTML into iframe
  useEffect(() => {
    if (iframeRef.current && generatedCode) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

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

        // Inject selection script if in edit mode - wait for load
        if (isEditMode) {
          // Use iframe onload to ensure content is ready
          const injectScript = () => {
            try {
              const doc = iframe.contentDocument || iframe.contentWindow?.document;
              if (doc && doc.body) {
                const script = doc.createElement('script');
                script.textContent = getSelectionScript();
                doc.body.appendChild(script);
                console.log('✅ Selection script injected successfully');
              }
            } catch (error) {
              console.error('❌ Error injecting selection script:', error);
            }
          };

          // Try immediate injection and also on load
          setTimeout(injectScript, 100);
          iframe.onload = injectScript;
        } else {
          // Remove selection script if edit mode is disabled
          iframe.onload = null;
        }
      }
    }
  }, [generatedCode, isEditMode])

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log('📨 Message received in parent:', event.data);

      if (event.data.type === 'ELEMENT_SELECTED' && onElementSelect) {
        console.log('✅ Element selected, calling onElementSelect');
        onElementSelect(event.data.data);
      }
    };

    window.addEventListener('message', handleMessage);
    console.log('👂 Parent window listening for messages');
    return () => window.removeEventListener('message', handleMessage);
  }, [onElementSelect]);

  // Send style updates to iframe
  useEffect(() => {
    if (selectedElement && iframeRef.current?.contentWindow && onUpdateStyle) {
      // This will be triggered when selectedElement.styles changes
      // The actual update is sent from the parent component
    }
  }, [selectedElement]);

  // Send updates to iframe when props change
  useEffect(() => {
    if (!iframeRef.current?.contentWindow || !selectedElement) return;

    const iframe = iframeRef.current.contentWindow;

    // Listen for style changes and send to iframe
    const handleStyleUpdate = (property: string, value: string) => {
      iframe.postMessage({
        type: 'UPDATE_STYLE',
        property,
        value
      }, '*');
    };

    // Listen for text changes and send to iframe
    const handleTextUpdate = (text: string) => {
      iframe.postMessage({
        type: 'UPDATE_TEXT',
        text
      }, '*');
    };

    // Store handlers for cleanup
    (window as any).__styleUpdateHandler = handleStyleUpdate;
    (window as any).__textUpdateHandler = handleTextUpdate;
  }, [selectedElement]);

  // Helper to send style updates
  const sendStyleUpdate = (property: string, value: string) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'UPDATE_STYLE',
        property,
        value
      }, '*');
    }
  };

  // Helper to send text updates
  const sendTextUpdate = (text: string) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'UPDATE_TEXT',
        text
      }, '*');
    }
  };

  // Expose update methods to parent via ref callback
  useEffect(() => {
    if (onUpdateStyle) {
      const originalUpdateStyle = onUpdateStyle;
      (window as any).__sendStyleUpdate = (property: string, value: string) => {
        sendStyleUpdate(property, value);
        originalUpdateStyle(property, value);
      };
    }
    if (onUpdateText) {
      const originalUpdateText = onUpdateText;
      (window as any).__sendTextUpdate = (text: string) => {
        sendTextUpdate(text);
        originalUpdateText(text);
      };
    }
  }, [onUpdateStyle, onUpdateText]);

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
        <div className='hidden md:flex items-center justify-between gap-2 p-3 border-b border-slate-200 bg-slate-50'>
          <div className='flex items-center gap-2'>
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

          {/* Action Buttons */}
          <div className='flex items-center gap-2'>
            {/* Edit Mode Toggle */}
            <button
              onClick={onToggleEditMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isEditMode
                ? 'bg-purple-500 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
            >
              {isEditMode ? <X className='w-3.5 h-3.5' /> : <Edit3 className='w-3.5 h-3.5' />}
              {isEditMode ? 'Exit Edit' : 'Edit'}
            </button>

            <button
              onClick={handleViewInNewWindow}
              className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-blue-500 text-white hover:bg-blue-600'
            >
              <Eye className='w-3.5 h-3.5' />
              View
            </button>
            <button
              onClick={handleDownload}
              className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-green-500 text-white hover:bg-green-600'
            >
              <Download className='w-3.5 h-3.5' />
              Download
            </button>
          </div>
        </div>
      )}

      {/* Edit Mode Indicator */}
      {isEditMode && generatedCode && (
        <div className='bg-purple-50 border-b border-purple-200 px-4 py-2'>
          <p className='text-xs text-purple-700 font-medium'>
            🎨 Edit Mode Active - Click any element to customize it
          </p>
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