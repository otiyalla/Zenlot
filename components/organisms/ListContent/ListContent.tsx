import { FlatList, StyleSheet } from 'react-native';
import { Text } from '@/components/atoms';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { AnalysisProps } from '@/types'

export type ListContentProps = {
    title: string;
    emptyListTitle: string;
    analyses: AnalysisProps[];
    renderedItem: (item: AnalysisProps) => React.ReactElement;
};

export const ListContent: React.FC<ListContentProps> = ({ title, renderedItem, emptyListTitle, analyses }) => {
   
    const colorSchema = useColorScheme();
    const theme = Colors[colorSchema ?? 'light'];

    return (
        <>
            <Text accessibilityLabel={title} bold size={'xl'} style={styles.header}>{title}</Text>
            <FlatList
                data={analyses}
                keyExtractor={(item, _id) => `${item.key}-${_id}`}
                renderItem={({ item }) => renderedItem(item)}
                ListEmptyComponent={
                    <Text accessibilityLabel={emptyListTitle} style={[styles.emptyText, {color: theme.placeholderTextColor}]}>
                        {emptyListTitle}
                    </Text>
                }
            />
        </>
    );
};

const styles = StyleSheet.create({
    header: {
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        paddingVertical: 8,
    },
});