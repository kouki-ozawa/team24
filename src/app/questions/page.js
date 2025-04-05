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
} from "lucide-react";

const icons = {
  technical_skill: <Code className="w-6 h-6" />,
  problem_solving_ability: <Brain className="w-6 h-6" />,
  communication_skill: <Users className="w-6 h-6" />,
  security_awareness: <Shield className="w-6 h-6" />,
  leadership_and_collaboration: <Target className="w-6 h-6" />,
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
  const [userSkills, setUserSkills] = useState({
    technical_skill: 1,
    problem_solving_ability: 1,
    communication_skill: 1,
    security_awareness: 1,
    leadership_and_collaboration: 1,
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

    const newSkills = { ...userSkills };
    questions.forEach((q) => {
      const answer = parseInt(answers[q.Question_ID]);
      Object.keys(newSkills).forEach((skill) => {
        if (q[skill]) {
          newSkills[skill] *= answer;
        }
      });
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
      security_awareness: 1,
      leadership_and_collaboration: 1,
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
      const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${userId}`);
      if (!userRes.ok) throw new Error("ユーザー情報の取得に失敗");
      const userData = await userRes.json();

      const updatedUser = {
        ...userData,
        ...userSkills,
        last_assessment_date: new Date().toISOString(),
      };

      const updateRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (!updateRes.ok) throw new Error("保存失敗");
      alert("スキル診断結果を保存しました！");
      router.push(`/users/${userId}`);
    } catch (error) {
      console.error(error);
      alert("保存に失敗しました。もう一度お試しください。");
    } finally {
      setIsSaving(false);
    }
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
                      <span className="ml-2 font-medium capitalize">
                        {skill.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                        style={{
                          width: `${Math.min(Math.max(Number(value), 0), 5) / 5 * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
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
