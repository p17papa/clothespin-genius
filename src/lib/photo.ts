import { Capacitor } from '@capacitor/core';
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera';

/** Take a photo with the phone camera, or pick a file when running in a browser. Returns null if cancelled. */
export const takePhoto = async (): Promise<string | null> => {
  if (Capacitor.isNativePlatform()) {
    try {
      const image = await CapCamera.getPhoto({
        quality: 90,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
        width: 1200,
      });
      return image.dataUrl ?? null;
    } catch (e: any) {
      if (String(e?.message || e).toLowerCase().includes('cancel')) return null;
      throw e;
    }
  }
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.setAttribute('capture', 'environment');
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    };
    input.click();
  });
};

/** Save to device storage; returns false if storage is full. */
export const saveJSON = (key: string, value: unknown): boolean => {
  try {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};
