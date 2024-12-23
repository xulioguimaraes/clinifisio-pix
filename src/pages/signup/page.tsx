import { Spinner } from "@/components/Spinner/Spinner";
import { supabase } from "@/services/supabase";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
interface IValuesLogin {
  email: string;
  password: string;
  confirmPassword: string;
}

import imageLogo from "@/app/logo.png";
import bglogin from "@/app/bglogin.png";
import Link from "next/link";
export default function Login() {
  const router = useRouter();
  const [values, setValues] = useState<IValuesLogin>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (values?.email === "" || values.password === "") {
      setError(true);

      return;
    }
    setIsOpen(true);

    const { data, error } = await supabase.auth.signInWithPassword(values);
    return console.log(data, error);

    if (data) {
      authPainel();
    }
    if (error) {
      setIsOpen(false);
      setError(true);
    }
  };
  function authPainel() {
    router.push("/painel");
  }
  const onChangeValues = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  return (
    <>
      <Head>Login | Clinifisio</Head>
      <main className="h-screen  flex justify-center items-center">
        <div className="flex bg-[#e9e9e9] items-center p-2 rounded-3xl">
          <div className="w-[500px] md:block sm:hidden">
            <Image width={1000} height={1000} alt="bg" src={bglogin} />
          </div>
          <div className="max-w-[380px] px-12 bg-white rounded-2xl flex flex-col justify-center text-black items-center">
            <div className="my-12">
              <Image width={100} height={100} src={imageLogo} alt="" />
            </div>
            <h6 className="text-3xl">Welcome!</h6>
            <span className="text-xs mt-4 font-light mb-8">
              Please enter your details
            </span>

            <form className="flex flex-col gap-3" onSubmit={handleLogin}>
              <input
                className="text-black p-2 min-w-80 border-b border-b-gray-700"
                value={values?.email}
                onChange={onChangeValues}
                type="email"
                autoComplete="email"
                name="email"
                placeholder="Email"
              />
              <input
                className="text-black p-2 min-w-80 border-b border-b-gray-700"
                value={values?.password}
                name="password"
                autoComplete="current-password"
                onChange={onChangeValues}
                type="password"
                placeholder="Password"
              />
              <input
                className="text-black p-2 min-w-80 border-b border-b-gray-700"
                value={values?.confirmPassword}
                name="password"
                autoComplete="current-password"
                onChange={onChangeValues}
                type="password"
                placeholder="Confirm Password"
              />

              {error && (
                <section className="__error">
                  <h3>Credenciais Invalidas</h3>
                </section>
              )}
              <button
                className="w-full mt-4 text-white font-semibold bg-black py-3 rounded-full"
                type="submit"
              >
                Register
              </button>
            </form>
            <div className="flex justify-center mt-24 mb-8">
              <Link className="text-xs text-gray-500" href="/login">
                {`Already have an account? `}
                <span className="font-semibold">Log in</span>
              </Link>
            </div>
          </div>
        </div>

        <Spinner isOpen={isOpen} />
      </main>
    </>
  );
}
