import './globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-main',
});

export const metadata = {
  title: 'Kissan Bazaar - Direct Farm to Buyer Marketplace',
  description: 'Digital marketplace connecting farmers directly with buyers to eliminate intermediaries.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="font-sans bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col justify-between">
        {children}
      </body>
    </html>
  );
}
