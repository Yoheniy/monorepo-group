import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';
describe('system-a app', () => {
    it('renders dashboard heading', () => {
        render(_jsx(App, {}));
        expect(screen.getByText('System A: Event-Heavy Dashboard')).toBeTruthy();
    });
});
//# sourceMappingURL=App.test.js.map