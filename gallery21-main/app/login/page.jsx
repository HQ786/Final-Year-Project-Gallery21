"use client";

import logo from '@public/logo.jpg';
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import '@styles/Register.scss';
import  toast, {Toaster } from 'react-hot-toast';

const LoginForm = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    setLoading(true);
    e.preventDefault();

    // Use next-auth's signIn function for manual login
    const result = await signIn("credentials", {
      redirect: false, // Don't redirect, handle it manually
      emailOrUsername: user, // Can be email or username
      password: password,
    });

    if (result?.error) {
      setError(result.error); // Handle any errors
    } else {
      // Redirect to the dashboard after successful login
      toast.success("Logging you in..")
      setTimeout(()=>{router.push("/")}, 2000);
    }
    setLoading(false);
  };

  return (
    <div className="register">
      <img
        src="/assets/register.jpg"
        alt="register"
        className="register_decor"
      />
      <div className="register_content">
        <div>
          <Image
            src={logo}
            alt="Logo"
            width={64}
            height={64}
            className="w-20 h-auto px-2"
          />
          <h1 className="text-center text-3xl text-white font-semibold py-2">
            LOGIN
          </h1>
        </div>
        <form
          className="register_content_form"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="email or user name"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
            className="bg-transparent focus:outline-none focus:border-b-2 focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-transparent focus:outline-none focus:border-b-2 focus:border-blue-500"
          />
          {error && <p className="text-red-600">{error}</p>}
          <div className="text-blue-600 text-sm">
            New to the platform?{" "}
            <Link href="/signup" className="underline">
              Register here
            </Link>
          </div>
          <button
            type="submit"
            className="w-52 py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition flex items-center justify-center"
            disabled={loading} // Disable button while loading
          >
            {loading ? (
              <>
                Logging in...
                <div className="ml-2 loader small-loader" />
              </>
            ) : (
              "Login"
            )}
          </button>
          <div>
            <p>
            <a href="/forgot-password" className="text-blue-500">Forgot Password?</a>
          </p>
          </div>
        </form>
        <Toaster />
      </div>
    </div>
  );
};

export default LoginForm;
