import type { Metadata } from 'next';
import { ApolloProvider } from '@/providers/ApolloProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'ePaper Hub',
  description: 'Your digital newspaper archive',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ApolloProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
