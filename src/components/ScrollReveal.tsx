import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealProps {
  children: string
  className?: string
  baseRotation?: number
  baseOpacity?: number
  blurStrength?: string
  triggerStart?: string
  triggerEnd?: string
}

export default function ScrollReveal({
  children,
  className = '',
  baseRotation = 8,
  baseOpacity = 0,
  blurStrength = '12px',
  triggerStart = 'top 85%',
  triggerEnd = 'top 30%',
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const words = children.split(' ')

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const wordEls = container.querySelectorAll('.sr-word')

    const ctx = gsap.context(() => {
      // Rotation animation
      gsap.fromTo(
        wordEls,
        { rotationX: baseRotation, transformOrigin: '50% 0%', transformPerspective: 800 },
        {
          rotationX: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: triggerStart,
            end: triggerEnd,
            scrub: false,
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Opacity animation with stagger
      gsap.fromTo(
        wordEls,
        { opacity: baseOpacity },
        {
          opacity: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container,
            start: triggerStart,
            end: triggerEnd,
            scrub: false,
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Blur animation
      gsap.fromTo(
        wordEls,
        { filter: `blur(${blurStrength})` },
        {
          filter: 'blur(0px)',
          duration: 0.7,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container,
            start: triggerStart,
            end: triggerEnd,
            scrub: false,
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, container)

    return () => ctx.revert()
  }, [baseRotation, baseOpacity, blurStrength, triggerStart, triggerEnd])

  return (
    <div ref={containerRef} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="sr-word inline-block"
          style={{ marginRight: '0.3em', opacity: 0 }}
        >
          {word}
        </span>
      ))}
    </div>
  )
}
