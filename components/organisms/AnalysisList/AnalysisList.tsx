import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '@/components/atoms';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useTranslate } from '@/hooks/useTranslate';
import { AnalysisProps } from '@/types'
import  { ListContent }  from '../ListContent';

export type AnalysisListProps = {
    analyses: AnalysisProps[];
    selected: AnalysisProps[];
    onAdd: (selected: AnalysisProps) => void;
    onRemove: (selected: AnalysisProps) => void;
};

//TODO: Review code - check styles for web when looking at list in dark and light mode
export const AnalysisList: React.FC<AnalysisListProps> = ({ analyses, onRemove, onAdd, selected }) => {
   
    const colorSchema = useColorScheme();
    const theme = Colors[colorSchema ?? 'light'];
    const { localize } = useTranslate();  

    const availableAnalyses = analyses.filter(a => !selected.find(s => s.key === a.key));

    const renderAdd = (item: AnalysisProps) => (
        <View style={[styles.itemRow, { borderBottomColor: theme.text}]}>
            <Text accessibilityLabel={item.name} size={'md'}>{item.name}</Text>
            <TouchableOpacity style={[styles.button, {backgroundColor: theme.buttons}]} onPress={() => onAdd(item)}>
                <Text accessibilityLabel={localize('common.add')} size={'sm'}>{localize('common.add')}</Text>
            </TouchableOpacity>
        </View>
    )

    const renderRemove = (item: AnalysisProps) => (
        <View style={[styles.itemRow, { borderBottomColor: theme.text}]}>
            <Text accessibilityLabel={item.name} size={'md'}>{item.name}</Text>
            <TouchableOpacity style={[styles.button, {backgroundColor: theme.buttonCancel}]} onPress={() => onRemove(item)}>
                <Text accessibilityLabel={localize('common.remove')} size={'sm'}>{localize('common.remove')}</Text>
            </TouchableOpacity>
        </View>
    )

    return (
        <View style={styles.container}>
            <ListContent
                title={localize('available_analyses')}
                emptyListTitle={localize('no_available_analyses')}
                analyses={availableAnalyses}
                renderedItem={renderAdd}
            />
            <ListContent
                title={localize('selected_analyses')}
                emptyListTitle={localize('no_selected_analyses')}
                analyses={selected}
                renderedItem={renderRemove}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
    },
    button: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 4,
    }
});
