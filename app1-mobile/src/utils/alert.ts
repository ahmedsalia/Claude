import { Alert, Platform } from 'react-native';

/**
 * Cross-platform alert that works on web, iOS, and Android
 */
export const showAlert = (
  title: string,
  message?: string,
  buttons?: Array<{
    text: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
  }>
) => {
  // On web, use window.confirm/alert
  if (Platform.OS === 'web') {
    const fullMessage = message ? `${title}\n\n${message}` : title;

    if (!buttons || buttons.length === 0) {
      // Simple alert
      window.alert(fullMessage);
      return;
    }

    if (buttons.length === 1) {
      // Single button alert
      window.alert(fullMessage);
      if (buttons[0].onPress) {
        buttons[0].onPress();
      }
      return;
    }

    // Confirm dialog (for 2+ buttons)
    const result = window.confirm(fullMessage);

    if (result) {
      // User clicked OK - find non-cancel button
      const confirmButton = buttons.find(b => b.style !== 'cancel');
      if (confirmButton?.onPress) {
        confirmButton.onPress();
      }
    } else {
      // User clicked Cancel
      const cancelButton = buttons.find(b => b.style === 'cancel');
      if (cancelButton?.onPress) {
        cancelButton.onPress();
      }
    }
  } else {
    // On native, use React Native Alert
    Alert.alert(title, message, buttons);
  }
};

/**
 * Simple alert with just an OK button
 */
export const showSimpleAlert = (title: string, message: string) => {
  showAlert(title, message, [{ text: 'OK' }]);
};

/**
 * Confirmation dialog with Cancel and Confirm buttons
 */
export const showConfirm = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void,
  confirmText: string = 'OK',
  cancelText: string = 'Cancel'
) => {
  showAlert(title, message, [
    {
      text: cancelText,
      style: 'cancel',
      onPress: onCancel,
    },
    {
      text: confirmText,
      onPress: onConfirm,
    },
  ]);
};

/**
 * Destructive confirmation (e.g., delete actions)
 */
export const showDestructiveConfirm = (
  title: string,
  message: string,
  onConfirm: () => void,
  confirmText: string = 'Delete'
) => {
  showAlert(title, message, [
    {
      text: 'Cancel',
      style: 'cancel',
    },
    {
      text: confirmText,
      style: 'destructive',
      onPress: onConfirm,
    },
  ]);
};
