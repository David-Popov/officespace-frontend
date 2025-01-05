import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TicketService } from "@/services/ticketService";
import { TicketType, TicketStatus } from "@/types/ticket.type";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CheckCircle } from "lucide-react";

interface IssueReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  userId: string;
}

export const IssueReportDialog: React.FC<IssueReportDialogProps> = ({
  isOpen,
  onClose,
  roomId,
  userId,
}) => {
  const [issueTitle, setIssueTitle] = useState<string>("");
  const [issueDescription, setIssueDescription] = useState<string>("");
  const [issueType, setIssueType] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIssueTitle("");
      setIssueDescription("");
      setIssueType("");
    }
  }, [isOpen]);

  const handleReportIssue = async () => {
    if (!issueTitle || !issueDescription || !issueType) {
      alert("Please fill out all fields!");
      return;
    }

    const ticketService = TicketService.getInstance();
    const issueReport = {
      user_uuid: userId,
      ticketTitle: issueTitle,
      ticketDesc: issueDescription,
      ticketType: issueType as TicketType,
      ticketStatus: TicketStatus.NEW,
      officeRoom_uuid: roomId,
      ticketDate: new Date().toISOString(),
    };

    try {
      setIsSubmitting(true);
      console.log("Reporting issue:", issueReport);

      const response = await ticketService.createTicket(issueReport);
      console.log("Ticket created successfully:", response);
      onClose();
      setShowAlertDialog(true);
    } catch (error: any) {
      console.error("Failed to create ticket:", error);

      if (error.response) {
        console.error("Error details:", error.response.data); // Log response data
      } else {
        console.error("Error message:", error.message); // Log error message
      }

      alert("Failed to report issue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report an Issue</DialogTitle>
            <DialogDescription>
              Provide details about the issue you're facing with the room.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Title Input */}
            <div className="space-y-2">
              <Label>Title*</Label>
              <Input
                type="text"
                value={issueTitle}
                onChange={(e) => setIssueTitle(e.target.value)}
                placeholder="Enter a short title for the issue"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Description*</Label>
              <Textarea
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                placeholder="Describe the issue with the room..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Issue Type*</Label>
              <Select value={issueType} onValueChange={setIssueType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="hover:bg-gray-200 hover:text-black" value="IT">
                    IT
                  </SelectItem>
                  <SelectItem className="hover:bg-gray-200 hover:text-black" value="MAINTENANCE">
                    Maintenance
                  </SelectItem>
                  <SelectItem className="hover:bg-gray-200 hover:text-black" value="CLEANING">
                    Cleaning
                  </SelectItem>
                  <SelectItem className="hover:bg-gray-200 hover:text-black" value="OTHER">
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              type="button"
              onClick={handleReportIssue}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Report Issue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader className="flex flex-col items-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
            <AlertDialogTitle>Issue Reported Successfully</AlertDialogTitle>
            <AlertDialogDescription>
              Your ticket has been successfully created. <br />
              Our team will begin working on the issue shortly.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setShowAlertDialog(false);
                onClose();
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
