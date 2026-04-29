import React from 'react';
import { DataCard, FormField, Panel, PrimaryButton, StatusBadge } from '@cph/ui-components';
import { capitalizeWords, formatDate } from '@cph/utils';

export type StudyTask = {
  id: string;
  title: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
};

export type TaskBoardProps = {
  title: string;
  tasks: StudyTask[];
  onToggleTask: (id: string) => void;
};

export function TaskBoard({ title, tasks, onToggleTask }: TaskBoardProps) {
  return (
    <DataCard title={title} subtitle="Feature-Y: Study Task Tracker">
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {tasks.map((task) => (
          <Panel key={task.id} heading={capitalizeWords(task.title)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <StatusBadge label={task.priority} tone={task.priority === 'High' ? 'warning' : 'success'} />
              <small>Due {formatDate(task.dueDate)}</small>
            </div>
            <PrimaryButton onClick={() => onToggleTask(task.id)}>
              {task.completed ? 'Mark pending' : 'Mark completed'}
            </PrimaryButton>
          </Panel>
        ))}
      </div>
    </DataCard>
  );
}

export type TaskCreatorProps = {
  title: string;
  draftTitle: string;
  draftDueDate: string;
  onTitleChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
  onCreate: () => void;
};

export function TaskCreator({ title, draftTitle, draftDueDate, onTitleChange, onDueDateChange, onCreate }: TaskCreatorProps) {
  return (
    <DataCard title={title} subtitle="Task creation using shared components">
      <FormField label="Task title">
        <input value={draftTitle} onChange={(event) => onTitleChange(event.target.value)} placeholder="Review chapter 5" />
      </FormField>
      <FormField label="Due date">
        <input type="date" value={draftDueDate} onChange={(event) => onDueDateChange(event.target.value)} />
      </FormField>
      <PrimaryButton onClick={onCreate}>Add task</PrimaryButton>
    </DataCard>
  );
}
