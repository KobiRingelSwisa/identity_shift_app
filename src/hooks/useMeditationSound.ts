import { useEffect, useRef } from 'react';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { getMeditationSoundModule } from '../audio/meditationSounds';

const TARGET_VOL = 0.32;
const FADE_IN_MS = 1400;
const FADE_OUT_MS = 450;

/**
 * Optional looping ambience for meditation steps. Fades in/out; cleans up on unmount or audio key change.
 */
export function useMeditationSound(audioKey: string | undefined) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const generationRef = useRef(0);
  const fadeInTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fadeOutTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const gen = ++generationRef.current;
    let cancelled = false;

    const clearFadeIn = () => {
      if (fadeInTimerRef.current) {
        clearInterval(fadeInTimerRef.current);
        fadeInTimerRef.current = null;
      }
    };

    const clearFadeOut = () => {
      if (fadeOutTimerRef.current) {
        clearInterval(fadeOutTimerRef.current);
        fadeOutTimerRef.current = null;
      }
    };

    const run = async () => {
      clearFadeOut();
      const prev = soundRef.current;
      soundRef.current = null;
      clearFadeIn();
      if (prev) {
        try {
          await prev.setVolumeAsync(0).catch(() => undefined);
          await prev.stopAsync();
        } catch {
          /* ignore */
        }
        try {
          await prev.unloadAsync();
        } catch {
          /* ignore */
        }
      }

      if (cancelled || gen !== generationRef.current) return;

      const source = getMeditationSoundModule(audioKey);
      if (!source) return;

      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          interruptionModeIOS: InterruptionModeIOS.MixWithOthers,
          interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
        });
        const { sound } = await Audio.Sound.createAsync(source, {
          isLooping: true,
          volume: 0,
          shouldPlay: true,
        });
        if (cancelled || gen !== generationRef.current) {
          await sound.unloadAsync().catch(() => undefined);
          return;
        }
        soundRef.current = sound;

        const steps = 16;
        const stepMs = FADE_IN_MS / steps;
        let step = 0;
        fadeInTimerRef.current = setInterval(() => {
          step += 1;
          const v = Math.min(TARGET_VOL, (TARGET_VOL * step) / steps);
          void sound.setVolumeAsync(v).catch(() => undefined);
          if (step >= steps && fadeInTimerRef.current) {
            clearInterval(fadeInTimerRef.current);
            fadeInTimerRef.current = null;
          }
        }, stepMs);
      } catch {
        /* invalid or missing asset — silent fallback */
      }
    };

    void run();

    return () => {
      cancelled = true;
      clearFadeIn();
      clearFadeOut();
      const s = soundRef.current;
      soundRef.current = null;
      if (!s) return;

      let vol = TARGET_VOL;
      const steps = 10;
      const stepMs = FADE_OUT_MS / steps;
      fadeOutTimerRef.current = setInterval(() => {
        vol -= TARGET_VOL / steps;
        if (vol <= 0) {
          clearFadeOut();
          void s.stopAsync().catch(() => undefined);
          void s.unloadAsync().catch(() => undefined);
          return;
        }
        void s.setVolumeAsync(vol).catch(() => undefined);
      }, stepMs);
    };
  }, [audioKey]);
}
