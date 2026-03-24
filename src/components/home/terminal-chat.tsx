'use client'

import { useState } from 'react'
import { CANNED_RESPONSES } from '@/data/terminal-suggestions'

const TIMESTAMP = '23:57:03'

interface Message {
  time: string
  text: string
  isUser?: boolean
}

export function TerminalChat() {
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
