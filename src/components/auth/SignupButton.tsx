"use client";

import { useClerk } from "@clerk/nextjs";
import { Button } from "../ui/button";

const SignupButton = () => {
  const { openSignUp } = useClerk();
  return (
    <Button variant={"outline"} className="bg-pink-200 text-black"  onClick={() => openSignUp()}>
      SignUp
    </Button>
  );
};

export default SignupButton;
