import React, { useState, useEffect } from 'react';
import { Platform, ScrollView } from 'react-native';
import {
  Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper, VStack, HStack, Divider, AddIcon
} from '@/components/design-system/ui';
import { Text, Button, TextInput, Icon } from '@/components/atoms';
import { useTranslate } from '@/hooks/useTranslate';
import { JournalEntry } from '@/api/journal';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants';
import { TextEditor } from '../Editor';

interface JournalEditProps {
  isOpen: boolean;
  onClose: () => void;
  journal: JournalEntry | null;
  onSave: (updatedJournal: Partial<JournalEntry>) => void;
}

export const JournalEdit: React.FC<JournalEditProps> = ({
  isOpen,
  onClose,
  journal,
  onSave,
}) => {
  const { localize } = useTranslate();
  const colorSchema = useColorScheme() as 'dark' | 'light';
  const theme = Colors[colorSchema];
  const isNewJournal = !journal;

  // Form state
  const [title, setTitle] = useState<string>(journal?.title || '');
  const [symbol, setSymbol] = useState<string>(journal?.symbol || '');
  const [tags, setTags] = useState<string[]>(journal?.tags || []);
  const [tagInput, setTagInput] = useState<string>('');
  const [plainText, setPlainText] = useState<string>(journal?.plainText || '');
  const [editorState, setEditorState] = useState<string | null>(journal?.editorState || null);

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Sync form when journal changes
  useEffect(() => {
    if (journal) {
      setTitle(journal.title || '');
      setSymbol(journal.symbol || '');
      setTags(journal.tags || []);
      setPlainText(journal.plainText || '');
      setEditorState(journal.editorState || null);
    } else {
      // Reset for new journal
      setTitle('');
      setSymbol('');
      setTags([]);
      setPlainText('');
      setEditorState(null);
    }
    setErrors({});
  }, [journal, isOpen]);

  const handleEditorChange = (newPlainText: string, newEditorState: string) => {
    setPlainText(newPlainText);
    setEditorState(newEditorState);
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    //TODO: Symbol is optional
    if (!symbol.trim()) {
      //newErrors.symbol = localize('symbol_required');
    }

    if (!plainText.trim() && !editorState) {
      newErrors.content = localize('journal.content_required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const journalData: Partial<JournalEntry> = {
      title: title.trim() || undefined,
      symbol: symbol.trim(),
      tags,
      plainText: plainText.trim() || undefined,
      editorState: editorState || undefined,
    };

    onSave(journalData);
  };

   const renderIcon = (icon: string | null) => {
    if (!icon) return null;
    return (
      <Icon
      style={{
        color: theme.primary,
      }}
        name={icon}
        size={24}
      />
    )
  }

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose} snapPoints={Platform.OS === 'ios' ? [85] : undefined}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
          <VStack space="md" className="w-full px-3 py-2">
            <HStack style={{ justifyContent: "flex-end", alignItems: "center" }}>
              <Text bold size="xl">{isNewJournal ? localize('journal.create') : localize('journal.edit')}</Text>
            </HStack>
            <Divider />

            <TextInput
              label={`${localize('title')} ${localize('optional')}`}
              value={title}
              onChangeText={setTitle}
              placeholder={localize('placeholder.journal')}
              error={!!errors.title}
              helperText={errors.title}
            />

            <TextInput
              label={localize('symbol')}
              value={symbol}
              onChangeText={setSymbol}
              placeholder={localize('placeholder.currency')}
              error={!!errors.symbol}
              helperText={errors.symbol}
              autoCapitalize="characters"
            />

            {/* Tags Input */}
            <>
              <TextInput
                label={`${localize('tags')} ${localize('optional')}`}
                value={tagInput}
                onChangeText={setTagInput}
                placeholder={localize('placeholder.tag')}
                onSubmitEditing={handleAddTag}
                rightIcon={renderIcon("square-plus")}
                onRightIconPress={handleAddTag}
              />
              {tags.length > 0 && (
                <HStack space="xs" style={{ flexWrap: 'wrap', marginTop: 8 }}>
                  {tags.map((tag, index) => (
                      <Button
                      key={`tag-${index}`}
                        title={tag.toUpperCase()}
                        onPress={() => handleRemoveTag(tag)}
                        size="sm"
                        icon={'xmark'}
                        variant="outline-danger"
                      />
                  ))}
                </HStack>
              )}
            </>

            {/* Content Editor */}
            <VStack space="xs">
              <Text size="sm" color="secondary">{localize('content')} *</Text>
              {errors.content && (
                <Text size="xs" color="error">{errors.content}</Text>
              )}
              <TextEditor
                plainText={plainText}
                editorState={editorState}
                onChange={handleEditorChange}
                
              />
            </VStack>

            <Divider />

            {/* Action Buttons */}
            <HStack space="md">
              <Button
                title={localize('common.cancel')}
                onPress={onClose}
                variant="outline-danger"
              />
              <Button
                title={localize('common.save')}
                onPress={handleSave}
                variant="success"
              />
            </HStack>
          </VStack>
      </ActionsheetContent>
    </Actionsheet>
  );
}

