import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Games - Spudin Game List',
  description: 'Discover and track your favorite games',
};

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
} 