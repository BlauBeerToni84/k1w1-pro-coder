import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.a25dfbdd4ff14cd69165cc189aa3f49e',
  appName: 'k1w1-pro-coder',
  webDir: 'dist',
  server: {
    url: 'https://a25dfbdd-4ff1-4cd6-9165-cc189aa3f49e.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1A1A2E',
      showSpinner: true,
      spinnerColor: '#00D9FF'
    }
  }
};

export default config;
