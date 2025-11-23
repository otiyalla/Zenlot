import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { TextInput} from '@/components/atoms/TextInput';
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useWebsocket } from '@/providers/WebsocketProvider';
import { IQuote } from '@/types';

interface SearchProps {
    query: string;
    onChangeText: (text: string) => void;
    onSelect: (item: unknown) => void;
    placeholderText: string;
    onSearch: (item: IQuote, text: string) => boolean;
    renderSearchItem: (item: IQuote) => React.ReactNode;
}


const Search = ({ query, onChangeText, onSelect, onSearch, placeholderText, renderSearchItem }: SearchProps) => {
    const colorScheme = useColorScheme();
    const [filteredResults, setFilteredResults] = useState<IQuote[]>([]);
    const [available, setAvailable] = useState<IQuote[]>([]);
    const [showResults, setShowResults] = useState(false);
    const { socket } = useWebsocket();
    const [isFocus, setFocus] = useState<boolean>(false);
    const theme = Colors[colorScheme as 'light' | 'dark']

    useEffect(() => {
        if (isFocus){
            if (!available.length){
                socket?.emit('list-quotes');
                socket?.on('list-quote-update', (data) => {
                    if(query.length > 0){
                        const filtered = data.filter((item: any) => onSearch(item, query));
                        setFilteredResults(filtered);
                    }else{
                        setFilteredResults(data);
                    }
                    setAvailable(data);
                    setShowResults(true);
                });
            }else{
                setShowResults(true);
            }
        } else {
            setShowResults(false);
        }

        return () => {
            socket?.off('list-quotes');
        }
    }, [isFocus, available.length]);
   
    const onSelectItem = (item: any) => {
        console.log('onSelectItem -', item);
        onSelect(item)
        setFocus(false);
        setShowResults(false);
    }

    const onChange = (text: string) => {
        onChangeText(text);
        
        if (text.length > 0) {
            const filtered = available.filter(item => onSearch(item, text));
            setFilteredResults(filtered);
        }
    }

    const onFocus = () => {
        setFocus(true);
        setShowResults(true);
    }

    const onBlur = () => {
        setTimeout(() => {
            //setFocus(false);
            //setShowResults(false);
        }, 250);
    }

    const onListPress = () => {
        setFocus(true);
        setShowResults(true);
    }


    const renderItem = ({item}: {item: IQuote & {id: string | number}}) => {
        return (
            <TouchableOpacity
                key={`zenlot-search-${item.id}`}
                style={[styles.item, {
                    borderBottomColor: theme.textBorderColor
                }]}
                onPress={() => {onSelectItem(item)}}
            >
                {renderSearchItem(item)}
            </TouchableOpacity>
        );
    };

    
    const renderItems = filteredResults.map(
        (item: IQuote, id: number) => renderItem({ item: { id, ...item } })
    )

    return (
        <View style={styles.container}>
            <TextInput
                placeholder={placeholderText}
                value={query}
                onChangeText={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
            />
            {showResults && (
                <Pressable onPress={onListPress}>
                    <ScrollView style={[styles.dropdown, {
                        backgroundColor: theme.background,
                        borderColor: theme.textBorderColor,
                    }]}
                    nestedScrollEnabled={true}
                    >
                        {
                            !!filteredResults.length && renderItems
                        } 
                    </ScrollView>
                </Pressable>
            )}  
        </View>
    );
};

const styles = StyleSheet.create({
    container: { width: '100%' },
    dropdown: {
        maxHeight: 200,
        zIndex: 1,
        paddingLeft: 5,
        paddingRight: 5,
        marginTop: -2,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderTopWidth: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0
    },
    item: {
        padding: 12,
        borderBottomWidth: 1,
    },
});

export default Search;