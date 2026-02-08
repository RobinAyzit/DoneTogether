import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Plus, Share2, Trash2, Pencil, Check, Users, User, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import {
  usePlans,
  usePlan,
  createPlan,
  updateItem,
  deleteItem,
  toggleItemChecked,
  addItemToPlan,
  deletePlan,
  updatePlan,
  addMemberToPlan
} from './hooks/useFirestore';
import { useFriendRequests } from './hooks/useFriends';
import { getInviteByCode, incrementInviteUse } from './hooks/useInvites';
import { JoinModal } from './components/JoinModal';
import { AuthModal } from './components/AuthModal';
import { FriendsModal } from './components/FriendsModal';
import { ShareModal } from './components/ShareModal';
import type { Plan, Item } from './types';


function App() {
  const { user, userProfile, loading: authLoading, error: authError, signInWithGoogle, signOut, isAuthenticated } = useAuth();
  const { plans, loading: _plansLoading } = usePlans(user?.uid);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const { plan: currentPlan } = usePlan(currentPlanId);
  const { incomingRequests } = useFriendRequests(user?.uid);

  const [activeTab, setActiveTab] = useState<'home' | 'plans' | 'profile'>('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<{ planId: string; item: Item } | null>(null);
  const [newPlanName, setNewPlanName] = useState('');
  const [toast, setToast] = useState('');
  const [addInput, setAddInput] = useState('');
  const [creatingPlan, setCreatingPlan] = useState(false);

  // Invite handling state
  const [pendingInviteCode, setPendingInviteCode] = useState<string | null>(null);
  const [joiningPlan, setJoiningPlan] = useState(false);

  // Check for invite code in URL on mount
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/join/')) {
      const code = path.split('/join/')[1];
      if (code) {
        setPendingInviteCode(code);
      }
    }
  }, []);

  // Handle joining plan when authenticated
  useEffect(() => {
    const handleJoin = async () => {
      if (!pendingInviteCode || !user || !userProfile || joiningPlan) return;

      setJoiningPlan(true);
      try {
        const invite = await getInviteByCode(pendingInviteCode);

        if (!invite) {
          showToast('Ogiltig eller utgången inbjudningslänk');
          setPendingInviteCode(null);
          window.history.replaceState({}, '', '/');
          return;
        }

        // Check if already a member (optimization)
        // We don't have the plan loaded yet, so we proceed to try adding
        // addMemberToPlan uses updateDoc which is safe

        await addMemberToPlan(
          invite.planId,
          user.uid,
          userProfile.email,
          userProfile.displayName,
          userProfile.photoURL
        );

        await incrementInviteUse(pendingInviteCode);

        showToast(`Gick med i ${invite.planName}!`);
        setCurrentPlanId(invite.planId);
        setActiveTab('plans');

        // Cleanup
        setPendingInviteCode(null);
        window.history.replaceState({}, '', '/');
      } catch (error) {
        console.error('Error joining plan:', error);
        showToast('Kunde inte gå med i planen');
      } finally {
        setJoiningPlan(false);
      }
    };

    handleJoin();
  }, [pendingInviteCode, user, userProfile]);

  // Show auth modal on load if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setShowAuthModal(true);
    } else if (isAuthenticated) {
      // Auto close auth modal when authenticated
      setShowAuthModal(false);
    }
  }, [authLoading, isAuthenticated]);

  // Trigger confetti when plan is completed
  useEffect(() => {
    if (currentPlan?.completed) {
      triggerConfetti();
    }
  }, [currentPlan?.completed]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 2200);
  };

  const triggerConfetti = () => {
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  const createNewPlan = async () => {
    if (!newPlanName.trim() || !user || !userProfile) return;

    setCreatingPlan(true);
    try {
      const planId = await createPlan(
        newPlanName.trim(),
        user.uid,
        userProfile.email,
        userProfile.displayName,
        userProfile.photoURL
      );

      setCurrentPlanId(planId);
      setNewPlanName('');
      setShowCreateModal(false);
      setActiveTab('plans');
      showToast('Plan skapad!');
    } catch (error: any) {
      console.error('Error creating plan:', error);
      showToast('Kunde inte skapa plan');
    } finally {
      setCreatingPlan(false);
    }
  };

  const handleToggleItem = async (planId: string, itemId: string) => {
    if (!user || !userProfile) return;

    try {
      await toggleItemChecked(planId, itemId, user.uid, userProfile.displayName);
    } catch (error: any) {
      console.error('Error toggling item:', error);
      showToast('Kunde inte uppdatera');
    }
  };

  const handleAddItem = async (planId: string, text: string) => {
    if (!text.trim()) return;

    try {
      await addItemToPlan(planId, text);
      setAddInput('');
      showToast('Punkt tillagd');
    } catch (error: any) {
      console.error('Error adding item:', error);
      showToast('Kunde inte lägga till');
    }
  };

  const handleDeleteItem = async (planId: string, itemId: string) => {
    try {
      await deleteItem(planId, itemId);
      showToast('Punkt borttagen');
    } catch (error: any) {
      console.error('Error deleting item:', error);
    }
  };

  const handleEditItem = async (planId: string, itemId: string, newText: string) => {
    if (!newText.trim()) return;

    try {
      await updateItem(planId, itemId, { text: newText.trim() });
      setShowEditModal(false);
      setEditingItem(null);
      showToast('Punkt uppdaterad');
    } catch (error: any) {
      console.error('Error editing item:', error);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!window.confirm('Radera denna plan?')) return;

    try {
      await deletePlan(planId);
      if (currentPlanId === planId) {
        setCurrentPlanId(null);
      }
      showToast('Plan raderad');
    } catch (error: any) {
      console.error('Error deleting plan:', error);
    }
  };

  const handleReopenPlan = async (planId: string) => {
    try {
      await updatePlan(planId, { completed: false });
      showToast('Plan öppnad igen');
    } catch (error: any) {
      console.error('Error reopening plan:', error);
    }
  };

  const openEditModal = (planId: string, item: Item) => {
    setEditingItem({ planId, item });
    setShowEditModal(true);
  };

  const getProgress = (plan: Plan) => {
    if (!plan.items || plan.items.length === 0) return 0;
    const checked = plan.items.filter((i) => i.checked).length;
    return Math.round((checked / plan.items.length) * 100);
  };

  // Safe sort with fallback
  const sortedPlans = [...plans].sort((a, b) => {
    const timeA = a.created?.toMillis?.() || 0;
    const timeB = b.created?.toMillis?.() || 0;
    return timeB - timeA;
  });
  const activePlans = sortedPlans.filter((p) => !p.completed);
  const completedPlans = sortedPlans.filter((p) => p.completed);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Check className="w-8 h-8 text-black" />
          </div>
          <div className="text-xl font-semibold italic">Share Plans Done Together</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 border-b border-zinc-800/50 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Check className="w-6 h-6 text-black" />
            </div>
            <div>
              <div className="font-bold text-xl tracking-tight">Share Plans Done Together</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {incomingRequests && incomingRequests.length > 0 && (
              <button
                onClick={() => setShowFriendsModal(true)}
                className="relative p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                title="Vänförfrågningar"
              >
                <Users className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-zinc-950">
                  {incomingRequests.length}
                </span>
              </button>
            )}

            {isAuthenticated && userProfile ? (
              <button
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-3 p-1 pr-3 rounded-2xl hover:bg-zinc-900 transition-colors border border-transparent hover:border-zinc-800"
              >
                {userProfile.photoURL ? (
                  <img src={userProfile.photoURL} className="w-8 h-8 rounded-xl object-cover border border-zinc-800" alt="" />
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 border border-zinc-700">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <span className="text-sm font-semibold text-zinc-300 hidden sm:block">{userProfile.displayName}</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-24 pb-32 max-w-3xl mx-auto px-6 h-screen overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-hide">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 pb-12"
            >
              {/* Hero Section */}
              <div className="bg-gradient-to-br from-emerald-500/10 to-transparent p-8 rounded-[32px] border border-emerald-500/10">
                <h2 className="text-3xl font-bold mb-3 tracking-tight">Klara planer tillsammans.</h2>
                <p className="text-zinc-400 leading-relaxed mb-6 max-w-md italic">
                  Skapa realtidsplaner med dina vänner. Se vem som har bockat av vad och fira er framgång!
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      if (isAuthenticated) setShowCreateModal(true);
                      else setShowAuthModal(true);
                    }}
                    className="px-6 py-3.5 rounded-2xl bg-emerald-500 text-black font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/20"
                  >
                    <Plus className="w-5 h-5 stroke-[3px]" />
                    Skapa ny plan
                  </button>

                  <button
                    onClick={() => {
                      if (isAuthenticated) setShowJoinModal(true);
                      else setShowAuthModal(true);
                    }}
                    className="px-6 py-3.5 rounded-2xl bg-zinc-800 text-white font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all border border-zinc-700 hover:border-zinc-600"
                  >
                    Done Together
                  </button>
                </div>
              </div>

              {/* Active Plans List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em]">Dina aktiva planer</h3>
                  <span className="text-zinc-600 text-xs font-medium">{activePlans.length} planer</span>
                </div>

                {activePlans.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {activePlans.map((plan) => (
                      <motion.div
                        key={plan.id}
                        layoutId={plan.id}
                        onClick={() => {
                          setCurrentPlanId(plan.id);
                          setActiveTab('plans');
                        }}
                        className="group bg-zinc-900/40 p-5 rounded-3xl border border-zinc-800/50 hover:border-emerald-500/30 hover:bg-zinc-900/60 transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-lg group-hover:text-emerald-400 transition-colors uppercase italic tracking-tight">{plan.name}</h4>
                          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold tracking-widest uppercase">
                            {getProgress(plan)}% Klar
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-4">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${getProgress(plan)}%` }}
                            className="h-full bg-emerald-500 rounded-full"
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-zinc-500 italic">
                          <span>{plan.items?.filter(i => i.checked).length || 0} av {plan.items?.length || 0} steg klara</span>
                          <div className="flex -space-x-2">
                            {plan.members && Object.values(plan.members).slice(0, 3).map((m: any, i) => (
                              <img
                                key={i}
                                src={m.photoURL || `https://ui-avatars.com/api/?name=${m.displayName}&background=333&color=fff`}
                                className="w-6 h-6 rounded-lg border-2 border-zinc-900 object-cover"
                                alt=""
                              />
                            ))}
                            {plan.members && Object.keys(plan.members).length > 3 && (
                              <div className="w-6 h-6 rounded-lg border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-[8px] font-bold">
                                +{Object.keys(plan.members).length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800">
                    <p className="text-zinc-500 italic text-sm">Inga aktiva planer än. Skapa din första!</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'plans' && (
            <motion.div
              key="plan-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 pb-12"
            >
              {!currentPlanId ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-6">
                    <button onClick={() => setActiveTab('home')} className="p-2 -ml-2 rounded-xl hover:bg-zinc-900 text-zinc-400">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-2xl font-bold tracking-tight">Alla Planer</h2>
                  </div>

                  <div className="space-y-8">
                    {/* Active Section */}
                    <div className="space-y-3">
                      <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] px-2">Aktiva</h3>
                      {activePlans.length > 0 ? activePlans.map(plan => (
                        <div
                          key={plan.id}
                          onClick={() => setCurrentPlanId(plan.id)}
                          className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                              <Check className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-semibold text-zinc-200 group-hover:text-white transition-colors">{plan.name}</div>
                              <div className="text-xs text-zinc-500">{plan.items?.filter(i => i.checked).length || 0}/{plan.items?.length || 0} klara</div>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePlan(plan.id);
                            }}
                            className="p-2 opacity-0 group-hover:opacity-100 rounded-lg hover:bg-red-500/10 text-red-500 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )) : (
                        <p className="text-zinc-600 text-sm italic px-2">Inga aktiva planer.</p>
                      )}
                    </div>

                    {/* Completed Section */}
                    {completedPlans.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] px-2">Färdiga</h3>
                        {completedPlans.map(plan => (
                          <div
                            key={plan.id}
                            onClick={() => setCurrentPlanId(plan.id)}
                            className="flex items-center justify-between p-4 rounded-2xl bg-zinc-950 border border-zinc-900 opacity-60 hover:opacity-100 transition-all cursor-pointer group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <Check className="w-5 h-5" />
                              </div>
                              <div className="line-through text-zinc-500">{plan.name}</div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReopenPlan(plan.id);
                              }}
                              className="px-3 py-1.5 rounded-lg border border-zinc-800 text-[10px] font-bold hover:bg-zinc-900"
                            >
                              ÖPPNA IGEN
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : currentPlan ? (
                <div className="space-y-6">
                  {/* Plan Detail Header */}
                  <div className="space-y-4">
                    <button
                      onClick={() => setCurrentPlanId(null)}
                      className="flex items-center gap-2 text-zinc-500 text-sm font-medium hover:text-zinc-300 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Tillbaka till listan
                    </button>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                          <Check className="w-7 h-7 text-black stroke-[2.5px]" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-black italic tracking-tight uppercase leading-none mb-1">{currentPlan.name}</h2>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest bg-zinc-800/50 px-2 py-0.5 rounded leading-none">
                              {currentPlan.members ? Object.keys(currentPlan.members).length : 0} Medlemmar
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowShareModal(true)}
                          className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-all"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeletePlan(currentPlan.id)}
                          className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:bg-red-500/10 hover:text-red-500 transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar in Details */}
                    <div className="p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Planprogression</span>
                        <span className="text-xs font-bold text-emerald-400">{getProgress(currentPlan)}% Klar</span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${getProgress(currentPlan)}%` }}
                          className="h-full bg-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Add Item Input */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddItem(currentPlan.id, addInput);
                    }}
                    className="relative"
                  >
                    <input
                      type="text"
                      value={addInput}
                      onChange={(e) => setAddInput(e.target.value)}
                      placeholder="Vad ska vi göra nästa?..."
                      className="w-full bg-zinc-900/60 border border-zinc-800 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all font-medium italic"
                    />
                    <Plus className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-5 h-5" />
                    <button
                      type="submit"
                      disabled={!addInput.trim()}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-emerald-500 text-black disabled:opacity-30 transition-all"
                    >
                      <Plus className="w-4 h-4 stroke-[3px]" />
                    </button>
                  </form>

                  {/* Items List */}
                  <div className="space-y-2">
                    {currentPlan.items && currentPlan.items.length > 0 ? (
                      [...currentPlan.items].sort((a, b) => (a.checked === b.checked ? 0 : a.checked ? 1 : -1)).map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${item.checked
                            ? 'bg-zinc-950/50 border-emerald-500/10 opacity-70'
                            : 'bg-zinc-900/40 border-zinc-800/50 hover:border-zinc-700'
                            }`}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <button
                              onClick={() => handleToggleItem(currentPlan.id, item.id)}
                              className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${item.checked
                                ? 'bg-emerald-500 border-emerald-500 text-black'
                                : 'border-zinc-700 hover:border-emerald-500'
                                }`}
                            >
                              {item.checked && <Check className="w-4 h-4 stroke-[3px]" />}
                            </button>
                            <div className="flex-1">
                              <div className={`font-semibold transition-all italic tracking-tight ${item.checked ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                                {item.text}
                              </div>
                              {item.checked && item.checkedBy && (
                                <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-0.5">
                                  Fixed by {item.checkedBy}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            {!item.checked && (
                              <button
                                onClick={() => openEditModal(currentPlan.id, item)}
                                className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-zinc-800 text-zinc-400 transition-all"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteItem(currentPlan.id, item.id)}
                              className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-red-500 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-zinc-600 italic text-sm">
                        Inga steg tillagda än. Börja med att lägga till ett!
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-3xl bg-red-500/10 flex items-center justify-center mx-auto mb-6 text-red-500">
                    <Trash2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Planen kunde inte hittas</h2>
                  <p className="text-zinc-500 mb-6">Den kan ha raderats eller så saknar du åtkomst.</p>
                  <button onClick={() => setCurrentPlanId(null)} className="px-6 py-2 rounded-xl bg-zinc-800 font-bold">Gå tillbaka</button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8 pb-12"
            >
              <div className="flex items-center gap-2 mb-6">
                <button onClick={() => setActiveTab('home')} className="p-2 -ml-2 rounded-xl hover:bg-zinc-900 text-zinc-400">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold tracking-tight">Din Profil</h2>
              </div>

              {userProfile && (
                <div className="space-y-8">
                  {/* Profile Header Card */}
                  <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 rounded-[32px] border border-zinc-800 relative overflow-hidden">
                    <div className="relative z-10 flex flex-col items-center">
                      {userProfile.photoURL ? (
                        <img
                          src={userProfile.photoURL}
                          className="w-24 h-24 rounded-[32px] border-4 border-zinc-900 object-cover shadow-2xl mb-4"
                          alt=""
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-[32px] bg-zinc-800 border-4 border-zinc-900 flex items-center justify-center text-4xl mb-4 text-zinc-500">
                          {userProfile.displayName?.[0]?.toUpperCase() || '?'}
                        </div>
                      )}
                      <h3 className="text-2xl font-black italic uppercase tracking-tight">{userProfile.displayName}</h3>
                      <p className="text-zinc-500 text-sm">{userProfile.email}</p>

                      <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                        <div className="bg-zinc-800/50 p-4 rounded-2xl text-center">
                          <div className="text-2xl font-bold text-emerald-400">{plans.length}</div>
                          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Planer</div>
                        </div>
                        <div className="bg-zinc-800/50 p-4 rounded-2xl text-center">
                          <div className="text-2xl font-bold text-emerald-400">{userProfile.friends?.length || 0}</div>
                          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Vänner</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Settings / Actions */}
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowFriendsModal(true)}
                      className="w-full flex items-center justify-between p-5 rounded-3xl bg-zinc-900/40 border border-zinc-800 hover:border-emerald-500/20 transition-all font-bold group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center group-hover:text-emerald-400">
                          <Users className="w-5 h-5" />
                        </div>
                        Hantera vänner
                      </div>
                      {incomingRequests && incomingRequests.length > 0 && <span className="bg-red-500 px-2 py-0.5 rounded-lg text-[10px] font-black">{incomingRequests.length}</span>}
                    </button>

                    <button
                      onClick={signOut}
                      className="w-full flex items-center justify-between p-5 rounded-3xl bg-zinc-900/40 border border-zinc-800 hover:border-red-500/20 hover:text-red-500 transition-all font-bold group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center group-hover:text-red-500">
                          <ArrowLeft className="w-5 h-5" />
                        </div>
                        Logga ut
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/80 border-t border-zinc-800/50 backdrop-blur-xl pb-safe">
        <div className="max-w-3xl mx-auto px-10 h-20 flex items-center justify-between">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'home' ? 'text-emerald-500 scale-110' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            <Home className="w-6 h-6 stroke-[2px]" />
            <span className="text-[10px] font-black uppercase tracking-widest">Hem</span>
          </button>

          <button
            onClick={() => {
              if (isAuthenticated) setShowCreateModal(true);
              else setShowAuthModal(true);
            }}
            className="w-14 h-14 bg-emerald-500 text-black rounded-[20px] flex items-center justify-center -mt-12 shadow-2xl shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all border-4 border-zinc-950"
          >
            <Plus className="w-7 h-7 stroke-[3px]" />
          </button>

          <button
            onClick={() => setActiveTab('plans')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'plans' ? 'text-emerald-500 scale-110' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            <Check className="w-6 h-6 stroke-[2px]" />
            <span className="text-[10px] font-black uppercase tracking-widest">Planer</span>
          </button>
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onSignIn={signInWithGoogle}
            error={authError || undefined}
          />
        )}

        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-zinc-950/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-zinc-900 rounded-[32px] border border-zinc-800 p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500" />
              <h2 className="text-2xl font-black italic uppercase tracking-tight mb-6">Skapa ny plan</h2>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Plannamn</label>
                  <input
                    type="text"
                    value={newPlanName}
                    onChange={(e) => setNewPlanName(e.target.value)}
                    placeholder="T.ex. Roadtrip 2024"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all font-bold italic"
                    autoFocus
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-4 bg-zinc-800 rounded-2xl text-sm font-bold hover:bg-zinc-700 transition"
                  >
                    AVBRYT
                  </button>
                  <button
                    onClick={createNewPlan}
                    disabled={!newPlanName.trim() || creatingPlan}
                    className="flex-2 py-4 bg-emerald-500 text-black rounded-2xl text-sm font-black disabled:opacity-30 transition hover:bg-emerald-400"
                  >
                    {creatingPlan ? 'SKAPAR...' : 'SKAPA PLAN'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showFriendsModal && userProfile && (
          <FriendsModal
            onClose={() => setShowFriendsModal(false)}
            currentUser={userProfile}
          />
        )}

        {showJoinModal && user && userProfile && (
          <JoinModal
            onClose={() => setShowJoinModal(false)}
            onJoin={(planId) => {
              setCurrentPlanId(planId);
              setActiveTab('plans');
              showToast('Gick med i planen!');
            }}
            user={user}
            userProfile={userProfile}
          />
        )}

        {showShareModal && currentPlan && userProfile && (
          <ShareModal
            onClose={() => setShowShareModal(false)}
            plan={currentPlan}
            currentUserId={user?.uid || ''}
            currentUserName={userProfile.displayName}
          />
        )}

        {showEditModal && editingItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowEditModal(false);
                setEditingItem(null);
              }}
              className="absolute inset-0 bg-zinc-950/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-zinc-900 rounded-[32px] border border-zinc-800 p-8 shadow-2xl"
            >
              <h2 className="text-xl font-black italic uppercase tracking-tight mb-6">Redigera punkt</h2>
              <input
                type="text"
                defaultValue={editingItem.item.text}
                id="edit-item-input"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all font-bold italic"
                autoFocus
              />
              <div className="pt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingItem(null);
                  }}
                  className="flex-1 py-4 bg-zinc-800 rounded-2xl text-sm font-bold"
                >
                  AVBRYT
                </button>
                <button
                  onClick={() => {
                    const input = document.getElementById('edit-item-input') as HTMLInputElement;
                    handleEditItem(editingItem.planId, editingItem.item.id, input.value);
                  }}
                  className="flex-2 py-4 bg-emerald-500 text-black rounded-2xl text-sm font-black"
                >
                  SPARA ÄNDRINGAR
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notifier */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs font-bold uppercase tracking-widest shadow-2xl flex items-center gap-3"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
