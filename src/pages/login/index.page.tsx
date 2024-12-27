import { Spinner } from "@/components/Spinner/Spinner";
import { supabase } from "@/services/supabase";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
interface IValuesLogin {
  email: string;
  password: string;
}
import { FcGoogle } from "react-icons/fc";

import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
export default function Login() {
  const [isOpen, setIsOpen] = useState(false);

  const handleConnectCalendar = async () => {
    await signIn("google");
  };
 
  return (
    <>
      <Head>Login | Clinifisio</Head>
      <main className="h-screen  flex justify-center items-center">
        <div className="flex bg-[#e9e9e9] items-center p-2 rounded-3xl">
          <div className="max-w-[380px] px-12 bg-white rounded-2xl flex flex-col justify-center text-black items-center">
            <h6 className="text-3xl mt-8">Welcome back!</h6>
            <span className="text-xs mt-4 font-light mb-8">
              Please enter your details
            </span>

            <button
              className="w-full text-black font-semibold bg-gray-200 py-2 flex justify-center items-center gap-2 rounded-full"
              type="button"
              onClick={handleConnectCalendar}
            >
              <FcGoogle size={30} className="bg-white p-1  rounded-full" />
              Log in with Google
            </button>
            <div className="flex justify-center mt-12 mb-4">
              <Link className="text-xs text-gray-500" href="/signup">
                {`Don't have an account?`}
                <span className="font-semibold">Sign Up</span>
              </Link>
            </div>
          </div>
        </div>

        <Spinner isOpen={isOpen} />
      </main>
    </>
  );
}
