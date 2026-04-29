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
export declare function EventBoard({ title, events, activeCategory, onCategoryChange }: EventBoardProps): import("react/jsx-runtime").JSX.Element;
export type EventCreatorProps = {
    title: string;
    draftTitle: string;
    draftDate: string;
    onTitleChange: (value: string) => void;
    onDateChange: (value: string) => void;
    onCreate: () => void;
};
export declare function EventCreator({ title, draftTitle, draftDate, onTitleChange, onDateChange, onCreate }: EventCreatorProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=index.d.ts.map