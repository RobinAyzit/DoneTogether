import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Link as LinkIcon, Copy, Check, Users as UsersIcon } from 'lucide-react';
import { getOrCreatePlanInvite, generateInviteLink } from '../hooks/useInvites';
import { useFriends } from '../hooks/useFriends';
import { addMemberToPlan } from '../hooks/useFirestore';
import type { Plan } from '../types';

interface ShareModalProps {
    plan: Plan;
    currentUserId: string;
    currentUserName: string;
    onClose: () => void;
}

export function ShareModal({ plan, currentUserId, currentUserName, onClose }: ShareModalProps) {
    const [inviteLink, setInviteLink] = useState('');
    const [copied, setCopied] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [shareMessage, setShareMessage] = useState('');

    const { friends } = useFriends(currentUserId);

    const handleGenerateLink = async () => {
        setGenerating(true);
        try {
            const code = await getOrCreatePlanInvite(plan.id, plan.name, currentUserId, currentUserName);
            const link = generateInviteLink(code);
            setInviteLink(link);
        } catch (error: any) {
            console.error('Error generating invite:', error);
        } finally {
            setGenerating(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShareWithFriend = async (friendUid: string, friendEmail: string, friendName: string, friendPhoto?: string) => {
        try {
            await addMemberToPlan(plan.id, friendUid, friendEmail, friendName, friendPhoto);
            setShareMessage(`${friendName} har lagts till i planen!`);
            setTimeout(() => setShareMessage(''), 2000);
        } catch (error: any) {
            console.error('Error sharing with friend:', error);
        }
    };

    const isMember = (uid: string) => !!plan.members[uid];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-900 rounded-3xl border border-zinc-800 max-w-lg w-full"
            >
                {/* Header */}
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Dela planen</h2>
                        <p className="text-sm text-zinc-400 mt-1">{plan.name}</p>
                    </div>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {shareMessage && (
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center">
                            {shareMessage}
                        </div>
                    )}

                    {/* Generate Link */}
                    <div>
                        <h3 className="text-sm font-medium mb-3 text-zinc-400 uppercase tracking-wider">
                            Skapa delningslänk
                        </h3>
                        {!inviteLink ? (
                            <button
                                onClick={handleGenerateLink}
                                disabled={generating}
                                className="w-full h-12 rounded-xl bg-emerald-500 text-black font-medium hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 transition flex items-center justify-center gap-2"
                            >
                                <LinkIcon className="w-4 h-4" />
                                {generating ? 'Genererar...' : 'Generera delningslänk'}
                            </button>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={inviteLink}
                                        readOnly
                                        className="flex-1 h-12 px-4 bg-zinc-800 border border-zinc-700 rounded-xl text-sm"
                                    />
                                    <button
                                        onClick={handleCopy}
                                        className="px-4 h-12 rounded-xl bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition flex items-center gap-2"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                        {copied ? 'Kopierad!' : 'Kopiera'}
                                    </button>
                                </div>
                                <p className="text-xs text-zinc-500 text-center">
                                    Dela denna länk med vem som helst för att bjuda in dem till planen
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Share with Friends */}
                    {friends.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium mb-3 text-zinc-400 uppercase tracking-wider">
                                Dela med vänner
                            </h3>
                            <div className="space-y-2 max-h-64 overflow-auto">
                                {friends.map((friend) => (
                                    <div
                                        key={friend.uid}
                                        className="p-3 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            {friend.photoURL ? (
                                                <img src={friend.photoURL} alt="" className="w-8 h-8 rounded-full" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-sm">
                                                    {friend.displayName[0].toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium text-sm">{friend.displayName}</div>
                                                <div className="text-xs text-zinc-400">{friend.email}</div>
                                            </div>
                                        </div>

                                        {isMember(friend.uid) ? (
                                            <div className="text-xs text-zinc-500">Redan medlem</div>
                                        ) : (
                                            <button
                                                onClick={() => handleShareWithFriend(friend.uid, friend.email, friend.displayName, friend.photoURL)}
                                                className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-medium hover:bg-emerald-400 transition"
                                            >
                                                Bjud in
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Current Members */}
                    <div>
                        <h3 className="text-sm font-medium mb-3 text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                            <UsersIcon className="w-4 h-4" />
                            Medlemmar ({Object.keys(plan.members).length})
                        </h3>
                        <div className="space-y-2">
                            {Object.values(plan.members).map((member) => (
                                <div
                                    key={member.uid}
                                    className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        {member.photoURL ? (
                                            <img src={member.photoURL} alt="" className="w-8 h-8 rounded-full" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-sm">
                                                {member.displayName[0].toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-medium text-sm">{member.displayName}</div>
                                            <div className="text-xs text-zinc-400">{member.email}</div>
                                        </div>
                                    </div>
                                    <div className="text-xs px-2 py-1 rounded bg-zinc-700/50 text-zinc-400">
                                        {member.role === 'owner' ? 'Ägare' : member.role === 'editor' ? 'Redaktör' : 'Läsare'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
