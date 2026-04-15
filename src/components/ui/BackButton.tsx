'use client'

import { useRouter } from 'next/navigation'

interface BackButtonProps {
    label?: string
    className?: string
}

export default function BackButton({ label = 'Volver', className = '' }: BackButtonProps) {
    const router = useRouter()

  return (
        <button
                onClick={() => router.back()}
                className={`inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors group ${className}`}
              >
              <svg
                        className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                      <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
              </svg>svg>
          {label}
        </button>button>
      )
}</button>
