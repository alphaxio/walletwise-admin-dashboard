import type { ActivityContextData } from '../types/activity';
import { count, integer, object, optionalText, timestamp } from './activityValidation';

export function activityContextResponse(value: unknown): ActivityContextData | null {
  if (value == null) return null;
  const context = object(value);
  const streak = context.streak ? object(context.streak) : {};
  const device = context.device ? object(context.device) : {};
  const kyc = context.kyc ? object(context.kyc) : {};
  const currentStreak = streak.currentStreak == null ? null : count(streak.currentStreak);
  return {
    walletBalanceMinor: context.walletBalanceMinor == null ? null : integer(context.walletBalanceMinor),
    lastActiveAt: context.lastActive ? timestamp(context.lastActive) : null,
    streak: currentStreak === null ? null : `${currentStreak} ${currentStreak === 1 ? 'day' : 'days'}`,
    checkInProgress: streak.checkInsInPeriod == null || streak.daysInPeriodSoFar == null ? null : `${count(streak.checkInsInPeriod)} of ${count(streak.daysInPeriodSoFar)} days checked in`,
    device: [optionalText(device.name), [optionalText(device.type), optionalText(device.os)].filter(Boolean).join(' ')].filter(Boolean).join(' · ') || null,
    kyc: optionalText(kyc.identityStatus), tier: kyc.tier == null ? null : `Tier ${kyc.tier}`,
  };
}
