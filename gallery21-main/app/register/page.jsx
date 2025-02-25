"use client";
import "@styles/Register.scss";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });

  const [passwordMatch, setPasswordMatch] = useState(true);
  const router = useRouter();

  useEffect(() => {
    formData.password === formData.confirmPassword ||
    formData.confirmPassword === ""
      ? setPasswordMatch(true)
      : setPasswordMatch(false);
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "profileImage" ? files[0] : value,
    }));
  };

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Convert the profile image to a base64 string if it exists
    let profileImageBase64 = null;
    if (formData.profileImage) {
      const reader = new FileReader();
      reader.readAsDataURL(formData.profileImage);
      reader.onloadend = async () => {
        profileImageBase64 = reader.result;
  
        // Create JSON payload
        const registerData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          profileImage: profileImageBase64,
        };
  
        try {
          const response = await fetch("/api/register/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(registerData),
          });
  
          const responseText = await response.text(); // Get response as text
          console.log("Response Text:", responseText); // Log the response text for debugging
  
          if (response.ok) {
            router.push("/dashboard");
          } else {
            const errorData = JSON.parse(responseText); // Try parsing as JSON
            alert(`Registration failed: ${errorData.message}`);
          }
        } catch (err) {
          alert("An error occurred during registration: " + err.message);
        }
      };
    } else {
      // Handle case where no profile image is provided
      const registerData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        profileImage: null,
      };
  
      try {
        const response = await fetch("/api/register/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registerData),
        });
  
        const responseText = await response.text(); // Get response as text
        console.log("Response Text:", responseText); // Log the response text for debugging
  
        if (response.ok) {
          router.push("/dashboard");
        } else {
          const errorData = JSON.parse(responseText); // Try parsing as JSON
          alert(`Registration failed: ${errorData.message}`);
        }
      } catch (err) {
        alert("An error occurred during registration: " + err.message);
      }
    }
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
        <form className="register_content_form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={formData.username}
            required
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            required
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            required
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            required
            onChange={handleChange}
          />
          {!passwordMatch && (
            <p style={{ color: "red" }}>Passwords do not match</p>
          )}
          <input
            id="image"
            type="file"
            name="profileImage"
            accept="image/*"
            style={{ display: "none" }}
            required
            onChange={handleChange}
          />
          <label htmlFor="image">
            <img src="/assets/addImage.png" alt="add profile" />
            <p>Upload Profile Photo</p>
          </label>
          {formData.profileImage && (
            <img
              src={URL.createObjectURL(formData.profileImage)}
              alt="profile"
              style={{ maxWidth: "80px" }}
            />
          )}
          <button type="submit" disabled={!passwordMatch}>
            Register
          </button>
        </form>
        <button className="google" type="button" onClick={loginWithGoogle}>
          <p>Log In with Google</p>
          <FcGoogle />
        </button>
        <a href="/login2">Already have an account? Log In Here</a>
      </div>
    </div>
  );
};

export default Register;
