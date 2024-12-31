import React, { FC, useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CompanyDto } from "@/types/company.type";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { AdminService } from "@/services/adminService";

const EditCompany: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<CompanyDto | null>(null);
  const [error, setError] = useState<string>("");
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const navigate = useNavigate();

  const service = AdminService.getInstance();

  useEffect(() => {
    if (id) {
      service
        .getCompanyById(id)
        .then((data: CompanyDto) => {
          setCompany(data);
        })
        .catch((error: any) => {
          console.error("Error fetching company:", error);
          setError(error.message || "Failed to fetch company");
          setErrorModal(true);
        });
    }
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with company:", company);

    if (!company) {
      console.log("Company is null, returning");
      return;
    }

    try {
      await service.updateCompany(company);
      console.log("Update successful");
      setSuccessModal(true);

      window.setTimeout(() => {
        navigate("/admin-panel");
      }, 3000);
    } catch (error) {
      console.error("Update failed:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
      setErrorModal(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompany((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  if (!company) return <div>Loading...</div>;

  return (
    <div className="w-full p-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Edit Company</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <Input
              type="text"
              name="name"
              value={company.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <Input
              type="text"
              name="address"
              value={company.address}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <Input
              type="text"
              name="type"
              value={company.type}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                navigate("/companies");
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
              Company has been updated successfully (redirect in 3 seconds).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setSuccessModal(false);
                window.location.href = "/companies";
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

export default EditCompany;
