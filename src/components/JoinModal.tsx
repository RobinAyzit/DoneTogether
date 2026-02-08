import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight, Loader, Link as LinkIcon } from 'lucide-react';
import { getInviteByCode, incrementInviteUse } from '../hooks/useInvites';
import { addMemberToPlan } from '../hooks/useFirestore';
import type { UserProfile } from '../types';

interface JoinModalProps {
    onClose: () => void;
    onJoin: (planId: string) => void;
    user: { uid: string };
    userProfile: UserProfile;
}

export function JoinModal({ onClose, onJoin, user, userProfile }: JoinModalProps) {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleJoin = async () => {
        if (!input.trim()) return;

        setLoading(true);
        setError('');

        try {
            // Extract code from URL if full link is pasted
            let code = input.trim();
            if (code.includes('/join/')) {
                code = code.split('/join/')[1];
            }

            const invite = await getInviteByCode(code);

            if (!invite) {
                setError('Ogiltig eller utgången inbjudningskod');
                setLoading(false);
                return;
            }

            await addMemberToPlan(
                invite.planId,
                user.uid,
                userProfile.email,
                userProfile.displayName,
                userProfile.photoURL
            );

            await incrementInviteUse(code);

            onJoin(invite.planId);
            onClose();
        } catch (err: any) {
            console.error('Error joining plan:', err);
            setError('Kunde inte gå med i planen. Försök igen.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-900 rounded-3xl border border-zinc-800 max-w-md w-full p-8 relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-zinc-400 hover:text-white transition"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-6">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 border border-purple-500/20">
                        <LinkIcon className="w-6 h-6 text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Done Together</h2>
                    <p className="text-zinc-400 text-sm">
                        Klistra in en inbjudningslänk eller kod för att gå med i en plan.
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="T.ex. https://.../join/ABC123"
                            className="w-full h-12 px-4 bg-zinc-950 border border-zinc-800 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition outline-none"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleJoin}
                        disabled={loading || !input.trim()}
                        className="w-full h-12 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-500 disabled:opacity-50 disabled:hover:bg-purple-600 transition flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader className="w-4 h-4 animate-spin" />
                                Går med...
                            </>
                        ) : (
                            <>
                                Gå med
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
