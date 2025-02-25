"use client";
import Link from 'next/link';
import Head from 'next/head';
import Feed from "@components/Feed";
import Navbar from "@components/Navbar";
import { Suspense } from "react";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>Gallery21</title>
        <link rel="icon" href="/images/logo_gallery21.jpg" />
      </Head>
      <div>
        <Suspense>
          <Navbar />
          <Feed />
        </Suspense>
      </div>
    </>
  );
}
