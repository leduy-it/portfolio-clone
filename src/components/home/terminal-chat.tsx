'use client'

import { useState } from 'react'

const TIMESTAMP = '23:57:03'

const CANNED_RESPONSES: Record<string, string> = {
  "Hey! Who are you?": "I'm Duy Le — a software engineer passionate about building great products. Welcome to my portfolio!",
  "Tell me about your work experience": "I've had the opportunity to work at DSO National Laboratories, NVIDIA, Outsight, Bumblebee, and GrowtricsAI. Each role sharpened my skills in systems, AI, and full-stack dev.",
  "Show me your photography": "Head over to the Photography page to see my shots! I love capturing urban landscapes and candid street moments.",
  "Let's schedule a chat": "Sure! Reach me at benedictchan247@gmail.com or connect on LinkedIn. Always happy to chat!",
  "Any food recs near Bugis?": "Oh absolutely — try the wonton noodles at Albert Centre, the roti prata at Zam Zam, or grab some mochi from the Japanese stalls at Bugis Street!",
}

export const SUGGESTIONS = Object.keys(CANNED_RESPONSES)

interface Message {
  time: string
  text: string
  isUser?: boolean
}

interface TerminalChatProps {
  onSuggestionClick?: (suggestion: string) => void
}

export function TerminalChat({ onSuggestionClick }: TerminalChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { time: TIMESTAMP, text: 'STATUS: DUYLE.JS is online.' },
    { time: TIMESTAMP, text: 'Feel free to ask about my work, life, or photography!' },
  ])
  const [input, setInput] = useState('')

  function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return

    const userMsg: Message = { time: getCurrentTime(), text: trimmed, isUser: true }
    const response = CANNED_RESPONSES[trimmed] ?? "Hmm, I don't have an answer for that yet — but feel free to email me!"
    const botMsg: Message = { time: getCurrentTime(), text: response }

    setMessages(prev => [...prev, userMsg, botMsg])
    setInput('')
  }

  function getCurrentTime() {
    return new Date().toTimeString().slice(0, 8)
  }

  return (
    <div className="flex flex-col rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface-card))] overflow-hidden w-full">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[rgb(var(--border))] bg-[rgb(var(--surface-overlay))]">
        <span className="w-3 h-3 rounded-full bg-[rgb(239,68,68)]" />
        <span className="w-3 h-3 rounded-full bg-[rgb(234,179,8)]" />
        <span className="w-3 h-3 rounded-full bg-[rgb(34,197,94)]" />
        <span className="ml-2 text-xs font-mono text-[rgb(var(--text-muted))]">
          duyle.js ~ %
        </span>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-2 px-4 py-4 min-h-[200px] max-h-[320px] overflow-y-auto font-mono text-sm">
        {messages.map((msg, i) => (
          <div key={i}>
            {msg.isUser ? (
              <p className="text-[rgb(var(--text-secondary))]">
                <span className="text-[rgb(var(--accent))]">&gt; </span>
                {msg.text}
              </p>
            ) : (
              <p className="text-white">
                <span className="text-[rgb(var(--text-muted))]">[{msg.time}]</span>{' '}
                {msg.text.includes('STATUS:') ? (
                  <>
                    <span className="text-[rgb(var(--accent))] font-semibold">STATUS:</span>
                    {msg.text.replace('STATUS:', '')}
                  </>
                ) : (
                  msg.text
                )}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-[rgb(var(--border))]">
        <span className="text-[rgb(var(--accent))] font-mono text-sm">&gt;</span>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
          placeholder="Ask me anything..."
          className="flex-1 bg-transparent font-mono text-sm text-white placeholder-[rgb(var(--text-muted))] outline-none caret-[rgb(var(--accent))]"
        />
      </div>
    </div>
  )
}
