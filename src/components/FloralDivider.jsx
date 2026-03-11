export default function FloralDivider({ className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-3 py-4 ${className}`}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-rose-medium opacity-60">
        <path d="M12 2C12 2 14 6 14 8C14 10 12 12 12 12C12 12 10 10 10 8C10 6 12 2 12 2Z" fill="currentColor" />
        <path d="M12 12C12 12 16 10 18 10C20 10 22 12 22 12C22 12 20 14 18 14C16 14 12 12 12 12Z" fill="currentColor" />
        <path d="M12 12C12 12 14 16 14 18C14 20 12 22 12 22C12 22 10 20 10 18C10 16 12 12 12 12Z" fill="currentColor" />
        <path d="M12 12C12 12 8 10 6 10C4 10 2 12 2 12C2 12 4 14 6 14C8 14 12 12 12 12Z" fill="currentColor" />
        <circle cx="12" cy="12" r="2" fill="#FCD34D" />
      </svg>
      <div className="h-px w-16 bg-gradient-to-r from-transparent via-rose-medium to-transparent opacity-40" />
      <svg width="8" height="8" viewBox="0 0 8 8" className="text-gold-accent animate-sparkle">
        <path d="M4 0.5L5.1 2.8L7.6 3.1L5.8 4.8L6.2 7.3L4 6.1L1.8 7.3L2.2 4.8L0.4 3.1L2.9 2.8Z" fill="currentColor" />
      </svg>
      <div className="h-px w-16 bg-gradient-to-r from-transparent via-blue-medium to-transparent opacity-40" />
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-blue-medium opacity-60">
        <path d="M12 2C12 2 14 6 14 8C14 10 12 12 12 12C12 12 10 10 10 8C10 6 12 2 12 2Z" fill="currentColor" />
        <path d="M12 12C12 12 16 10 18 10C20 10 22 12 22 12C22 12 20 14 18 14C16 14 12 12 12 12Z" fill="currentColor" />
        <path d="M12 12C12 12 14 16 14 18C14 20 12 22 12 22C12 22 10 20 10 18C10 16 12 12 12 12Z" fill="currentColor" />
        <path d="M12 12C12 12 8 10 6 10C4 10 2 12 2 12C2 12 4 14 6 14C8 14 12 12 12 12Z" fill="currentColor" />
        <circle cx="12" cy="12" r="2" fill="#FCD34D" />
      </svg>
    </div>
  )
}
