"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Login successful!");
        } catch (error: any) {
            alert(error.message);
        }
    };

    const register = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Registered successfully!");
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
            <h1 className="text-2xl font-bold">Login</h1>
            <input
                type="email"
                placeholder="Email"
                className="p-2 border rounded w-full max-w-xs"
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                className="p-2 border rounded w-full max-w-xs"
                onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex gap-4">
                <button onClick={login} className="px-4 py-2 bg-blue-500 text-white rounded">
                    Log In
                </button>
                <button onClick={register} className="px-4 py-2 bg-gray-500 text-white rounded">
                    Sign Up
                </button>
            </div>
        </main>
    );
}
