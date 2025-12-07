
"use client"
import React, { useEffect, useState } from 'react'
import PlaygroundHeader from '../_components/PlaygroundHeader'
import ChatSection from '../_components/ChatSection'
import WebsiteDesign from '../_components/WebsiteDesign'
import ElementSettingSection from '../_components/ElementSettingSection'
import { useParams, useSearchParams } from 'next/navigation'
import axios from 'axios'
import { MessageSquare, X } from 'lucide-react'

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

const PlayGround = () => {
    const { projectId } = useParams()
    const params = useSearchParams();
    const frameId = params.get('frameId');
    const [frameDetails, setFrameDetails] = useState<Frame>()
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [generatedCode, setGeneratedCode] = useState<any>({})

    useEffect(() => {
        GetFrameDetails()
    }, [frameId])

    const GetFrameDetails = async () => {
        const response = await axios.get(`/api/frames?frameId=${frameId}`)
        const data = await response.data
        setFrameDetails(data)
    }

    const sendMessage = async (message: string) => {
        setLoading(true)

        setMessages((prev) => [
            ...prev,
            {
                role: 'user',
                content: message
            }
        ])

        try {
            const response = await fetch('/api/ai-model', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [
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

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                aiResponse += chunk;

                if (!isCode && aiResponse.includes('```html')) {
                    isCode = true;
                    const index = aiResponse.indexOf('```html') + 7;
                    const initialCodeChunk = aiResponse.slice(index);
                    setGeneratedCode((prev: any) => prev + initialCodeChunk)
                } else if (isCode) {
                    setGeneratedCode((prev: any) => prev + chunk)
                }

            }
            //after streaming end
            if (!isCode) {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: 'assistant',
                        content: aiResponse
                    }
                ])
            } else {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: 'assistant',
                        content: 'Your Code Is Ready!'
                    }
                ])
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

    return (
        <div className='min-h-screen bg-slate-50'>
            <PlaygroundHeader />

            {/* Mobile Chat Toggle Button */}
            <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className='lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg hover:shadow-xl flex items-center justify-center text-white transition-all'
            >
                {isChatOpen ? <X className='w-6 h-6' /> : <MessageSquare className='w-6 h-6' />}
            </button>

            {/* Main Content */}
            <div className='flex flex-col lg:flex-row relative'>
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
                <div className='flex-1 min-w-0'>
                    <WebsiteDesign />
                </div>

                {/* Element Settings - Hidden on mobile, shown on larger screens */}
                <div className='hidden xl:block'>
                    <ElementSettingSection />
                </div>
            </div>
        </div>
    )
}

export default PlayGround