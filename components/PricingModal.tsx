import React, { useState } from 'react';
import { X, Check, Zap, Crown } from 'lucide-react';
import { upgradeToPro } from '../services/supabase';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSuccess: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, userId, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      // Simulate API call to payment provider
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update DB
      await upgradeToPro(userId);
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-white to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl w-full max-w-lg p-1 relative shadow-2xl overflow-hidden transition-colors">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition z-10"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/20">
              <Crown className="text-white w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Upgrade to Pro</h2>
            <p className="text-slate-600 dark:text-slate-400">Unlock your sales potential with more power.</p>
          </div>

          <div className="bg-white dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-8 shadow-sm">
            <div className="flex items-end justify-center gap-1 mb-6">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">$10</span>
              <span className="text-slate-500 dark:text-slate-400 mb-1">/month</span>
            </div>

            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400">
                  <Check size={14} />
                </div>
                <span>30 Generations per month</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400">
                  <Check size={14} />
                </div>
                <span>Access to all script types</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400">
                  <Check size={14} />
                </div>
                <span>Priority Support</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400">
                  <Check size={14} />
                </div>
                <span>Save unlimited history</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-900/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Zap size={20} fill="currentColor" />
                Unlock Pro Access
              </>
            )}
          </button>
          <p className="text-center text-xs text-slate-500 mt-4">
            Secure payment processing. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;