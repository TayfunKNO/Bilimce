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
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 40,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 32,
          }}
        >
          B
        </div>
        <div style={{ fontSize: 64, fontWeight: 'bold', color: 'white', marginBottom: 16 }}>
          BİLİMCE
        </div>
        <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.5)', textAlign: 'center', maxWidth: 700 }}>
          Bilimsel araştırmaları Türkçe keşfet
        </div>
        <div
          style={{
            marginTop: 40,
            padding: '12px 32px',
            borderRadius: 50,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            color: 'white',
            fontSize: 20,
          }}
        >
          bilimce.vercel.app
        </div>
      </div>
    ),
    { ...size }
  )
}
