import { useCallback, useState } from 'react';
import { ActivityIndicator, I18nManager, StyleSheet, View } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import { SessionContainer } from './src/session/SessionContainer';
import { loadProgram } from './src/session/loadProgram';
import { OnboardingFlow } from './src/onboarding/OnboardingFlow';
import { MainHome } from './src/screens/MainHome';
import { TrackCompleteSummary } from './src/screens/TrackCompleteSummary';
import { PostSessionScreen } from './src/screens/PostSessionScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { AboutScreen } from './src/screens/AboutScreen';
import { ReminderSetupScreen } from './src/screens/ReminderSetupScreen';
import { useAppBootstrap } from './src/app/useAppBootstrap';
import { useAppFlow } from './src/app/useAppFlow';
import { resetTrackProgress } from './src/storage/progress';
import { theme } from './src/ui/theme';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const program = loadProgram();

type Panel = 'none' | 'settings' | 'about';

function AppInner() {
  const {
    bootstrapping,
    progress,
    refreshProgress,
    reminderPromptSeen,
  } = useAppBootstrap();
  const [panel, setPanel] = useState<Panel>('none');

  const {
    inSession,
    showTrackComplete,
    postSession,
    handleOnboardingDone,
    startSession,
    handleSessionComplete,
    dismissTrackComplete,
    homeFromPostSession,
    replayFromPostSession,
  } = useAppFlow({ program, progress, refreshProgress });

  const onRestartTrack = useCallback(async () => {
    await resetTrackProgress();
    await refreshProgress();
    dismissTrackComplete();
  }, [refreshProgress, dismissTrackComplete]);

  const reminderSetupDone = useCallback(async () => {
    await refreshProgress();
  }, [refreshProgress]);

  if (bootstrapping || progress == null) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={theme.accent} />
      </View>
    );
  }

  if (!progress.onboardingDone) {
    return (
      <SafeAreaView style={styles.safe}>
        <OnboardingFlow onDone={handleOnboardingDone} />
      </SafeAreaView>
    );
  }

  if (!reminderPromptSeen) {
    return (
      <SafeAreaView style={styles.safe}>
        <ReminderSetupScreen onComplete={reminderSetupDone} />
      </SafeAreaView>
    );
  }

  if (postSession) {
    return (
      <SafeAreaView style={styles.safe}>
        <PostSessionScreen
          dayCompleted={postSession.day}
          anchorText={postSession.anchorText}
          streak={postSession.streak}
          completedDaysCount={postSession.completedDaysCount}
          trackDays={postSession.trackDays}
          totalSessionsCompleted={postSession.totalSessionsCompleted}
          onReplay={replayFromPostSession}
          onHome={homeFromPostSession}
        />
      </SafeAreaView>
    );
  }

  if (showTrackComplete) {
    return (
      <SafeAreaView style={styles.safe}>
        <TrackCompleteSummary
          program={program}
          progress={progress}
          onContinue={dismissTrackComplete}
          onRestartTrack={onRestartTrack}
        />
      </SafeAreaView>
    );
  }

  if (inSession) {
    return (
      <SafeAreaView style={styles.safe}>
        <SessionContainer
          program={program}
          currentDay={Math.min(
            progress.currentDay,
            program.track.duration_days
          )}
          onSessionComplete={handleSessionComplete}
        />
      </SafeAreaView>
    );
  }

  if (panel === 'settings') {
    return (
      <SafeAreaView style={styles.safe}>
        <SettingsScreen
          onBack={() => setPanel('none')}
          onProgressReset={refreshProgress}
        />
      </SafeAreaView>
    );
  }

  if (panel === 'about') {
    return (
      <SafeAreaView style={styles.safe}>
        <AboutScreen onBack={() => setPanel('none')} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <MainHome
        progress={progress}
        program={program}
        onStartSession={startSession}
        onOpenSettings={() => setPanel('settings')}
        onOpenAbout={() => setPanel('about')}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider style={styles.safe}>
      <AppInner />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.background,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.background,
  },
});
