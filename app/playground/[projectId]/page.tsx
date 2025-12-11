
"use client"
import React, { useEffect, useState } from 'react'
import PlaygroundHeader from '../_components/PlaygroundHeader'
import ChatSection from '../_components/ChatSection'
import WebsiteDesign from '../_components/WebsiteDesign'
import ElementSettingSection from '../_components/ElementSettingSection'
import ImageSettingSection from '../_components/ImageSettingSection'
import { useParams, useSearchParams } from 'next/navigation'
import axios from 'axios'
import { MessageSquare, X } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'

export type Frame = {
    id: number;
    frameId: string;
    designCode: string;
    projectId: string;
    createdOn: string;
    chatMessages: ChatMessage[];
}

export type ChatMessage = {
    role: string;
    content: string;
}

export type SelectedElement = {
    tagName: string;
    textContent: string;
    innerHTML: string;
    styles: {
        color: string;
        backgroundColor: string;
        fontSize: string;
        fontWeight: string;
        fontFamily: string;
        padding: string;
        margin: string;
        textAlign: string;
    };
    classList: string[];
    xpath: string;
}

const getSystemPrompt = (userInput: string) => `You are an expert web developer assistant. Analyze the user's input and respond accordingly.

UserInput: ${userInput}

Instructions:

1. If the user input is explicitly asking to generate code, design, or HTML/CSS/JS output 
   (e.g., "Create a landing page", "Build a dashboard", "Generate HTML Tailwind CSS code"), then:

   - Generate a complete HTML Tailwind CSS code using Flowbite UI components.
   - Use a modern design with **blue as the primary color theme**.
   - Only include the <body> content (do not add <head> or <title>).
   
   **RESPONSIVE DESIGN REQUIREMENTS (CRITICAL):**
   - Use a **mobile-first approach** - design for mobile screens first, then scale up.
   - Use Tailwind CSS responsive prefixes for ALL layout elements:
       • Default (no prefix) = mobile (< 640px)
       • sm: = small tablets (≥ 640px)
       • md: = tablets (≥ 768px)
       • lg: = laptops (≥ 1024px)
       • xl: = desktops (≥ 1280px)
       • 2xl: = large screens (≥ 1536px)
   - **Navigation:** Use hamburger menu (hidden on mobile, visible on md:) for mobile devices.
   - **Grid Layouts:** Always use responsive grid classes:
       • grid-cols-1 (mobile)
       • sm:grid-cols-2 (small tablets)
       • md:grid-cols-2 or md:grid-cols-3 (tablets)
       • lg:grid-cols-3 or lg:grid-cols-4 (laptops+)
   - **Flexbox:** Use flex-col on mobile, then md:flex-row for larger screens.
   - **Text Sizes:** Scale typography responsively:
       • text-2xl md:text-3xl lg:text-4xl xl:text-5xl (headings)
       • text-sm md:text-base lg:text-lg (body text)
   - **Spacing:** Use responsive padding and margins:
       • px-4 md:px-8 lg:px-12 xl:px-16 (horizontal padding)
       • py-8 md:py-12 lg:py-16 xl:py-20 (vertical padding)
       • gap-4 md:gap-6 lg:gap-8 (grid/flex gaps)
   - **Images:** Make all images responsive with w-full h-auto and object-cover/contain.
   - **Containers:** Use max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 for content containers.
   - **Hidden/Visible Elements:** Use hidden md:block or block md:hidden for device-specific content.
   - **Touch Targets:** Ensure buttons and clickable elements are at least 44x44px on mobile.
   - **Tables:** Make tables responsive with overflow-x-auto wrapper on mobile.
   - **Forms:** Stack form fields vertically on mobile (flex-col), horizontally on larger screens (md:flex-row).
   
   - All primary components must match the theme color.
   - Add proper padding and margin for each element.
   - Components should be independent; do not connect them.
   - Use placeholders for all images:
       • Light mode: https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg
       • Dark mode: https://www.cibakey.com/wp-content/uploads/2015/12/placeholder-3.jpg
     Add an alt tag describing the image prompt.
   - Use the following libraries/components where appropriate:
       • FontAwesome icons (fa fa-)
       • Flowbite UI components: buttons, modals, forms, tables, tabs, alerts, cards, dialogs,
         dropdowns, accordions, etc.
       • Chart.js for charts & graphs
       • Swiper.js for sliders/carousels
       • Tippy.js for tooltips & popovers
   - Include interactive components like modals, dropdowns, and accordions.
   - Ensure proper spacing, alignment, hierarchy, and theme consistency.
   - Ensure charts are visually appealing and match the theme color.
   - Header menu options should be spread out and not connected.
   - Do not include broken links.
   - Wrap your HTML code in \`\`\`html code blocks.
   - Do not add any extra text before or after the HTML code block.

2. If the user input is **general text or greetings** 
   (e.g., "Hi", "Hello", "How are you?") **or does not explicitly ask to generate code**, then:

   - Respond with a simple, friendly text message instead of generating any code.
   - Do NOT wrap your response in code blocks.

Examples:

- User: "Hi" → Response: "Hello! How can I help you today?"
- User: "Build a responsive landing page with Tailwind CSS" → Response:
  \`\`\`html
  [Generate full HTML code as per instructions above]
  \`\`\`
`

