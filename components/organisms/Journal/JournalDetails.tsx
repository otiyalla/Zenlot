import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import {
  Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper, VStack, HStack, Badge, BadgeText,
  Divider, TrashIcon, EditIcon,
} from '@/components/design-system/ui';
import { Text, Icon, Button } from '@/components/atoms';
import { useTranslate } from '@/hooks/useTranslate';
import { useUser } from '@/providers/UserProvider';
import { JournalEntry } from '@/api/journal';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors, formatDate } from '@/constants';
import { extractPlainTextFromLexical } from '@/constants/journal';

interface JournalDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  journal: JournalEntry;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onPin?: () => void;
  onArchive?: () => void;
}

export const JournalDetails: React.FC<JournalDetailsProps> = ({
  isOpen,
  onClose,
  journal,
  onEdit,
  onDelete,
  onPin,
  onArchive,
}) => {
  if (!journal) return null;
  const { localize } = useTranslate();
  const colorSchema = useColorScheme() as 'dark' | 'light';
  const user = useUser().user;
  const { language } = user ?? { language: 'en' };
  const theme = Colors[colorSchema];
  
  const content = extractPlainTextFromLexical(journal.editorState, journal.plainText) || journal.plainText || '';
  const displayDate = journal.createdAt ? formatDate(new Date(journal.createdAt), language as any, true) : '';
  const updateDate = journal.updatedAt ? formatDate(new Date(journal.updatedAt), language as any, true) : '';

  const sideOptions = [
    onPin && { 
      onPress: () => onPin(), 
      icon: <Icon size={journal.isPinned ? 16 : 20} style={{ bottom: 1 }} library={journal.isPinned ? 'fontawesome6' : 'ionicons'} name={journal.isPinned ? 'thumbtack-slash' : 'pin-outline'}/>,
      label: journal.isPinned ? localize('unpin') : localize('pin')
    },
    onArchive && {
      onPress: () => onArchive(),
      icon: <Icon size={20} style={{ bottom: 1 }} library='ionicons' name={journal.isArchived ? 'folder-open-outline' : 'archive-outline'} />,
      label: journal.isArchived ? localize('unarchive') : localize('archive')
    },
    { onPress: () => onEdit(journal.id!), icon: <Icon library='gluestack' name='edit' as={EditIcon} />, label: localize('edit') },
    { onPress: () => onDelete(journal.id!), icon: <Icon library='gluestack' name='trash' as={TrashIcon} />, label: localize('delete') }
  ].filter(Boolean);

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose} snapPoints={Platform.OS === 'ios' ? [85] : undefined}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>

        <VStack space="md" className="w-full px-3 py-2">
          <HStack style={{ justifyContent: "space-between", alignItems: "center" }}>
            <HStack space="md" style={{ alignItems: "center" }}>
              {journal.symbol && (
                <Badge variant="solid" action="info" className="rounded-full">
                  <BadgeText>{journal.symbol}</BadgeText>
                </Badge>
              )}
              {journal.isPinned && (
                <Icon size={20} library='ionicons' name='pin-outline'/>
              )}
              {journal.isArchived && (
                <Badge variant="outline" className="rounded-full">
                  <BadgeText>{localize('journal.archived').toUpperCase()}</BadgeText>
                </Badge>
              )}
            </HStack>
            <HStack testID='side-action-buttons' space="sm">
              {sideOptions.map((option, index) => (
                option && option.onPress && (
                  <TouchableOpacity 
                    key={`${index}-side-action-button`} 
                    onPress={option.onPress}
                    accessibilityLabel={option.label}
                  >
                    {option.icon}
                  </TouchableOpacity>
                )
              ))}
            </HStack>
          </HStack>
          <Divider />

          {journal.title && (
            <VStack space="xs">
              <Text size="xs" color="secondary">{localize('title')}</Text>
              <Text bold size="lg">{journal.title}</Text>
            </VStack>
          )}

          {journal.tags && journal.tags.length > 0 && (
            <VStack space="xs">
              <Text size="xs" color="secondary">{localize('tags')}</Text>
              <HStack space="xs" style={{ flexWrap: 'wrap' }}>
                {journal.tags.map((tag, index) => (
                  <Badge key={`tag-${index}`} variant="outline" action="muted" className="rounded-full">
                    <BadgeText>{tag}</BadgeText>
                  </Badge>
                ))}
              </HStack>
            </VStack>
          )}

          {content && (
            <>
              <Divider />
              <VStack space="xs">
                <Text size="xs" color="secondary">{localize('content')}</Text>
                <Text>{content}</Text>
              </VStack>
            </>
          )}

          <Divider />

          <HStack style={{ justifyContent: "space-between" }}>
            <VStack>
              <Text size="xs" color="secondary">{localize('common.created')}</Text>
              <Text size="xs" bold>{displayDate}</Text>
            </VStack>
            {journal.updatedAt && updateDate && (
              <VStack>
                <Text size="xs" color="secondary">{localize('last_update')}</Text>
                <Text size="xs" bold>{updateDate}</Text>
              </VStack>
            )}
          </HStack>

          <Button
            size='sm'
            title={localize('common.close')}
            variant="outline"
            onPress={onClose}
          />
        </VStack>
      </ActionsheetContent>
    </Actionsheet>
  );
}

