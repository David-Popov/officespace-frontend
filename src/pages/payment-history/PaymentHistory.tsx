import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/UserContext";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DollarSign } from "lucide-react";
import { Payment } from "@/types/payment.types";

const PaymentHistory: React.FC = () => {
  const { user } = useAuth();
  const payments = user?.payments || [];

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-6 h-6" />
            <div>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>View all your payment transactions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No payment history found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment: Payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.description}</TableCell>
                    <TableCell>
                      {payment.amount} {payment.currency}
                    </TableCell>
                    <TableCell>{format(new Date(payment.date), "MMM d, yyyy HH:mm")}</TableCell>
                    <TableCell className="font-mono text-sm">{payment.chargeId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentHistory;
