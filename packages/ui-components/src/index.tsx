import React, { type ReactNode } from 'react';

const baseStyle = {
  borderRadius: '0.5rem',
  border: '1px solid #e2e8f0',
  padding: '0.75rem 1rem'
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function PrimaryButton(props: ButtonProps) {
  return (
    <button
      {...props}
      style={{
        ...baseStyle,
        backgroundColor: '#2563eb',
        color: '#ffffff',
        fontWeight: 600,
        cursor: 'pointer',
        ...props.style
      }}
    />
  );
}

export function SecondaryButton(props: ButtonProps) {
  return (
    <button
      {...props}
      style={{
        ...baseStyle,
        backgroundColor: '#f8fafc',
        color: '#0f172a',
        cursor: 'pointer',
        ...props.style
      }}
    />
  );
}

type DataCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function DataCard({ title, subtitle, children }: DataCardProps) {
  return (
    <section
      style={{
        ...baseStyle,
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 10px rgba(15, 23, 42, 0.05)'
      }}
    >
      <h3 style={{ margin: '0 0 0.25rem 0' }}>{title}</h3>
      {subtitle ? <p style={{ margin: '0 0 1rem 0', color: '#475569' }}>{subtitle}</p> : null}
      <div>{children}</div>
    </section>
  );
}

type FormFieldProps = {
  label: string;
  children: ReactNode;
};

export function FormField({ label, children }: FormFieldProps) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.8rem' }}>
      <span style={{ fontSize: '0.9rem', color: '#334155' }}>{label}</span>
      {children}
    </label>
  );
}

export function StatusBadge({ label, tone = 'neutral' }: { label: string; tone?: 'neutral' | 'success' | 'warning' }) {
  const toneMap = {
    neutral: '#e2e8f0',
    success: '#bbf7d0',
    warning: '#fde68a'
  };

  return (
    <span
      style={{
        padding: '0.25rem 0.5rem',
        borderRadius: '999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: toneMap[tone],
        color: '#0f172a'
      }}
    >
      {label}
    </span>
  );
}

export function Panel({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div style={{ ...baseStyle, backgroundColor: '#f8fafc' }}>
      <h4 style={{ marginTop: 0 }}>{heading}</h4>
      {children}
    </div>
  );
}
