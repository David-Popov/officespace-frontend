// src/pages/users/EditUser.tsx
import React, { FC, useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdminService } from "@/services/adminService";
import { User } from "@/types/users.types";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const EditUser: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const navigate = useNavigate();

  const service = AdminService.getInstance();

  useEffect(() => {
    if (id) {
      service
        .getUserById(id)
        .then((data: User) => {
          setUser(data);
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
          setError(error.message || "Failed to fetch user");
          setErrorModal(true);
        });
    }
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with user:", user);

    if (!user) {
      console.log("User is null, returning");
      return;
    }

    try {
      await service.updateUser(user);
      console.log("Update successful");
      setSuccessModal(true);

      window.setTimeout(() => {
        navigate("/users");
      }, 3000);
    } catch (error) {
      console.error("Update failed:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
      setErrorModal(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="w-full p-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Edit User</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <Input
              type="text"
              name="username"
              value={user.username}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <Input
              type="text"
              name="firstName"
              value={user.firstName || ""}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <Input
              type="text"
              name="lastName"
              value={user.lastName || ""}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <Input type="text" name="phone" value={user.phone || ""} onChange={handleInputChange} />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                navigate("/users");
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>

      <AlertDialog open={successModal} onOpenChange={setSuccessModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Success</AlertDialogTitle>
            <AlertDialogDescription>
              User has been updated successfully (redirect in 3 seconds).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setSuccessModal(false);
                window.location.href = "/users";
              }}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={errorModal} onOpenChange={setErrorModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>{error}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorModal(false)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditUser;
