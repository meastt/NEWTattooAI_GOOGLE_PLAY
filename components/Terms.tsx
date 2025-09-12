import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
        <h2 className="text-4xl font-display font-bold mb-8 text-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink-600 to-neon-500">
            Terms of Use
          </span>
        </h2>
        <div className="space-y-6 text-slate-700 dark:text-slate-300 prose dark:prose-invert max-w-none">
          <p className="text-lg font-medium text-ink-600 dark:text-ink-400">
            <strong>Last Updated:</strong> September 9, 2025
          </p>
          
          <h3 className="text-2xl font-display font-bold mt-8 mb-4 text-slate-900 dark:text-white">1. Acceptance of Terms</h3>
          <p className="text-lg leading-relaxed">
            By using the Tattoo Generator App ("the App"), you agree to these Terms of Use. If you don't agree, don't use the App.
          </p>

          <h3 className="text-2xl font-display font-bold mt-8 mb-4 text-slate-900 dark:text-white">2. What the App Does</h3>
          <p className="text-lg leading-relaxed">
            The App uses AI to generate tattoo designs on your uploaded photos. You get 5 free credits, then can subscribe for unlimited use.
          </p>

          <h3 className="text-2xl font-display font-bold mt-8 mb-4 text-slate-900 dark:text-white">3. Subscriptions</h3>
          <p className="text-lg leading-relaxed">
            <strong>Weekly Plan:</strong> $4.99/week - 30 credits per week
            <br />
            <strong>Monthly Plan:</strong> $12.99/month - 120 credits per month
          </p>
          <ul className="text-lg leading-relaxed space-y-2 mt-4">
            <li>• Subscriptions auto-renew unless canceled 24+ hours before renewal</li>
            <li>• Manage subscriptions in your App Store settings</li>
            <li>• No refunds for partial periods</li>
          </ul>

          <h3 className="text-2xl font-display font-bold mt-8 mb-4 text-slate-900 dark:text-white">4. What You Can't Do</h3>
          <div className="bg-red-50 dark:bg-red-950/30 p-6 rounded-2xl border border-red-200 dark:border-red-800 mt-6">
            <h4 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-3">Prohibited Content - Don't upload or request:</h4>
            <ul className="text-red-700 dark:text-red-300 space-y-2">
              <li>• Images involving anyone under 18</li>
              <li>• Sexual, explicit, or inappropriate content</li>
              <li>• Images of other people without their permission</li>
              <li>• Stolen, hacked, or copyrighted images</li>
              <li>• Illegal, violent, or hateful content</li>
              <li>• Content meant to harass or harm others</li>
            </ul>
            <p className="text-red-800 dark:text-red-200 font-semibold mt-4">
              <strong>Zero Tolerance:</strong> Immediate account termination for prohibited content.
            </p>
          </div>

          <h3 className="text-2xl font-display font-bold mt-8 mb-4 text-slate-900 dark:text-white">5. Your Responsibility</h3>
          <div className="bg-ink-50 dark:bg-ink-950/30 p-6 rounded-2xl border border-ink-200 dark:border-ink-800 mt-6">
            <h4 className="text-lg font-semibold text-ink-800 dark:text-ink-200 mb-3">By uploading images, you confirm:</h4>
            <ul className="text-ink-700 dark:text-ink-300 space-y-2">
              <li>• You own the image or have permission to use it</li>
              <li>• Everyone shown in the image consents to this use</li>
              <li>• You won't use the app to harm, harass, or deceive others</li>
            </ul>
            <p className="text-ink-800 dark:text-ink-200 font-semibold mt-4">
              <strong>You're responsible for all content you create and any consequences.</strong>
            </p>
          </div>

          <h3 className="text-2xl font-display font-bold mt-8 mb-4 text-slate-900 dark:text-white">6. Our Responsibilities (Limited)</h3>
          <ul className="text-lg leading-relaxed space-y-2">
            <li>• We provide the app "as is" without guarantees</li>
            <li>• We can't monitor every image due to volume</li>
            <li>• We'll remove violations when reported or detected</li>
            <li>• We cooperate fully with law enforcement</li>
            <li>• Generated designs are for inspiration only - consult a real tattoo artist</li>
          </ul>

          <h3 className="text-2xl font-display font-bold mt-8 mb-4 text-slate-900 dark:text-white">7. Privacy & Data</h3>
          <ul className="text-lg leading-relaxed space-y-2">
            <li>• We process your images only to generate tattoos</li>
            <li>• Images are deleted after processing</li>
            <li>• We don't store or share your personal images</li>
          </ul>

          <h3 className="text-2xl font-display font-bold mt-8 mb-4 text-slate-900 dark:text-white">8. Liability</h3>
          <div className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-2xl border border-amber-200 dark:border-amber-800 mt-6">
            <h4 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-3">You agree to cover us legally for any problems caused by your use of the app, including:</h4>
            <ul className="text-amber-700 dark:text-amber-300 space-y-2">
              <li>• Using others' images without permission</li>
              <li>• Creating harmful or illegal content</li>
              <li>• Any lawsuits from your generated content</li>
            </ul>
            <p className="text-amber-800 dark:text-amber-200 font-semibold mt-4">
              <strong>Our liability is limited to what you paid for your subscription.</strong>
            </p>
          </div>

          <h3 className="text-2xl font-display font-bold mt-8 mb-4 text-slate-900 dark:text-white">9. Platform Protection</h3>
          <p className="text-lg leading-relaxed">
            We're a technology platform. Users create all content through our automated systems. We're not responsible for user content, even if harmful, but we'll work with authorities when needed.
          </p>

          <h3 className="text-2xl font-display font-bold mt-8 mb-4 text-slate-900 dark:text-white">10. Changes & Contact</h3>
          <p className="text-lg leading-relaxed">
            We can update these Terms anytime. Continued use means you accept changes.
          </p>
          <div className="bg-neon-50 dark:bg-neon-950/30 p-6 rounded-2xl border border-neon-200 dark:border-neon-800 mt-6">
            <p className="text-neon-700 dark:text-neon-300">
              <strong>Contact us:</strong> support@inkpreview.com
              <br />
              <strong>Governed by:</strong> Utah, USA law
            </p>
          </div>

          <div className="text-center mt-12 p-6 bg-slate-100 dark:bg-slate-800 rounded-2xl border-2 border-slate-300 dark:border-slate-600">
            <p className="text-xl font-semibold text-slate-900 dark:text-white">
              By using the App, you agree to these Terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;