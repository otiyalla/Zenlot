import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, useColorScheme } from 'react-native';

type Option = {
    label: string;
    value: string;
};

export type DropdownProps = {
    options: Option[];
    selectedValue: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
};

export const Dropdown: React.FC<DropdownProps> = ({
    options,
    selectedValue,
    onValueChange,
    placeholder = 'Select...',
}) => {
    const [visible, setVisible] = useState(false);
    const scheme = useColorScheme();

    const theme = scheme === 'dark' ? darkTheme : lightTheme;

    const selectedLabel =
        options.find((opt) => opt.value === selectedValue)?.label || placeholder;

    return (
        <View>
            <TouchableOpacity
                style={[styles.dropdown, { backgroundColor: theme.bg, borderColor: theme.border }]}
                onPress={() => setVisible(true)}
                activeOpacity={0.7}
            >
                <Text style={{ color: theme.text }}>{selectedLabel}</Text>
            </TouchableOpacity>
            <Modal visible={visible} transparent animationType="fade">
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setVisible(false)}
                >
                    <View style={[styles.modalContent, { backgroundColor: theme.bg }]}>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.option}
                                    onPress={() => {
                                        onValueChange(item.value);
                                        setVisible(false);
                                    }}
                                >
                                    <Text style={{ color: theme.text }}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const lightTheme = {
    bg: '#fff',
    text: '#222',
    border: '#ccc',
};

const darkTheme = {
    bg: '#222',
    text: '#fff',
    border: '#444',
};

const styles = StyleSheet.create({
    dropdown: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        minWidth: 120,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        borderRadius: 10,
        padding: 8,
        minWidth: 200,
        maxHeight: 300,
        elevation: 5,
    },
    option: {
        padding: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
    },
});
