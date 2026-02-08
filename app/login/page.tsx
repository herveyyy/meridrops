"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Server, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });
        if (result?.error) {
            setError("Invalid credentials or server access denied.");
            setLoading(false);
        } else {
            router.push("/admin/"); // Redirect to your panel
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
            {/* Background Glow Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md z-10">
                {/* Logo / Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary/10 border border-secondary/20 mb-4">
                        <ShieldCheck className="w-8 h-8 text-secondary" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Admin Portal
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Secure access for file management
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-surface/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-xl text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-gray-400 font-semibold ml-1">
                                Admin Email
                            </label>
                            <div className="relative">
                                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@system.com"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-gray-400 font-semibold ml-1">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="••••••••"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 transition-all text-sm"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-secondary hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {loading ? "Authenticating..." : "Sign In to Panel"}
                            {!loading && (
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Info */}
                <div className="mt-8 flex items-center justify-center gap-4 text-[10px] uppercase tracking-[0.2em] text-gray-600 font-bold">
                    <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-success rounded-full" />
                        SYSTEM OPERATIONAL
                    </div>
                    <span className="text-white/10">|</span>
                    <div className="flex items-center gap-1">
                        <Server className="w-3 h-3" />
                        ENCRYPTED SESSION
                    </div>
                </div>
            </div>
        </div>
    );
}
