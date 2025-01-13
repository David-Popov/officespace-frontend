import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentService } from "@/services/paymentService";
import { ConfirmPaymentRequest, Payment } from "@/types/payment.types";
import { CheckCircle2, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

const SuccessPayment = () => {
  const navigate = useNavigate();
  const paymentService = PaymentService.getInstance();
  const [payment, setPayment] = useState<Payment>();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const confirmPayment = async () => {
      if (isProcessing || payment) return;

      const sessionId = localStorage.getItem("stripeSessionId");
      const data = localStorage.getItem("confirmPaymentRequest");

      if (!sessionId || !data) {
        console.log("Required payment data not found in localStorage");
        return;
      }

      try {
        setIsProcessing(true);
        const confirmPaymentRequest: ConfirmPaymentRequest = JSON.parse(data);
        console.log("confirmPaymentRequest: ", confirmPaymentRequest);
        const paymentResult = await paymentService.confirmPayment(confirmPaymentRequest);

        if (paymentResult) {
          setPayment(paymentResult);
          localStorage.removeItem("stripeSessionId");
          localStorage.removeItem("confirmPaymentRequest");
        }
      } catch (error) {
        console.error("Payment confirmation failed:", error);
      } finally {
        setIsProcessing(false);
      }
    };

    confirmPayment();
  }, [isProcessing, payment]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold text-green-600">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">Your payment has been processed successfully.</p>
            <p className="text-muted-foreground">Your reservation has been confirmed.</p>
            {payment && (
              <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 mr-2 text-green-500" />
                <span>Receipt sent to {payment.customerEmail}</span>
              </div>
            )}
          </div>

          {payment && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Payment Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Amount:</div>
                  <div className="font-medium text-right">
                    {payment.amount} {payment.currency.toUpperCase()}
                  </div>

                  <div className="text-muted-foreground">Date:</div>
                  <div className="font-medium text-right">
                    {format(new Date(payment.date), "PPP p")}
                  </div>

                  <div className="text-muted-foreground">Email:</div>
                  <div className="font-medium text-right">{payment.customerEmail}</div>

                  <div className="text-muted-foreground">Description:</div>
                  <div className="font-medium text-right line-clamp-2">{payment.description}</div>

                  <div className="text-muted-foreground">Transaction ID:</div>
                  <div className="font-medium text-right text-xs truncate">{payment.chargeId}</div>
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button variant="outline" className="w-full" onClick={() => navigate("/")}>
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SuccessPayment;
