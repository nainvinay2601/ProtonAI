import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import SignInButton from "../auth/SignInButton";
import SignupButton from "../auth/SignupButton";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center">
      {/* Logo */}
      <div className="logo">
        <p className="text-2xl font-bold"> P.AI</p>
      </div>
      {/* History */}

      <div className="historyLink">
        <p className="text-xl font-bold">HISTORY</p>
      </div>
      {/* AuthSide */}

      <div className="authSide">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <div className="flex justify-center items-center gap-4">

          <SignInButton />
          <SignupButton />
          </div>
        </SignedOut>
      </div>
    </nav>
  );
};

export default Navbar;
