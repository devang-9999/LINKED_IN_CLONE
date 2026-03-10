"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/users/me", {
          credentials: "include",
        });

        if (!res.ok) {
          router.push("/authentication/login");
        } else {
          setLoading(false);
        }
      } catch {
        router.push("/authentication/login");
      }
    };

    checkAuth();
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
}

// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable react-hooks/set-state-in-effect */
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function ProtectedLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {

//         // OLD LOCALSTORAGE TOKEN CHECK
//         /*
//         const token = localStorage.getItem("token");

//         if (!token) {
//           router.push("/authentication/login");
//         } else {
//           setLoading(false);
//         }
//         */

//         const res = await fetch("http://localhost:5000/auth/me", {
//           method: "GET",
//           credentials: "include", // VERY IMPORTANT (sends cookie)
//         });

//         if (!res.ok) {
//           router.push("/authentication/login");
//         } else {
//           setLoading(false);
//         }
//       } catch (err) {
//         router.push("/authentication/login");
//       }
//     };

//     checkAuth();
//   }, [router]);

//   if (loading) return null;

//   return <>{children}</>;
// }