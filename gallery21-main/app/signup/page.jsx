// Frontend: RegistrationForm Component

'use client';
import "@styles/Register.scss";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "./schema";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';

export default function RegistrationForm() {
  const router = useRouter();
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [usernameError, setUsernameError] = useState('');
  const [accountError, setAccountError] = useState('');
  const [loading, setLoading] = useState(false);


  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(signupSchema),
  });

  useEffect(() => {
    register.username === register.confirmPassword ||
      register.confirmPassword === ""
      ? setPasswordMatch(true)
      : setPasswordMatch(false);
  }, [register.password, register.confirmPassword]);

  // username uniqueness
  const checkUsername = async (username) => {
    try {
      const response = await fetch('/api/check-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (data.exists) {
        setUsernameAvailable(false); // Set username as unavailable
        setUsernameError("Username is already taken"); // Set error message
      } else {
        setUsernameAvailable(true); // Username is available
        setUsernameError(''); // Clear error message
      }
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameError("Error checking username availability"); // Handle fetch error
    }
  };



  // Handle username input change
  const handleUsernameChange = (event) => {
    const username = event.target.value;
    register("username").onChange(event);
    if (username) {
      checkUsername(username); // Check username availability
    } else {
      setUsernameAvailable(true); // Reset availability if username is empty
      setUsernameError('');
    }
  };

  const handleAccountError = (event) => {
    if (accountError) {
      console.log(89);
      setAccountError("")
    }
  }
  const onSubmit = async (data) => {
    data.email = data.email.toLowerCase();
    setLoading(true);
    if (usernameAvailable) {
      try {
        const response = await fetch("/api/signup", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          
          const userData = await response.json();
          console.log('userData', userData);
          
          toast.success("Registration successful!");
          console.log('id', userData.user._id);
          //localStorage.setItem('userId', JSON.stringify({ userId: userData.user._id }));
          setTimeout(() => {
            const userId = userData.user._id;
            router.push(`/signup/${userId}`);
        }, 3000);
        }
        if (response.status == 400) {
          setAccountError("Account with this email already exists");
        }
        else {
          const data = await response.json();

        }
      } catch (error) {
        console.error("Signup error:", error);
      }
    }
    setLoading(false);
  };

  const loginWithGoogle = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="register">
      <img
        src="/assets/register.jpg"
        alt="register"
        className="register_decor"
      />
      <div className="register_content">
      <ToastContainer />
        <form className="register_content_form" onSubmit={handleSubmit(onSubmit)}>
          <input type="text" placeholder="Username" {...register("username")} onChange={handleUsernameChange} />
          <p className="error-style">{usernameError || errors.username?.message}</p>
          <input type="text" placeholder="Email Address" {...register("email")} onChange={handleAccountError} />
          <p className="error-style">{accountError || errors.email?.message}</p>
          <input type="password" placeholder="Password" {...register("password")} />
          <p className="error-style">{errors.password?.message}</p>
          <input type="password" placeholder="Confirm Password" {...register("confirmPassword")} />
          <p className="error-style">{errors.confirmPassword?.message}</p>
          <button
            type="submit"
            disabled={!passwordMatch || loading} // Disable if password doesn't match or while loading
          >
            {loading ? (
              <>
                Signing up...
                <div className="ml-2 loader small-loader" /> 
              </>
            ) : (
              "Continue"
            )}
          </button>

        </form>
        <button className="google" type="button" onClick={loginWithGoogle}>
          <p>Log In with Google</p>
          <FcGoogle />
        </button>
        <span className='text-white'>Already have an account? <a href="/login">Log In Here</a> </span>
      </div>
    </div>
  );
}
