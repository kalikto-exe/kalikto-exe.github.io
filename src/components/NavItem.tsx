import { useRef, useState } from 'react'

interface NavItemProps {
  label: string
  href?: string
}

export default function NavItem({ label, href = '#' }: NavItemProps) {
  const cycleRef = useRef(0)
  const [phase, setPhase] = useState<'idle' | 'out' | 'in'>('idle')

  const handleMouseEnter = () => {
    cycleRef.current += 1
    const thisCycle = cycleRef.current
    setPhase('out')

    setTimeout(() => {
      if (cycleRef.current !== thisCycle) return
      setPhase('in')
    }, 200)

    setTimeout(() => {
      if (cycleRef.current !== thisCycle) return
      setPhase('idle')
    }, 600)
  }

  const handleMouseLeave = () => {
    cycleRef.current += 1
    setPhase('idle')
  }

  const textClass =
    phase === 'out'
      ? 'nav-fly-out'
      : phase === 'in'
      ? 'nav-fly-in'
      : ''

  return (
    <a
      href={href}
      className="relative overflow-hidden inline-block text-white/60 hover:text-white/90 transition-colors duration-300 font-mono text-xs tracking-widest uppercase py-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className={`inline-block ${textClass}`}>{label}</span>
    </a>
  )
}
