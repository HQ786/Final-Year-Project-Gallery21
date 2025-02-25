'use client';

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Form from "@components/Form";
import Loader from "@components/Loader";
import Navbar from "@components/Navbar";

const UpdateWorkContent = () => {
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const workId = searchParams.get("id");
  const router = useRouter();
  const { data: session } = useSession();

  const [work, setWork] = useState({
    category: "",
    title: "",
    description: "",
    price: "",
    photos: [],
  });

  useEffect(() => {
    const getWorkDetails = async () => {
      if (workId) {
        try {
          const res = await fetch(`/api/work/${workId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await res.json();
          setWork({
            category: data.body.category,
            title: data.body.title,
            description: data.body.description,
            price: data.body.price,
            photos: data.body.workPhotoPaths,
          });
          setLoading(false);
        } catch (error) {
          console.error("In Update Work - getWorkDetails failed:", error);
        }
      }
    };
    getWorkDetails();
  }, [workId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateWorkForm = new FormData();
      for (let key in work) {
        updateWorkForm.append(key, work[key]);
      }
      work.photos.forEach((photo) => {
        updateWorkForm.append("workPhotoPaths", photo);
      });
      const response = await fetch(`/api/work/${workId}`, {
        method: "PATCH",
        body: updateWorkForm,
      });
      if (response.ok) {
        router.push(`/shop?id=${session?.user?._id}`);
      }
    } catch (error) {
      console.error(`Updatework failed: ${error.message}`);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <Form
        type="Edit"
        work={work}
        setWork={setWork}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

const UpdateWork = () => {
  return (
    <Suspense fallback={<Loader />}>
      <UpdateWorkContent />
    </Suspense>
  );
};

export default UpdateWork;