"use client"
import React, { useState, useRef, useEffect } from 'react'
import { ChatMessage } from '../[projectId]/page'
import { Send, Sparkles, Image, Code, X } from 'lucide-react'

type Props = {
  messages: ChatMessage[]
  onClose?: () => void
  onSend: any
}

const ChatSection = ({ messages, onClose, onSend }: Props) => {
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
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

  return (
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
        {isTyping && (
          <div className='flex justify-start'>
            <div className='bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm'>
              <div className='flex gap-1'>
                <div className='w-2 h-2 bg-slate-400 rounded-full animate-bounce' style={{ animationDelay: '0ms' }}></div>
                <div className='w-2 h-2 bg-slate-400 rounded-full animate-bounce' style={{ animationDelay: '150ms' }}></div>
                <div className='w-2 h-2 bg-slate-400 rounded-full animate-bounce' style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer Input */}
      <div className='p-3 lg:p-4 border-t border-slate-200 bg-white/80 backdrop-blur-sm'>
        {/* Quick Actions */}
        <div className='flex gap-2 mb-2 lg:mb-3'>
          <button className='flex items-center gap-1 lg:gap-1.5 px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors text-xs font-medium text-slate-700'>
            <Image className='w-3 lg:w-3.5 h-3 lg:h-3.5' />
            <span className='hidden sm:inline'>Image</span>
          </button>
          <button className='flex items-center gap-1 lg:gap-1.5 px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors text-xs font-medium text-slate-700'>
            <Code className='w-3 lg:w-3.5 h-3 lg:h-3.5' />
            <span className='hidden sm:inline'>Code</span>
          </button>
        </div>

        {/* Input Area */}
        <div className='relative'>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder='Describe what you want to build...'
            className='w-full px-3 lg:px-4 py-2 lg:py-3 pr-11 lg:pr-12 rounded-xl border border-slate-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none resize-none text-sm placeholder:text-slate-400 transition-all'
            rows={2}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className='absolute right-2 bottom-2 w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-slate-300 disabled:to-slate-300 flex items-center justify-center transition-all shadow-lg disabled:shadow-none'
          >
            <Send className='w-3.5 h-3.5 lg:w-4 lg:h-4 text-white' />
          </button>
        </div>

        {/* Footer Note */}
        <p className='text-xs text-slate-400 mt-2 text-center hidden sm:block'>
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  )
}

export default ChatSection