export const financialDetailFields: Record<string, string[]> = {
    'usd/transactions': ['transactionId', 'user.name', 'user.email', 'user.tag', 'amount', 'fee', 'providerFee', 'commission', 'type', 'category', 'balance', 'createdAt', 'status', 'details'],
    'usd/accounts': ['user.name', 'user.email', 'balance', 'accountNumber', 'routingNumber', 'bankName', 'midenCustomerId', 'midenWalletId', 'cryptoDepositAddress', 'status'],
    'savings/plans': ['title', 'user.name', 'planType', 'principal', 'interestAccrued', 'payoutAmount', 'startDate', 'maturityDate', 'status', 'contributions', 'schedule'],
};
