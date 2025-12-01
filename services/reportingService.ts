/**
 * Content Reporting Service
 *
 * Handles user reports for offensive or inappropriate AI-generated content.
 * Reports are stored locally to comply with Google Play's AI-Generated Content policy.
 */

export interface ContentReport {
  id: string;
  userId: string;
  reportedAt: string;
  reason: string;
  additionalInfo: string;
  contentType: 'generated' | 'saved';
  contentId?: string;
  status: 'pending' | 'reviewed';
}

const REPORTS_STORAGE_KEY = 'inksync_content_reports';

/**
 * Get or create anonymous user ID
 */
const getUserId = (): string => {
  let userId = localStorage.getItem('tattoo_app_user_id');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9) + Date.now();
    localStorage.setItem('tattoo_app_user_id', userId);
  }
  return userId;
};

/**
 * Submit a content report
 */
export const submitContentReport = async (
  reason: string,
  additionalInfo: string,
  contentType: 'generated' | 'saved',
  contentId?: string
): Promise<ContentReport> => {
  try {
    const report: ContentReport = {
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: getUserId(),
      reportedAt: new Date().toISOString(),
      reason,
      additionalInfo,
      contentType,
      contentId,
      status: 'pending'
    };

    // Get existing reports
    const storedReports = localStorage.getItem(REPORTS_STORAGE_KEY);
    const reports: ContentReport[] = storedReports ? JSON.parse(storedReports) : [];

    // Add new report
    reports.push(report);

    // Save back to localStorage
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));

    console.log('Content report submitted successfully:', report.id);
    return report;
  } catch (error) {
    console.error('Error submitting content report:', error);
    throw new Error('Failed to submit report. Please try again.');
  }
};

/**
 * Get all reports (for admin purposes or debugging)
 */
export const getAllReports = (): ContentReport[] => {
  try {
    const storedReports = localStorage.getItem(REPORTS_STORAGE_KEY);
    return storedReports ? JSON.parse(storedReports) : [];
  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
};

/**
 * Get reports count for the current user
 */
export const getUserReportsCount = (): number => {
  try {
    const userId = getUserId();
    const reports = getAllReports();
    return reports.filter(report => report.userId === userId).length;
  } catch (error) {
    console.error('Error getting user reports count:', error);
    return 0;
  }
};

/**
 * Clear old reports (keep only last 100 reports to prevent storage bloat)
 */
export const pruneOldReports = (): void => {
  try {
    const reports = getAllReports();
    if (reports.length > 100) {
      // Keep only the most recent 100 reports
      const recentReports = reports.slice(-100);
      localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(recentReports));
      console.log('Pruned old reports, kept most recent 100');
    }
  } catch (error) {
    console.error('Error pruning old reports:', error);
  }
};
