import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DataCard, FormField, Panel, PrimaryButton, StatusBadge } from '@cph/ui-components';
import { capitalizeWords, formatDate } from '@cph/utils';
export function TaskBoard({ title, tasks, onToggleTask }) {
    return (_jsx(DataCard, { title: title, subtitle: "Feature-Y: Study Task Tracker", children: _jsx("div", { style: { display: 'grid', gap: '0.75rem' }, children: tasks.map((task) => (_jsxs(Panel, { heading: capitalizeWords(task.title), children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }, children: [_jsx(StatusBadge, { label: task.priority, tone: task.priority === 'High' ? 'warning' : 'success' }), _jsxs("small", { children: ["Due ", formatDate(task.dueDate)] })] }), _jsx(PrimaryButton, { onClick: () => onToggleTask(task.id), children: task.completed ? 'Mark pending' : 'Mark completed' })] }, task.id))) }) }));
}
export function TaskCreator({ title, draftTitle, draftDueDate, onTitleChange, onDueDateChange, onCreate }) {
    return (_jsxs(DataCard, { title: title, subtitle: "Task creation using shared components", children: [_jsx(FormField, { label: "Task title", children: _jsx("input", { value: draftTitle, onChange: (event) => onTitleChange(event.target.value), placeholder: "Review chapter 5" }) }), _jsx(FormField, { label: "Due date", children: _jsx("input", { type: "date", value: draftDueDate, onChange: (event) => onDueDateChange(event.target.value) }) }), _jsx(PrimaryButton, { onClick: onCreate, children: "Add task" })] }));
}
//# sourceMappingURL=index.js.map