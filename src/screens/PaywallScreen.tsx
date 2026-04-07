import { useCallback, useEffect, useState } from 'react';
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
import type { BillingPeriod } from '../billing/types';
import { trackEvent } from '../analytics/track';
import type { PaywallTriggerReason } from '../app/useAppFlow';

type Props = {
  reason: PaywallTriggerReason;
  onClose: () => void;
};

export function PaywallScreen({ reason, onClose }: Props) {
  const [plan, setPlan] = useState<BillingPeriod>('yearly');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void trackEvent('paywall_viewed', { reason });
  }, [reason]);

  const onPurchase = useCallback(async () => {
    setLoading(true);
    try {
      await trackEvent('paywall_cta_clicked', { plan });
      await trackEvent('purchase_started', { plan });
      await getBillingProvider().purchasePackage(plan);
      await trackEvent('purchase_success', { plan });
      onClose();
    } catch (e) {
      await trackEvent('purchase_failed', {
        reason: e instanceof Error ? e.message : 'unknown',
      });
    } finally {
      setLoading(false);
    }
  }, [plan, onClose]);

  const onRestore = useCallback(async () => {
    setLoading(true);
    try {
      await trackEvent('restore_started');
      await getBillingProvider().restorePurchases();
      await trackEvent('restore_success');
      onClose();
    } catch (e) {
      await trackEvent('restore_failed', {
        reason: e instanceof Error ? e.message : 'unknown',
      });
    } finally {
      setLoading(false);
    }
  }, [onClose]);

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
          >
            <Text style={styles.close}>סגור</Text>
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
            style={[styles.chip, plan === 'monthly' && styles.chipOn]}
          >
            <Text style={[styles.chipText, plan === 'monthly' && styles.chipTextOn]}>
              חודשי
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => setPlan('yearly')}
            style={[styles.chip, plan === 'yearly' && styles.chipOn]}
          >
            <Text style={[styles.chipText, plan === 'yearly' && styles.chipTextOn]}>
              שנתי
            </Text>
          </Pressable>
        </View>

        <Text style={styles.hint}>
          אפשר לסגור בכל עת — האימון הבסיסי נשאר זמין.
        </Text>

        {loading ? (
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
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: theme.surfaceElevated,
    borderWidth: 1,
    borderColor: theme.surfaceBorder,
  },
  chipOn: {
    borderColor: theme.accent,
    backgroundColor: theme.surfaceFocus,
  },
  chipText: {
    color: theme.textSecondary,
    fontSize: 15,
    writingDirection: 'rtl',
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
  loader: {
    marginVertical: 24,
  },
  spacer: {
    height: 8,
  },
});
