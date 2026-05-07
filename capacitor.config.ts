import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bilimce.app',
  appName: 'BILIMCE',
  webDir: 'public',
  server: {
    url: 'https://bilimce.vercel.app',
    cleartext: true
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;
