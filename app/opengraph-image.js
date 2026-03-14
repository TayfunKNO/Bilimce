import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'BİLİMCE - Bilimsel Araştırmalar Türkçe'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0f',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Arka plan degrade çemberler */}
        <div style={{
          position: 'absolute', top: -100, left: -100,
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.15), transparent)',
        }} />
        <div style={{
          position: 'absolute', bottom: -100, right: -100,
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.15), transparent)',
        }} />

        {/* Bilim ikonları */}
        <div style={{
          display: 'flex', gap: 40, marginBottom: 32,
          fontSize: 56,
        }}>
          <span>🧬</span>
          <span>⚛️</span>
          <span>🔬</span>
          <span>🧪</span>
          <span>🧠</span>
        </div>

        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24,
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: 18,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, fontWeight: 'bold', color: 'white',
          }}>B</div>
          <div style={{
            fontSize: 72, fontWeight: '900', color: 'white',
            letterSpacing: -2,
          }}>BİLİMCE</div>
        </div>

        {/* Alt yazı */}
        <div style={{
          fontSize: 32, color: 'rgba(255,255,255,0.5)',
          textAlign: 'center', maxWidth: 800, marginBottom: 36,
          lineHeight: 1.4,
        }}>
          Bilimsel araştırmaları Türkçe keşfet
        </div>

        {/* URL */}
        <div style={{
          padding: '14px 40px', borderRadius: 50,
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          color: 'white', fontSize: 24, fontWeight: '600',
          letterSpacing: 1,
        }}>
          bilimce.vercel.app
        </div>
      </div>
    ),
    { ...size }
  )
}
