"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import RequireAuth from "@/components/RequireAuth";
import { useRouter } from "next/navigation";
import {
  Brain,
  Code,
  Users,
  Shield,
  Target,
  Save,
  User,
  Layout,      // 追加: frontend_skill 用のアイコン
  Server,      // 追加: backend_skill 用のアイコン
  Cloud        // 追加: infrastructure_skill 用のアイコン
} from "lucide-react";

const icons = {
  technical_skill: <Code className="w-6 h-6" />,
  problem_solving_ability: <Brain className="w-6 h-6" />,
  communication_skill: <Users className="w-6 h-6" />,
  leadership_and_collaboration: <Target className="w-6 h-6" />,
  frontend_skill: <Layout className="w-6 h-6" />,
  backend_skill: <Server className="w-6 h-6" />,
  infrastructure_skill: <Cloud className="w-6 h-6" />,
  security_awareness: <Shield className="w-6 h-6" />,
};

const options = [
  { value: "1", label: "基礎レベル" },
  { value: "2", label: "初級レベル" },
  { value: "3", label: "中級レベル" },
  { value: "4", label: "上級レベル" },
  { value: "5", label: "エキスパートレベル" },
];

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [calculationDetails, setCalculationDetails] = useState([]);
  const [userSkills, setUserSkills] = useState({
    technical_skill: 1, // 技術力
    problem_solving_ability: 1, // 問題解決力
    communication_skill: 1, // コミュニケーション
    leadership_and_collaboration: 1, // リーダーシップ
    frontend_skill: 1, // フロントエンド
    backend_skill: 1, // バックエンド
    infrastructure_skill: 1, // インフラ
    security_awareness: 1, // セキュリティ意識
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState(null);
  const questionRefs = useRef([]);
  const resultRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questions`);
        if (!res.ok) throw new Error("質問の取得に失敗");
        const data = await res.json();
        setQuestions(data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswer = (questionIndex, questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    setTimeout(() => {
      if (questionIndex < questions.length - 1) {
        questionRefs.current[questionIndex + 1]?.scrollIntoView({ behavior: "smooth" });
      } else {
        resultRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }, 200);
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length !== questions.length) {
      alert("すべての質問に回答してください。");
      return;
    }

    // 基本値は0にして合計値を算出する
    const newSkills = {
      technical_skill: 0,
      problem_solving_ability: 0,
      communication_skill: 0,
      leadership_and_collaboration: 0,
      frontend_skill: 0,
      backend_skill: 0,
      infrastructure_skill: 0,
      security_awareness: 0,
    };

    // 各スキルの最大値を計算
    const maxSkillValues = {
      technical_skill: 0,
      problem_solving_ability: 0,
      communication_skill: 0,
      leadership_and_collaboration: 0,
      frontend_skill: 0,
      backend_skill: 0,
      infrastructure_skill: 0,
      security_awareness: 0,
    };

    questions.forEach((q) => {
      const answer = parseInt(answers[q.Question_ID], 10);

      // 各スキルに係数を掛けて加算
      if (q.technical_skill) {
        newSkills.technical_skill += answer * q.technical_skill;
        maxSkillValues.technical_skill += 5 * q.technical_skill;
      }
      if (q.problem_solving_ability) {
        newSkills.problem_solving_ability += answer * q.problem_solving_ability;
        maxSkillValues.problem_solving_ability += 5 * q.problem_solving_ability;
      }
      if (q.communication_skill) {
        newSkills.communication_skill += answer * q.communication_skill;
        maxSkillValues.communication_skill += 5 * q.communication_skill;
      }
      if (q.leadership_and_collaboration) {
        newSkills.leadership_and_collaboration += answer * q.leadership_and_collaboration;
        maxSkillValues.leadership_and_collaboration += 5 * q.leadership_and_collaboration;
      }
      if (q.frontend_skill) {
        newSkills.frontend_skill += answer * q.frontend_skill;
        maxSkillValues.frontend_skill += 5 * q.frontend_skill;
      }
      if (q.backend_skill) {
        newSkills.backend_skill += answer * q.backend_skill;
        maxSkillValues.backend_skill += 5 * q.backend_skill;
      }
      if (q.infrastructure_skill) {
        newSkills.infrastructure_skill += answer * q.infrastructure_skill;
        maxSkillValues.infrastructure_skill += 5 * q.infrastructure_skill;
      }
      if (q.security_awareness) {
        newSkills.security_awareness += answer * q.security_awareness;
        maxSkillValues.security_awareness += 5 * q.security_awareness;
      }
    });

    // スキル値を正規化してパーセンテージに変換
    Object.keys(newSkills).forEach((skill) => {
      newSkills[skill] = Math.min((newSkills[skill] / maxSkillValues[skill]) * 100, 100);
    });

    setUserSkills(newSkills);
    setIsSubmitted(true);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  const handleReset = () => {
    setAnswers({});
    setUserSkills({
      technical_skill: 1,
      problem_solving_ability: 1,
      communication_skill: 1,
      leadership_and_collaboration: 1,
      frontend_skill: 1,
      backend_skill: 1,
      infrastructure_skill: 1,
      security_awareness: 1,
    });
    setIsSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToProfile = () => {
    if (userId) {
      router.push(`/users/${userId}`);
    } else {
      alert("ユーザーIDが見つかりません。ログインしてください。");
    }
  };

  const saveResults = async () => {
    if (!userId) {
      alert("ユーザーIDが見つかりません。ログインしてください。");
      return;
    }

    setIsSaving(true);
    try {
      const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`);
      if (!userRes.ok) {
        console.error("GETエラー：ステータス", userRes.status);
        throw new Error("ユーザー情報の取得に失敗");
      }
      const userData = await userRes.json();

      const updatedUser = {
        ...userData,
        ...userSkills,
        last_assessment_date: new Date().toISOString(),
      };

      console.log("Updated user data:", updatedUser);

      const updateRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (!updateRes.ok) {
        const errorText = await updateRes.text();
        console.error("PUTリクエスト失敗:", errorText);
        throw new Error("保存失敗");
      }

      alert("スキル診断結果を保存しました！");
      router.push(`/users`);
    } catch (error) {
      console.error(error);
      alert("保存に失敗しました。もう一度お試しください。");
    } finally {
      setIsSaving(false);
    }
  };

  // スキル値に応じた色を設定する関数
  const getSkillColor = (value) => {
    if (value >= 80) return "bg-green-500";
    if (value >= 60) return "bg-blue-500";
    if (value >= 40) return "bg-yellow-500";
    return "bg-gray-400";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">質問を読み込み中...</div>
      </div>
    );
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            エンジニアスキル診断
          </h1>

          {!isSubmitted && (
            <>
              {questions.map((q, index) => (
                <Card
                  key={q.Question_ID}
                  ref={(el) => (questionRefs.current[index] = el)}
                  className="p-6 mb-6"
                >
                  <h2 className="text-xl font-semibold mb-2">質問 {index + 1}</h2>
                  <p className="text-gray-700 mb-4">{q.Text}</p>
                  <RadioGroup
                    value={answers[q.Question_ID] || ""}
                    onValueChange={(value) =>
                      handleAnswer(index, q.Question_ID, value)
                    }
                    className="space-y-4"
                  >
                    {options.map((option) => (
                      <div
                        key={option.value}
                        className={`flex items-center space-x-3 p-2 rounded-lg ${answers[q.Question_ID] === option.value
                            ? "bg-blue-100"
                            : "bg-white"
                          }`}
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`q-${q.Question_ID}-opt-${option.value}`}
                          className={`w-4 h-4 rounded-full border-2 ${answers[q.Question_ID] === option.value
                              ? "border-blue-500"
                              : "border-gray-400"
                            }`}
                        />
                        <Label htmlFor={`q-${q.Question_ID}-opt-${option.value}`}
                          className={`cursor-pointer ${answers[q.Question_ID] === option.value
                              ? "border-blue-600"
                              : "text-gray-700"
                            }`}>
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </Card>
              ))}

              <div className="flex justify-center">
                <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                  診断結果を見る
                </Button>
              </div>
            </>
          )}

          {isSubmitted && (
            <Card ref={resultRef} className="p-6 mt-8">
              <h2 className="text-2xl font-semibold mb-6">診断結果</h2>
              <div className="space-y-6">
                {Object.entries(userSkills).map(([skill, value]) => (
                  <div key={skill}>
                    <div className="flex items-center mb-2">
                      {icons[skill]}
                      <span className="ml-2 font-medium">
                        {
                          {
                            technical_skill: "技術力",
                            problem_solving_ability: "問題解決力",
                            communication_skill: "コミュニケーション",
                            leadership_and_collaboration: "リーダーシップ",
                            frontend_skill: "フロントエンド",
                            backend_skill: "バックエンド",
                            infrastructure_skill: "インフラ",
                            security_awareness: "セキュリティ意識",
                          }[skill]
                        }
                      </span>
                      <span className="ml-auto text-sm text-gray-600">{Math.round(value)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ease-in-out ${getSkillColor(value)}`}
                        style={{
                          width: `${value}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">計算詳細</h3>
                <ul className="space-y-4">
                  {calculationDetails.map((detail, index) => (
                    <li key={index} className="bg-gray-100 p-4 rounded-lg">
                      <p className="font-medium mb-2">{`質問 ${index + 1}: ${detail.question}`}</p>
                      <ul className="list-disc pl-5 space-y-1">
                        {detail.calculations.map((calc, calcIndex) => (
                          <li key={calcIndex} className="text-sm text-gray-700">
                            {calc}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={saveResults}
                  disabled={isSaving}
                  className="flex-1 bg-green-600 hover:bg-green-700 flex items-center justify-center"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      保存中...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      結果を保存
                    </>
                  )}
                </Button>
                <Button
                  onClick={goToProfile}
                  variant="outline"
                  className="flex-1 flex items-center justify-center"
                >
                  <User className="w-4 h-4 mr-2" />
                  プロフィールを見る
                </Button>
              </div>
              <Button onClick={handleReset} variant="ghost" className="mt-4 w-full">
                もう一度診断する
              </Button>
            </Card>
          )}
        </div>
      </div>
    </RequireAuth>
  );
}
