export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 min-h-screen"> {/* just made /70 for transparency */}
      <div className="relative bg-slate-900 rounded-xl shadow-2xl border border-slate-700 p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-slate-400 hover:text-red-700 bg-red-500 p-2 rounded-md text-3xl font-bold cursor-pointer"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  )
}
