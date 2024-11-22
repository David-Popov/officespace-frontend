import React, { FC, useState } from "react";
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
import mockUsers from "@/types/users.types";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Users: FC = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleEdit = (userId: string) => {
    window.location.href = `/users/edit/${userId}`;
  };

  const handleDeleteClick = (userId: string) => {
    setSelectedUserId(userId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedUserId) {
      window.location.href = `/users/delete/${selectedUserId}`;
      // Or handle deletion through an API call:
      // await deleteUser(selectedUserId);
      // refreshUsersList();
    }
    setDeleteDialogOpen(false);
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
                {mockUsers.map((user) => (
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
