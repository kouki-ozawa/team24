// "use client";

// import React from "react";
// import { useUser } from "../hooks/useUser";

// export default function UserInfo({ userId }) {
//   const { user, loading, error } = useUser(userId);

//   if (loading) return <p>読み込み中...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;
//   if (!user) return <p>ユーザー情報が見つかりません。</p>;

//   return (
//     <div className="mt-8 p-4 border rounded-md shadow-sm bg-white">
//       <h2 className="text-xl font-bold text-gray-800 mb-4">ユーザー情報</h2>
//       <ul className="space-y-2 text-gray-700 text-sm">
//         <li>
//           <strong>名前:</strong> {user.name}
//         </li>
//         <li>
//           <strong>Email:</strong> {user.email}
//         </li>
//         <li>
//           <strong>技術力:</strong> {user.technical_skill}
//         </li>
//         <li>
//           <strong>問題解決力:</strong> {user.problem_solving_ability}
//         </li>
//         <li>
//           <strong>コミュニケーション:</strong> {user.communication_skill}
//         </li>
//         <li>
//           <strong>リーダーシップ:</strong> {user.leadership_and_collaboration}
//         </li>
//         <li>
//           <strong>フロントエンド:</strong> {user.frontend_skill}
//         </li>
//         <li>
//           <strong>バックエンド:</strong> {user.backend_skill}
//         </li>
//         <li>
//           <strong>インフラ:</strong> {user.infrastructure_skill}
//         </li>
//         <li>
//           <strong>セキュリティ意識:</strong> {user.security_awareness}
//         </li>
//       </ul>
//     </div>
//   );
// }

"use client";

import React from "react";
import { useUser } from "../hooks/useUser";
import { UserIcon } from "lucide-react";

export default function UserInfo({ userId }) {
  const { user, loading, error } = useUser(userId);

  if (loading) return <p className="text-gray-600 text-center mt-10">読み込み中...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!user) return <p className="text-gray-600 text-center mt-10">ユーザー情報が見つかりません。</p>;

  return (
    <div className="mt-12 px-4 sm:px-6 lg:px-0 max-w-3xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8">
        <div className="flex items-center justify-center mb-6 gap-3">
          <UserIcon className="w-7 h-7 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-800">ユーザー情報</h2>
        </div>
        <div className="border-t border-gray-200 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <InfoItem label="名前" value={user.name} />
          <InfoItem label="Email" value={user.email} />
          <InfoItem label="技術力" value={user.technical_skill} />
          <InfoItem label="問題解決力" value={user.problem_solving_ability} />
          <InfoItem label="コミュニケーション" value={user.communication_skill} />
          <InfoItem label="リーダーシップ" value={user.leadership_and_collaboration} />
          <InfoItem label="フロントエンド" value={user.frontend_skill} />
          <InfoItem label="バックエンド" value={user.backend_skill} />
          <InfoItem label="インフラ" value={user.infrastructure_skill} />
          <InfoItem label="セキュリティ意識" value={user.security_awareness} />
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-gray-500 font-medium tracking-wide">{label}</span>
      <span className="mt-1 text-gray-900 text-base">{value ?? "未入力"}</span>
    </div>
  );
}
