import React, { FC, useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserDto } from "@/types/users.types";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Users: FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserDto[]>([]);
  const [editedUser, setEditedUser] = useState<UserDto | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/users/get-all", { method: "GET" });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: UserDto[] = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = async () => {
    if (editedUser) {
      const updatedUsers = users.map((user) => (user.Id === editedUser.Id ? editedUser : user));
      setUsers(updatedUsers);

      try {
        const response = await fetch(`/users/update/${editedUser.Id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editedUser),
        });
        if (!response.ok) throw new Error("Failed to update user");
      } catch (error) {
        console.error(error);
      }

      navigate(0);
    }
  };

  const handleDeleteClick = (userId: string) => {
    setSelectedUserId(userId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedUserId) {
      const updatedUsers = users.filter((user) => user.Id !== selectedUserId);
      setUsers(updatedUsers);
      try {
        const response = await fetch(`/admin/delete-user/${selectedUserId}`, { method: "DELETE" });
        if (!response.ok) throw new Error(`Failed to delete user with id ${selectedUserId}`);
      } catch (error) {
        console.error(error);
      }

      navigate(0);
    }
    setDeleteDialogOpen(false);
  };

  const handleInputChange = (field: keyof UserDto, value: string) => {
    setEditedUser((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  return (
    <>
      <div className="w-full p-4">
        <div className="rounded-md border bg-background">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[25%]">Email</TableHead>
                  <TableHead className="w-[20%]">Username</TableHead>
                  <TableHead className="w-[20%]">First Name</TableHead>
                  <TableHead className="w-[20%]">Last Name</TableHead>
                  <TableHead className="w-[15%] text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.Id}>
                    <TableCell className="min-w-[200px] font-medium">{user.email}</TableCell>
                    <TableCell className="min-w-[150px]">{user.username}</TableCell>
                    <TableCell className="min-w-[150px]">{user.firstName}</TableCell>
                    <TableCell className="min-w-[150px]">{user.lastName}</TableCell>
                    <TableCell className="min-w-[100px] text-right">
                      <div className="flex justify-end space-x-2 pr-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-background"
                              onClick={() => setEditedUser(user)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Edit profile</DialogTitle>
                              <DialogDescription>
                                Make changes to a user's profile here. Click save when you're done.
                              </DialogDescription>
                            </DialogHeader>
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleEdit();
                              }}
                            >
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="email" className="text-right">
                                    Email
                                  </Label>
                                  <Input
                                    id="email"
                                    value={editedUser?.email || ""}
                                    className="col-span-3"
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="username" className="text-right">
                                    Username
                                  </Label>
                                  <Input
                                    id="username"
                                    value={editedUser?.username || ""}
                                    className="col-span-3"
                                    onChange={(e) => handleInputChange("username", e.target.value)}
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="firstName" className="text-right">
                                    First Name
                                  </Label>
                                  <Input
                                    id="firstName"
                                    value={editedUser?.firstName || ""}
                                    className="col-span-3"
                                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="lastName" className="text-right">
                                  Last Name
                                </Label>
                                <Input
                                  id="lastName"
                                  value={editedUser?.lastName || ""}
                                  className="col-span-3"
                                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                                />
                              </div>
                              <DialogFooter className="mt-2">
                                <Button type="submit">Save changes</Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-background hover:text-destructive"
                          onClick={() => handleDeleteClick(user.Id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user and remove their
              data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Users;
