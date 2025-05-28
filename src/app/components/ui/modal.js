export default function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
        <div className="relative bg-slate-900 rounded-xl shadow-2xl border border-slate-700 w-full max-w-md p-6">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-slate-400 hover:text-red-500 text-xl font-bold"
          >
            &times;
          </button>
          {children}
        </div>
      </div>
    )
  }