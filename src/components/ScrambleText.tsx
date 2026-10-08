import { useState, useEffect } from 'react'

const CHARS = '0123456789!@#$%&'

interface ScrambleTextProps {
  text: string
  delay?: number // dalam milidetik
  duration?: number // total durasi dalam milidetik
}

export function ScrambleText({ text, delay = 0, duration = 1200 }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState('')

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    let interval: ReturnType<typeof setInterval>

    timeout = setTimeout(() => {
      let iteration = 0
      // Berapa lama interval per frame? (Misal 30ms per frame)
      const frameRate = 30
      const totalFrames = duration / frameRate
      const lettersToRevealPerFrame = text.length / totalFrames

      interval = setInterval(() => {
        setDisplayText(() => {
          return text
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' ' // Jangan acak spasi
              if (index < iteration) {
                return text[index] // Huruf asli sudah terbuka
              }
              // Huruf acak untuk sisa karakter
              return CHARS[Math.floor(Math.random() * CHARS.length)]
            })
            .join('')
        })

        iteration += lettersToRevealPerFrame

        if (iteration >= text.length) {
          clearInterval(interval)
          setDisplayText(text) // Pastikan teks akhir benar
        }
      }, frameRate)
    }, delay)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [text, delay, duration])

  // Menampilkan karakter kosong dengan spasi invisible (opacity 0) agar tinggi tetap terjaga sebelum animasi dimulai
  if (!displayText) {
    return <span style={{ opacity: 0 }}>{text}</span>
  }

  return <span>{displayText}</span>
}

