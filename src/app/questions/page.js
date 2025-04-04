"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Brain,
  Code,
  Users,
  Shield,
  Target,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

// アイコンのマップ
const icons = {
  technical_skill: <Code className="w-6 h-6" />,
  problem_solving_ability: <Brain className="w-6 h-6" />,
  communication_skill: <Users className="w-6 h-6" />,
  security_awareness: <Shield className="w-6 h-6" />,
  leadership_and_collaboration: <Target className="w-6 h-6" />,
};

// 選択肢
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [transitionClass, setTransitionClass] = useState("");

  // 質問を取得
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/questions`
        );
        console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }
        const data = await response.json();
        setQuestions(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // 次の質問に進める
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      // アニメーションのためのクラスを追加
      setTransitionClass("slide-out-left");

      // アニメーション完了後に次の質問に移動
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
        setTransitionClass("slide-in-right");

        // 入場アニメーション完了後にクラスをリセット
        setTimeout(() => {
          setTransitionClass("");
        }, 500);
      }, 500);
    } else {
      // 最後の質問の場合は結果表示
      handleSubmit();
    }
  };

  // 前の質問に戻る
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      // アニメーションのためのクラスを追加
      setTransitionClass("slide-out-right");

      // アニメーション完了後に前の質問に移動
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev - 1);
        setTransitionClass("slide-in-left");

        // 入場アニメーション完了後にクラスをリセット
        setTimeout(() => {
          setTransitionClass("");
        }, 500);
      }, 500);
    }
  };

  // 次の質問に進めるかどうかを判断
  const canProceed = (index) => {
    return answers[questions[index]?.Question_ID] !== undefined;
  };

  // 診断結果を計算
  const handleSubmit = () => {
    if (Object.keys(answers).length !== questions.length) {
      alert("すべての質問に回答してください。");
      return;
    }

    const newSkills = { ...userSkills };
    questions.forEach((question) => {
      const answer = parseInt(answers[question.Question_ID]);
      Object.keys(newSkills).forEach((skill) => {
        if (question[skill]) {
          newSkills[skill] *= answer;
        }
      });
    });

    setUserSkills(newSkills);
    setIsSubmitted(true);
  };

  // 診断結果をリセット
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
    setCurrentQuestionIndex(0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">質問を読み込み中...</div>
      </div>
    );
  }

  // 進行度の計算
  const progress =
    questions.length > 0
      ? Math.round((Object.keys(answers).length / questions.length) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          エンジニアスキル診断
        </h1>

        {!isSubmitted ? (
          <>
            {/* 進行度バー */}
            <div className="mb-8">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>0%</span>
                <span>{progress}%</span>
                <span>100%</span>
              </div>
            </div>

            {/* 質問ドット */}
            <div className="flex justify-center mb-6 space-x-1">
              {questions.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full focus:outline-none ${
                    answers[questions[index]?.Question_ID] !== undefined
                      ? "bg-blue-600"
                      : index === currentQuestionIndex
                        ? "bg-blue-300"
                        : "bg-gray-300"
                  }`}
                  onClick={() => {
                    // すでに回答済みか、直前の質問まで回答済みの場合のみジャンプ可能
                    const canJump =
                      index === 0 ||
                      Object.keys(answers).length >= index ||
                      (index > 0 &&
                        answers[questions[index - 1]?.Question_ID] !==
                          undefined);

                    if (canJump) {
                      setCurrentQuestionIndex(index);
                    }
                  }}
                ></button>
              ))}
            </div>

            {/* 質問カード */}
            <div className="relative overflow-hidden">
              {questions[currentQuestionIndex] && (
                <Card
                  key={questions[currentQuestionIndex].Question_ID}
                  className={`p-6 ${transitionClass} transition-all duration-500 ease-in-out`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {icons[Object.keys(icons)[currentQuestionIndex % 5]]}
                      <h2 className="text-xl font-semibold text-gray-800">
                        {questions[currentQuestionIndex].Text}
                      </h2>
                    </div>
                    <span className="text-sm font-medium text-gray-500">
                      {currentQuestionIndex + 1}/{questions.length}
                    </span>
                  </div>
                  <RadioGroup
                    value={answers[questions[currentQuestionIndex].Question_ID]}
                    onValueChange={(value) => {
                      setAnswers((prev) => ({
                        ...prev,
                        [questions[currentQuestionIndex].Question_ID]: value,
                      }));
                    }}
                    className="space-y-3"
                  >
                    {options.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`${questions[currentQuestionIndex].Question_ID}-${option.value}`}
                        />
                        <Label
                          htmlFor={`${questions[currentQuestionIndex].Question_ID}-${option.value}`}
                          className="w-full cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </Card>
              )}
            </div>

            {/* ナビゲーションボタン */}
            <div className="mt-8 flex justify-between">
              <Button
                onClick={handlePrevious}
                variant="outline"
                className="flex items-center gap-2"
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft className="w-4 h-4" />
                前へ
              </Button>

              <Button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                disabled={!canProceed(currentQuestionIndex)}
              >
                {currentQuestionIndex < questions.length - 1 ? (
                  <>
                    次へ
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    診断する
                    <CheckCircle className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <Card className="mt-8 p-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
              診断結果
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">技術力:</span>
                <span className="text-lg">{userSkills.technical_skill}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">問題解決能力:</span>
                <span className="text-lg">
                  {userSkills.problem_solving_ability}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">コミュニケーション能力:</span>
                <span className="text-lg">
                  {userSkills.communication_skill}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">セキュリティ意識:</span>
                <span className="text-lg">{userSkills.security_awareness}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">学習適応能力:</span>
                <span className="text-lg">
                  {userSkills.leadership_and_collaboration}
                </span>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                もう一度診断する
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
