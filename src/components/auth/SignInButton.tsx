"use client";
import { useClerk } from "@clerk/nextjs";
import React from "react";
import { Button } from "../ui/button";

const SignInButton = () => {
  const { openSignIn } = useClerk();
  return (
    <Button variant={"outline"} className="bg-black" onClick={() => openSignIn()}>
      Sign In
    </Button>
  );
};

export default SignInButton;
