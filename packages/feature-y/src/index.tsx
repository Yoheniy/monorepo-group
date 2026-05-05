import React from 'react';
import { DataCard, FormField, Panel, PrimaryButton, SecondaryButton } from '@cph/ui-components';
import { capitalizeWords, formatCurrency } from '@cph/utils';

export type CartLine = {
  lineId: string;
  productId: string;
  name: string;
  unitPriceCents: number;
  quantity: number;
};

export type CartPanelProps = {
  title: string;
  lines: CartLine[];
  subtotalCents: number;
  onIncrement: (lineId: string) => void;
  onDecrement: (lineId: string) => void;
  onRemove: (lineId: string) => void;
};

export function CartPanel({ title, lines, subtotalCents, onIncrement, onDecrement, onRemove }: CartPanelProps) {
  return (
    <DataCard title={title} subtitle="Line items, quantities, and subtotal — demo only, no charges.">
      {lines.length === 0 ? (
        <p className="cph-empty-hint">Your cart is empty. Add items from the catalog.</p>
      ) : (
        <div className="cph-stack">
          {lines.map((line) => {
            const lineTotal = line.unitPriceCents * line.quantity;
            return (
              <Panel key={line.lineId} heading={capitalizeWords(line.name)}>
                <div className="cph-row-between">
                  <span className="cph-muted">
                    {formatCurrency(line.unitPriceCents)} × {line.quantity}
                  </span>
                  <span className="cph-price">{formatCurrency(lineTotal)}</span>
                </div>
                <div className="cph-cluster" style={{ marginBottom: 0 }}>
                  <SecondaryButton className="cph-btn--icon" onClick={() => onDecrement(line.lineId)} aria-label="Decrease quantity">
                    −
                  </SecondaryButton>
                  <SecondaryButton className="cph-btn--icon" onClick={() => onIncrement(line.lineId)} aria-label="Increase quantity">
                    +
                  </SecondaryButton>
                  <SecondaryButton onClick={() => onRemove(line.lineId)}>Remove</SecondaryButton>
                </div>
              </Panel>
            );
          })}
          <div className="cph-cart-subtotal">
            <span className="cph-muted">Subtotal</span>
            <span className="cph-price">{formatCurrency(subtotalCents)}</span>
          </div>
        </div>
      )}
    </DataCard>
  );
}

export type CheckoutFormProps = {
  title: string;
  fullName: string;
  email: string;
  address: string;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onSubmit: () => void;
  errorMessage?: string;
};

export function CheckoutForm({
  title,
  fullName,
  email,
  address,
  onFullNameChange,
  onEmailChange,
  onAddressChange,
  onSubmit,
  errorMessage
}: CheckoutFormProps) {
  return (
    <DataCard title={title} subtitle="Shipping details for the demo — no card or payment step.">
      <FormField label="Full name">
        <input value={fullName} onChange={(event) => onFullNameChange(event.target.value)} placeholder="Ada Lovelace" />
      </FormField>
      <FormField label="Email">
        <input type="email" value={email} onChange={(event) => onEmailChange(event.target.value)} placeholder="you@school.edu" />
      </FormField>
      <FormField label="Shipping address">
        <textarea value={address} onChange={(event) => onAddressChange(event.target.value)} rows={3} placeholder="Street, city, postal code" />
      </FormField>
      {errorMessage ? (
        <p className="cph-alert cph-alert--error" role="alert">
          {errorMessage}
        </p>
      ) : null}
      <PrimaryButton onClick={onSubmit}>Place order (demo)</PrimaryButton>
    </DataCard>
  );
}
