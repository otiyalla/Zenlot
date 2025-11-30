import React, { useState, useMemo, useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import { PageTemplate } from '@/components/templates';
import { Text, TextInput, Icon, Button } from '@/components/atoms';
import { useTranslate } from '@/hooks/useTranslate';
import { Colors, formatDate } from '@/constants';
import { useColorScheme } from '@/hooks/useColorScheme';
import { JournalEntry } from '@/api/journal';
import {
  ScrollView,
  HStack,
  VStack,
  Box,
  SearchIcon
} from '@/components/design-system/ui';
import { JournalCard, JournalDetails, JournalEdit } from '@/components/organisms';

export interface JournalPageProps {
  journals?: JournalEntry[];
  onViewJournal?: (journalId: number) => void;
  onEditJournal?: (id: number, data: Partial<JournalEntry>) => Promise<void>;
  onDeleteJournal?: (id: number) => Promise<void>;
  onCreateJournal?: (data: JournalEntry) => Promise<void>;
  onFilterJournals?: (filters: any) => void;
  onRefresh?: () => void;
  loading?: boolean;
  error?: string | null;
  testID?: string;
  pageSize?: number;
}

export const JournalPage: React.FC<JournalPageProps> = ({
  journals = [],
  onViewJournal,
  onEditJournal,
  onDeleteJournal,
  onCreateJournal,
  onFilterJournals,
  onRefresh,
  loading = false,
  error = null,
  testID,
  pageSize = 10,
}) => {
  const { localize } = useTranslate();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pinned' | 'archived' | 'recent' | 'thisWeek' | 'thisMonth'>('all');
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const theme = Colors[useColorScheme() as 'light' | 'dark'];
    const [viewJournalId, setViewJournalId] = useState<number | null>(null);
  const [editJournalId, setEditJournalId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Quick filters
  const quickFilters = [
    { key: 'all', label: 'journal.all' },
    { key: 'pinned', label: 'journal.pinned' },
    { key: 'archived', label: 'journal.archived' },
    { key: 'recent', label: 'recent' },
    { key: 'thisWeek', label: 'this_week' },
    { key: 'thisMonth', label: 'this_month' },
  ];

  const filteredJournals = useMemo(() => {
    let result = journals;
    
    // Apply filter based on selected filter
    switch (selectedFilter) {
      case 'pinned':
        result = result.filter(journal => journal.isPinned === true);
        break;
      case 'archived':
        result = result.filter(journal => journal.isArchived === true);
        break;
      case 'recent':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        result = result.filter(journal => new Date(journal.createdAt || 0) >= oneWeekAgo);
        break;
      case 'thisWeek':
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        result = result.filter(journal => new Date(journal.createdAt || 0) >= startOfWeek);
        break;
      case 'thisMonth':
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        result = result.filter(journal => new Date(journal.createdAt || 0) >= startOfMonth);
        break;
      default:
        // 'all' - no additional filtering
        break;
    }
    
    // Apply text search
    if (search.trim()) {
      const lowerSearch = search.trim().toLowerCase();
      result = result.filter(
        journal =>
          journal.symbol?.toLowerCase().includes(lowerSearch) ||
          journal.title?.toLowerCase().includes(lowerSearch) ||
          journal.plainText?.toLowerCase().includes(lowerSearch) ||
          journal.tags?.some(tag => tag.toLowerCase().includes(lowerSearch))
      );
    }
    
    return result;
  }, [journals, selectedFilter, search]);

  const visibleJournals = filteredJournals.slice(0, visibleCount);

  const handleFilterChange = useCallback((filter: 'all' | 'pinned' | 'archived' | 'recent' | 'thisWeek' | 'thisMonth') => {
    setSelectedFilter(filter);
    // Apply filter via API if onFilterJournals is provided
    if (onFilterJournals) {
      const filterParams: any = {};
      if (filter === 'pinned') filterParams.isPinned = true;
      if (filter === 'archived') filterParams.isArchived = true;
      if (filter === 'recent') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filterParams.start = oneWeekAgo.toISOString();
      }
      if (filter === 'thisWeek') {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        filterParams.start = startOfWeek.toISOString();
      }
      if (filter === 'thisMonth') {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        filterParams.start = startOfMonth.toISOString();
      }
      onFilterJournals(filterParams);
    }
    setVisibleCount(pageSize);
  }, [onFilterJournals, pageSize]);

  const handleSearchChange = useCallback((text: string) => {
    setSearch(text);
    if (onFilterJournals && text.trim()) {
      onFilterJournals({ query: text.trim() });
    }
    setVisibleCount(pageSize);
  }, [onFilterJournals, pageSize]);

  const handleLoadMore = useCallback(async () => {
    if (visibleCount < filteredJournals.length && !isLoadingMore) {
      setIsLoadingMore(true);
      setVisibleCount(prev => prev + pageSize);
      setIsLoadingMore(false);
    }
  }, [visibleCount, filteredJournals.length, isLoadingMore, pageSize]);

  const handleViewJournal = useCallback((journalId: number) => {
    onViewJournal?.(journalId);
    if (viewJournalId !== journalId) setViewJournalId(journalId);
    if (viewJournalId === journalId) setViewJournalId(null);
  }, [onViewJournal, viewJournalId]);

  const handleDeleteJournal = useCallback(async (journalId: number) => {
    try {
      await onDeleteJournal?.(journalId);
      setViewJournalId(null);
    } catch (error) {
      console.error('Error deleting journal:', error);
    }
  }, [onDeleteJournal]);

  const handleEditJournal = useCallback(async (id: number, data: Partial<JournalEntry>) => {
    try {
      await onEditJournal?.(id, data);
      setEditJournalId(null);
    } catch (error) {
      console.error('Error updating journal:', error);
      throw error;
    }
  }, [onEditJournal]);

  //TODO: Add pagination load more button or infinite scroll and fix bg color 
  const renderLoadingItem = () => (
    <Box className="bg-background-100 p-4 rounded-lg mb-3 border border-outline-200">
      <HStack className="justify-between items-center mb-3">
        <VStack className="gap-1">
          <Box className="h-5 w-20 bg-background-200 rounded" />
          <Box className="h-3 w-12 bg-background-200 rounded" />
        </VStack>
      </HStack>
      <VStack className="gap-2 mb-3">
        <Box className="h-8 w-full bg-background-200 rounded" />
      </VStack>
    </Box>
  );

  const renderJournalItem = (journal: JournalEntry) => {
    if (editJournalId === journal.id) {
      return (
        <JournalEdit
          journal={journal}
          isOpen={true}
          onClose={() => setEditJournalId(null)}
          onSave={(updatedJournal) => handleEditJournal(journal.id!, updatedJournal)}
        />
      );
    }
    
    if (viewJournalId === journal.id) {
      return (
        <JournalDetails
          journal={journal}
          isOpen={true}
          onClose={() => setViewJournalId(null)}
          onEdit={() => {
            setViewJournalId(null);
            setEditJournalId(journal.id!);
          }}
          onDelete={handleDeleteJournal}
          onPin={async () => {
            await handleEditJournal(journal.id!, { isPinned: !journal.isPinned });
          }}
          onArchive={async () => {
            await handleEditJournal(journal.id!, { isArchived: !journal.isArchived });
          }}
        />
      );
    }

    return (
      <JournalCard
        journal={journal}
        onViewDetails={() => handleViewJournal(journal.id!)}
        onEdit={() => setEditJournalId(journal.id!)}
        onDelete={() => handleDeleteJournal(journal.id!)}
      />
    );
  };

  const renderEmptyState = () => (
    <VStack className="p-8 items-center gap-2">
      <Text size={'xl'} weight='semibold' align='center'>{localize('journal.no_journal_entries')}</Text>
      <Text weight='medium' align='center'>{localize('journal.start_journaling_message')}</Text>
    </VStack>
  );

  const renderQuickFilter = (filter: { key: string; label: string }) => {
    const isSelected = selectedFilter === filter.key;
    return (
      <TouchableOpacity
        key={filter.key}
        style={{
          borderWidth: 1,
          borderColor: isSelected ? theme.secondary : theme.borderColor,
          backgroundColor: isSelected ? theme.secondary : 'transparent',
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 8,
        }}
        onPress={() => handleFilterChange(filter.key as any)}
      >
        <Text weight='semibold'>{localize(filter.label)}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <PageTemplate 
      title={localize('journals')} 
      testID={testID}
      refreshing={loading}
      onRefresh={onRefresh}
    >
      {/* <VStack className="flex-1"> */}
      <VStack >
        {error && (
          <Box className="mb-2 p-2 bg-error-100 rounded">
            <Text color="error" size="sm">{error}</Text>
          </Box>
        )}

        {/* Search Input */}
        <Box className="mb-2">
          <TextInput
            variant='filled'
            value={search}
            onChangeText={handleSearchChange}
            autoCorrect={false}
            autoCapitalize="none"
            placeholder={localize('journal.search')}
            rightIcon={<Icon name='search' size={18} library='gluestack' as={SearchIcon}/>}
            testID="journal-search-input"
            helperText={localize('journal.search_helper_text')}
          />
        </Box>

        {/* Horizontal Quick Search Filters */}
        <Box className="mb-4">
          <Text className="text-lg font-semibold mb-3 text-typography-900">{localize('quick_search')}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingHorizontal: 4, flexDirection: 'row' }}
          >
            {quickFilters.map((filter) => renderQuickFilter(filter))}
          </ScrollView>
        </Box>

        {/* Create Button */}
        <Box className="mb-4">
          <Button
            title={localize('journal.create')}
            onPress={() => setShowCreateModal(true)}
            variant="primary"
            testID="create-journal-btn"
          />
        </Box>

        {/* Journal List */}
        <Box className="flex-1"> 
          <HStack className="justify-between items-center mb-3">
            <Text size={'lg'} weight='semibold'>
              {localize('journal.entries')}
            </Text>
            <Text size={'sm'} weight='medium'>
              {filteredJournals.length} {localize('journal.entries')}
            </Text>
          </HStack>
          
          {filteredJournals.length === 0 ? (
            renderEmptyState()
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={true}
              contentContainerStyle={{ paddingBottom: 24 }}
            >
              {visibleJournals.map((journal) => (
                <Box key={journal.id}>
                  {renderJournalItem(journal)}
                </Box>
              ))}
              {isLoadingMore ? (
                <VStack className="gap-2 mt-4">
                  {Array(3).fill(0).map((_, index) => (
                    <Box key={index}>
                      {renderLoadingItem()}
                    </Box>
                  ))}
                </VStack>
              ) : null}
              {visibleCount < filteredJournals.length && !isLoadingMore && (
                <VStack style={{ marginTop: 16, alignSelf: 'center' }}>
                  <Button
                    onPress={handleLoadMore}
                    title={localize('load_more')}
                    size="md"
                    variant="outline"
                    testID="journal-load-more-btn"
                  />
                </VStack>
              )}
            </ScrollView>
          )}
        </Box>

        {/* Create Journal Modal */}
        {showCreateModal && (
          <JournalEdit
            journal={null}
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSave={async (newJournal) => {
              if (onCreateJournal) {
                await onCreateJournal(newJournal as JournalEntry);
              }
              setShowCreateModal(false);
            }}
          />
        )}
      </VStack>
    </PageTemplate>
  );
};

