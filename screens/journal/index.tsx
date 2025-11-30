import React, { useState, useEffect, useCallback } from 'react';
import { JournalPage } from '@/components/pages';
import { journalApi, JournalEntry } from '@/api/journal';

export default function Journal() {
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadJournals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await journalApi.getJournals();
      setJournals(data || []);
    } catch (err: any) {
      console.error('Error loading journals:', err);
      setError(err?.data?.message || 'Failed to load journals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJournals();
  }, [loadJournals]);

  const handleViewJournal = useCallback((journalId: number) => {
    console.log('View journal:', journalId);
  }, []);

  const handleEditJournal = useCallback(async (id: number, data: Partial<JournalEntry>) => {
    try {
      await journalApi.updateJournal(id, data);
      await loadJournals();
    } catch (err: any) {
      console.error('Error updating journal:', err);
      throw err;
    }
  }, [loadJournals]);

  const handleDeleteJournal = useCallback(async (id: number) => {
    try {
      await journalApi.deleteJournal(id);
      await loadJournals();
    } catch (err: any) {
      console.error('Error deleting journal:', err);
      throw err;
    }
  }, [loadJournals]);

  const handleCreateJournal = useCallback(async (data: JournalEntry) => {
    try {
      await journalApi.createJournal(data);
      await loadJournals();
    } catch (err: any) {
      console.error('Error creating journal:', err);
      throw err;
    }
  }, [loadJournals]);

  const handleFilterJournals = useCallback(async (filters: any) => {
    try {
      setLoading(true);
      setError(null);
      const data = await journalApi.searchJournals(filters);
      setJournals(data || []);
    } catch (err: any) {
      console.error('Error filtering journals:', err);
      setError(err?.data?.message || 'Failed to filter journals');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <JournalPage
      journals={journals}
      onViewJournal={handleViewJournal}
      onEditJournal={handleEditJournal}
      onDeleteJournal={handleDeleteJournal}
      onCreateJournal={handleCreateJournal}
      onFilterJournals={handleFilterJournals}
      onRefresh={loadJournals}
      loading={loading}
      error={error}
    />
  );
}

