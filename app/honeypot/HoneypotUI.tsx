'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { recordVisit } from './actions'

const MESSAGES = [
  "Catch yourself before you wreck yourself.",
  "You're getting the hang of this.",
  "One less visit to the site you want to avoid.",
  "Take a deep breath. This is how habits change.",
  "Keep going, my friend.",
]

export default function HoneypotUI({ todayCount }: { todayCount: number }) {
  const pathname = usePathname()
  const fromRef = useRef<string | null>(null)
  const [messageIndex, setMessageIndex] = useState(0)
  const [messageVisible, setMessageVisible] = useState(true)
  const [showCount, setShowCount] = useState(false)

  useEffect(() => {
    if (fromRef.current !== null) return
    fromRef.current = document.referrer
    recordVisit(fromRef.current)
  }, [pathname])

  useEffect(() => {
    setMessageIndex(Math.floor(Math.random() * MESSAGES.length))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageVisible(false)
      setTimeout(() => {
        setMessageIndex((i) => (i + 1) % MESSAGES.length)
        setMessageVisible(true)
      }, 500)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      style={{ backgroundColor: '#F5EE9E', minHeight: '100vh' }}
      className="flex flex-col"
    >
      <div className="flex justify-end p-4">
        <button
          onClick={() => setShowCount((v) => !v)}
          style={{ color: '#2D728F' }}
          className="flex items-center gap-2 text-sm font-medium cursor-pointer"
          aria-label="Toggle today's visit count"
        >
          <span className="text-lg">👁</span>
          {showCount && (
            <span
              style={{ backgroundColor: '#F49E4C', color: '#fff' }}
              className="px-2 py-0.5 rounded-full text-xs font-bold"
            >
              {todayCount} today
            </span>
          )}
        </button>
      </div>

      <div
        style={{ animation: 'fadeIn 0.8s ease-out' }}
        className="flex flex-col flex-1 items-center justify-center gap-8 px-6 text-center"
      >
        <div className="text-9xl select-none">🍯</div>

        <p
          style={{
            color: '#2D728F',
            opacity: messageVisible ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
          }}
          className="text-xl font-medium max-w-md leading-relaxed"
        >
          {MESSAGES[messageIndex]}
        </p>

        <Link
          href="/dashboard"
          style={{ backgroundColor: '#F49E4C', color: '#fff' }}
          className="px-8 py-3 rounded-full text-base font-semibold hover:opacity-90 transition-opacity"
        >
          View My Data
        </Link>
      </div>
    </div>
  )
}
