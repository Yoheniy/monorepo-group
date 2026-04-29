import React from 'react';
import { DataCard, FormField, Panel, PrimaryButton, SecondaryButton, StatusBadge } from '@cph/ui-components';
import { capitalizeWords, formatDate, truncateText } from '@cph/utils';

export type CampusEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: 'Academic' | 'Social' | 'Career';
};

export type EventBoardProps = {
  title: string;
  events: CampusEvent[];
  activeCategory: 'All' | CampusEvent['category'];
  onCategoryChange: (category: 'All' | CampusEvent['category']) => void;
};

export function EventBoard({ title, events, activeCategory, onCategoryChange }: EventBoardProps) {
  const filtered = activeCategory === 'All' ? events : events.filter((event) => event.category === activeCategory);

  return (
    <DataCard title={title} subtitle="Feature-X: Event & Schedule Manager">
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <SecondaryButton onClick={() => onCategoryChange('All')}>All</SecondaryButton>
        <SecondaryButton onClick={() => onCategoryChange('Academic')}>Academic</SecondaryButton>
        <SecondaryButton onClick={() => onCategoryChange('Social')}>Social</SecondaryButton>
        <SecondaryButton onClick={() => onCategoryChange('Career')}>Career</SecondaryButton>
      </div>
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {filtered.map((event) => (
          <Panel key={event.id} heading={capitalizeWords(event.title)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <StatusBadge label={event.category} tone="neutral" />
              <small>{formatDate(event.date)}</small>
            </div>
            <p style={{ margin: '0 0 0.6rem 0' }}>{truncateText(event.description, 120)}</p>
            <small>{event.location}</small>
          </Panel>
        ))}
      </div>
    </DataCard>
  );
}

export type EventCreatorProps = {
  title: string;
  draftTitle: string;
  draftDate: string;
  onTitleChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onCreate: () => void;
};

export function EventCreator({ title, draftTitle, draftDate, onTitleChange, onDateChange, onCreate }: EventCreatorProps) {
  return (
    <DataCard title={title} subtitle="Compose shared form components into feature flows">
      <FormField label="Event title">
        <input value={draftTitle} onChange={(event) => onTitleChange(event.target.value)} placeholder="Career fair" />
      </FormField>
      <FormField label="Event date">
        <input type="date" value={draftDate} onChange={(event) => onDateChange(event.target.value)} />
      </FormField>
      <PrimaryButton onClick={onCreate}>Add event</PrimaryButton>
    </DataCard>
  );
}
