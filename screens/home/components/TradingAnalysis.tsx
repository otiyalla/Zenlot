import React from "react";
import { Platform, View, ScrollView, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { TextComponent as Text } from "@/components/atoms/Text";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslate } from "@/hooks/useTranslate";
import { ButtonComponent as Button } from "@/components/atoms/Button";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import AnalysisCard from "./orgnisms/AnalysisCard";
import AnalysisList from "./orgnisms/AnalysisList";
import { AnalysisProps, AnalysisType, IAnalysisCard } from "@/types"
import { useTrade } from "@/providers/TradeProvider";

const types:AnalysisType[] = ['weekly_analysis',  'weekly_pips', 'monthly_analysis',  'monthly_pips' ];
   
const TradingAnalysis: React.FC = () => {
    const [cards, setCards] = useState<IAnalysisCard[]>([]);
    const [show, setShow] = useState<boolean>(false);
    const { localize } = useTranslate();
    const [selected, setSelected] = useState<AnalysisProps[]>([]);
    const colorSchema = useColorScheme();
    const theme =  Colors[colorSchema ?? 'light'];
    const list = types.reduce((a, e) => {
        a.push({key: e, name: localize(e)});
        return a;
    }, [] as {key: string, name: string}[]);
    const { tradeHistory } = useTrade();
    
    
    const getAnalysis = (type: string) => {
        return {
            id: Math.round(Math.random() * 1000),
            title: localize(type),
            type,
            content: {
                trades: Math.round(Math.random()  *  (type.includes('weekly') ? 5 : 10)),
                gain: Math.round(Math.random()  *  (type.includes('weekly') ? 20 : 100)),
                loss: Math.round(Math.random()  *  (type.includes('weekly') ? 20 : 120)),
                net: (Math.round(Math.random()  *  (type.includes('weekly') ? 50 : 100))) * (!!Math.round(Math.random()) ? -1 : 1),
            }
        }
    }


    const onAdd = (analysis: AnalysisProps) => {
        //TODO: Call an api to get the analysis - Consider changing to present month and previouse month
        //TODO: Consider changing to present month and previous month
        //TODO:  Consider changing to current week and previous week
        const newCards = getAnalysis(analysis.key);
        setCards([ ...cards, newCards ]);
        setSelected([ ...selected, analysis]);
    }

    const onRemove = (analysis: AnalysisProps) => {
        const updated = selected.filter(a => a.key !== analysis.key);
        const newCards = cards.filter(a => a.type !== analysis.key);
        setCards([ ...newCards ]);
        setSelected([ ...updated]);
    }

    const onToggle = () => {
        setShow(!show);
    }

    const settings =(
            <Modal
                visible={show}
                onRequestClose={onToggle}
                animationType="slide"
                presentationStyle="pageSheet"
                backdropColor={theme.background}
                statusBarTranslucent={true}
            >
                <View 
                style={{flex:1, backgroundColor: theme.background}}>
                    <AnalysisList 
                        analyses={list}
                        onAdd={onAdd}
                        onRemove={onRemove}
                        selected={selected}
                    />
                    <Button accessibilityLabel={localize('common.close')} color={'#B10B0B'} onPress={onToggle} title={localize('common.close')}/>
                </View>
            </Modal>
    );
    

    return (
        <View style={styles.container}>
            <Text style={styles.header} bold size={'3xl'} accessibilityLabel={localize('trading_overview')} >{localize('trading_overview')}</Text>
            <ScrollView alwaysBounceHorizontal={true} horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                {
                    cards.map((card, i) => (
                        <AnalysisCard
                            key={`${card.id}-${i}`}
                            id={card.id}
                            title={card.title}
                            type={card.type}
                            content={card.content}
                        />
                ))}
                { list.length !== selected.length ? (
                    <TouchableOpacity style={[styles.addButton, {backgroundColor: theme.buttons}]} onPress={onToggle}>
                        <Ionicons accessibilityLabel={localize('common.add')} name="add" size={32} color={theme.text} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={[styles.removeButton, {backgroundColor: theme.buttonCancel}]} onPress={onToggle}>
                        <Ionicons accessibilityLabel={localize('common.remove')} name="remove" size={32} color={theme.text} />
                    </TouchableOpacity>)
                }
            </ScrollView>
            {settings}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        marginVertical: 10 
    },
    header: { 
        marginBottom: 12, 
        marginLeft: 8,
        alignItems: 'center'
    },
    scrollView: { 
        paddingLeft: 10 
    },
    addButton: {
        width: 60,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    removeButton: {
        width: 60,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
});

export default TradingAnalysis;