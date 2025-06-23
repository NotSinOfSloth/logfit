"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/login");
        }
    }, [user]);

    if (!user) return null; // Optional: show loading spinner

    return (
        <main className="p-4">
            <h1 className="text-2xl font-bold">Welcome, {user.email}!</h1>
        </main>
    );
}
