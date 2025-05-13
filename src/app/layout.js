import './globals.css'

export const metadata = {
  title: 'Doodlify',
  description: 'Turn your doodles into realistic images using AI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
    
  )
}