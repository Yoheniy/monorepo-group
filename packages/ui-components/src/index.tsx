import React, { type ReactNode } from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

function mergeClassNames(...parts: Array<string | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export function PrimaryButton({ className, type = 'button', style, ...props }: ButtonProps) {
  return (
    <button type={type} {...props} className={mergeClassNames('cph-btn', 'cph-btn--primary', className)} style={style} />
  );
}

export function SecondaryButton({ className, type = 'button', style, ...props }: ButtonProps) {
  return (
    <button type={type} {...props} className={mergeClassNames('cph-btn', 'cph-btn--secondary', className)} style={style} />
  );
}

type DataCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function DataCard({ title, subtitle, children }: DataCardProps) {
  return (
    <section className="cph-card">
      <h3 className="cph-card__title">{title}</h3>
      {subtitle ? <p className="cph-card__subtitle">{subtitle}</p> : null}
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
    <label className="cph-field">
      <span className="cph-field__label">{label}</span>
      {children}
    </label>
  );
}

export function StatusBadge({ label, tone = 'neutral' }: { label: string; tone?: 'neutral' | 'success' | 'warning' }) {
  return <span className={mergeClassNames('cph-badge', `cph-badge--${tone}`)}>{label}</span>;
}

export function Panel({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div className="cph-panel">
      <h4 className="cph-panel__title">{heading}</h4>
      {children}
    </div>
  );
}
