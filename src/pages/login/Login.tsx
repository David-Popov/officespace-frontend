import React, { useState, FormEvent, ChangeEvent } from "react";
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { LoginUserRequest } from "@/types/auth.types";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/UserContext";

const Login: React.FC = () => {
  const { login } = useAuth();
  const location = useLocation();
  const [loginRequest, setLoginRequest] = useState<LoginUserRequest>({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activateFailedLoginModal, setActivateFailedLoginModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log(loginRequest);
      const result: Promise<void> = login(loginRequest);

      result
        .then(() => {
          navigate(from, { replace: true });
        })
        .catch((error) => {
          setActivateFailedLoginModal(true);
          console.log(error);
        });
    } catch (error) {
      console.error("Login failed:", error);
      setActivateFailedLoginModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginSuccess = (response: CredentialResponse) => {
    const { credential } = response;
    if (credential) {
      fetch("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + credential)
        .then((res) => res.json())
        .then((data) => {
          console.log("Google login successful:", data);
          // Handle Google login success
        });
    }
  };

  const handleGoogleLoginFailure = (error: unknown) => {
    console.error("Google login failed:", error);
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background w-full">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={loginRequest.email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setLoginRequest((prev) => ({ ...prev, email: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button
                      variant="link"
                      className="px-0 text-sm text-primary hover:underline"
                      type="button"
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginRequest.password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setLoginRequest((prev) => ({ ...prev, password: e.target.value }))
                    }
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="flex justify-center w-full">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => handleGoogleLoginFailure}
                useOneTap
                size="large"
                width="400"
                text="continue_with"
                shape="rectangular"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <div className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <a href="/signup" className="px-0 text-primary">
                Sign up
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
      <AlertDialog open={activateFailedLoginModal} onOpenChange={setActivateFailedLoginModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Login was unsuccessful.</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setActivateFailedLoginModal(false);
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </GoogleOAuthProvider>
  );
};

export default Login;
