
import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg">
      <h2 className="text-3xl font-bold mb-6">Privacy Policy</h2>
      <div className="space-y-4 text-gray-300">
        <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
        
        <p>
          This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
        </p>

        <h3 className="text-xl font-semibold mt-4">1. Information We Collect</h3>
        <p>
          We do not collect or store any personal information or images you upload. All images and data processed are handled transiently. They are sent to the Google Gemini API for processing and are not stored on our servers. Your images and prompts are subject to Google's API data usage policies.
        </p>

        <h3 className="text-xl font-semibold mt-4">2. Use of Your Information</h3>
        <p>
          The images and text you provide are used solely for the purpose of generating the AI-edited or created image as requested by you through the application's features. We do not use this information for any other purpose, such as advertising or user profiling.
        </p>
        
        <h3 className="text-xl font-semibold mt-4">3. Camera Access</h3>
        <p>
          If you grant permission, our app will access your device's camera. This is solely for the purpose of allowing you to take a photo for use within the app's 'Tattoo Try-On' and 'Tattoo Removal' features. The camera feed is not monitored, and images are only captured upon your specific action.
        </p>

        <h3 className="text-xl font-semibold mt-4">4. Third-Party Services</h3>
        <p>
          Our service relies on the Google Gemini API to function. Your interactions with our AI features mean that the data you input (images and text) is processed by Google. We recommend you review <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">Google's Privacy Policy</a> to understand how they handle data.
        </p>

        <h3 className="text-xl font-semibold mt-4">5. Changes to this Privacy Policy</h3>
        <p>
          We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.
        </p>

        <h3 className="text-xl font-semibold mt-4">6. Contact Us</h3>
        <p>
          If you have any questions about this Privacy Policy, You can contact us by email at: privacy@example.com
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
