import './globals.css'

export const metadata = {
  title: 'Doodle to Image Generator',
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