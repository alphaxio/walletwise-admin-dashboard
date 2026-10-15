'use client';
import UsdRateSettings from '../UsdRateSettings/UsdRateSettings';
import SavingsRateSettings from '../SavingsRateSettings/SavingsRateSettings';
export default function RateSettings({type}: {type: 'usd' | 'savings'}) {
  return type === 'usd' ? <UsdRateSettings /> : <SavingsRateSettings />;
}
