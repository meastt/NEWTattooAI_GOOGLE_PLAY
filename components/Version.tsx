import React from 'react';
import versionInfo from '../version.json';

interface VersionProps {
  theme?: 'light' | 'dark';
}

const Version: React.FC<VersionProps> = ({ theme = 'light' }) => {
  return (
    <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} text-center`}>
      v{versionInfo.version} (Build {versionInfo.build})
    </div>
  );
};

export default Version;