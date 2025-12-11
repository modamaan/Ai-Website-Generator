"use client"
import React, { useState, useRef, useEffect } from 'react'
import { ChatMessage } from '../[projectId]/page'
import { Send, Sparkles, Image, Code, X, Upload, Wand2 } from 'lucide-react'
import ImageUpload from './ImageUpload'
import ImageGenerate from './ImageGenerate'

type Props = {
  messages: ChatMessage[]
  onClose?: () => void
  onSend: any
  loading?: boolean
}

const ChatSection = ({ messages, onClose, onSend, loading = false }: Props) => {
  const [input, setInput] = useState('')
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [showImageGenerate, setShowImageGenerate] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (input.trim()) {
      // TODO: Implement send message logic
      console.log('Sending message:', input)
      onSend(input)
      setInput('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleImageUploadComplete = (imageUrl: string) => {
    setInput(prev => prev + `\n\nImage URL: ${imageUrl}`)
    setShowImageUpload(false)
  }

  const handleImageGenerateComplete = (imageUrl: string) => {
    setInput(prev => prev + `\n\nGenerated Image URL: ${imageUrl}`)
    setShowImageGenerate(false)
  }

  return (
    <>
      <div className='w-full lg:w-96 shadow-xl h-screen lg:h-[91vh] flex flex-col bg-gradient-to-b from-slate-50 to-white lg:border-r border-slate-200'>
        {/* Header */}
        <div className='p-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm'>
          <div className='flex items-center justify-between gap-2'>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center'>
                <Sparkles className='w-4 h-4 text-white' />
              </div>
              <div>
                <h2 className='font-semibold text-slate-800'>AI Assistant</h2>
                <p className='text-xs text-slate-500'>Ready to help you build</p>
              </div>
            </div>
            {/* Mobile Close Button */}
            {onClose && (
              <button
                onClick={onClose}
                className='lg:hidden w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors'
              >
                <X className='w-5 h-5 text-slate-600' />
              </button>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className='flex-1 overflow-y-auto p-3 lg:p-4 space-y-3 lg:space-y-4'>
          {messages.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-full text-center px-4'>
              <div className='w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-3 lg:mb-4'>
                <Sparkles className='w-6 h-6 lg:w-8 lg:h-8 text-purple-500' />
              </div>
              <h3 className='text-base lg:text-lg font-semibold text-slate-800 mb-2'>Start Creating</h3>
              <p className='text-xs lg:text-sm text-slate-500 max-w-xs'>
                Describe what you want to build and I'll help you create it
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${message.role === 'user'
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-200'
                    : 'bg-white border border-slate-200 text-slate-800 shadow-sm'
                    }`}
                >
                  <p className='text-sm leading-relaxed whitespace-pre-wrap'>
                    {message.content}
                  </p>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className='flex justify-start'>
              <div className='bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm'>
                <div className='flex items-center gap-2'>
                  <div className='flex gap-1'>
                    <div className='w-2 h-2 bg-purple-400 rounded-full animate-bounce' style={{ animationDelay: '0ms' }}></div>
                    <div className='w-2 h-2 bg-purple-400 rounded-full animate-bounce' style={{ animationDelay: '150ms' }}></div>
                    <div className='w-2 h-2 bg-purple-400 rounded-full animate-bounce' style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className='text-xs text-slate-500'>AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Image Upload Modal */}
      {showImageUpload && (
        <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
          <div className='max-w-2xl w-full'>
            <ImageUpload
              onUploadComplete={handleImageUploadComplete}
              onClose={() => setShowImageUpload(false)}
            />
          </div>
        </div>
      )}

      {/* Image Generate Modal */}
      {showImageGenerate && (
        <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto'>
          <div className='max-w-4xl w-full my-8'>
            <div className='bg-white rounded-lg p-4'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold'>Generate Image</h3>
                <button
                  onClick={() => setShowImageGenerate(false)}
                  className='p-1 hover:bg-gray-100 rounded-full transition-colors'
                >
                  <X className='w-5 h-5 text-gray-500' />
                </button>
              </div>
              <ImageGenerate onGenerateComplete={handleImageGenerateComplete} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatSection
