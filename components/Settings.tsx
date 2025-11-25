import React, { useState } from 'react';
import type { View } from '../types';
import { deleteUserData } from '../services/tattooService';
import LoadingSpinner from './LoadingSpinner';
import ThemeToggle from './ThemeToggle';
import Version from './Version';

interface SettingsProps {
  onNavigate: (view: View) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onNavigate, theme, toggleTheme }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleDeleteData = async () => {
    setIsDeleting(true);
    setDeleteStatus('idle');
    
    try {
      await deleteUserData();
      setDeleteStatus('success');
      // Clear any additional localStorage items
      localStorage.clear();
      // Redirect to home after successful deletion
      setTimeout(() => {
        onNavigate('home');
      }, 2000);
    } catch (error) {
      console.error('Error deleting user data:', error);
      setDeleteStatus('error');
    } finally {
      setIsDeleting(false);
      setShowConfirmDialog(false);
    }
  };

  const confirmDelete = () => {
    setShowConfirmDialog(true);
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setDeleteStatus('idle');
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-electric-500/10 rounded-full blur-3xl" />
        </div>

        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-electric-500/10 border border-electric-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-electric-400 animate-pulse" />
          <span className="text-xs font-heading uppercase tracking-wider text-electric-400">Configuration</span>
        </div>

        <h1 className="font-display text-4xl md:text-5xl tracking-wider uppercase mb-2">
          <span className="text-white neon-text-cyan">SETTINGS</span>
        </h1>
        <p className="text-steel-400 text-sm">
          Manage your preferences and data
        </p>
      </div>

      {/* Settings Cards */}
      <div className="space-y-5">
        {/* Theme Settings Card */}
        <div className="bg-void-900/80 backdrop-blur-sm p-6 rounded-2xl border border-void-700">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-void-700">
            <div className="w-10 h-10 rounded-lg bg-electric-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-electric-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <h2 className="font-heading text-lg font-bold text-white uppercase tracking-wide">Appearance</h2>
          </div>

          <div className="flex items-center justify-between p-4 bg-void-800 rounded-xl border border-void-600">
            <div>
              <h3 className="text-sm font-medium text-white">Theme</h3>
              <p className="text-xs text-steel-400">
                {theme === 'light' ? 'Light' : 'Dark'} mode
              </p>
            </div>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </div>

        {/* Data Management Card */}
        <div className="bg-void-900/80 backdrop-blur-sm p-6 rounded-2xl border border-void-700">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-void-700">
            <div className="w-10 h-10 rounded-lg bg-magenta-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-magenta-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
            <h2 className="font-heading text-lg font-bold text-white uppercase tracking-wide">Data Management</h2>
          </div>

          <div className="space-y-4">
            <p className="text-steel-400 text-sm">
              Delete all saved designs and local data.
            </p>

            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <p className="text-xs text-yellow-400">
                This action cannot be undone. Export designs before proceeding.
              </p>
            </div>

            {deleteStatus === 'success' && (
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                <p className="text-xs text-green-400">Data deleted. Redirecting...</p>
              </div>
            )}

            {deleteStatus === 'error' && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-xs text-red-400">Failed to delete. Try again.</p>
              </div>
            )}

            <button
              onClick={confirmDelete}
              disabled={isDeleting || deleteStatus === 'success'}
              className="w-full bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 font-heading uppercase tracking-wider text-xs py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <LoadingSpinner />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete My Data</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Legal Links Card */}
        <div className="bg-void-900/80 backdrop-blur-sm p-6 rounded-2xl border border-void-700">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-void-700">
            <div className="w-10 h-10 rounded-lg bg-electric-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-electric-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="font-heading text-lg font-bold text-white uppercase tracking-wide">Legal</h2>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => onNavigate('privacy')}
              className="w-full flex items-center justify-between p-3 bg-void-800 rounded-xl border border-void-600 hover:border-electric-500/50 text-steel-300 hover:text-white transition-all duration-300"
            >
              <span className="text-sm">Privacy Policy</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={() => onNavigate('terms')}
              className="w-full flex items-center justify-between p-3 bg-void-800 rounded-xl border border-void-600 hover:border-electric-500/50 text-steel-300 hover:text-white transition-all duration-300"
            >
              <span className="text-sm">Terms of Use</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={() => onNavigate('disclaimer')}
              className="w-full flex items-center justify-between p-3 bg-void-800 rounded-xl border border-void-600 hover:border-electric-500/50 text-steel-300 hover:text-white transition-all duration-300"
            >
              <span className="text-sm">Disclaimer</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-void-950/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-void-900 border border-void-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>

              <h3 className="font-heading text-lg uppercase tracking-wider text-white mb-2">
                Delete All Data?
              </h3>

              <p className="text-steel-400 text-sm mb-6">
                This will permanently delete all saved designs. Cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 bg-void-800 border border-void-600 hover:border-electric-500/50 text-steel-300 hover:text-white font-heading uppercase tracking-wider text-xs py-3 px-4 rounded-xl transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteData}
                  disabled={isDeleting}
                  className="flex-1 bg-red-500 hover:bg-red-400 text-white font-heading uppercase tracking-wider text-xs py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <LoadingSpinner />
                      <span>...</span>
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Version Info */}
      <div className="mt-8 text-center">
        <Version theme={theme} />
      </div>
    </div>
  );
};

export default Settings;
