import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { createRequest } from "@/helpers/request-response-helper";

const ReportIssue: React.FC = () => {
  const [email, setEmail] = useState("");
  const [issue, setIssue] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !issue) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      const data = {
        email,
        issue,
      };

      const response = await fetch("/report-issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createRequest(data)),
      });

      if (!response.ok) throw new Error("Failed to submit the issue.");
      setMessage("Your issue has been reported. Thank you!");
      setEmail("");
      setIssue("");
    } catch (err) {
      setMessage((err as Error).message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-center">Report an Issue</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="issue" className="block text-sm font-medium text-gray-700 mb-2">
                Issue Description
              </label>
              <Textarea
                id="issue"
                placeholder="Describe the issue"
                rows={4}
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                required
              />
            </div>
            {message && (
              <Alert variant="destructive" className="text-sm">
                {message}
              </Alert>
            )}
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportIssue;
