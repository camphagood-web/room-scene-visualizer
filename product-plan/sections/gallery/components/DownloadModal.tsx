import { useState, useEffect } from 'react'

interface DownloadModalProps {
  isOpen: boolean
  defaultFileName: string
  selectedCount: number
  onConfirm?: (fileName: string) => void
  onCancel?: () => void
}

export function DownloadModal({
  isOpen,
  defaultFileName,
  selectedCount,
  onConfirm,
  onCancel,
}: DownloadModalProps) {
  const [fileName, setFileName] = useState(defaultFileName)

  // Reset filename when modal opens
  useEffect(() => {
    if (isOpen) {
      setFileName(defaultFileName)
    }
  }, [isOpen, defaultFileName])

  // Handle keyboard
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel?.()
      } else if (e.key === 'Enter' && fileName.trim()) {
        onConfirm?.(fileName.trim())
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, fileName, onConfirm, onCancel])

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-stone-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-amber-600 dark:text-amber-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                Download Images
              </h2>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                {selectedCount} {selectedCount === 1 ? 'image' : 'images'} selected
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-4">
          <label
            htmlFor="fileName"
            className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2"
          >
            Folder name
          </label>
          <input
            id="fileName"
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Enter folder name..."
            autoFocus
            className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-shadow"
          />
          <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
            Your images will be downloaded as <span className="font-medium">{fileName || 'images'}.zip</span>
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 dark:bg-stone-800/50 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm?.(fileName.trim())}
            disabled={!fileName.trim()}
            className="px-5 py-2 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 disabled:bg-stone-300 dark:disabled:bg-stone-700 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  )
}
