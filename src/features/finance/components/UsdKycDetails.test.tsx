import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import UsdKycDetails from './UsdKycDetails';
afterEach(cleanup);
const wallet = {
  id:2,email:'ada@example.com',status:'active',balance:'63.72',midenCustomerId:'customer-2',midenWalletId:'wallet-2',createdAt:'2026-06-09T12:06:26+01:00',updatedAt:'2026-10-14T21:53:23+01:00',lastContinuityFeeAt:'2026-06-09T12:06:26+01:00',
  user:{firstName:'Ada',middleName:null,lastName:'Example',fullName:'Ada Example',email:'ada@example.com',phoneNumber:'1234567890',userTag:'ada',dob:null,tier:'3'},
  kycDocuments:{govIdImageFront:null,govIdImageBack:null,proofOfAddressDocument:null,bvnOrTaxId:null,submittedAt:null},residentialAddress:null,sourceOfFunds:null,
  bankDetails:{bankName:'Lead Bank',currency:'usd',bankAddress:'Test bank address',paymentRail:'ach_push',bankAccountNumber:'210000000001',bankRoutingNumber:'101000000',bankBeneficiaryName:'Ada Example',bankBeneficiaryAddress:'Test beneficiary address'},
  cryptoAddress:{chain:'polygon',address:'0xtestaddress',currency:'usdc'},
  security:{threatStatus:'critical',restrictionStatus:'none',restrictionType:'brute_force',restrictionReason:'Incorrect PIN attempt'},
};
describe('USD KYC detail response', () => {
  it('renders the nested profile, bank, crypto and security fields', () => {
    render(<UsdKycDetails data={wallet} />);
    const profile=screen.getByRole('heading',{name:'User profile'}).closest('section')!;
    expect(within(profile).getByText('Ada Example')).toBeTruthy();
    expect(screen.getByText('US$63.72')).toBeTruthy();
    expect(screen.getByText('210000000001')).toBeTruthy();
    expect(screen.getByText('101000000')).toBeTruthy();
    expect(screen.getByText('Test beneficiary address')).toBeTruthy();
    expect(screen.getByText('0xtestaddress')).toBeTruthy();
    expect(screen.getByText('critical').className).toContain('bg-red-500/10');
    expect(screen.getByText('Incorrect PIN attempt')).toBeTruthy();
    expect(screen.getAllByText('Document unavailable')).toHaveLength(3);
    expect(screen.getAllByText('Not provided')).toHaveLength(2);
    expect(screen.queryByText('Selfie')).toBeNull();
  });
  it('uses the supplied KYC document URL fields', () => {
    render(<UsdKycDetails data={{...wallet,kycDocuments:{...wallet.kycDocuments,govIdImageFront:'https://example.com/front.jpg',govIdImageBack:'https://example.com/back.jpg',proofOfAddressDocument:'https://example.com/address.jpg'}}} />);
    expect(screen.getByAltText('Government ID front').getAttribute('src')).toBe('https://example.com/front.jpg');
    expect(screen.getByAltText('Government ID back').getAttribute('src')).toBe('https://example.com/back.jpg');
    expect(screen.getByAltText('Proof of address').getAttribute('src')).toBe('https://example.com/address.jpg');
  });
});
