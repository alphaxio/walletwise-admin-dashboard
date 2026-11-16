import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ServiceData } from "@/features/services/types";
import { ExpandIcon, TrendingUp, Wallet } from "lucide-react";

const TransactionSummaryCard = ({ data }: { data: ServiceData }) => {
  const totalAmount = parseFloat(data?.amount);
  const dollarAmount =
    Number(data?.details?.amount_requested) ||
    Number(data?.details?.amount_usd);
  const exchnageRate = Number(data?.details?.exchange_rate);
  // const feeAmount = parseFloat(data?.fee);
  // const totalWithFee = totalAmount + feeAmount;

  return (
    <Card className="border-border/50 shadow-sm dark:bg-gray-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          Transaction Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Amount</span>
            <div className="flex flex-col">
              {" "}
              <span className="text-2xl font-bold text-foreground">
                ₦
                {totalAmount.toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                })}
              </span>
              {/* NaN/0 when the transaction has no dollar amount: show nothing */}
              {dollarAmount > 0 && (
                <span className="text-2xl font-bold text-foreground">
                  $
                  {dollarAmount
                    ? dollarAmount.toLocaleString("en-NG", {
                        minimumFractionDigits: 2,
                      })
                    : "N/A"}
                </span>
              )}
            </div>
          </div>

          {/* {feeAmount > 0 && (
            <>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Fee</span>
                <span className="text-foreground font-semibold">
                  ₦
                  {feeAmount.toLocaleString("en-NG", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  Total
                </span>
                <span className="text-xl font-bold text-foreground">
                  ₦
                  {totalWithFee.toLocaleString("en-NG", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </>
          )} */}
        </div>

        <div className="pt-2 border-t border-border/50">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Wallet className="w-4 h-4" />
              Balance After
            </span>
            <span className="text-foreground font-bold">
              ₦
              {parseFloat(
                data?.balance || data?.balance_after || "0",
              ).toLocaleString("en-NG", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
          {exchnageRate > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <ExpandIcon className="w-4 h-4" />
                Exhange rate
              </span>
              <span className="text-foreground font-bold">
                ₦
                {exchnageRate
                  ? exchnageRate.toLocaleString("en-NG", {
                      minimumFractionDigits: 2,
                    })
                  : "N/A"}
              </span>
            </div>
          )}
        </div>

        {parseFloat(data?.commission) > 0 && (
          <Alert className="border-green-500/20 bg-green-500/5">
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-700 dark:text-green-300 text-xs">
              Commission earned: ₦
              {parseFloat(data?.commission).toLocaleString("en-NG", {
                minimumFractionDigits: 2,
              })}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionSummaryCard;
