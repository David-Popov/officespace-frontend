import React, { useState, useRef, ChangeEvent, FormEvent } from "react";
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from "@react-oauth/google";
import profilePic from "../../images/profilePic.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [streetAddress, setStreetAddress] = useState<string>("");

  const profilePicRef = useRef<HTMLImageElement>(null);
  const profilePicInputRef = useRef<HTMLInputElement>(null);

  const handlePassword = (e: FormEvent) => {
    e.preventDefault();
  };

  const changeProfilePicture = () => {
    if (profilePicInputRef.current) {
      profilePicInputRef.current.click();
      profilePicInputRef.current.onchange = () => {
        if (profilePicRef.current && profilePicInputRef.current?.files) {
          profilePicRef.current.src = URL.createObjectURL(profilePicInputRef.current.files[0]);
        }
      };
    }
  };

  const handleGoogleLoginSuccess = (response: CredentialResponse) => {
    const { credential } = response;
    if (credential) {
      fetch("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + credential)
        .then((res) => res.json())
        .then((data) => {
          setEmail(data.email);
          setFirstName(data.given_name);
          setLastName(data.family_name);
          setUsername(data.name);
          console.log("Google user registered:", data);
        });
    }
  };

  const handleGoogleLoginFailure = (error: unknown) => {
    console.error("Google login failed:", error);
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
      <div className="flex flex-col items-center justify-center min-h-screen py-8 w-full">
        <div className="border-2 border-gray-300 rounded-[14px] p-8 bg-white w-full max-w-md">
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold">Register</h2>
          </div>

          <form onSubmit={handlePassword}>
            <div className="flex justify-center items-center mb-4">
              <img
                src={profilePic}
                alt="Profile"
                ref={profilePicRef}
                onClick={changeProfilePicture}
                className="h-12 w-12 rounded-full border border-black cursor-pointer"
              />
              <input type="file" ref={profilePicInputRef} name="pictureURL" className="hidden" />

              <Input
                type="text"
                name="username"
                placeholder="Username"
                value={username}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                autoComplete="off"
                required
                className="ml-4 px-4 py-2 border rounded-[10px] w-full dark:border-none"
              />
            </div>

            <div className="flex space-x-4 mb-4">
              <Input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={firstName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                autoComplete="off"
                required
                className="px-4 py-2 border rounded-[10px] w-full dark:border-none"
              />
              <Input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={lastName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                autoComplete="off"
                required
                className="px-4 py-2 border rounded-[10px] w-full dark:border-none"
              />
            </div>

            <div className="flex flex-col space-y-2 mb-4">
              <Input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                autoComplete="off"
                required
                className="px-4 py-2 border rounded-[10px] w-full dark:border-none"
              />
              <Input
                type="text"
                name="address"
                placeholder="Street Address"
                value={streetAddress}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setStreetAddress(e.target.value)}
                autoComplete="off"
                required
                className="px-4 py-2 border rounded-[10px] w-full dark:border-none"
              />
              <Input
                type="text"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                autoComplete="off"
                required
                className="px-4 py-2 border rounded-[10px] w-full dark:border-none"
              />
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
                className="px-4 py-2 border rounded-[10px] w-full dark:border-none"
              />
            </div>

            <Button type="submit" variant="default" className="w-full mt-4 rounded-[10px]">
              Register
            </Button>

            {/* Google Register Button */}
            <div className="mt-4">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => handleGoogleLoginFailure}
                useOneTap
              />
            </div>
          </form>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Signup;
