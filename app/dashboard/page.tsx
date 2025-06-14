"use client";

import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Dashboard() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            // Redirect to login if not authenticated
            router.push("/login");
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return null; // This will be handled by the useEffect redirect
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Welcome, {user.email}</h2>
                <div className="mb-4">
                    <p>You are successfully logged in with Google.</p>
                </div>
                <button
                    onClick={() => {
                        supabase.auth.signOut();
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
} 