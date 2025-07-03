import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Game Details - Spudin Game List',
  description: 'View game details and add to your collection',
};

export default function GameDetailsLayout({
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