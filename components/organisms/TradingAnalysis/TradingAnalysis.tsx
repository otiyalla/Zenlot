import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
} from "react-native";
import { Text, Button, Icon, SafeAreaView } from "@/components/atoms";
import { useTranslate } from "@/hooks/useTranslate";
import { useTrade } from "@/providers/TradeProvider";
import {  AnalysisList } from "../AnalysisList";
import { AnalysisCard } from "../AnalysisCard";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { AnalysisProps, AnalysisType, IAnalysisCard } from "@/types";
import { useUser } from "@/providers/UserProvider";

export interface TradingAnalysisProps {
  testID?: string;
}
//TODO: REVIEW CODE - Enhance styles and possibly add charts for better analysis
const types: AnalysisType[] = [
  "weekly_analysis",
  "weekly_pips",
  "monthly_analysis",
  "monthly_pips",
];

export const TradingAnalysis: React.FC<TradingAnalysisProps> = ({ testID }) => {
  const dummyUser = {
    accountCurrency: "USD",
    balance: 12500.75,
    totalTrades: 150,
    winRate: 0.65,
    weeklyPnL: 320.5,
    weeklyTrades: 12,
    avgReturn: 0.04,
  };
  const { trade } = useTrade();
  const { user } = useUser();

  const [cards, setCards] = useState<IAnalysisCard[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const { localize } = useTranslate();
  const [selected, setSelected] = useState<AnalysisProps[]>([]);
  const colorSchema = useColorScheme();
  const theme = Colors[colorSchema ?? "light"];
  const list = types.reduce((a, e) => {
    a.push({ key: e, name: localize(e) });
    return a;
  }, [] as { key: string; name: string }[]);
  const { tradeHistory } = useTrade();

  const getAnalysis = (type: string) => {
    return {
      id: Math.round(Math.random() * 1000),
      title: type,
      type,
      content: {
        trades: Math.round(Math.random() * (type.includes("weekly") ? 5 : 10)),
        gain: Math.round(Math.random() * (type.includes("weekly") ? 20 : 100)),
        loss: Math.round(Math.random() * (type.includes("weekly") ? 20 : 120)),
        net:
          Math.round(Math.random() * (type.includes("weekly") ? 50 : 100)) *
          (!!Math.round(Math.random()) ? -1 : 1),
      },
    };
  };

  const onAdd = (analysis: AnalysisProps) => {
    //TODO: Call an api to get the analysis - Consider changing to present month and previouse month
    //TODO: Consider changing to present month and previous month
    //TODO:  Consider changing to current week and previous week
    const newCards = getAnalysis(analysis.key);
    setCards([...cards, newCards]);
    setSelected([...selected, analysis]);
  };

  const onRemove = (analysis: AnalysisProps) => {
    const updated = selected.filter((a) => a.key !== analysis.key);
    const newCards = cards.filter((a) => a.type !== analysis.key);
    setCards([...newCards]);
    setSelected([...updated]);
  };

  const onToggle = () => {
    setShow((prev) => !prev);
  };

  const settings = (
    <Modal
      visible={show}
      onRequestClose={onToggle}
      animationType="slide"
      presentationStyle={Platform.OS !== "web" ? "pageSheet" : "overFullScreen"}
      backdropColor={theme.background}
      statusBarTranslucent={true}
    >
      <View style={[styles.modalContent, { backgroundColor: theme.background}]}>
        <AnalysisList
          analyses={list}
          onAdd={onAdd}
          onRemove={onRemove}
          selected={selected}
        />
        <Button
          accessibilityLabel={localize("common.close")}
          variant="danger"
          onPress={onToggle}
          title={localize("common.close")}
        />
      </View>
    </Modal>
  );

  const actionButtons = () => {
    if (list.length === selected.length) {
      return (
        <TouchableOpacity
          style={[styles.removeButton, { backgroundColor: theme.buttonCancel }]}
          onPress={onToggle}
        >
          <Icon
            accessibilityLabel={localize("common.remove")}
            name="minus"
            size={32}
            color={theme.text}
          />
        </TouchableOpacity>
      );
    }
    if (list.length !== selected.length && selected.length) {
      return (
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.buttons }]}
          onPress={onToggle}
        >
          <Icon
            accessibilityLabel={localize("common.add")}
            name="add"
            size={32}
            color={theme.text}
          />
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text
        style={styles.header}
        bold
        size={"2xl"}
        accessibilityLabel={localize("trading_overview")}
      >
        {localize("trading_overview")}
      </Text>
      {!selected.length && (
        <Button
          title={localize('add_analytic_overview')}
          onPress={onToggle}
          variant="outline"
          size="sm"
        />
      )}

      <ScrollView
        alwaysBounceHorizontal={true}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {cards.map((card, i) => (
          <AnalysisCard
            key={`${card.id}-${i}`}
            id={card.id}
            title={card.title}
            type={card.type}
            content={card.content}
          />
        ))}
        {actionButtons()}
      </ScrollView>
      {settings}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    backgroundColor: 'transparent'
  },
  header: {
    marginBottom: 12,
    textAlign: 'right',
  },
  modalContent: {
    padding: 10,
    flex: 1,
  },
  scrollView: {
    paddingLeft: 10,
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
