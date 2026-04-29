import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { EventBoard, EventCreator } from '@cph/feature-x';
import { TaskBoard, TaskCreator } from '@cph/feature-y';
import { apiClient } from '@cph/utils';
const initialEvents = [
    {
        id: 'e1',
        title: 'computer science seminar',
        description: 'Guest lecture about software architecture in real monorepo systems.',
        date: '2026-05-02',
        location: 'Engineering Hall A',
        category: 'Academic'
    },
    {
        id: 'e2',
        title: 'student networking mixer',
        description: 'Connect with peers and alumni to discuss internship opportunities.',
        date: '2026-05-07',
        location: 'Campus Center',
        category: 'Career'
    }
];
const initialTasks = [
    { id: 't1', title: 'submit project proposal', dueDate: '2026-05-01', priority: 'High', completed: false },
    { id: 't2', title: 'read distributed systems notes', dueDate: '2026-05-03', priority: 'Medium', completed: false }
];
export function App() {
    const [events, setEvents] = useState(initialEvents);
    const [tasks, setTasks] = useState(initialTasks);
    const [category, setCategory] = useState('All');
    const [eventTitle, setEventTitle] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDate, setTaskDate] = useState('');
    const completedTaskCount = useMemo(() => tasks.filter((task) => task.completed).length, [tasks]);
    async function createEvent() {
        const result = await apiClient(async () => {
            if (!eventTitle || !eventDate) {
                throw new Error('Event title and date are required');
            }
            const newEvent = {
                id: `e-${Date.now()}`,
                title: eventTitle,
                description: 'User-created event in System A configuration.',
                date: eventDate,
                location: 'TBD',
                category: 'Social'
            };
            setEvents((current) => [newEvent, ...current]);
            return newEvent;
        });
        if (result.ok) {
            setEventTitle('');
            setEventDate('');
        }
    }
    function createTask() {
        if (!taskTitle || !taskDate) {
            return;
        }
        const newTask = {
            id: `t-${Date.now()}`,
            title: taskTitle,
            dueDate: taskDate,
            priority: 'Low',
            completed: false
        };
        setTasks((current) => [newTask, ...current]);
        setTaskTitle('');
        setTaskDate('');
    }
    return (_jsxs("main", { style: { maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'sans-serif' }, children: [_jsx("h1", { children: "System A: Event-Heavy Dashboard" }), _jsxs("p", { children: ["Configuration-first assembly using imported composites from ", _jsx("code", { children: "@cph/feature-x" }), " and", ' ', _jsx("code", { children: "@cph/feature-y" }), ". Completed tasks: ", completedTaskCount, "/", tasks.length] }), _jsxs("div", { style: { display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }, children: [_jsx(EventCreator, { title: "Add Campus Event", draftTitle: eventTitle, draftDate: eventDate, onTitleChange: setEventTitle, onDateChange: setEventDate, onCreate: createEvent }), _jsx(TaskCreator, { title: "Quick Task Capture", draftTitle: taskTitle, draftDueDate: taskDate, onTitleChange: setTaskTitle, onDueDateChange: setTaskDate, onCreate: createTask }), _jsx(EventBoard, { title: "Upcoming Events", events: events, activeCategory: category, onCategoryChange: setCategory }), _jsx(TaskBoard, { title: "Task Sidebar", tasks: tasks, onToggleTask: (id) => setTasks((current) => current.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))) })] })] }));
}
//# sourceMappingURL=App.js.map