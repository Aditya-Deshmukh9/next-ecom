"use client";
import { notFound, useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  searchParams: { token: string; userId: string };
}

export default function Verifypage(props: Props) {
  const { token, userId } = props.searchParams;
  const router = useRouter();

  useEffect(() => {
    fetch("/api/users/verify", {
      method: "POST",
      body: JSON.stringify({ token, userId }),
    }).then(async (res) => {
      const apiRes = await res.json();
      const { error, message } = apiRes as { message: string; error: string };
      console.log(res);

      if (res.ok) {
        console.log(message);
        router.replace("/");
      }

      if (!res.ok && error) {
        console.log(error);
      }
    });
  }, []);

  if (!token || !userId) return notFound();
  return (
    <div className="text-3xl text-white opacity-80 text-center flex justify-center items-center w-full h-screen p-5 animate-pulse">
      <div className="flex flex-col">
        Please wait...
        <p>We are Verifying your email</p>
      </div>
    </div>
  );
}
