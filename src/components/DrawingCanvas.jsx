'use client'

import { useEffect, useRef, useState } from 'react'

export default function DrawingCanvas({ onDraw }) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const contextRef = useRef(null)
  const canvasInstanceRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Get the display size of the canvas
    const displayWidth = canvas.clientWidth
    const displayHeight = canvas.clientHeight
    
    // Set the canvas internal size to match its display size
    canvas.width = displayWidth
    canvas.height = displayHeight
    
    // Get canvas context
    const context = canvas.getContext('2d')
    context.lineCap = 'round'
    context.strokeStyle = 'black'
    context.lineWidth = 5
    
    // Fill with white background
    context.fillStyle = 'white'
    context.fillRect(0, 0, canvas.width, canvas.height)
    
    contextRef.current = context

    // Create canvas instance only once
    if (!canvasInstanceRef.current) {
      canvasInstanceRef.current = {
        canvas: canvas,
        clear: () => {
          context.fillStyle = 'white'
          context.fillRect(0, 0, canvas.width, canvas.height)
        },
        getDataURL: () => {
          return canvas.toDataURL('image/png')
        }
      }
      
      // Pass to parent only once
      if (onDraw) {
        onDraw(canvasInstanceRef.current)
      }
    }
  }, [])

  // Get correct cursor coordinates relative to canvas
  const getCursorPosition = (event) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return { x, y }
  }

  const startDrawing = (event) => {
    const { x, y } = getCursorPosition(event)
    contextRef.current.beginPath()
    contextRef.current.moveTo(x, y)
    setIsDrawing(true)
  }

  const finishDrawing = () => {
    contextRef.current.closePath()
    setIsDrawing(false)
  }

  const draw = (event) => {
    if (!isDrawing) return
    
    const { x, y } = getCursorPosition(event)
    contextRef.current.lineTo(x, y)
    contextRef.current.stroke()
  }

  // Add touch events for mobile support
  const handleTouchStart = (e) => {
    e.preventDefault()
    const touch = e.touches[0]
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top
    
    contextRef.current.beginPath()
    contextRef.current.moveTo(x, y)
    setIsDrawing(true)
  }

  const handleTouchMove = (e) => {
    if (!isDrawing) return
    e.preventDefault()
    
    const touch = e.touches[0]
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top
    
    contextRef.current.lineTo(x, y)
    contextRef.current.stroke()
  }

  const handleTouchEnd = (e) => {
    e.preventDefault()
    contextRef.current.closePath()
    setIsDrawing(false)
  }

  return (
    <div className="w-full flex justify-center">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        onMouseLeave={finishDrawing}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="border-2 border-gray-400 rounded-lg touch-none"
        width="400"
        height="400"
        style={{ width: '400px', height: '400px' }}
      />
    </div>
  )
}