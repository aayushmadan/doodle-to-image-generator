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
    <main className="md:h-screen h-full flex-1 items-center justify-center sm:w-screen ">
      <div className='md:h-screen h-full bg-gray-100 rounded-lg p-2 w-full sm:w-screen flex flex-col items-center justify-start text-center'>
        <h1
          className={`${cabin.className} text-[28px] md:text-4xl mt-3 mb-3 text-all bg-gradient-to-r from-pink-600 to-blue-700 inline-block text-transparent bg-clip-text h-16`}
          style={{ fontWeight: 700 }}
        >
          Doodle to Image Generator
        </h1>
        <Suspense fallback={<div>Loading...</div>}>
          <ImageGenerator className={`${cabin.className} -mt-8`} />
        </Suspense>
      </div>
    </main>
  )
}