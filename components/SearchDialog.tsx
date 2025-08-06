'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogHeader,
} from '@/components/ui/dialog';
import { GameSearch } from './GameSearch';
import { Button } from './ui/button';

interface SearchDialogProps {
    triggerClassName?: string;
    buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    buttonText?: string;
    buttonIcon?: boolean;
}

export function SearchDialog({
    triggerClassName = '',
    buttonVariant = 'outline',
    buttonText = 'Search',
    buttonIcon = true
}: SearchDialogProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const handleGameSelect = (gameId: number) => {
        setIsOpen(false);
        router.push(`/games/${gameId}`);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant={buttonVariant} className={triggerClassName}>
                    {buttonIcon && (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 h-4 w-4"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                    )}
                    {buttonText}
                </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-[95vw] sm:max-w-[900px] max-h-[90vh] sm:max-h-[95vh] overflow-hidden bg-slate-800 border-slate-700 flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="text-2xl sm:text-3xl font-bold text-center mb-2 sm:mb-4">Game Search</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-auto">
                    <GameSearch onGameSelect={handleGameSelect} className="h-full" />
                </div>
            </DialogContent>
        </Dialog>
    );
} 