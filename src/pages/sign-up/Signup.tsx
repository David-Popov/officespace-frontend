import React, { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthService } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface RegisterUserRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

const Signup: React.FC = () => {
  const initFormData = {
    email: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
  };

  const [formData, setFormData] = useState<RegisterUserRequest>(initFormData);
  const [activateFailedRegisterModal, setActivateFailedRegisterModal] = useState<boolean>(false);
  const [activateSuccesfulRegisterModal, setActivateSuccesfulRegisterModal] =
    useState<boolean>(false);
  const navigate = useNavigate();
  const service = AuthService.getInstance();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form data:", formData);
    let result: Promise<void> = service.register(formData);

    result
      .then(() => {
        setActivateSuccesfulRegisterModal(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      })
      .catch((error) => {
        setActivateFailedRegisterModal(true);
        console.log(error);
      });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen py-8 w-full bg-background">
        <div className="border rounded-[14px] p-8 w-full max-w-md bg-card text-card-foreground shadow-sm">
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold">Register</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="off"
              required
              className="mb-4"
            />

            <div className="flex space-x-4 mb-4">
              <Input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                autoComplete="off"
                required
              />
              <Input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </div>

            <div className="flex flex-col space-y-2 mb-4">
              <Input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="off"
                required
              />
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="off"
                required
              />
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full mt-4">
              Register
            </Button>
          </form>
        </div>
      </div>
      <AlertDialog open={activateFailedRegisterModal} onOpenChange={setActivateFailedRegisterModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Register was unsuccessful.</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setActivateFailedRegisterModal(false);
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={activateSuccesfulRegisterModal}
        onOpenChange={setActivateSuccesfulRegisterModal}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Register was successful.</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setActivateSuccesfulRegisterModal(false);
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Signup;
