import React, { useState } from 'react';

interface ContentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, additionalInfo: string) => Promise<void>;
  contentType: 'generated' | 'saved';
}

const REPORT_REASONS = [
  'Offensive or inappropriate content',
  'Violent or graphic imagery',
  'Sexual or suggestive content',
  'Hateful symbols or imagery',
  'Copyright or trademark violation',
  'Other'
];

const ContentReportModal: React.FC<ContentReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  contentType
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) return;

    setIsSubmitting(true);
    try {
      await onSubmit(selectedReason, additionalInfo);
      setSubmitSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to submit report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedReason('');
    setAdditionalInfo('');
    setSubmitSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="bg-void-900 border border-void-700 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-void-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="font-heading text-lg uppercase tracking-wider text-white">Report Content</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-steel-400 hover:text-white transition-colors p-1"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {submitSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-heading text-lg uppercase tracking-wider text-green-400 mb-2">Report Submitted</p>
            <p className="text-sm text-steel-400">Thank you for helping keep our community safe.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Description */}
            <p className="text-sm text-steel-400 leading-relaxed">
              Help us maintain a safe and appropriate experience. Please select a reason for reporting this AI-generated content.
            </p>

            {/* Reason Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-heading uppercase tracking-wider text-steel-300 mb-3">
                Reason for Report *
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {REPORT_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                      selectedReason === reason
                        ? 'bg-red-500/10 border-red-500/50'
                        : 'bg-void-800 border-void-600 hover:border-red-500/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="mt-0.5 w-4 h-4 text-red-500 border-void-600 focus:ring-red-500/50"
                    />
                    <span className="text-sm text-steel-300 flex-1">{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-2">
              <label htmlFor="additionalInfo" className="block text-xs font-heading uppercase tracking-wider text-steel-300">
                Additional Information (Optional)
              </label>
              <textarea
                id="additionalInfo"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Provide any additional context that might be helpful..."
                className="w-full bg-void-800 border border-void-600 rounded-xl p-4 text-white placeholder-steel-500 focus:outline-none focus:border-red-500/50 transition-all duration-300 resize-none text-sm"
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-void-800 border border-void-600 hover:border-void-500 text-steel-300 hover:text-white font-heading uppercase tracking-wider text-sm py-3 px-4 rounded-xl transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedReason || isSubmitting}
                className="flex-1 bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 font-heading uppercase tracking-wider text-sm py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-red-400/30 rounded-full animate-spin border-t-red-400" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Report</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContentReportModal;
