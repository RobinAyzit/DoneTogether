import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, UserPlus, Check, XCircle, Users as UsersIcon, Loader } from 'lucide-react';
import { useFriends, useFriendRequests, searchUserByEmail, sendFriendRequest, acceptFriendRequest, declineFriendRequest, removeFriend } from '../hooks/useFriends';
import type { UserProfile } from '../types';

interface FriendsModalProps {
    onClose: () => void;
    currentUser: UserProfile;
}

export function FriendsModal({ onClose, currentUser }: FriendsModalProps) {
    const [searchEmail, setSearchEmail] = useState('');
    const [searchResult, setSearchResult] = useState<UserProfile | null>(null);
    const [searching, setSearching] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [actionMessage, setActionMessage] = useState('');

    const { friends, loading: friendsLoading } = useFriends(currentUser.uid);
    const { incomingRequests, outgoingRequests } = useFriendRequests(currentUser.uid);

    const handleSearch = async () => {
        if (!searchEmail.trim()) return;

        setSearching(true);
        setSearchError('');
        setSearchResult(null);

        try {
            const user = await searchUserByEmail(searchEmail.trim());
            if (!user) {
                setSearchError('Ingen användare hittades med den e-postadressen');
            } else if (user.uid === currentUser.uid) {
                setSearchError('Du kan inte lägga till dig själv som vän');
            } else {
                setSearchResult(user);
            }
        } catch (error: any) {
            setSearchError('Ett fel uppstod vid sökningen');
        } finally {
            setSearching(false);
        }
    };

    const handleSendRequest = async (toUser: UserProfile) => {
        try {
            await sendFriendRequest(currentUser, toUser);
            setActionMessage('Vänförfrågan skickad!');
            setSearchResult(null);
            setSearchEmail('');
            setTimeout(() => setActionMessage(''), 2000);
        } catch (error: any) {
            setSearchError(error.message);
        }
    };

    const handleAcceptRequest = async (requestId: string) => {
        try {
            await acceptFriendRequest(requestId);
            setActionMessage('Vänförfrågan accepterad!');
            setTimeout(() => setActionMessage(''), 2000);
        } catch (error: any) {
            console.error('Error accepting request:', error);
        }
    };

    const handleDeclineRequest = async (requestId: string) => {
        try {
            await declineFriendRequest(requestId);
            setActionMessage('Vänförfrågan avvisad');
            setTimeout(() => setActionMessage(''), 2000);
        } catch (error: any) {
            console.error('Error declining request:', error);
        }
    };

    const handleRemoveFriend = async (friendId: string) => {
        if (!confirm('Är du säker på att du vill ta bort denna vän?')) return;

        try {
            await removeFriend(currentUser.uid, friendId);
            setActionMessage('Vän borttagen');
            setTimeout(() => setActionMessage(''), 2000);
        } catch (error: any) {
            console.error('Error removing friend:', error);
        }
    };

    const isAlreadyFriend = (uid: string) => friends.some((f) => f.uid === uid);
    const hasPendingRequest = (uid: string) =>
        outgoingRequests.some((r) => r.to === uid) ||
        incomingRequests.some((r) => r.from === uid);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-900 rounded-3xl border border-zinc-800 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                            <UsersIcon className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">Vänner</h2>
                            <p className="text-sm text-zinc-400">Hantera vänner och dela planer</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Action Message */}
                <AnimatePresence>
                    {actionMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mx-6 mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center"
                        >
                            {actionMessage}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6 space-y-6">
                    {/* Search Section */}
                    <div>
                        <h3 className="text-sm font-medium mb-3 text-zinc-400 uppercase tracking-wider">
                            Lägg till vän
                        </h3>
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="email"
                                    value={searchEmail}
                                    onChange={(e) => setSearchEmail(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="Sök efter Gmail-adress..."
                                    className="w-full h-12 pl-10 pr-4 bg-zinc-800 border border-zinc-700 rounded-xl outline-none focus:border-emerald-500 transition"
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                disabled={searching || !searchEmail.trim()}
                                className="px-6 h-12 rounded-xl bg-emerald-500 text-black font-medium hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 transition flex items-center gap-2"
                            >
                                {searching ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                                Sök
                            </button>
                        </div>

                        {searchError && (
                            <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {searchError}
                            </div>
                        )}

                        {searchResult && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-3 p-4 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    {searchResult.photoURL ? (
                                        <img src={searchResult.photoURL} alt="" className="w-10 h-10 rounded-full" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-lg">
                                            {searchResult.displayName[0].toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <div className="font-medium">{searchResult.displayName}</div>
                                        <div className="text-sm text-zinc-400">{searchResult.email}</div>
                                    </div>
                                </div>

                                {isAlreadyFriend(searchResult.uid) ? (
                                    <div className="text-sm text-zinc-500">Redan vänner</div>
                                ) : hasPendingRequest(searchResult.uid) ? (
                                    <div className="text-sm text-zinc-500">Förfrågan skickad</div>
                                ) : (
                                    <button
                                        onClick={() => handleSendRequest(searchResult)}
                                        className="px-4 py-2 rounded-lg bg-emerald-500 text-black text-sm font-medium hover:bg-emerald-400 transition flex items-center gap-2"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        Lägg till
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Incoming Requests */}
                    {incomingRequests.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium mb-3 text-zinc-400 uppercase tracking-wider">
                                Väntande förfrågningar ({incomingRequests.length})
                            </h3>
                            <div className="space-y-2">
                                {incomingRequests.map((request) => (
                                    <motion.div
                                        key={request.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            {request.fromPhoto ? (
                                                <img src={request.fromPhoto} alt="" className="w-10 h-10 rounded-full" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-lg">
                                                    {request.fromName[0].toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium">{request.fromName}</div>
                                                <div className="text-sm text-zinc-400">{request.fromEmail}</div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAcceptRequest(request.id)}
                                                className="p-2 rounded-lg bg-emerald-500 text-black hover:bg-emerald-400 transition"
                                                title="Acceptera"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeclineRequest(request.id)}
                                                className="p-2 rounded-lg bg-zinc-700 text-zinc-400 hover:bg-zinc-600 transition"
                                                title="Avvisa"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Friends List */}
                    <div>
                        <h3 className="text-sm font-medium mb-3 text-zinc-400 uppercase tracking-wider">
                            Mina vänner ({friends.length})
                        </h3>
                        {friendsLoading ? (
                            <div className="text-center py-8 text-zinc-500">Laddar...</div>
                        ) : friends.length === 0 ? (
                            <div className="text-center py-8 text-zinc-500">
                                Inga vänner än. Sök efter en Gmail-adress för att lägga till vänner!
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {friends.map((friend) => (
                                    <div
                                        key={friend.uid}
                                        className="p-4 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            {friend.photoURL ? (
                                                <img src={friend.photoURL} alt="" className="w-10 h-10 rounded-full" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-lg">
                                                    {friend.displayName[0].toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium">{friend.displayName}</div>
                                                <div className="text-sm text-zinc-400">{friend.email}</div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleRemoveFriend(friend.uid)}
                                            className="text-sm text-zinc-500 hover:text-red-400 transition"
                                        >
                                            Ta bort
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
