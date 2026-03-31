"use client"

interface CompassIconProps {
  className?: string
  animate?: boolean
  size?: number
}

export function CompassIcon({ className = "", animate = false, size = 40 }: CompassIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animate ? 'animate-spin-slow' : ''}`}
    >
      {/* Outer ring */}
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      
      {/* Cardinal points */}
      <circle cx="20" cy="4" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="36" cy="20" r="1.5" fill="currentColor" opacity="0.4" />
      <circle cx="20" cy="36" r="1.5" fill="currentColor" opacity="0.4" />
      <circle cx="4" cy="20" r="1.5" fill="currentColor" opacity="0.4" />
      
      {/* Compass needle - North (gold/accent colored) */}
      <path
        d="M20 6L23 20L20 17L17 20L20 6Z"
        fill="hsl(var(--accent))"
        className={animate ? '' : 'animate-needle-sway'}
        style={{ transformOrigin: "20px 20px" }}
      />
      
      {/* Compass needle - South */}
      <path
        d="M20 34L17 20L20 23L23 20L20 34Z"
        fill="currentColor"
        opacity="0.5"
        className={animate ? '' : 'animate-needle-sway'}
        style={{ transformOrigin: "20px 20px" }}
      />
      
      {/* Center point */}
      <circle cx="20" cy="20" r="2.5" fill="currentColor" />
      <circle cx="20" cy="20" r="1.5" fill="hsl(var(--accent))" />
    </svg>
  )
}

export function CompassLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center overflow-hidden">
        <CompassIcon size={28} className="text-primary-foreground" />
      </div>
    </div>
  )
}
