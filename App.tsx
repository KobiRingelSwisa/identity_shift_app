import { useCallback, useState } from 'react';
import { ActivityIndicator, I18nManager, StyleSheet, View } from 'react-native';
import {
  useFonts,
  Assistant_400Regular,
  Assistant_500Medium,
  Assistant_600SemiBold,
} from '@expo-google-fonts/assistant';
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
import { PrivacyPolicyScreen } from './src/screens/PrivacyPolicyScreen';
import { TermsOfUseScreen } from './src/screens/TermsOfUseScreen';
import { SubscriptionTermsScreen } from './src/screens/SubscriptionTermsScreen';
import { PaywallScreen } from './src/screens/PaywallScreen';
import { ErrorBoundary } from './src/ui/ErrorBoundary';
import { ReminderSetupScreen } from './src/screens/ReminderSetupScreen';
import { useAppBootstrap } from './src/app/useAppBootstrap';
import { useAppFlow } from './src/app/useAppFlow';
import { resetTrackProgress } from './src/storage/progress';
import { theme } from './src/ui/theme';
import { featureFlags } from './src/config/featureFlags';
import { usePremiumEntitlement } from './src/hooks/usePremiumEntitlement';
import { trackEvent } from './src/analytics/track';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const program = loadProgram();

type Panel =
  | 'none'
  | 'settings'
  | 'about'
  | 'privacy'
  | 'terms'
  | 'subscription_terms';

function AppInner() {
  const {
    bootstrapping,
    progress,
    refreshProgress,
    reminderPromptSeen,
  } = useAppBootstrap();
  const [panel, setPanel] = useState<Panel>('none');
  const [legalFrom, setLegalFrom] = useState<'settings' | 'about'>('settings');

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
    paywallTrigger,
    dismissPaywall,
    openPaywall,
    openPaywallFromSettings,
  } = useAppFlow({ program, progress, refreshProgress });

  const { premium } = usePremiumEntitlement();

  const showPostSessionGrowthCta =
    featureFlags.ENABLE_PAYWALL &&
    featureFlags.GROWTH_POST_SESSION_UPGRADE_CTA &&
    premium === false;

  const showTrackCompleteGrowthCta =
    featureFlags.ENABLE_PAYWALL &&
    featureFlags.GROWTH_TRACK_COMPLETE_UPGRADE_CTA &&
    premium === false;

  const onGrowthPostSession = useCallback(() => {
    void trackEvent('growth_upgrade_cta_clicked', {
      surface: 'post_session',
      programId: program.track.id,
    });
    openPaywall('growth_post_session');
  }, [program.track.id, openPaywall]);

  const onGrowthTrackComplete = useCallback(() => {
    void trackEvent('growth_upgrade_cta_clicked', {
      surface: 'track_complete',
      programId: program.track.id,
    });
    openPaywall('growth_track_complete');
  }, [program.track.id, openPaywall]);

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

  if (paywallTrigger != null && featureFlags.ENABLE_PAYWALL) {
    return (
      <SafeAreaView style={styles.safe}>
        <PaywallScreen
          reason={paywallTrigger}
          programId={program.track.id}
          onClose={dismissPaywall}
        />
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
          showUpgradeCTA={showPostSessionGrowthCta}
          onOpenUpgrade={onGrowthPostSession}
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
          showUpgradeCTA={showTrackCompleteGrowthCta}
          onOpenUpgrade={onGrowthTrackComplete}
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
          onOpenPrivacy={() => {
            setLegalFrom('settings');
            setPanel('privacy');
          }}
          onOpenTerms={() => {
            setLegalFrom('settings');
            setPanel('terms');
          }}
          onOpenSubscriptionTerms={() => {
            setLegalFrom('settings');
            setPanel('subscription_terms');
          }}
          onOpenUpgrade={openPaywallFromSettings}
        />
      </SafeAreaView>
    );
  }

  if (panel === 'privacy') {
    return (
      <SafeAreaView style={styles.safe}>
        <PrivacyPolicyScreen onBack={() => setPanel(legalFrom)} />
      </SafeAreaView>
    );
  }

  if (panel === 'terms') {
    return (
      <SafeAreaView style={styles.safe}>
        <TermsOfUseScreen onBack={() => setPanel(legalFrom)} />
      </SafeAreaView>
    );
  }

  if (panel === 'subscription_terms') {
    return (
      <SafeAreaView style={styles.safe}>
        <SubscriptionTermsScreen onBack={() => setPanel(legalFrom)} />
      </SafeAreaView>
    );
  }

  if (panel === 'about') {
    return (
      <SafeAreaView style={styles.safe}>
        <AboutScreen
          onBack={() => setPanel('none')}
          onOpenPrivacy={() => {
            setLegalFrom('about');
            setPanel('privacy');
          }}
          onOpenTerms={() => {
            setLegalFrom('about');
            setPanel('terms');
          }}
          onOpenSubscriptionTerms={() => {
            setLegalFrom('about');
            setPanel('subscription_terms');
          }}
        />
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
        onOpenPremiumUpgrade={
          featureFlags.ENABLE_PAYWALL ? openPaywallFromSettings : undefined
        }
      />
    </SafeAreaView>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Assistant_400Regular,
    Assistant_500Medium,
    Assistant_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.fontLoading}>
        <ActivityIndicator color={theme.accent} />
      </View>
    );
  }

  return (
    <SafeAreaProvider style={styles.safe}>
      <ErrorBoundary>
        <AppInner />
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  fontLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.background,
  },
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
