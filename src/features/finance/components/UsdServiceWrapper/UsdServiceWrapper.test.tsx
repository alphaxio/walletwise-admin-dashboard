import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import UsdServiceWrapper from './UsdServiceWrapper';
vi.mock('@/components/templates/ServiceLayout/ServiceLayout', () => ({default:({tabs,defaultTab}:{tabs:{value:string;label:string}[];defaultTab:string}) => <div data-testid="service" data-default={defaultTab}>{tabs.map(tab => <span key={tab.value}>{tab.label}</span>)}</div>}));
vi.mock('../FinancialList/FinancialList', () => ({default:() => null}));
vi.mock('../RateSettings/RateSettings', () => ({default:() => null}));
afterEach(cleanup);
it('opens the transaction ledger and excludes the Accounts tab', () => {
  render(<UsdServiceWrapper />);
  expect(screen.getByTestId('service').getAttribute('data-default')).toBe('transactions');
  expect(screen.queryByText('Accounts')).toBeNull();
  expect(screen.getByText('Transactions & settlement')).toBeTruthy();
  expect(screen.getByText('Rates & fees')).toBeTruthy();
});
