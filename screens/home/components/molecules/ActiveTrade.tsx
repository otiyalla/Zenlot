import React, { useState, useCallback } from "react";
import { FlatList, StyleSheet, View, Platform, RefreshControl } from "react-native";
import { TextComponent as Text } from "@/components/atoms/Text";
import { useTranslate } from "@/hooks/useTranslate";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useTrade } from "@/providers/TradeProvider";
import TradeCard  from '@/screens/home/components/orgnisms/TradeCard';

const ActiveTrade: React.FC = () => {
    const { localize } = useTranslate();
    const { tradeHistory, refreshTrades } = useTrade();
    const colorSchema = useColorScheme();
    const theme =  Colors[colorSchema ?? 'light'];
    const [refreshing, setRefreshing] = useState(false);
//TODO: Add the ability to show total trades and hide total trades
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            refreshTrades();
        } catch (error) {
            console.error('Failed to refresh trades:', error);
        } finally {
            setRefreshing(false);
        }
    }, []);

    const renderedItem = (item: any) => {
        return (
            <TradeCard trade={item} onPress={()=>{}}/>
        )
    }
      
    return (
        <View style={styles.container}>
            <Text style={{ marginLeft: 20 }} bold size={'2xl'} accessibilityLabel={localize('active_trades')}>{localize('active_trades')}</Text>
            <FlatList
                style={styles.flatList}
                contentContainerStyle={styles.contentContainer}
                data={tradeHistory}
                keyExtractor={(item, _id) => `${item.key}-${_id}`}
                renderItem={({ item }) => renderedItem(item)}
                ListEmptyComponent={
                    <Text accessibilityLabel={localize('no_trade_entered')} italic style={[styles.emptyText, {color: theme.placeholderTextColor}]}>
                        {localize('no_trade_entered')}
                    </Text>
                }
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[theme.primary]}
                        tintColor={theme.primary}
                        title={localize('pull_to_refresh')}
                        titleColor={theme.placeholderTextColor}
                    />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: Platform.OS === 'web' ? 650 : 600,
    },
    flatList: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    contentContainer: {
        flexGrow: 1,
        paddingBottom: Platform.OS === 'web' ? 60 : 20,
    },
    emptyText: {
        paddingVertical: 8,
    },
});

export default ActiveTrade;