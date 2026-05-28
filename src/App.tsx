import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowRight, Globe, BarChart3, Star, Zap, Users, Trophy, ChevronRight } from 'lucide-react'
import ScrollReveal from './components/ScrollReveal'
import Reveal from './components/Reveal'
import NavItem from './components/NavItem'

// Google Drive direct video URL
const VIDEO_URL =
  'https://player.cloudinary.com/embed/?cloud_name=dd40c4kty&public_id=clt_l_f_p_l_h_g_g_g_clt_l_f_p_l_h_g_g_g_mp__b33wst'

const NAV_LINKS = ['League', 'Clubs', 'Players', 'Fixtures', 'About']

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const screen3Ref = useRef<HTMLDivElement>(null)
  const [arrowCycle, setArrowCycle] = useState(0)
  const [arrowPhase, setArrowPhase] = useState<'idle' | 'out' | 'in'>('idle')
  const [isLoaded, setIsLoaded] = useState(false)
  const isSeeking = useRef(false)

  const { scrollY } = useScroll()
  const headerY = useTransform(scrollY, [0, 500, 800], [0, 0, -150])

  // Scroll-driven video scrubbing with seeking guard
  const handleScroll = useCallback(() => {
    const video = videoRef.current
    const footer = screen3Ref.current
    if (!video || !footer || isSeeking.current) return

    const docHeight = document.documentElement.scrollHeight
    const winHeight = window.innerHeight
    const scrollTop = window.scrollY

    // Map scroll: 0 at top → 1 when footer is 20% from top of viewport
    const footerTop = footer.getBoundingClientRect().top + scrollTop
    const endPoint = footerTop - winHeight * 0.2
    const fraction = Math.min(Math.max(scrollTop / endPoint, 0), 1)

    const duration = video.duration
    if (!duration || isNaN(duration)) return

    const targetTime = fraction * duration
    if (Math.abs(video.currentTime - targetTime) < 0.05) return

    isSeeking.current = true
    video.currentTime = targetTime

    const onSeeked = () => {
      isSeeking.current = false
      video.removeEventListener('seeked', onSeeked)
    }
    video.addEventListener('seeked', onSeeked)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const handleArrowEnter = () => {
    const nextCycle = arrowCycle + 1
    setArrowCycle(nextCycle)
    setArrowPhase('out')
    setTimeout(() => setArrowPhase('in'), 250)
    setTimeout(() => setArrowPhase('idle'), 750)
  }

  const handleArrowLeave = () => {
    setArrowCycle(c => c + 1)
    setArrowPhase('idle')
  }

  const arrowClass =
    arrowPhase === 'out'
      ? 'arrow-fly-out'
      : arrowPhase === 'in'
      ? 'arrow-fly-in'
      : ''

  return (
    <div className="relative min-h-[400vh] bg-black">
      {/* ── Fixed Video Background ── */}
      <div
        ref={videoContainerRef}
        className="fixed inset-0 z-0 bg-black overflow-hidden"
      >
        <video
          ref={videoRef}
          src={VIDEO_URL}
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={() => setIsLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.8s ease' }}
        />
        {/* Cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
        {/* Subtle vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.65) 100%)',
          }}
        />
      </div>

      {/* ── Fixed Header ── */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-[5vw] py-6"
        style={{ y: headerY }}
      >
        {/* WISA Logo SVG */}
        <a href="#" className="flex items-center gap-3 group">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="group-hover:scale-105 transition-transform duration-300"
          >
            <circle cx="20" cy="20" r="19" stroke="white" strokeWidth="1.5" />
            {/* Football pentagon pattern */}
            <polygon
              points="20,8 28,14 25,24 15,24 12,14"
              stroke="white"
              strokeWidth="1.2"
              fill="none"
            />
            <circle cx="20" cy="20" r="3" fill="white" />
            <line x1="20" y1="8" x2="20" y2="4" stroke="white" strokeWidth="1" />
            <line x1="28" y1="14" x2="32" y2="12" stroke="white" strokeWidth="1" />
            <line x1="25" y1="24" x2="28" y2="28" stroke="white" strokeWidth="1" />
            <line x1="15" y1="24" x2="12" y2="28" stroke="white" strokeWidth="1" />
            <line x1="12" y1="14" x2="8" y2="12" stroke="white" strokeWidth="1" />
          </svg>
          <div>
            <span className="font-mono text-white font-bold tracking-[0.15em] text-sm uppercase">
              WISA
            </span>
            <div className="font-mono text-white/30 text-[9px] tracking-[0.2em] uppercase leading-none">
              World Intl. Sports Assoc.
            </div>
          </div>
        </a>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <NavItem key={link} label={link} href={`#${link.toLowerCase()}`} />
          ))}
        </nav>

        {/* CTA */}
        <a
          href="#"
          className="hidden md:flex items-center gap-2 font-mono text-xs tracking-widest uppercase px-5 py-2.5 border border-white/20 text-white/80 hover:text-black hover:bg-white transition-all duration-300 backdrop-blur-md"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          Buy Match Pass
          <ChevronRight size={12} />
        </a>
      </motion.header>

      {/* ── Scrollable Content Layer ── */}
      <div className="relative z-10 pointer-events-none">
        {/* ════════════════════════════════════
            SECTION 1 — HERO
        ════════════════════════════════════ */}
        <section
          className="pointer-events-auto relative min-h-screen flex items-end pb-16"
          style={{ width: '90vw', margin: '0 auto' }}
        >
          <div className="w-full grid grid-cols-12 gap-6 items-end">
            {/* Heading — bottom left, cols 1-7 */}
            <motion.div
              className="col-span-12 lg:col-span-7"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Season badge */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-px bg-white/40" />
                <span className="font-mono text-white/50 text-[10px] tracking-[0.3em] uppercase">
                  Season 2025–26
                </span>
              </div>

              <h1
                className="font-sans font-bold text-white leading-[0.9] tracking-tight"
                style={{
                  fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                  textShadow: '0 0 80px rgba(255,255,255,0.08)',
                }}
              >
                Championing
                <br />
                The Pitch
                <br />
                <span className="italic font-light text-white/70">Of Legends</span>
              </h1>

              {/* CTA Button */}
              <div className="mt-10 pointer-events-auto">
                <button
                  className="group flex items-center gap-0 overflow-hidden border border-white/15 hover:border-white transition-all duration-300"
                  style={{
                    backdropFilter: 'blur(80px)',
                    background: 'rgba(255,255,255,0.08)',
                  }}
                  onMouseEnter={handleArrowEnter}
                  onMouseLeave={handleArrowLeave}
                  onMouseOver={e => {
                    ;(e.currentTarget as HTMLButtonElement).style.background = '#fff'
                    ;(e.currentTarget as HTMLButtonElement).style.color = '#000'
                  }}
                  onMouseOut={e => {
                    ;(e.currentTarget as HTMLButtonElement).style.background =
                      'rgba(255,255,255,0.08)'
                    ;(e.currentTarget as HTMLButtonElement).style.color = '#fff'
                  }}
                >
                  <span className="font-mono text-xs tracking-widest uppercase px-6 py-4 transition-colors duration-300">
                    Explore The League
                  </span>
                  <div className="border-l border-white/15 group-hover:border-black/20 px-4 py-4 overflow-hidden transition-colors duration-300">
                    <ArrowRight
                      size={14}
                      className={`transition-colors duration-300 ${arrowClass}`}
                    />
                  </div>
                </button>
              </div>
            </motion.div>

            {/* Description — center-right, cols 8-12 */}
            <motion.div
              className="col-span-12 lg:col-span-5 lg:col-start-8 lg:pb-3"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="p-6 border border-white/8"
                style={{
                  backdropFilter: 'blur(40px)',
                  background: 'rgba(255,255,255,0.04)',
                  maxWidth: '460px',
                  marginLeft: 'auto',
                }}
              >
                <p className="font-sans text-white/60 text-sm leading-relaxed">
                  The World International Sports Association unites{' '}
                  <strong className="text-white font-semibold">
                    elite clubs, legendary players, and passionate fans
                  </strong>{' '}
                  across 6 continents — delivering world-class football through
                  innovation, integrity, and the pursuit of excellence on every pitch.
                </p>
                <div className="mt-5 pt-5 border-t border-white/10 flex gap-6">
                  <div>
                    <div className="font-mono text-white text-xl font-bold">148</div>
                    <div className="font-mono text-white/35 text-[9px] tracking-widest uppercase mt-1">
                      Nations
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-white text-xl font-bold">3.2B</div>
                    <div className="font-mono text-white/35 text-[9px] tracking-widest uppercase mt-1">
                      Global Fans
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-white text-xl font-bold">920</div>
                    <div className="font-mono text-white/35 text-[9px] tracking-widest uppercase mt-1">
                      Elite Clubs
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Scroll indicator */}
        <motion.div
          className="pointer-events-auto flex flex-col items-center gap-2 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <span className="font-mono text-white/25 text-[9px] tracking-[0.3em] uppercase">
            Scroll
          </span>
          <motion.div
            className="w-px bg-white/20 origin-top"
            animate={{ scaleY: [0, 1, 0], y: [0, 0, 20] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ height: '40px' }}
          />
        </motion.div>

        {/* ════════════════════════════════════
            SECTION 2 — CAPABILITIES
        ════════════════════════════════════ */}
        <section
          className="pointer-events-auto relative min-h-screen flex flex-col justify-center py-24"
          style={{ width: '90vw', margin: '0 auto' }}
          id="about"
        >
          {/* Section label */}
          <Reveal className="flex items-center gap-4 mb-12">
            <div className="w-8 h-px bg-white/30" />
            <span className="font-mono text-white/40 text-[10px] tracking-[0.3em] uppercase">
              Our Mandate
            </span>
          </Reveal>

          {/* ScrollReveal Heading */}
          <ScrollReveal
            className="font-sans font-bold text-white leading-tight mb-16"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
            } as React.CSSProperties}
            baseRotation={10}
            baseOpacity={0}
            blurStrength="16px"
          >
            Where Elite Performance Meets Global Passion For The Beautiful Game
          </ScrollReveal>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-white/8 bg-white/8">
            {/* Col 1: Globe + Logo */}
            <Reveal
              className="relative overflow-hidden"
              delay={0}
              style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(20px)',
              } as React.CSSProperties}
            >
              <div className="p-8 h-full flex flex-col justify-between min-h-[380px]">
                {/* Globe visual */}
                <div className="relative w-full aspect-square max-w-[200px] mx-auto mb-6">
                  <div
                    className="absolute inset-0 rounded-full border border-white/10"
                    style={{ background: 'rgba(255,255,255,0.02)' }}
                  />
                  <Globe
                    size={80}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20"
                    strokeWidth={0.8}
                  />
                  {/* Orbit rings */}
                  <div
                    className="absolute inset-4 rounded-full border border-white/5"
                    style={{ transform: 'rotateX(60deg)' }}
                  />
                  {/* Floating dots */}
                  {[
                    { top: '15%', left: '60%' },
                    { top: '40%', left: '20%' },
                    { top: '70%', left: '75%' },
                    { top: '55%', left: '50%' },
                  ].map((pos, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1.5 h-1.5 rounded-full bg-white/40"
                      style={{ top: pos.top, left: pos.left }}
                      animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.2, 0.8] }}
                      transition={{
                        duration: 2 + i * 0.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.4,
                      }}
                    />
                  ))}
                </div>
                {/* WISA Wordmark */}
                <div className="mt-auto">
                  <div className="font-mono text-white/10 text-4xl font-bold tracking-[0.15em] mb-2">
                    WISA
                  </div>
                  <p className="font-sans text-white/50 text-xs leading-relaxed">
                    Governing football across 148 member nations with unified standards
                    for competition, safety, and fair play.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Col 2: Performance Analytics / Facilities */}
            <div
              className="border-x border-white/8 flex flex-col"
              style={{ background: 'rgba(0,0,0,0.2)' }}
            >
              {/* Analytics */}
              <Reveal
                delay={0.1}
                className="p-8 border-b border-white/8 flex-1"
              >
                <div className="flex items-start justify-between mb-6">
                  <BarChart3 size={20} className="text-white/40" strokeWidth={1.2} />
                  <span className="font-mono text-white/20 text-[9px] tracking-[0.2em] uppercase">
                    01
                  </span>
                </div>
                <h3 className="font-sans font-semibold text-white text-lg mb-3 leading-tight">
                  Performance Analytics
                </h3>
                <p className="font-sans text-white/45 text-xs leading-relaxed">
                  Real-time biometric tracking, xG modeling, and AI-driven scouting
                  reports. Every pass, sprint, and set piece — quantified.
                </p>
                {/* Mini data visualization */}
                <div className="mt-6 flex items-end gap-1 h-12">
                  {[40, 65, 50, 80, 60, 90, 70, 85, 75, 95].map((h, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 bg-white/20 rounded-sm origin-bottom"
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </Reveal>

              {/* Facilities */}
              <Reveal delay={0.2} className="p-8 flex-1">
                <div className="flex items-start justify-between mb-6">
                  <Zap size={20} className="text-white/40" strokeWidth={1.2} />
                  <span className="font-mono text-white/20 text-[9px] tracking-[0.2em] uppercase">
                    02
                  </span>
                </div>
                <h3 className="font-sans font-semibold text-white text-lg mb-3 leading-tight">
                  World-Class Facilities
                </h3>
                <p className="font-sans text-white/45 text-xs leading-relaxed">
                  WISA-certified stadiums, training centres, and medical suites across
                  every affiliated nation — built to our exact technical specifications.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-2">
                  {['UEFA', 'CAF', 'CONMEBOL', 'AFC', 'CONCACAF', 'OFC'].map(conf => (
                    <div
                      key={conf}
                      className="font-mono text-white/30 text-[8px] tracking-wider border border-white/8 px-2 py-1 text-center"
                    >
                      {conf}
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Col 3: Matchday Premium / Fan Experiences */}
            <div className="flex flex-col" style={{ background: 'rgba(255,255,255,0.02)' }}>
              {/* Matchday */}
              <Reveal delay={0.15} className="p-8 border-b border-white/8 flex-1">
                <div className="flex items-start justify-between mb-6">
                  <Trophy size={20} className="text-white/40" strokeWidth={1.2} />
                  <span className="font-mono text-white/20 text-[9px] tracking-[0.2em] uppercase">
                    03
                  </span>
                </div>
                <h3 className="font-sans font-semibold text-white text-lg mb-3 leading-tight">
                  Matchday Premium
                </h3>
                <p className="font-sans text-white/45 text-xs leading-relaxed">
                  Hospitality packages, pitch-side access, and VIP lounges that redefine
                  what it means to experience a WISA match live.
                </p>
                {/* Tier indicators */}
                <div className="mt-6 space-y-2">
                  {[
                    { label: 'Platinum', pct: '100%' },
                    { label: 'Gold', pct: '72%' },
                    { label: 'Silver', pct: '48%' },
                  ].map(tier => (
                    <div key={tier.label} className="flex items-center gap-3">
                      <span className="font-mono text-white/30 text-[9px] w-12">{tier.label}</span>
                      <div className="flex-1 h-px bg-white/10 relative">
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-white/40"
                          initial={{ width: 0 }}
                          whileInView={{ width: tier.pct }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* Fan Experiences */}
              <Reveal delay={0.25} className="p-8 flex-1">
                <div className="flex items-start justify-between mb-6">
                  <Users size={20} className="text-white/40" strokeWidth={1.2} />
                  <span className="font-mono text-white/20 text-[9px] tracking-[0.2em] uppercase">
                    04
                  </span>
                </div>
                <h3 className="font-sans font-semibold text-white text-lg mb-3 leading-tight">
                  Fan Experiences
                </h3>
                <p className="font-sans text-white/45 text-xs leading-relaxed">
                  Digital fan IDs, AR stadium guides, exclusive NFT collectibles, and
                  community hubs connecting supporters worldwide.
                </p>
                <div className="mt-6 flex items-center gap-2">
                  <Star size={10} className="text-white/40" />
                  <Star size={10} className="text-white/40" />
                  <Star size={10} className="text-white/40" />
                  <Star size={10} className="text-white/40" />
                  <Star size={10} className="text-white/40" />
                  <span className="font-mono text-white/25 text-[9px] ml-1">
                    4.9 / 3.2B Fans
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            SECTION 3 — GLASSMORPHISM FOOTER
        ════════════════════════════════════ */}
        <section
          ref={screen3Ref}
          className="pointer-events-auto relative py-16 pb-0"
          style={{ width: '90vw', margin: '0 auto' }}
          id="connect"
        >
          {/* Glassmorphism Footer Card */}
          <div
            className="w-full border border-white/10 overflow-hidden"
            style={{
              background: 'rgba(26,26,26,0.6)',
              backdropFilter: 'blur(80px)',
              WebkitBackdropFilter: 'blur(80px)',
            }}
          >
            {/* Top CTA Block */}
            <div className="border-b border-white/8 px-10 py-16">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-5 h-px bg-white/30" />
                    <span className="font-mono text-white/35 text-[10px] tracking-[0.3em] uppercase">
                      Get Started
                    </span>
                  </div>
                  <h2
                    className="font-sans font-bold text-white leading-tight"
                    style={{ fontSize: 'clamp(2rem, 4.5vw, 3.8rem)' }}
                  >
                    Ready To Score
                    <br />
                    <span className="italic font-light text-white/60">
                      Your Winning Season?
                    </span>
                  </h2>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="#"
                    className="font-mono text-xs tracking-widest uppercase px-7 py-4 bg-white text-black hover:bg-white/90 transition-colors duration-200 text-center"
                  >
                    Join WISA
                  </a>
                  <a
                    href="#"
                    className="font-mono text-xs tracking-widest uppercase px-7 py-4 border border-white/20 text-white/70 hover:text-white hover:border-white/50 transition-all duration-200 text-center"
                    style={{ backdropFilter: 'blur(20px)' }}
                  >
                    View Fixtures
                  </a>
                </div>
              </div>
            </div>

            {/* 4-Column Footer Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 border-b border-white/8">
              {/* Brand */}
              <div className="px-8 py-10" style={{ background: 'rgba(26,26,26,0.4)' }}>
                <div className="flex items-center gap-2 mb-5">
                  <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="19" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />
                    <polygon points="20,8 28,14 25,24 15,24 12,14" stroke="white" strokeWidth="1.2" fill="none" strokeOpacity="0.6" />
                    <circle cx="20" cy="20" r="3" fill="white" fillOpacity="0.6" />
                  </svg>
                  <span className="font-mono text-white/60 font-bold text-xs tracking-widest uppercase">WISA</span>
                </div>
                <p className="font-sans text-white/35 text-xs leading-relaxed">
                  Governing the beautiful game with excellence, integrity, and a commitment to football's
                  global future.
                </p>
                <div className="mt-6 font-mono text-white/20 text-[9px] tracking-wider">
                  EST. 1988 · GENEVA
                </div>
              </div>

              {/* Company */}
              <div className="px-8 py-10" style={{ background: 'rgba(26,26,26,0.4)' }}>
                <h4 className="font-mono text-white/25 text-[9px] tracking-[0.25em] uppercase mb-5">
                  Company
                </h4>
                <ul className="space-y-3">
                  {['About WISA', 'Leadership', 'Governance', 'Press Room', 'Careers'].map(item => (
                    <li key={item}>
                      <a
                        href="#"
                        className="font-sans text-white/45 hover:text-white text-xs transition-colors duration-200"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Services */}
              <div className="px-8 py-10" style={{ background: 'rgba(26,26,26,0.4)' }}>
                <h4 className="font-mono text-white/25 text-[9px] tracking-[0.25em] uppercase mb-5">
                  Services
                </h4>
                <ul className="space-y-3">
                  {['Match Passes', 'Club Licensing', 'Player Registry', 'Analytics Suite', 'Media Rights'].map(item => (
                    <li key={item}>
                      <a
                        href="#"
                        className="font-sans text-white/45 hover:text-white text-xs transition-colors duration-200"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Connect */}
              <div className="px-8 py-10" style={{ background: 'rgba(26,26,26,0.4)' }}>
                <h4 className="font-mono text-white/25 text-[9px] tracking-[0.25em] uppercase mb-5">
                  Connect
                </h4>
                <ul className="space-y-3">
                  {['Twitter / X', 'Instagram', 'YouTube', 'LinkedIn', 'Fan Portal'].map(item => (
                    <li key={item}>
                      <a
                        href="#"
                        className="font-sans text-white/45 hover:text-white text-xs transition-colors duration-200"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Copyright Bar */}
            <div className="px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="font-mono text-white/20 text-[9px] tracking-[0.2em] uppercase">
                © 2025 World International Sports Association. All rights reserved.
              </span>
              <div className="flex items-center gap-6">
                {['Privacy Policy', 'Terms of Use', 'Cookie Settings'].map(item => (
                  <a
                    key={item}
                    href="#"
                    className="font-mono text-white/20 hover:text-white/50 text-[9px] tracking-wider uppercase transition-colors duration-200"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
