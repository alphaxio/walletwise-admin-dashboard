import { cleanup, render, screen } from '@testing-library/react';
import { createTable, flexRender, getCoreRowModel } from '@tanstack/react-table';
import { afterEach, describe, expect, it } from 'vitest';
import { Column } from './Column';
import type { UserType } from '../../types';

afterEach(cleanup);
function renderStatus(account_status: UserType['account_status'], is_blacklisted: boolean) {
  const user: UserType = { id: 'user-1', first_name: 'Ada', last_name: 'Example', user_tag: 'ada', email: 'ada@example.com', phone_number: '12345', created_at: '2026-11-12T10:00:00Z', account_status, is_blacklisted };
  const table = createTable<UserType>({ data: [user], columns: Column, getCoreRowModel: getCoreRowModel(), state: {}, onStateChange: () => undefined, renderFallbackValue: null });
  const cell = table.getRowModel().rows[0].getAllCells().find(cell => cell.column.id === 'account_status')!;
  render(<>{flexRender(cell.column.columnDef.cell, cell.getContext())}</>);
}

describe('manage-user account status', () => {
  it.each([
    ['active', true, 'suspended'],
    ['active', false, 'Personalized account'],
    ['inactive', false, 'suspended'],
    ['unknown', false, 'Virtual account'],
  ] as const)('renders %s with blacklist=%s without accessing a missing column', (status, blacklisted, label) => {
    renderStatus(status, blacklisted);
    expect(screen.getByText(label)).toBeTruthy();
  });
});
