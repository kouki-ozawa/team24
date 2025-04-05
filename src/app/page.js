"use client";

import { useEffect, useState } from "react";
import UserInfo from "@/components/UserInfo";
import Auth from "@/components/Auth";

export default function Home() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const savedId = localStorage.getItem("userId");
    if (savedId) setUserId(savedId);
  }, []);

  return (
    <main className="p-8">
      {userId ? <UserInfo userId={userId} /> : <Auth setUserId={setUserId} />}
    </main>
  );
}

// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     try {
//       // ここでは簡単なバリデーションのみを行い、
//       // 特定のメールアドレスとパスワードでログインを許可します
//       if (
//         formData.email === "test@example.com" &&
//         formData.password === "password"
//       ) {
//         // 実際のアプリケーションでは、ここでAPIを呼び出してログイン処理を行います
//         router.push("/skill-match");
//       } else {
//         throw new Error("メールアドレスまたはパスワードが正しくありません。");
//       }
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   return (
//     <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div className="text-center">
//           <div className="flex justify-center mb-4">
//             {/* ロゴ画像がある場合は以下のようにImageコンポーネントを使用 */}
//             {/* <Image
//               src="/logo.png"
//               alt="SkillMatch Logo"
//               width={64}
//               height={64}
//               className="mx-auto"
//             /> */}
//             {/* ロゴ画像がない場合は代替テキスト */}
//             <div className="text-4xl font-bold text-blue-600">SkillMatch</div>
//           </div>
//           <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
//             アカウントにログイン
//           </h2>
//           <p className="mt-2 text-sm text-gray-600">
//             エンジニアスキル診断システムへようこそ
//           </p>
//         </div>

//         <Card className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
//           <div className="p-6">
//             {error && (
//               <div className="mb-4 p-4 rounded-md bg-red-50 border border-red-200">
//                 <p className="text-sm text-red-700">{error}</p>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div>
//                 <Label htmlFor="email" className="text-gray-700">
//                   メールアドレス
//                 </Label>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   placeholder="your@email.com"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="password" className="text-gray-700">
//                   パスワード
//                 </Label>
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   autoComplete="current-password"
//                   required
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   placeholder="••••••••"
//                 />
//               </div>

//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <input
//                     id="remember-me"
//                     name="remember-me"
//                     type="checkbox"
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                   />
//                   <label
//                     htmlFor="remember-me"
//                     className="ml-2 block text-sm text-gray-900"
//                   >
//                     状態を保持
//                   </label>
//                 </div>

//                 <div className="text-sm">
//                   <a
//                     href="#"
//                     className="font-medium text-blue-600 hover:text-blue-500"
//                   >
//                     パスワードをお忘れですか？
//                   </a>
//                 </div>
//               </div>

//               <Button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full bg-blue-600 hover:bg-blue-700 text-white"
//               >
//                 {isLoading ? "ログイン中..." : "ログイン"}
//               </Button>
//             </form>

//             <div className="mt-6">
//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300" />
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-2 bg-white text-gray-500">または</span>
//                 </div>
//               </div>

//               <div className="mt-6">
//                 <Button
//                   type="button"
//                   className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
//                   onClick={() => router.push("/users")}
//                 >
//                   新規アカウント登録
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </Card>

//         <div className="text-center text-sm text-gray-600">
//           <p>テスト用アカウント:</p>
//           <p>Email: test@example.com</p>
//           <p>Password: password</p>
//         </div>
//       </div>
//     </div>
//   );
// }
