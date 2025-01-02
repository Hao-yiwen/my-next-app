export const metadata = {
  title: 'Next.js App Router Example',
  description: 'Example page using App Router',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
} 