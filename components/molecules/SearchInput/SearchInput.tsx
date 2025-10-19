import React, { useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { TextInput, Text, Icon } from '@/components/atoms';
import { Colors } from '@/constants';
import { useColorScheme } from "@/hooks/useColorScheme";

export interface SearchResult {
  [key: string]: any;
}

export interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSelect?: (item: SearchResult) => void;
  placeholder?: string;
  results?: SearchResult[];
  onSearch?: (query: string) => void;
  renderResult?: (item: SearchResult) => React.ReactNode;
  loading?: boolean;
  error?: boolean;
  testID?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  onSelect,
  placeholder = 'Search...',
  results = [],
  onSearch,
  renderResult,
  loading = false,
  error = false,
  testID,
}) => {
  const [showResults, setShowResults] = useState(false);
  const theme = useColorScheme() ?? "light";

  const handleTextChange = useCallback((text: string) => {
    onChangeText(text);
    if (onSearch) {
      onSearch(text);
    }
    setShowResults(text.length > 0);
  }, [onChangeText, onSearch]);

  const handleSelect = useCallback((item: SearchResult) => {
    if (onSelect) {
      onSelect(item);
    }
    setShowResults(false);
  }, [onSelect]);

  const handleBlur = useCallback(() => {
    // Delay hiding results to allow for selection
    setTimeout(() => setShowResults(false), 150);
  }, []);

  const renderItem = ({item}: {item: SearchResult & {id: string | number}}) => {
        return (
            <TouchableOpacity
                key={`zenlot-search-${item.id}`}
                style={[styles.resultItemContainer, {
                    borderBottomColor: Colors[theme].textBorderColor
                }]}
                onPress={() => {handleSelect(item)}}
            >
                {renderResult && renderResult(item)}
            </TouchableOpacity>
        );
    };

    const renderItems = results.map(
        (item: SearchResult, id: number) => renderItem({ item: { id, ...item } })
    )

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={handleTextChange}
        placeholder={placeholder}
        error={error}
        testID={testID}
        onFocus={() => setShowResults(value.length > 0)}
        onBlur={handleBlur}
        style={styles.input}
        rightIcon={loading ? 'spinner' : value.length > 0 ? 'times' : 'search'}
        onRightIconPress={value.length > 0 ? () => onChangeText('') : undefined}
      />
      
      {showResults && results.length > 0 && (
        <View style={[styles.resultsContainer, 
          { backgroundColor: Colors[theme].background, 
            borderColor: Colors[theme].textBorderColor, 
            shadowColor: Colors[theme].inputBorder }]
          }>
          {
            !!results.length && renderItems
          }
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    zIndex: 1000,
  },
  input: {
    width: '100%',
  },
  resultsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderRadius: 8,
    borderWidth: 1,
    maxHeight: 200,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1001,
  },
  resultsList: {
    maxHeight: 200,
  },
  resultItemContainer: {
    padding: 12,
    borderBottomWidth: 1,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
