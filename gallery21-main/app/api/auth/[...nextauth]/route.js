import User from "@models/User";
import { connectToDB } from "@utils/database";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        try {
          await connectToDB();

          const { emailOrUsername, password } = credentials;

          if (!emailOrUsername || !password) {
            throw new Error("Email/Username and password are required");
          }

          let user;
          // Determine if the input is an email (contains '@') or a username
          if (emailOrUsername.includes("@")) {
            user = await User.findOne({ email: emailOrUsername });
          } else {
            user = await User.findOne({ username: emailOrUsername });
          }
          console.log(user);

          if (!user) {
            throw new Error("User not found");
          }
          
          // Compare the entered password with the stored hashed password
          const isPasswordValid = await bcrypt.compare(password, user.password);
          console.log(password, user.password)
          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          // Return the user object if login is successful
          return {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
            roles: user.roles,
            isVerified: user.isVerified,
          };
        } catch (error) {
          console.error("Error in manual login:", error.message);
          if (error.name === "TimeoutError" || error.message.includes("timed out")) {
            throw new Error("Login request timed out. Please try again.");
          } else {
            throw new Error(error.message || "Login failed");
          }       
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // Use JWT-based sessions
    maxAge: 24 * 60 * 60,
  },
  // cookies: {
  //   sessionToken: {
  //     name: `__Secure-next-auth.session-token`,
  //     options: {
  //       httpOnly: true,
  //       sameSite: "lax",
  //       path: "/",
  //       secure: process.env.NODE_ENV === "production", // Ensure secure cookies in production
  //       maxAge: 24 * 60 * 60, // Match the maxAge of the session
  //     },
  //   },
  // },  
  callbacks: {
    async session({ session, token }) {
      // Attach user ID and other data to the session
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.username = token.username;
        session.user.isVerified = token.isVerified;
        session.user.roles = token.roles;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Store user data in JWT token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.isVerified = user.isVerified;
        token.roles = user.roles;

      }
      // Set token expiry (in seconds)
      const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24 hours
      token.exp = expirationTime;

      return token;
    },
  },
});

export { handler as GET, handler as POST };
