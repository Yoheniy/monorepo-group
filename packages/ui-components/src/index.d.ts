import React, { type ReactNode } from 'react';
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
export declare function PrimaryButton(props: ButtonProps): import("react/jsx-runtime").JSX.Element;
export declare function SecondaryButton(props: ButtonProps): import("react/jsx-runtime").JSX.Element;
type DataCardProps = {
    title: string;
    subtitle?: string;
    children: ReactNode;
};
export declare function DataCard({ title, subtitle, children }: DataCardProps): import("react/jsx-runtime").JSX.Element;
type FormFieldProps = {
    label: string;
    children: ReactNode;
};
export declare function FormField({ label, children }: FormFieldProps): import("react/jsx-runtime").JSX.Element;
export declare function StatusBadge({ label, tone }: {
    label: string;
    tone?: 'neutral' | 'success' | 'warning';
}): import("react/jsx-runtime").JSX.Element;
export declare function Panel({ heading, children }: {
    heading: string;
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map