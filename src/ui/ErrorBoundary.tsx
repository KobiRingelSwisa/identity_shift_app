import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from './theme';
import { logger } from '../utils/logger';

type Props = { children: ReactNode };

type State = { hasError: boolean; message?: string };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(err: Error): State {
    return { hasError: true, message: err.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    logger.error('ErrorBoundary', error.message, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.root}>
          <Text style={styles.title}>משהו השתבש</Text>
          <Text style={styles.body} accessibilityRole="text">
            נסה לפתוח שוב את האפליקציה. אם זה חוזר — נשמח לשמוע דרך תמיכה בהגדרות.
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="נסה שוב"
            onPress={() => this.setState({ hasError: false, message: undefined })}
            style={styles.btn}
          >
            <Text style={styles.btnText}>נסה שוב</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: theme.background,
  },
  title: {
    fontSize: 22,
    color: theme.text,
    textAlign: 'center',
    marginBottom: 12,
    writingDirection: 'rtl',
  },
  body: {
    fontSize: 15,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    writingDirection: 'rtl',
  },
  btn: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: theme.surfaceElevated,
  },
  btnText: {
    color: theme.accent,
    fontSize: 16,
    fontWeight: '600',
  },
});