const PlayGround = () => {
    const { projectId } = useParams()
    const params = useSearchParams();
    const frameId = params.get('frameId');
    const { user } = useUser();
    const [frameDetails, setFrameDetails] = useState<Frame>()
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [generatedCode, setGeneratedCode] = useState<string>("")
    const [initialMessageProcessed, setInitialMessageProcessed] = useState(false)
    const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null)
    const [isEditMode, setIsEditMode] = useState(false)
    const [isDeploying, setIsDeploying] = useState(false)

    useEffect(() => {
        GetFrameDetails()
    }, [frameId])

    const GetFrameDetails = async () => {
        const response = await axios.get(`/api/frames?frameId=${frameId}`)
        const data = await response.data
        setFrameDetails(data)
    }

    // Load initial messages from frameDetails and auto-send if needed
    useEffect(() => {
        if (frameDetails && frameDetails.chatMessages && frameDetails.chatMessages.length > 0 && !initialMessageProcessed) {
            const initialMessages = frameDetails.chatMessages as ChatMessage[]
            setMessages(initialMessages)

            // Load saved generated code if it exists
            if (frameDetails.designCode) {
                setGeneratedCode(frameDetails.designCode)
            }

            // Only auto-send the first user message if there's no AI response yet
            const hasAssistantResponse = initialMessages.some(msg => msg.role === 'assistant')

            if (!hasAssistantResponse) {
                const firstUserMessage = initialMessages.find(msg => msg.role === 'user')
                if (firstUserMessage && firstUserMessage.content) {
                    setInitialMessageProcessed(true)
                    // Small delay to ensure UI is ready
                    setTimeout(() => {
                        sendMessage(firstUserMessage.content, true) // Skip adding user message as it's already in initialMessages
                    }, 500)
                }
            } else {
                // Mark as processed if there's already an assistant response
                setInitialMessageProcessed(true)
            }
        }
    }, [frameDetails, initialMessageProcessed])

    // Function to save frame data (chat messages and generated code) to database
    const saveFrameData = async (messagesToSave: ChatMessage[], codeToSave?: string) => {
        try {
            await axios.put('/api/frames', {
                frameId: frameId,
                messages: messagesToSave,
                designCode: codeToSave,
                userEmail: user?.primaryEmailAddress?.emailAddress
            });
        } catch (error) {
            console.error('Error saving frame data:', error);
            // Don't throw error to avoid disrupting user experience
        }
    }

    const sendMessage = async (message: string, skipAddingUserMessage = false) => {
        // Prevent sending if already loading
        if (loading) return;

        setLoading(true)

        // Reset generated code for new message
        setGeneratedCode("")

        // Only add user message if not skipping (to avoid duplicates from initial messages)
        if (!skipAddingUserMessage) {
            setMessages((prev) => [
                ...prev,
                {
                    role: 'user',
                    content: message
                }
            ])
        }

        try {
            const response = await fetch('/api/ai-model', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: 'system',
                            content: getSystemPrompt(message)
                        },
                        {
                            role: 'user',
                            content: message
                        }
                    ]
                })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('No response body');
            }

            const decoder = new TextDecoder();

            let aiResponse = "";
            let isCode = false;
            let accumulatedCode = ""; // Track the actual generated code

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                aiResponse += chunk;

                if (!isCode && aiResponse.includes('```html')) {
                    isCode = true;
                    const index = aiResponse.indexOf('```html') + 7;
                    const initialCodeChunk = aiResponse.slice(index);
                    accumulatedCode += initialCodeChunk;
                    setGeneratedCode((prev: string) => prev + initialCodeChunk)
                } else if (isCode && !chunk.includes('```')) {
                    // Only add chunk if it doesn't contain the closing markdown tag
                    accumulatedCode += chunk;
                    setGeneratedCode((prev: string) => prev + chunk)
                }

            }

            // Clean up any remaining markdown code block markers
            if (isCode) {
                accumulatedCode = accumulatedCode.replace(/```$/g, '').trim();
                setGeneratedCode((prev: string) => prev.replace(/```$/g, '').trim())
            }
            //after streaming end
            if (!isCode) {
                setMessages((prev) => {
                    const updatedMessages = [
                        ...prev,
                        {
                            role: 'assistant',
                            content: aiResponse
                        }
                    ];
                    // Save messages to database after state update
                    saveFrameData(updatedMessages);
                    return updatedMessages;
                });
            } else {
                setMessages((prev) => {
                    const updatedMessages = [
                        ...prev,
                        {
                            role: 'assistant',
                            content: 'Your Code Is Ready!'
                        }
                    ];
                    // Save messages and generated code to database after state update
                    saveFrameData(updatedMessages, accumulatedCode);
                    return updatedMessages;
                });
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'Sorry, there was an error processing your request.'
                }
            ])
        } finally {
            setLoading(false)
        }
    }

    // Handler for element selection from iframe
    const handleElementSelect = (element: SelectedElement) => {
        setSelectedElement(element);
    }

    // Handler for updating element styles
    const handleUpdateStyle = (property: string, value: string) => {
        if (!selectedElement) return;

        // Update local state
        setSelectedElement(prev => prev ? {
            ...prev,
            styles: { ...prev.styles, [property]: value }
        } : null);

        // Send message to iframe
        const iframe = document.querySelector('iframe');
        if (iframe?.contentWindow) {
            iframe.contentWindow.postMessage({
                type: 'UPDATE_STYLE',
                property,
                value
            }, '*');
        }
    }

    // Handler for updating element text
    const handleUpdateText = (text: string) => {
        if (!selectedElement) return;

        // Update local state
        setSelectedElement(prev => prev ? {
            ...prev,
            textContent: text
        } : null);

        // Send message to iframe
        const iframe = document.querySelector('iframe');
        if (iframe?.contentWindow) {
            iframe.contentWindow.postMessage({
                type: 'UPDATE_TEXT',
                text
            }, '*');
        }
    }

    // Handler for updating image attributes (src, alt, etc.)
    const handleUpdateAttribute = (attribute: string, value: string) => {
        if (!selectedElement) return;

        // Send message to iframe
        const iframe = document.querySelector('iframe');
        if (iframe?.contentWindow) {
            iframe.contentWindow.postMessage({
                type: 'UPDATE_ATTRIBUTE',
                attribute,
                value
            }, '*');
        }
    }

    // Handler for toggling edit mode
    const handleToggleEditMode = () => {
        setIsEditMode(!isEditMode);
        if (isEditMode) {
            // Exiting edit mode, deselect element
            setSelectedElement(null);
        }
    }

    // Handler for deploying to Vercel
    const handleDeploy = async () => {
        if (!generatedCode) {
            toast.error('No website to deploy. Please generate a website first.');
            return;
        }

        setIsDeploying(true);
        toast.loading('Deploying to Vercel...', { id: 'deploy' });

        try {
            const response = await axios.post('/api/deploy', {
                projectId,
                frameId
            });

            if (response.data.success) {
                toast.success(
                    <div>
                        <p>Deployment successful! 🎉</p>
                        <a
                            href={response.data.data.deploymentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            {response.data.data.deploymentUrl}
                        </a>
                    </div>,
                    { id: 'deploy', duration: 10000 }
                );
            }
        } catch (error: any) {
            console.error('Deployment error:', error);
            const errorMessage = error.response?.data?.error || 'Failed to deploy. Please try again.';
            toast.error(errorMessage, { id: 'deploy' });
        } finally {
            setIsDeploying(false);
        }
    }

    // Handler for saving changes to database
    const handleSaveChanges = async () => {
        try {
            // Get the modified HTML from the iframe
            const iframe = document.querySelector('iframe');
            const iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document;

            if (iframeDoc && iframeDoc.body) {
                // Extract only the body content (without our injected scripts and styles)
                const modifiedHTML = iframeDoc.body.innerHTML;

                // Remove editor-specific classes and attributes
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = modifiedHTML;

                // Remove editor classes
                const allElements = tempDiv.querySelectorAll('*');
                allElements.forEach(el => {
                    el.classList.remove('editor-hover', 'editor-selected');
                    el.removeAttribute('data-element-tag');
                });

                const cleanedHTML = tempDiv.innerHTML;

                // Update the generatedCode state
                setGeneratedCode(cleanedHTML);

                // Save to database
                await saveFrameData(messages, cleanedHTML);

                console.log('✅ Changes saved successfully');
            }
        } catch (error) {
            console.error('❌ Error saving changes:', error);
            throw error;
        }
    }

    useEffect(() => {
        console.log(generatedCode)
    }, [generatedCode])

    return (
        <div className='min-h-screen bg-slate-50'>
            <PlaygroundHeader
                onDeploy={handleDeploy}
                isDeploying={isDeploying}
            />

            {/* Mobile Chat Toggle Button */}
            <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className='lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg hover:shadow-xl flex items-center justify-center text-white transition-all'
            >
                {isChatOpen ? <X className='w-6 h-6' /> : <MessageSquare className='w-6 h-6' />}
            </button>

            {/* Main Content */}
            <div className='flex flex-col lg:flex-row relative h-[calc(100vh-73px)]'>
                {/* Chat Section - Mobile Overlay / Desktop Sidebar */}
                <div className={`
                    fixed lg:relative inset-0 lg:inset-auto z-40 lg:z-auto
                    transition-transform duration-300 ease-in-out
                    ${isChatOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>
                    <ChatSection
                        messages={messages || []}
                        onClose={() => setIsChatOpen(false)}
                        onSend={(input: string) => sendMessage(input)}
                        loading={loading}
                    />
                </div>

                {/* Overlay for mobile when chat is open */}
                {isChatOpen && (
                    <div
                        className='lg:hidden fixed inset-0 bg-black/50 z-30'
                        onClick={() => setIsChatOpen(false)}
                    />
                )}

                {/* Website Design - Main Content */}
                <div className='flex-1 min-w-0 overflow-hidden'>
                    <WebsiteDesign
                        generatedCode={generatedCode}
                        isEditMode={isEditMode}
                        onToggleEditMode={handleToggleEditMode}
                        onElementSelect={handleElementSelect}
                        selectedElement={selectedElement}
                        onUpdateStyle={handleUpdateStyle}
                        onUpdateText={handleUpdateText}
                    />
                </div>

                {/* Element/Image Settings - Hidden on mobile, shown on larger screens */}
                <div className='hidden xl:block'>
                    {selectedElement?.tagName.toLowerCase() === 'img' ? (
                        <ImageSettingSection
                            selectedEl={selectedElement as any}
                            onUpdateStyle={handleUpdateStyle}
                            onUpdateAttribute={handleUpdateAttribute}
                        />
                    ) : (
                        <ElementSettingSection
                            selectedElement={selectedElement}
                            onUpdateStyle={handleUpdateStyle}
                            onUpdateText={handleUpdateText}
                            onSaveChanges={handleSaveChanges}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default PlayGround