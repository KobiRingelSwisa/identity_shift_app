/**
 * Bundled loops keyed by JSON `step.audio`. Replace files under assets/audio/ as needed.
 */
const meditationSoundModules: Record<string, number> = {
  calm_loop_01: require('../../assets/audio/calm_loop_01.wav'),
};

export function getMeditationSoundModule(audioKey: string | undefined): number | null {
  if (!audioKey) return null;
  return meditationSoundModules[audioKey] ?? null;
}
