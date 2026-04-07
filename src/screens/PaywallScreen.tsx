import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ScreenLayout } from '../ui/ScreenLayout';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SecondaryButton } from '../ui/SecondaryButton';
import { theme, typography } from '../ui/theme';
import { getBillingProvider } from '../billing/getBillingProvider';
import { notifyBillingRefresh } from '../billing/billingRefresh';
import { useBilling } from '../billing/useBilling';
import type { BillingPeriod } from '../billing/types';
import { trackEvent } from '../analytics/track';
import type { PaywallTriggerReason } from '../app/useAppFlow';

type Props = {
  reason: PaywallTriggerReason;
  programId: string;
  onClose: () => void;
};

export function PaywallScreen({ reason, programId, onClose }: Props) {
  const { offerings, loading, error, refresh } = useBilling();
  const [plan, setPlan] = useState<BillingPeriod>('yearly');
  const [purchaseBusy, setPurchaseBusy] = useState(false);
  const [restoreBusy, setRestoreBusy] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [successKind, setSuccessKind] = useState<'none' | 'purchase' | 'restore'>(
    'none'
  );
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    void trackEvent('paywall_viewed', { reason, programId });
  }, [reason, programId]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const scheduleCloseAfterSuccess = useCallback(
    (kind: 'purchase' | 'restore') => {
      notifyBillingRefresh();
      setSuccessKind(kind);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      closeTimerRef.current = setTimeout(() => {
        closeTimerRef.current = null;
        setSuccessKind('none');
        onClose();
      }, 1400);
    },
    [onClose]
  );

  const onPurchase = useCallback(async () => {
    setInlineError(null);
    setPurchaseBusy(true);
    try {
      await trackEvent('paywall_cta_clicked', { plan, programId });
      await trackEvent('purchase_started', { plan, programId });
      await getBillingProvider().purchasePackage(plan);
      await trackEvent('purchase_success', { plan, programId });
      scheduleCloseAfterSuccess('purchase');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'unknown';
      setInlineError(msg);
      await trackEvent('purchase_failed', { reason: msg, programId });
    } finally {
      setPurchaseBusy(false);
    }
  }, [plan, programId, scheduleCloseAfterSuccess]);

  const onRestore = useCallback(async () => {
    setInlineError(null);
    setRestoreBusy(true);
    try {
      await trackEvent('restore_started', { programId });
      await getBillingProvider().restorePurchases();
      await trackEvent('restore_success', { programId });
      scheduleCloseAfterSuccess('restore');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'unknown';
      setInlineError(msg);
      await trackEvent('restore_failed', { reason: msg, programId });
    } finally {
      setRestoreBusy(false);
    }
  }, [programId, scheduleCloseAfterSuccess]);

  const busy = purchaseBusy || restoreBusy || successKind !== 'none';

  if (successKind !== 'none') {
    return (
      <ScreenLayout background="gradient">
        <View style={styles.centered}>
          <Text style={styles.successTitle}>
            {successKind === 'purchase'
              ? 'המנוי הופעל'
              : 'הרכישות שוחזרו בהצלחה'}
          </Text>
          <Text style={styles.muted}>סוגרים…</Text>
          <ActivityIndicator color={theme.accent} style={styles.loader} />
        </View>
      </ScreenLayout>
    );
  }

  if (loading && !offerings && !error) {
    return (
      <ScreenLayout background="gradient">
        <View style={styles.centered}>
          <ActivityIndicator color={theme.accent} />
          <Text style={styles.muted}>טוען הצעות…</Text>
        </View>
      </ScreenLayout>
    );
  }

  if (error && !offerings) {
    return (
      <ScreenLayout background="gradient">
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <PrimaryButton label="נסה שוב" onPress={() => void refresh()} />
          <View style={styles.spacer} />
          <SecondaryButton label="סגור" onPress={onClose} />
        </View>
      </ScreenLayout>
    );
  }

  if (!offerings) {
    return (
      <ScreenLayout background="gradient">
        <View style={styles.centered}>
          <Text style={styles.errorText}>אין חבילות זמינות כרגע.</Text>
          <SecondaryButton label="סגור" onPress={onClose} />
        </View>
      </ScreenLayout>
    );
  }

  const monthlyLabel = `${offerings.monthly.title} — ${offerings.monthly.price}`;
  const yearlyLabel = `${offerings.yearly.title} — ${offerings.yearly.price}`;

  return (
    <ScreenLayout background="gradient">
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="סגור"
            onPress={onClose}
            hitSlop={12}
            disabled={busy}
          >
            <Text style={[styles.close, busy && styles.disabled]}>סגור</Text>
          </Pressable>
        </View>

        <Text style={styles.title}>Identity Shift+</Text>
        <Text style={styles.sub}>
          תמיכה בהמשך הפיתוח, מסלולים נוספים בעתיד, ובלי לשנות את הקצב השקט של
          האימון היומי.
        </Text>

        <View style={styles.toggleRow}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setPlan('monthly')}
            disabled={busy}
            style={[styles.chip, plan === 'monthly' && styles.chipOn]}
          >
            <Text style={[styles.chipText, plan === 'monthly' && styles.chipTextOn]}>
              {monthlyLabel}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => setPlan('yearly')}
            disabled={busy}
            style={[styles.chip, plan === 'yearly' && styles.chipOn]}
          >
            <Text style={[styles.chipText, plan === 'yearly' && styles.chipTextOn]}>
              {yearlyLabel}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.hint}>
          אפשר לסגור בכל עת — האימון הבסיסי נשאר זמין.
        </Text>

        {inlineError ? (
          <Text style={styles.errorText}>{inlineError}</Text>
        ) : null}

        {busy ? (
          <ActivityIndicator color={theme.accent} style={styles.loader} />
        ) : (
          <>
            <PrimaryButton
              label={plan === 'yearly' ? 'המשך עם שנתי' : 'המשך עם חודשי'}
              onPress={() => void onPurchase()}
            />
            <View style={styles.spacer} />
            <SecondaryButton label="שחזור רכישה" onPress={() => void onRestore()} />
          </>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  scroll: {
    paddingBottom: 40,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  close: {
    color: theme.accent,
    fontSize: 15,
    fontWeight: '500',
    writingDirection: 'rtl',
  },
  disabled: {
    opacity: 0.5,
  },
  title: {
    ...typography.screenTitle,
    fontSize: 26,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  sub: {
    ...typography.body,
    color: theme.textSecondary,
    textAlign: 'right',
    lineHeight: 22,
    writingDirection: 'rtl',
  },
  toggleRow: {
    flexDirection: 'row-reverse',
    gap: 10,
    marginTop: 8,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: theme.surfaceElevated,
    borderWidth: 1,
    borderColor: theme.surfaceBorder,
    flex: 1,
    minWidth: 0,
  },
  chipOn: {
    borderColor: theme.accent,
    backgroundColor: theme.surfaceFocus,
  },
  chipText: {
    color: theme.textSecondary,
    fontSize: 14,
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  chipTextOn: {
    color: theme.text,
    fontWeight: '600',
  },
  hint: {
    ...typography.caption,
    textAlign: 'right',
    lineHeight: 20,
    writingDirection: 'rtl',
  },
  errorText: {
    ...typography.caption,
    color: '#f87171',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  loader: {
    marginVertical: 24,
  },
  spacer: {
    height: 8,
  },
  muted: {
    color: theme.textSecondary,
    marginTop: 12,
    writingDirection: 'rtl',
  },
  successTitle: {
    ...typography.screenTitle,
    fontSize: 22,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
});
