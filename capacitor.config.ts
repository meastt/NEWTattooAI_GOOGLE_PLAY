import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.inkvisionai.app',
  appName: 'InkVision AI',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    },
    Filesystem: {
      permissions: ['read', 'write']
    },
    StatusBar: {
      style: 'default',
      backgroundColor: '#000000'
    }
  }
};

export default config;
