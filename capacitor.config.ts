import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.039772f2e37145deb032629c90205ff8',
  appName: 'clothespin-genius',
  webDir: 'dist',
  server: {
    url: 'https://039772f2-e371-45de-b032-629c90205ff8.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      saveToGallery: true
    }
  }
};

export default config;
