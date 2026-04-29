import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const baseStyle = {
    borderRadius: '0.5rem',
    border: '1px solid #e2e8f0',
    padding: '0.75rem 1rem'
};
export function PrimaryButton(props) {
    return (_jsx("button", { ...props, style: {
            ...baseStyle,
            backgroundColor: '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
            cursor: 'pointer',
            ...props.style
        } }));
}
export function SecondaryButton(props) {
    return (_jsx("button", { ...props, style: {
            ...baseStyle,
            backgroundColor: '#f8fafc',
            color: '#0f172a',
            cursor: 'pointer',
            ...props.style
        } }));
}
export function DataCard({ title, subtitle, children }) {
    return (_jsxs("section", { style: {
            ...baseStyle,
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 10px rgba(15, 23, 42, 0.05)'
        }, children: [_jsx("h3", { style: { margin: '0 0 0.25rem 0' }, children: title }), subtitle ? _jsx("p", { style: { margin: '0 0 1rem 0', color: '#475569' }, children: subtitle }) : null, _jsx("div", { children: children })] }));
}
export function FormField({ label, children }) {
    return (_jsxs("label", { style: { display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.8rem' }, children: [_jsx("span", { style: { fontSize: '0.9rem', color: '#334155' }, children: label }), children] }));
}
export function StatusBadge({ label, tone = 'neutral' }) {
    const toneMap = {
        neutral: '#e2e8f0',
        success: '#bbf7d0',
        warning: '#fde68a'
    };
    return (_jsx("span", { style: {
            padding: '0.25rem 0.5rem',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            backgroundColor: toneMap[tone],
            color: '#0f172a'
        }, children: label }));
}
export function Panel({ heading, children }) {
    return (_jsxs("div", { style: { ...baseStyle, backgroundColor: '#f8fafc' }, children: [_jsx("h4", { style: { marginTop: 0 }, children: heading }), children] }));
}
//# sourceMappingURL=index.js.map