"use client";

import { usePathname, useRouter } from "next/navigation";
import { Shield, Flame, Code, Target } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();

  // ログインページとユーザー登録ページではナビゲーションを表示しない
  if (pathname === "/" || pathname === "/") {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* サービス説明 */}
            <div className="col-span-1 md:col-span-1">
              <h3 className="text-xl font-bold text-primary mb-4 tracking-wider">
                ProjectYAKUZA
              </h3>
              <p className="text-foreground/80 text-sm leading-relaxed">
                組織の絆を強め、技術者の実力を見極める。
                それが我々の流儀。個々の力を最大限に引き出し、
                一流の仕事をこなす組織づくりをサポートする。
              </p>
            </div>

            {/* クイックリンク */}
            <div>
              <h3 className="text-sm font-semibold text-primary mb-4">
                クイックリンク
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Code className="w-4 h-4 text-accent mr-2" />
                  <a 
                    href="/questions" 
                    className="text-sm text-foreground/80 hover:text-accent transition-colors"
                  >
                    スキル診断
                  </a>
                </li>
                <li className="flex items-center">
                  <Target className="w-4 h-4 text-accent mr-2" />
                  <a 
                    href="/projects" 
                    className="text-sm text-foreground/80 hover:text-accent transition-colors"
                  >
                    プロジェクト管理
                  </a>
                </li>
                <li className="flex items-center">
                  <Shield className="w-4 h-4 text-accent mr-2" />
                  <a 
                    href="/users" 
                    className="text-sm text-foreground/80 hover:text-accent transition-colors"
                  >
                    ユーザー情報
                  </a>
                </li>
              </ul>
            </div>

            {/* お問い合わせ */}
            <div>
              <h3 className="text-sm font-semibold text-primary mb-4">
                作成者
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    className="text-sm text-foreground/80"
                  >
                    team24(本物)
                    <br />
                    【技育CAMP】ハッカソン Vol.2即席チーム
                  </a>
                </li>
                <li>
                  <div className="flex space-x-4 mt-4">
                    <a
                      href="https://github.com/kouki-ozawa/team24"
                      className="text-foreground/50 hover:text-accent transition-colors"
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
          <div className="border-t border-border mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-foreground/50">
                &copy; {currentYear} 極道開発組合 ProjectYAKUZA. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a
                  href="#"
                  className="text-sm text-foreground/50 hover:text-accent transition-colors"
                >
                  掟書
                </a>
                <a
                  href="#"
                  className="text-sm text-foreground/50 hover:text-accent transition-colors"
                >
                  契約条項
                </a>
                <a
                  href="#"
                  className="text-sm text-foreground/50 hover:text-accent transition-colors"
                  title="特定商取引法に基づく表記"
                >
                  取引表記
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
