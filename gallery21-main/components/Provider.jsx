"use client";
import { SessionProvider } from "next-auth/react";
import { PostProvider } from "@context/PostContext";
import { ImageProvider } from "@context/ImageContext";

const Provider = ({ children, session }) => {
  return(
  <SessionProvider session={session}>
      <PostProvider>
          <ImageProvider>
            {children}
          </ImageProvider>
      </PostProvider>
    </SessionProvider>
    );
};

export default Provider;
