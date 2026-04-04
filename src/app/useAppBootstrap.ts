import { useCallback, useEffect, useState } from 'react';
import { loadProgress, type AppProgress } from '../storage/progress';
import { loadProgram } from '../session/loadProgram';
import { loadReminderSettings } from '../storage/reminders';
import { syncScheduledRemindersFromStorage } from '../notifications/reminders';

const program = loadProgram();

export function useAppBootstrap() {
  const [bootstrapping, setBootstrapping] = useState(true);
  const [progress, setProgress] = useState<AppProgress | null>(null);
  const [reminderPromptSeen, setReminderPromptSeen] = useState(true);

  const refreshProgress = useCallback(async () => {
    const p = await loadProgress(program.track.duration_days);
    setProgress(p);
    if (p.onboardingDone) {
      const r = await loadReminderSettings();
      setReminderPromptSeen(r.promptSeen);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const p = await loadProgress(program.track.duration_days);
      if (cancelled) return;
      setProgress(p);
      if (p.onboardingDone) {
        const r = await loadReminderSettings();
        if (!cancelled) {
          setReminderPromptSeen(r.promptSeen);
        }
        await syncScheduledRemindersFromStorage();
      }
      if (!cancelled) {
        setBootstrapping(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    bootstrapping,
    progress,
    refreshProgress,
    reminderPromptSeen,
  };
}
