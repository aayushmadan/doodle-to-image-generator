'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Cabin } from 'next/font/google';

const cabin = Cabin({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

// Dynamically importing the ImageGenerator component with no SSR
const ImageGenerator = dynamic(() => import('@/components/ImageGenerator'), {
  ssr: false,
})

export default function Home() {
  return (
    <main className="h-screen flex flex-col items-center justify-center">
      <div className='h-screen bg-gray-100 rounded-lg p-2 w-full flex flex-col items-center justify-center '>
        <h1
          className={`${cabin.className} text-4xl mt-2 mb-7  text-all bg-gradient-to-r from-pink-600 to-blue-700 inline-block text-transparent bg-clip-text h-11`}
          style={{ fontWeight: 700 }}
        >
          Doodle to Image Generator
        </h1>
        <Suspense fallback={<div>Loading...</div>}>
          <ImageGenerator />
        </Suspense>
      </div>
    </main>
  )
}