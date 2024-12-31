import { FC, useState, useEffect } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { User } from "@/types/users.types";
import { Pencil, Trash2, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminService } from "@/services/adminService";
import { useNavigate } from "react-router-dom";
import { CompanyDto } from "@/types/company.type";
import { GetReservationsResponseObject, ReservationStatus } from "@/types/reservation.type";

interface AdminPanelProps {
  initialTab?: string;
}

const AdminPanel: FC<AdminPanelProps> = ({ initialTab = "users" }) => {
  const [users, setUsers] = useState<Array<User>>([]);
  const [companies, setCompanies] = useState<Array<CompanyDto>>([]);
  const [reservations, setReservations] = useState<Array<GetReservationsResponseObject>>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItemType, setDeleteItemType] = useState<"users" | "companies">("users");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [errorModalOpen, setErrorModalOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  const service = AdminService.getInstance();

  const handleEdit = (id: string, type: string) => {
    navigate(`/${type}/edit/${id}`);
  };

  const handleAdd = (type: string) => {
    navigate(`/${type}/new`);
  };

  const handleDeleteClick = (id: string, type: "users" | "companies") => {
    setSelectedItemId(id);
    setDeleteItemType(type);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedItemId) {
      let deletePromise;

      switch (deleteItemType) {
        case "users":
          deletePromise = service.deleteUser(selectedItemId);
          break;
        case "companies":
          deletePromise = service.deleteCompany(selectedItemId);
          break;
      }

      deletePromise
        .then(() => {
          loadData();
          setSelectedItemId(null);
          setDeleteDialogOpen(false);
        })
        .catch((error) => {
          console.error("Error deleting item:", error);
          setError(error.message || "Failed to delete item");
          setErrorModalOpen(true);
          setSelectedItemId(null);
          setDeleteDialogOpen(false);
        });
    }
  };

  const loadData = () => {
    service
      .getUsers()
      .then((data: User[]) => {
        setUsers(data);
        console.log(JSON.stringify(data), "Data");
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setError(error.message || "Failed to fetch users");
        setErrorModalOpen(true);
      });

    service
      .getCompanies()
      .then((data: CompanyDto[]) => setCompanies(data))
      .catch((error) => {
        console.error("Error fetching companies:", error);
        setError(error.message || "Failed to fetch companies");
        setErrorModalOpen(true);
      });

    service
      .getReservations()
      .then((data: GetReservationsResponseObject[]) => {
        setReservations(data);
        console.log("Data: ", data);
      })
      .catch((error) => {
        console.error("Error fetching companies:", error);
        setError(error.message || "Failed to fetch companies");
        setErrorModalOpen(true);
      });
  };

  const filterData = (data: any[], type: string) => {
    return data.filter((item) => {
      let matchesSearch = true;
      let matchesFilter = true;

      switch (type) {
        case "users":
          matchesSearch = item.email.toLowerCase().includes(searchTerm.toLowerCase());
          matchesFilter = roleFilter === "all" || item.roleName === roleFilter;
          break;

        case "reservations":
          matchesSearch = item.reservationTitle.toLowerCase().includes(searchTerm.toLowerCase());
          matchesFilter = statusFilter === "all" || item.status === statusFilter;
          break;

        case "companies":
          matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
          break;
      }

      return matchesSearch && matchesFilter;
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const renderUserToolbar = () => (
    <div className="flex items-center justify-between mb-4 gap-4">
      <div className="flex-1 flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="ADMIN">ADMIN</SelectItem>
            <SelectItem value="USER">USER</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={() => handleAdd("users")} className="gap-2">
        <Plus className="h-4 w-4" /> Add New User
      </Button>
    </div>
  );

  const renderReservationToolbar = () => (
    <div className="flex items-center justify-between mb-4 gap-4">
      <div className="flex-1 flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">PENDING</SelectItem>
            <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
            <SelectItem value="CANCELED">CANCELED</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderCompanyToolbar = () => (
    <div className="flex items-center justify-between mb-4 gap-4">
      <div className="flex-1 flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by company name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <Button onClick={() => handleAdd("companies")} className="gap-2">
        <Plus className="h-4 w-4" /> Add New Company
      </Button>
    </div>
  );

  const renderUsersTable = () => (
    <div className="rounded-md border bg-background">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[25%]">Email</TableHead>
            <TableHead className="w-[20%]">Username</TableHead>
            <TableHead className="w-[15%]">First Name</TableHead>
            <TableHead className="w-[15%]">Last Name</TableHead>
            <TableHead className="w-[10%]">Role</TableHead>
            <TableHead className="w-[15%] text-right pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterData(users, "users").map((user: User) => (
            <TableRow key={user.Id}>
              <TableCell className="font-medium">{user.email}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.roleName}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2 pr-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-background"
                    onClick={() => handleEdit(user.Id, "users")}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-background hover:text-destructive"
                    onClick={() => handleDeleteClick(user.Id, "users")}
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
  );

  return (
    <div className="w-[90%] mx-auto p-6">
      <Tabs defaultValue={initialTab} className="w-full space-y-6">
        <div className="mb-6">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="users" className="space-y-4 w-full">
          {renderUserToolbar()}
          {renderUsersTable()}
        </TabsContent>

        <TabsContent value="companies" className="space-y-4">
          {renderCompanyToolbar()}
          <div className="rounded-md border bg-background">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[40%]">Company Name</TableHead>
                  <TableHead className="w-[30%]">Address</TableHead>
                  <TableHead className="w-[15%]">Type</TableHead>
                  <TableHead className="w-[15%] text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterData(companies, "companies").map((company: CompanyDto) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>{company.address}</TableCell>
                    <TableCell>{company.type}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2 pr-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-background"
                          onClick={() => handleEdit(company.id, "companies")}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-background hover:text-destructive"
                          onClick={() => handleDeleteClick(company.id, "companies")}
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
        </TabsContent>

        <TabsContent value="reservations" className="space-y-4">
          {renderReservationToolbar()}
          <div className="rounded-md border bg-background">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[25%]">Name</TableHead>
                  <TableHead className="w-[20%]">Start Date Time</TableHead>
                  <TableHead className="w-[20%]">End Date Time</TableHead>
                  <TableHead className="w-[15%]">Status</TableHead>
                  <TableHead className="w-[15%]">User Email</TableHead>
                  <TableHead className="w-[15%]">Office Room</TableHead>
                  <TableHead className="w-[20%] text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterData(reservations, "reservations").map(
                  (reservation: GetReservationsResponseObject) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">{reservation.reservationTitle}</TableCell>
                      <TableCell>{reservation.startDateTime}</TableCell>
                      <TableCell>{reservation.endDateTime}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium 
                        ${
                          reservation.status === ReservationStatus.CONFIRMED
                            ? "bg-green-100 text-green-800"
                            : reservation.status === ReservationStatus.PENDING
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                        >
                          {reservation.status}
                        </span>
                      </TableCell>
                      <TableCell>{reservation.userEmail}</TableCell>
                      <TableCell>{reservation.officeRoomName}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2 pr-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-background"
                            onClick={() => handleEdit(reservation.id, "reservations")}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this item and remove their
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

      <AlertDialog open={errorModalOpen} onOpenChange={setErrorModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>An error occurred</AlertDialogTitle>
            <AlertDialogDescription>{error}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorModalOpen(false)}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPanel;
