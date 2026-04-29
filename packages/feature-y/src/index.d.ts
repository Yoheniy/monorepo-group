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
export declare function TaskBoard({ title, tasks, onToggleTask }: TaskBoardProps): import("react/jsx-runtime").JSX.Element;
export type TaskCreatorProps = {
    title: string;
    draftTitle: string;
    draftDueDate: string;
    onTitleChange: (value: string) => void;
    onDueDateChange: (value: string) => void;
    onCreate: () => void;
};
export declare function TaskCreator({ title, draftTitle, draftDueDate, onTitleChange, onDueDateChange, onCreate }: TaskCreatorProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=index.d.ts.map