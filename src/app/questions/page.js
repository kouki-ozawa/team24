// "use client";

// import { useState, useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import RequireAuth from "@/components/RequireAuth";
// import { useRouter } from "next/navigation";
// import {
//   Brain,
//   Code,
//   Users,
//   Shield,
//   Target,
//   ArrowRight,
//   ArrowLeft,
//   CheckCircle,
//   Save,
//   User,
// } from "lucide-react";

// // アイコンのマップ
// const icons = {
//   technical_skill: <Code className="w-6 h-6" />,
//   problem_solving_ability: <Brain className="w-6 h-6" />,
//   communication_skill: <Users className="w-6 h-6" />,
//   security_awareness: <Shield className="w-6 h-6" />,
//   leadership_and_collaboration: <Target className="w-6 h-6" />,
// };
// const questionRefs = useRef([]);
// // 選択肢
// const options = [
//   { value: "1", label: "基礎レベル" },
//   { value: "2", label: "初級レベル" },
//   { value: "3", label: "中級レベル" },
//   { value: "4", label: "上級レベル" },
//   { value: "5", label: "エキスパートレベル" },
// ];

// export default function Home() {
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [userSkills, setUserSkills] = useState({
//     technical_skill: 1,
//     problem_solving_ability: 1,
//     communication_skill: 1,
//     security_awareness: 1,
//     leadership_and_collaboration: 1,
//   });
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [transitionClass, setTransitionClass] = useState("");
//   const router = useRouter();
//   const [userId, setUserId] = useState(null);

//   // ユーザーIDを取得
//   useEffect(() => {
//     const storedUserId = localStorage.getItem("userId");
//     setUserId(storedUserId);
//   }, []);

//   // 質問を取得
//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/questions`
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch questions");
//         }
//         const data = await response.json();
//         setQuestions(data);
//         setIsLoading(false);
//       } catch (error) {
//         console.error("Error fetching questions:", error);
//         setIsLoading(false);
//       }
//     };

//     fetchQuestions();
//   }, []);

//   // 次の質問に進める
//   const handleNext = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       // アニメーションのためのクラスを追加
//       setTransitionClass("slide-out-left");

//       // アニメーション完了後に次の質問に移動
//       setTimeout(() => {
//         setCurrentQuestionIndex((prev) => prev + 1);
//         setTransitionClass("slide-in-right");

//         // 入場アニメーション完了後にクラスをリセット
//         setTimeout(() => {
//           setTransitionClass("");
//         }, 500);
//       }, 500);
//     } else {
//       // 最後の質問の場合は結果表示
//       handleSubmit();
//     }
//   };

//   // 前の質問に戻る
//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       // アニメーションのためのクラスを追加
//       setTransitionClass("slide-out-right");

//       // アニメーション完了後に前の質問に移動
//       setTimeout(() => {
//         setCurrentQuestionIndex((prev) => prev - 1);
//         setTransitionClass("slide-in-left");

//         // 入場アニメーション完了後にクラスをリセット
//         setTimeout(() => {
//           setTransitionClass("");
//         }, 500);
//       }, 500);
//     }
//   };

//   // 次の質問に進めるかどうかを判断
//   const canProceed = (index) => {
//     return answers[questions[index]?.Question_ID] !== undefined;
//   };

//   // 診断結果を計算
//   const handleSubmit = () => {
//     if (Object.keys(answers).length !== questions.length) {
//       alert("すべての質問に回答してください。");
//       return;
//     }

//     const newSkills = { ...userSkills };
//     questions.forEach((question) => {
//       const answer = parseInt(answers[question.Question_ID]);
//       Object.keys(newSkills).forEach((skill) => {
//         if (question[skill]) {
//           newSkills[skill] *= answer;
//         }
//       });
//     });

//     setUserSkills(newSkills);
//     setIsSubmitted(true);
//   };

//   // 診断結果をリセット
//   const handleReset = () => {
//     setAnswers({});
//     setUserSkills({
//       technical_skill: 1,
//       problem_solving_ability: 1,
//       communication_skill: 1,
//       security_awareness: 1,
//       leadership_and_collaboration: 1,
//     });
//     setIsSubmitted(false);
//     setCurrentQuestionIndex(0);
//   };

//   // ユーザープロフィールページに移動
//   const goToProfile = () => {
//     if (userId) {
//       router.push(`/users/${userId}`);
//     } else {
//       alert("ユーザーIDが見つかりません。ログインしてください。");
//     }
//   };

//   // 診断結果をサーバーに保存
//   const saveResults = async () => {
//     if (!userId) {
//       alert("ユーザーIDが見つかりません。ログインしてください。");
//       return;
//     }

//     setIsSaving(true);

//     try {
//       // ユーザー情報を取得して更新するアプローチ
//       const userResponse = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/user/${userId}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!userResponse.ok) {
//         throw new Error("ユーザー情報の取得に失敗しました");
//       }

//       const userData = await userResponse.json();

//       // スキル評価データを更新
//       const updatedUserData = {
//         ...userData,
//         technical_skill: userSkills.technical_skill,
//         problem_solving_ability: userSkills.problem_solving_ability,
//         communication_skill: userSkills.communication_skill,
//         leadership_and_collaboration: userSkills.leadership_and_collaboration,
//         security_awareness: userSkills.security_awareness,
//         // 診断完了時刻を追加
//         last_assessment_date: new Date().toISOString(),
//       };

//       // ユーザー情報を更新
//       const updateResponse = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/user/${userId}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(updatedUserData),
//         }
//       );

//       if (!updateResponse.ok) {
//         throw new Error("スキル診断結果の保存に失敗しました");
//       }

//       alert("スキル診断結果が保存されました");

//       // ユーザープロフィールページにリダイレクト
//       router.push(`/users/${userId}`);
//     } catch (error) {
//       console.error("保存エラー:", error);
//       alert("結果の保存中にエラーが発生しました。もう一度お試しください。");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-xl font-semibold">質問を読み込み中...</div>
//       </div>
//     );
//   }

//   // 進行度の計算
//   const progress =
//     questions.length > 0
//       ? Math.round((Object.keys(answers).length / questions.length) * 100)
//       : 0;

//   const content = (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto">
//         <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
//           エンジニアスキル診断
//         </h1>
//         {!isSubmitted ? (
//           <>
//             {/* 進行度バー */}
//             <div className="mb-8">
//               <div className="w-full bg-gray-200 rounded-full h-2.5">
//                 <div
//                   className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
//                   style={{ width: `${progress}%` }}
//                 ></div>
//               </div>
//               <div className="flex justify-between mt-2 text-sm text-gray-500">
//                 <span>0%</span>
//                 <span>{progress}%</span>
//                 <span>100%</span>
//               </div>
//             </div>

//             {/* 質問をすべて縦に表示 */}
//             <div className="space-y-6 mb-6">
//               {questions.map((question, index) => (
//                 <Card
//                   key={question.Question_ID}
//                   className="p-6"
//                   ref={(el) => (questionRefs.current[index] = el)} // 👈 ここ
//                 >
//                   <h2 className="text-xl font-semibold mb-2">質問 {index + 1}</h2>
//                   <p className="text-gray-700 mb-4">{question.Text}</p>
//                   <RadioGroup
//                     value={answers[question.Question_ID] || ""}
//                     onValueChange={(value) => {
//                       // 回答を保存
//                       setAnswers((prev) => ({
//                         ...prev,
//                         [question.Question_ID]: value,
//                       }));

//                       // 少し待って次の質問へスクロール
//                       setTimeout(() => {
//                         const nextRef = questionRefs.current[index + 1];
//                         if (nextRef) {
//                           nextRef.scrollIntoView({ behavior: "smooth", block: "start" });
//                         }
//                       }, 200); // ちょっと待ってからスクロール（視覚的にスムーズ）
//                     }}
//                     className="space-y-4"
//                   >
//                     {options.map((option) => (
//                       <div key={option.value} className="flex items-center space-x-3">
//                         <RadioGroupItem
//                           value={option.value}
//                           id={`option-${question.Question_ID}-${option.value}`}
//                         />
//                         <Label htmlFor={`option-${question.Question_ID}-${option.value}`}>
//                           {option.label}
//                         </Label>
//                       </div>
//                     ))}
//                   </RadioGroup>
//                 </Card>
//               ))}

//               {/* {questions.map((question, index) => (
//                 <Card key={question.Question_ID} className="p-6">
//                   <h2 className="text-xl font-semibold mb-2">
//                     質問 {index + 1}
//                   </h2>
//                   <p className="text-gray-700 mb-4">{question.Text}</p>
//                   <RadioGroup
//                     value={answers[question.Question_ID] || ""}
//                     onValueChange={(value) => {
//                       setAnswers((prev) => ({
//                         ...prev,
//                         [question.Question_ID]: value,
//                       }));
//                     }}
//                     className="space-y-4"
//                   >
//                     {options.map((option) => (
//                       <div key={option.value} className="flex items-center space-x-3">
//                         <RadioGroupItem
//                           value={option.value}
//                           id={`option-${question.Question_ID}-${option.value}`}
//                         />
//                         <Label htmlFor={`option-${question.Question_ID}-${option.value}`}>
//                           {option.label}
//                         </Label>
//                       </div>
//                     ))}
//                   </RadioGroup>
//                 </Card>
//               ))} */}
//             </div>

//             {/* 診断ボタン */}
//             <div className="flex justify-center">
//               <Button
//                 onClick={handleSubmit}
//                 disabled={Object.keys(answers).length !== questions.length}
//                 className="bg-blue-600 hover:bg-blue-700 flex items-center"
//               >
//                 診断結果を見る
//                 <CheckCircle className="w-4 h-4 ml-2" />
//               </Button>
//             </div>
//           </>
//         ) : (
//           <Card className="p-6">
//             <h2 className="text-2xl font-semibold mb-6">診断結果</h2>
//             <div className="space-y-6">
//               {Object.entries(userSkills).map(([skill, value]) => (
//                 <div key={skill}>
//                   <div className="flex items-center mb-2">
//                     {icons[skill]}
//                     <span className="ml-2 font-medium">
//                       {skill
//                         .split("_")
//                         .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//                         .join(" ")}
//                     </span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-2.5">
//                     <div
//                       className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
//                       style={{ width: `${(value / 5) * 100}%` }}
//                     ></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-6 flex flex-col sm:flex-row gap-4">
//               <Button
//                 onClick={saveResults}
//                 disabled={isSaving}
//                 className="flex-1 bg-green-600 hover:bg-green-700 flex items-center justify-center"
//               >
//                 {isSaving ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                     保存中...
//                   </>
//                 ) : (
//                   <>
//                     <Save className="w-4 h-4 mr-2" />
//                     結果を保存
//                   </>
//                 )}
//               </Button>
//               <Button
//                 onClick={goToProfile}
//                 variant="outline"
//                 className="flex-1 flex items-center justify-center"
//               >
//                 <User className="w-4 h-4 mr-2" />
//                 プロフィールを見る
//               </Button>
//             </div>
//             <Button
//               onClick={handleReset}
//               variant="ghost"
//               className="mt-4 w-full"
//             >
//               もう一度診断する
//             </Button>
//           </Card>
//         )}
//       </div>
//     </div>
//   );

//   return <RequireAuth>{content}</RequireAuth>;
// }
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
                      <div key={option.value} className="flex items-center space-x-3">
                        <RadioGroupItem
                          value={option.value}
                          id={`q-${q.Question_ID}-opt-${option.value}`}
                        />
                        <Label htmlFor={`q-${q.Question_ID}-opt-${option.value}`}>
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
                        style={{ width: `${(value / 5) * 100}%` }}
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
