import * as React from 'react';
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAvoidingView } from 'react-native';

export const KeyboarAvoidingContent: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const insets = useSafeAreaInsets();
    const headerHeight = useHeaderHeight();

    return (
        <KeyboardAvoidingView
            behavior="padding"
            style={{ flexGrow: 1, flexBasis: 0, marginBottom: insets.bottom }}
            keyboardVerticalOffset={headerHeight}
        >
            {children}
        </KeyboardAvoidingView>
    );
};