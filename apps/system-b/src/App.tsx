import React, { useMemo, useState } from 'react';
import { EventBoard, type CampusEvent } from '@cph/feature-x';
import { TaskBoard, TaskCreator, type StudyTask } from '@cph/feature-y';

const systemBEvents: CampusEvent[] = [
  {
    id: 'e9',
    title: 'hackathon kickoff',
    description: 'A focused event listing to keep study schedules aligned with campus activities.',
    date: '2026-05-10',
    location: 'Innovation Lab',
    category: 'Social'
  }
];

const systemBTasks: StudyTask[] = [
  { id: 'tb1', title: 'finalize ui component docs', dueDate: '2026-05-05', priority: 'High', completed: false },
  { id: 'tb2', title: 'prepare utils demo', dueDate: '2026-05-06', priority: 'Medium', completed: true }
];

export function App() {
  const [events] = useState(systemBEvents);
  const [tasks, setTasks] = useState(systemBTasks);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');

  const pendingCount = useMemo(() => tasks.filter((task) => !task.completed).length, [tasks]);

  function createTask() {
    if (!taskTitle || !taskDueDate) {
      return;
    }

    const nextTask: StudyTask = {
      id: `tb-${Date.now()}`,
      title: taskTitle,
      dueDate: taskDueDate,
      priority: 'Low',
      completed: false
    };

    setTasks((current) => [nextTask, ...current]);
    setTaskTitle('');
    setTaskDueDate('');
  }

  return (
    <main style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'sans-serif' }}>
      <h1>System B: Task-Heavy Dashboard</h1>
      <p>
        This assembly emphasizes task execution while reusing event summaries from shared feature packages. Pending tasks: {pendingCount}
      </p>
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '2fr 1fr' }}>
        <TaskBoard
          title="Deep Work Tasks"
          tasks={tasks}
          onToggleTask={(id) => setTasks((current) => current.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))}
        />
        <div style={{ display: 'grid', gap: '1rem' }}>
          <TaskCreator
            title="Capture New Task"
            draftTitle={taskTitle}
            draftDueDate={taskDueDate}
            onTitleChange={setTaskTitle}
            onDueDateChange={setTaskDueDate}
            onCreate={createTask}
          />
          <EventBoard title="Related Events" events={events} activeCategory="All" onCategoryChange={() => undefined} />
        </div>
      </div>
    </main>
  );
}
