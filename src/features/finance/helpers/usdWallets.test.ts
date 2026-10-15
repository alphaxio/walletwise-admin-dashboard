import { describe, expect, it } from 'vitest';
import { normalizeUsdWallets } from './usdWallets';
import { recordId, money } from './records';
import { metrics } from '../constants/lists';

describe('USD wallets response', () => {
  it('maps flat wallet fields without using the wallet ID as the user ID', () => {
    const wallet = {id:7,email:'person@example.com',first_name:'Ada',last_name:'Example',user_tag:'ada',phone_number:'12345',miden_customer_id:'miden-1',miden_wallet_id:null,balance:'0.00',created_at:'2026-06-15T18:43:27+01:00',status:'pending_kyc',us_account_number:null,restriction_status:'none',threat_status:'suspicious'};
    const result = normalizeUsdWallets({wallets:[wallet],summary:{totalAccounts:3,pendingKyc:2,kycApproved:0,active:1,rejected:0,frozen:0,totalBalance:64.04},pagination:{totalRecords:2,currentPage:1,totalPages:1,limit:10}});
    expect(result.records[0]).toMatchObject({id:7,user:{name:'Ada Example',email:'person@example.com',tag:'ada',phone:'12345'},createdAt:wallet.created_at,midenCustomerId:'miden-1',accountNumber:null,restrictionStatus:'none',threatStatus:'suspicious'});
    expect(recordId(result.records[0])).toBe('7');
    expect(recordId(result.records[0],true)).toBe('');
    expect(money(result.records[0].balance,'USD')).toBe('US$0.00');
    expect(result.total).toBe(2);
    expect(result.metrics.totalAccounts).toBe(3);
    expect(metrics['usd/kyc']?.map(field => field.key)).toEqual(Object.keys(result.metrics));
  });
});
