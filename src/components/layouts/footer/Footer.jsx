"use client";

import { usePathname, useRouter } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();

  // ログインページとユーザー登録ページではナビゲーションを表示しない
  if (pathname === "/" || pathname === "/users") {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* サービス説明 */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                SkillMatch
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                SkillMatchは、エンジニアのスキルを可視化し、
                キャリア開発をサポートするプラットフォームです。
                適切なスキル診断と、継続的な成長をサポートします。
              </p>
            </div>

            {/* クイックリンク
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                クイックリンク
              </h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="/skill-match" 
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    スキル診断
                  </a>
                </li>
                <li>
                  <a 
                    href="/users" 
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    ユーザー管理
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    ヘルプセンター
                  </a>
                </li>
              </ul>
            </div> */}

            {/* お問い合わせ */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                お問い合わせ
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:support@skillmatch.example.com"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    support@skillmatch.example.com
                  </a>
                </li>
                <li>
                  <div className="flex space-x-4 mt-4">
                    <a
                      href="#"
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      aria-label="Twitter"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-gray-900 transition-colors"
                      aria-label="GitHub"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* 区切り線 */}
          <div className="border-t border-gray-200 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500">
                &copy; {currentYear} SkillMatch. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  プライバシーポリシー
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  利用規約
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  特定商取引法に基づく表記
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
