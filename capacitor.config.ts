import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bilimce.app',
  appName: 'BILIMCE',
  webDir: 'public',
  server: {
    url: 'https://bilimce.vercel.app',
    cleartext: true
  }
};

export default config;
