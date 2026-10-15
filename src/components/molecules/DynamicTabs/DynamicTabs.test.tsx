import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import DynamicTabs from './DynamicTabs';
const { navigation } = vi.hoisted(() => ({navigation:{query:'',push:vi.fn(),replace:vi.fn()}}));
vi.mock('next/navigation', () => ({useSearchParams:() => new URLSearchParams(navigation.query),usePathname:() => '/services/savings',useRouter:() => navigation}));
const tabs = [{value:'history',label:'History',content:<p>History content</p>},{value:'rates',label:'Rates',content:<p>Rate content</p>}];
afterEach(cleanup);
beforeEach(() => {navigation.query='';navigation.push.mockClear();navigation.replace.mockClear();});
describe('persistent tabs', () => {
 it('restores the tab from the URL when the page loads', () => {
  navigation.query='tab=rates&userId=abc';
  render(<DynamicTabs tabs={tabs} defaultTab="history" onClick={vi.fn()} />);
  expect(screen.getByRole('tab',{name:'Rates'}).getAttribute('aria-selected')).toBe('true');
  expect(screen.getByText('Rate content')).toBeTruthy();
 });
 it('adds the default tab to the URL while preserving other parameters', async () => {
  navigation.query='userId=abc';
  render(<DynamicTabs tabs={tabs} defaultTab="history" onClick={vi.fn()} />);
  await waitFor(() => expect(navigation.replace).toHaveBeenCalledWith('/services/savings?userId=abc&tab=history',{scroll:false}));
 });
 it('persists selection and synchronizes callbacks after navigation', async () => {
  navigation.query='tab=history&userId=abc'; const onClick=vi.fn();
  const {rerender}=render(<DynamicTabs tabs={tabs} defaultTab="history" onClick={onClick} />);
  fireEvent.mouseDown(screen.getByRole('tab',{name:'Rates'}),{button:0,ctrlKey:false});
  expect(navigation.push).toHaveBeenCalledWith('/services/savings?tab=rates&userId=abc',{scroll:false});
  navigation.query='tab=rates&userId=abc';
  rerender(<DynamicTabs tabs={tabs} defaultTab="history" onClick={onClick} />);
  await waitFor(() => expect(onClick).toHaveBeenCalledWith('rates'));
 });
 it('uses an independent URL key for nested tabs', () => {
  navigation.query='tab=rates&transferType=history';
  render(<DynamicTabs tabs={tabs} defaultTab="rates" urlKey="transferType" onClick={vi.fn()} />);
  expect(screen.getByRole('tab',{name:'History'}).getAttribute('aria-selected')).toBe('true');
 });
});
