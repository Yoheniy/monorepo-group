import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { EventBoard } from '@cph/feature-x';
import { TaskBoard, TaskCreator } from '@cph/feature-y';
const systemBEvents = [
    {
        id: 'e9',
        title: 'hackathon kickoff',
        description: 'A focused event listing to keep study schedules aligned with campus activities.',
        date: '2026-05-10',
        location: 'Innovation Lab',
        category: 'Social'
    }
];
const systemBTasks = [
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
        const nextTask = {
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
    return (_jsxs("main", { style: { maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'sans-serif' }, children: [_jsx("h1", { children: "System B: Task-Heavy Dashboard" }), _jsxs("p", { children: ["This assembly emphasizes task execution while reusing event summaries from shared feature packages. Pending tasks: ", pendingCount] }), _jsxs("div", { style: { display: 'grid', gap: '1rem', gridTemplateColumns: '2fr 1fr' }, children: [_jsx(TaskBoard, { title: "Deep Work Tasks", tasks: tasks, onToggleTask: (id) => setTasks((current) => current.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))) }), _jsxs("div", { style: { display: 'grid', gap: '1rem' }, children: [_jsx(TaskCreator, { title: "Capture New Task", draftTitle: taskTitle, draftDueDate: taskDueDate, onTitleChange: setTaskTitle, onDueDateChange: setTaskDueDate, onCreate: createTask }), _jsx(EventBoard, { title: "Related Events", events: events, activeCategory: "All", onCategoryChange: () => undefined })] })] })] }));
}
//# sourceMappingURL=App.js.map