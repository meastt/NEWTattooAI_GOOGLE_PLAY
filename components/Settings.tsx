import React, { useState } from 'react';
import type { View } from '../types';
import { deleteUserData, addGalleryImages } from '../services/tattooService';
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
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-12 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-ink-500/10 to-neon-500/10 rounded-full blur-3xl" />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink-600 via-ink-500 to-neon-500">
            Settings
          </span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Manage your account and data preferences.
        </p>
      </div>

      {/* Settings Cards */}
      <div className="space-y-8">
        {/* Theme Settings Card */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-ink-100 to-neon-100 dark:from-ink-900 dark:to-neon-900 flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-ink-600 dark:text-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Appearance</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Choose your preferred theme for the app interface.
            </p>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Theme</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Currently using {theme === 'light' ? 'Light' : 'Dark'} mode
                </p>
              </div>
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>
          </div>
        </div>

        {/* Data Management Card */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-ink-100 to-neon-100 dark:from-ink-900 dark:to-neon-900 flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-ink-600 dark:text-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
            <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Data Management</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              You have full control over your data. You can delete all your saved tattoo ideas and clear your local data at any time.
            </p>
            
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">What gets deleted:</h3>
              <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                <li>• All your saved tattoo ideas from our database</li>
                <li>• Your local app preferences and settings</li>
                <li>• Any cached data on your device</li>
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-200 dark:border-amber-800">
              <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Important:</h3>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                This action cannot be undone. Make sure to export any designs you want to keep before proceeding.
              </p>
            </div>

            {deleteStatus === 'success' && (
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-2xl border border-green-200 dark:border-green-800">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-green-700 dark:text-green-300 font-medium">
                    All your data has been successfully deleted. Redirecting to home...
                  </p>
                </div>
              </div>
            )}

            {deleteStatus === 'error' && (
              <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-2xl border border-red-200 dark:border-red-800">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-red-700 dark:text-red-300 font-medium">
                    Failed to delete data. Please try again.
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={confirmDelete}
              disabled={isDeleting || deleteStatus === 'success'}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg hover:shadow-xl disabled:shadow-none"
            >
              {isDeleting ? (
                <>
                  <LoadingSpinner />
                  <span>Deleting Data...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete My Data</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Privacy Information Card */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neon-100 to-ink-100 dark:from-neon-900 dark:to-ink-900 flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-neon-600 dark:text-neon-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Privacy & Data</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              We respect your privacy and give you complete control over your data.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Uploaded Images</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Processed transiently and never stored on our servers.
                </p>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Saved Designs</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Stored until you delete them or after 90 days of inactivity.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onNavigate('privacy')}
                className="flex-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium py-3 px-6 rounded-2xl transition-colors duration-300"
              >
                View Privacy Policy
              </button>
              <button
                onClick={() => onNavigate('terms')}
                className="flex-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium py-3 px-6 rounded-2xl transition-colors duration-300"
              >
                View Terms of Use
              </button>
              <button
                onClick={() => onNavigate('disclaimer')}
                className="flex-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium py-3 px-6 rounded-2xl transition-colors duration-300"
              >
                View Disclaimer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-4">
                Delete All Data?
              </h3>
              
              <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                This will permanently delete all your saved tattoo ideas and clear your local data. This action cannot be undone.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={cancelDelete}
                  className="flex-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium py-3 px-6 rounded-2xl transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteData}
                  disabled={isDeleting}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <LoadingSpinner />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    'Yes, Delete Everything'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Admin Button (temporary) */}
      <div className="mt-8 text-center">
        <button
          onClick={addGalleryImages}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Add Gallery Images
        </button>
      </div>

      {/* Version Info */}
      <div className="mt-8 text-center">
        <Version theme={theme} />
      </div>
    </div>
  );
};

export default Settings;
