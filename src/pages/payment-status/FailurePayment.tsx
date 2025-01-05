import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FailurePayment = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold text-red-600">Payment Failed</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-2 pb-6">
          <p className="text-muted-foreground">We couldn't process your payment.</p>
          <p className="text-muted-foreground">
            Please try again or contact support if the problem persists.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button
            className="w-full bg-red-600 hover:bg-red-700"
            onClick={() => window.history.back()}
          >
            Try Again
          </Button>
          <Button variant="outline" className="w-full" onClick={() => navigate("/")}>
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FailurePayment;
