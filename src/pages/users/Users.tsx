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
import { User } from "@/types/users.types";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminService } from "@/services/adminService";
import { error } from "console";
import { AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

const Users: FC = () => {
  const [users, setUsers] = useState<Array<User>>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [acitvateErrorModal, setAcitvateErrorModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const service = AdminService.getInstance();

  const handleEdit = (userId: string) => {
    navigate(`/users/edit/${userId}`);
  };

  const handleDeleteClick = (userId: string) => {
    setSelectedUserId(userId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedUserId) {
      const result: Promise<void> = service.deleteUser(selectedUserId);

      result
        .then(() => {
          loadUsers();
          setSelectedUserId(null);
          setDeleteDialogOpen(false);
        })
        .catch((error) => {
          console.error("Error deleting user with id: " + selectedUserId, error);
          setError(error.message || "Failed to fetch users");
          setAcitvateErrorModal(true);
          setUsers([]);
          setSelectedUserId(null);
          setDeleteDialogOpen(false);
        });
    }
  };

  const loadUsers = () => {
    service
      .getUsers()
      .then((data: User[]) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setError(error.message || "Failed to fetch users");
        setAcitvateErrorModal(true);
        setUsers([]);
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-background"
                          onClick={() => handleEdit(user.Id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-background hover:text-destructive"
                          onClick={() => {
                            handleDeleteClick(user.Id);
                          }}
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

      <AlertDialog open={acitvateErrorModal} onOpenChange={setAcitvateErrorModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>An error appeared.</AlertDialogTitle>
            <AlertDescription>Error: {error}</AlertDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setAcitvateErrorModal(false);
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

export default Users;
