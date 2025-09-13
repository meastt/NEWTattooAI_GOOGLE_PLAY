import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
        <h2 className="text-4xl font-display font-bold mb-8 text-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink-600 to-neon-500">
            Privacy Policy
          </span>
        </h2>
        <div className="space-y-6 text-slate-700 dark:text-slate-300 prose dark:prose-invert max-w-none">
          <p className="text-lg font-medium text-ink-600 dark:text-ink-400">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
          </p>
          
          <p className="text-lg leading-relaxed">
            This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
          </p>

          <h3 className="text-2xl font-display font-bold mt-8 mb-4 text-slate-900 dark:text-white">1. Information We Collect</h3>
          <p className="text-lg leading-relaxed">
            We do not collect or store any personal information or images you upload. All images and data processed are handled transiently. They are sent to the Google Gemini API for processing and are not stored on our servers. Your images and prompts are subject to Google's API data usage policies.
          </p>
          
          <div className="bg-ink-50 dark:bg-ink-950/30 p-6 rounded-2xl border border-ink-200 dark:border-ink-800 mt-6">
            <h4 className="text-lg font-semibold text-ink-800 dark:text-ink-200 mb-3">Data Storage Policy:</h4>
            <ul className="text-ink-700 dark:text-ink-300 space-y-2">
              <li>• <strong>Uploaded Images:</strong> Processed transiently and never stored on our servers</li>
              <li>• <strong>Saved Designs:</strong> Stored until you delete them or after 90 days of inactivity</li>
              <li>• <strong>User Preferences:</strong> Stored locally on your device only</li>
            </ul>
          </div>

          <h3 className="text-2xl font-display font-bold mt-8 mb-4 text-slate-900 dark:text-white">2. Use of Your Information</h3>
          <p className="text-lg leading-relaxed">
            The images and text you provide are used solely for the purpose of generating the AI-edited or created image as requested by you through the application's features. We do not use this information for any other purpose, such as advertising or user profiling.
          </p>
          
          <h3 className="text-2xl font-display font-bold mt-8 mb-4 text-slate-900 dark:text-white">3. Camera Access</h3>
          <p className="text-lg leading-relaxed">
            If you grant permission, our app will access your device's camera. This is solely for the purpose of allowing you to take a photo for use within the app's 'Tattoo Try-On' and 'Tattoo Removal' features. The camera feed is not monitored, and images are only captured upon your specific action.
          </p>

          <h3 className="text-2xl font-display font-bold mt-8 mb-4 text-slate-900 dark:text-white">4. Third-Party Services</h3>
          <p className="text-lg leading-relaxed">
            Our service relies on the Google Gemini API to function. Your interactions with our AI features mean that the data you input (images and text) is processed by Google. We recommend you review <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-ink-600 dark:text-ink-400 hover:text-ink-700 dark:hover:text-ink-300 hover:underline transition-colors duration-300">Google's Privacy Policy</a> to understand how they handle data.
          </p>

          <h3 className="text-2xl font-display font-bold mt-8 mb-4 text-slate-900 dark:text-white">5. Your Data Rights & Deletion</h3>
          <p className="text-lg leading-relaxed">
            You have complete control over your data. You can delete all your saved tattoo ideas and clear your local data at any time through the Settings page in the app.
          </p>
          
          <div className="bg-neon-50 dark:bg-neon-950/30 p-6 rounded-2xl border border-neon-200 dark:border-neon-800 mt-6">
            <h4 className="text-lg font-semibold text-neon-800 dark:text-neon-200 mb-3">Instant Data Deletion:</h4>
            <ul className="text-neon-700 dark:text-neon-300 space-y-2">
              <li>• Access the Settings page from the header menu</li>
              <li>• Click "Delete My Data" to remove all saved designs</li>
              <li>• All data is permanently deleted immediately</li>
              <li>• No waiting period or manual processing required</li>
            </ul>
          </div>

          <h3 className="text-2xl font-display font-bold mt-8 mb-4 text-slate-900 dark:text-white">6. Changes to this Privacy Policy</h3>
          <p className="text-lg leading-relaxed">
            We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.
          </p>

          <h3 className="text-2xl font-display font-bold mt-8 mb-4 text-slate-900 dark:text-white">7. Contact Us</h3>
          <p className="text-lg leading-relaxed">
            If you have any questions about this Privacy Policy, You can contact us by email at support@inkpreview.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;