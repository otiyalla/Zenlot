import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { TextComponent as Text } from "@/components/atoms/Text";
import { Card, Divider } from '@/components/ui';
import { useTranslate } from "@/hooks/useTranslate";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { IAnalysisCard } from "@/types";

const AnalysisCard: React.FC<IAnalysisCard> = ({ title, content}) => {
    const { localize } = useTranslate();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const color = colorScheme === 'dark' ? {positive: theme.success, negative: theme.danger} :  {positive: theme.success, negative: theme.danger};
    
    return (
        <Card size={'sm'} variant='outline' style={styles.card}>
            <Text bold size={'md'} accessibilityLabel={title} style={styles.cardTitle}>{title}</Text>
            <Divider className="mt-2" />
            <View style={styles.cardContent}>
                <View style={{ flex: 1 }}>
                    <Text bold accessibilityLabel={localize('trades')}>{localize('trades')}</Text>
                    <Text bold size={'2xl'} accessibilityLabel={(content.trades).toString()}>{content.trades}</Text>
                </View>
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                    <Text style={[ { color: color.positive }]} accessibilityLabel={localize('forex.gain')}>{localize('forex.gain')}: {content.gain}</Text>
                    <Text style={[ { color: color.negative , marginTop: 5 }]} accessibilityLabel={localize('forex.loss')}>{localize('forex.loss')}: {content.loss}</Text>
                </View>
            </View>
            {!!content.net && 
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text bold style={{ marginTop: 5 }} accessibilityLabel={localize('net')}>{localize('net')}: </Text>
                    <Text bold style={[ { marginTop: 5, color: content.net < 0 ? color.negative : color.positive }]} accessibilityLabel={(content.net).toString()}>{content.net}</Text>
                </View>
            }
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginRight: 12,
        justifyContent: "center",
        alignSelf: 'stretch', 
        minWidth: Platform.OS !== 'web' ? 180 : 235,
        flexGrow: 1 
    },
    cardTitle: { 
        alignSelf: 'flex-end'
    },
    cardContent: { 
        flexDirection: "row",
        alignItems: "flex-start" 
    }
});

export default AnalysisCard;