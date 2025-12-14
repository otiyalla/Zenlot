import React from 'react';
import { Platform, Pressable } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
  Box, HStack, VStack, Badge, BadgeText,
  Divider, ChevronRightIcon
} from '@/components/design-system/ui';
import { Colors } from '@/constants/Colors';
import { Text, Icon } from '@/components/atoms';
import { formatDate } from '@/constants';
import { extractPlainTextFromLexical } from '@/constants/journal';
import { useTranslate } from '@/hooks/useTranslate';
import { JournalEntry } from '@/api/journal';
import { useUser } from '@/providers/UserProvider';

type JournalCardProps = {
  journal: JournalEntry;
  onViewDetails: (journalId: number) => void;
  onEdit: (journalId: number) => void;
  onDelete: (journalId: number) => void;
};
     
export const JournalCard: React.FC<JournalCardProps> = ({
  journal,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const colorSchema = useColorScheme() as 'dark' | 'light';
  const theme = Colors[colorSchema];
  const { localize } = useTranslate();
  const { user } = useUser();
  const language = user?.language || 'en';
  
  const content = extractPlainTextFromLexical(journal.editorState, journal.plainText) || '';
  const truncatedContent = content.length > 150 ? content.substring(0, 150) + '...' : content;
  const displayDate = journal.createdAt ? formatDate(new Date(journal.createdAt), language as any) : '';

  return (
    <Pressable
      onPress={() => journal.id && onViewDetails(journal.id)}
      role="button"
      accessibilityLabel={`Open ${journal.symbol} journal details`}
    >
      <Box
        className='px-4 py-3 my-2 rounded-r-[10]'
        style={{
          backgroundColor: theme.background,
          borderRadius: 8,
          borderLeftWidth: journal.isPinned ? 6 : 2,
          borderLeftColor: journal.isPinned ? theme.primary : theme.borderColor,
          shadowColor: theme.text,
          shadowOpacity: 0.15,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          ...(Platform.OS === 'web' ? { boxShadow: '0 6px 18px rgba(0,0,0,0.15)' } : {}),
          opacity: journal.isArchived ? 0.6 : 1,
        }}
      >
        <HStack className="mb-2" style={{ alignItems: "center", justifyContent: "space-between" }}>
          <HStack style={{ alignItems: "center" }} space="md">
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
        </HStack>

        {journal.title && (
          <VStack className="mb-2">
            <Text bold size="lg">{journal.title}</Text>
          </VStack>
        )}

        {journal.tags && journal.tags.length > 0 && (
          <HStack className="mb-2" space="xs" style={{ flexWrap: 'wrap' }}>
            {journal.tags.map((tag, index) => (
              <Badge key={`tag-${index}`} variant="outline" action="muted" className="rounded-full">
                <BadgeText>{tag}</BadgeText>
              </Badge>
            ))}
          </HStack>
        )}

        {content && (
          <>
            <Divider className="my-2" />
            <Text size="sm" numberOfLines={3}>
              {truncatedContent}
            </Text>
          </>
        )}

        <HStack style={{ alignItems: "center", justifyContent: "space-between" }} className="mt-2">
          <Text size="xs" color="secondary">
            {displayDate}
          </Text>
          <Icon as={ChevronRightIcon} name="chevron-right" library='gluestack' size={18} />
        </HStack>
      </Box>
    </Pressable>
  );
}

