import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Play, 
  RotateCcw, 
  BookOpen, 
  CheckSquare, 
  ArrowRight,
  List,
  Trophy,
  Calculator,
  HelpCircle
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

// --- データ定義 (全7問: 過去問セレクト演習 2-4 キャッシュ・フロー計算書) ---

const problemData = [
  {
    id: 1,
    category: "資金の範囲",
    question: "キャッシュ・フロー計算書が対象とする資金の範囲は、現金及び現金同等物である。現金同等物に含まれる短期投資に該当する最も適切なものの組み合わせを下記の解答群から選べ。なお、ａ〜ｅの資産の運用期間はすべて3か月以内であるとする。\n\nａ 株式\nｂ 株式投資信託\nｃ コマーシャル・ペーパー\nｄ 定期預金\nｅ 普通預金",
    options: [
      "ａ と ｂ",
      "ａ と ｃ",
      "ｂ と ｃ",
      "ｃ と ｄ",
      "ｄ と ｅ"
    ],
    correctAnswer: 3,
    explanation: `
      <p class="font-bold mb-2">正解：エ (ｃ と ｄ)</p>
      <div class="bg-blue-50 p-3 rounded text-sm mb-2">
        <p class="font-bold border-b border-blue-200 mb-1">資金の範囲</p>
        [cite_start]<p><strong>① 現金：</strong> 手許現金、要求払預金（当座、普通、通知預金など）[cite: 354]</p>
        [cite_start]<p><strong>② 現金同等物：</strong> 容易に換金可能で、価値変動リスクが僅少な短期投資（取得日から満期・償還まで<strong>3か月以内</strong>） [cite: 356]</p>
      </div>
      <ul class="text-xs space-y-1">
        [cite_start]<li><strong>ｃ コマーシャル・ペーパー：</strong> 適切。現金同等物の例です [cite: 361]。</li>
        [cite_start]<li><strong>ｄ 定期預金：</strong> 適切。3か月以内であれば該当します [cite: 362]。</li>
        [cite_start]<li>※株式(ａ)や株式投資信託(ｂ)は価格変動リスクが大きいため対象外です [cite: 359, 360]。</li>
        [cite_start]<li>※普通預金(ｅ)は「現金同等物」ではなく「現金」に分類されます [cite: 363]。</li>
      </ul>
    `
  },
  {
    id: 2,
    category: "C/Fの構造",
    question: "キャッシュ･フロー計算書に関する記述として、最も適切なものはどれか。",
    options: [
      "間接法によるキャッシュ･フロー計算書では、棚卸資産の増加額は営業活動によるキャッシュ・フローの増加要因として表示される。",
      "資金の範囲には定期預金は含まれない。",
      "支払利息は、営業活動によるキャッシュ・フローの区分で表示する方法と財務活動によるキャッシュ・フローの区分で表示する方法の2つが認められている。",
      "有形固定資産の売却による収入は、財務活動によるキャッシュ・フローの区分で表示される。"
    ],
    correctAnswer: 2,
    explanation: `
      <p class="font-bold mb-2">正解：ウ</p>
      <ul class="text-sm space-y-2">
        [cite_start]<li><strong>ア ×：</strong> 棚卸資産が増加するとキャッシュは減少するため、減少要因となります [cite: 376]。</li>
        [cite_start]<li><strong>イ ×：</strong> 期間が3ヶ月以内であれば、定期預金も資金の範囲に含まれます [cite: 377]。</li>
        [cite_start]<li class="text-blue-700 font-bold"><strong>ウ ○：</strong> 支払利息は財務活動の区分が一般的ですが、営業活動の区分での表示も認められています [cite: 378]。</li>
        [cite_start]<li><strong>エ ×：</strong> 有形固定資産の売却収入は「投資活動によるキャッシュ・フロー」に区分されます [cite: 379]。</li>
      </ul>
    `
  },
  {
    id: 3,
    category: "キャッシュの増加要因",
    question: "キャッシュ・フローが増加する原因として、最も適切なものはどれか。",
    options: [
      "売掛金の減少",
      "仕入債務の減少",
      "棚卸資産の増加",
      "長期借入金の減少"
    ],
    correctAnswer: 0,
    explanation: `
      <p class="font-bold mb-2">正解：ア</p>
      <p class="text-sm mb-2">資産の減少や負債の増加が、キャッシュの増加につながります。</p>
      <div class="bg-gray-50 p-2 border rounded text-xs space-y-1">
        [cite_start]<p class="text-blue-700 font-bold">ア ○：売掛金(資産)の減少 ＝ 代金を回収したため、現金が増える [cite: 391]。</p>
        [cite_start]<p>イ ×：仕入債務(負債)の減少 ＝ 代金を支払ったため、現金が減る [cite: 392]。</p>
        [cite_start]<p>ウ ×：棚卸資産(資産)の増加 ＝ 商品を仕入れたため、現金が減る [cite: 393]。</p>
        [cite_start]<p>エ ×：長期借入金(負債)の減少 ＝ 借金を返済したため、現金が減る [cite: 394]。</p>
      </div>
    `
  },
  {
    id: 4,
    category: "C/Fの表示",
    question: "キャッシュ・フロー計算書に関する記述として、最も適切なものはどれか。",
    options: [
      "「営業活動によるキャッシュ・フロー」の区分では、主要な取引ごとにキャッシュ・フローを総額表示しなければならない。",
      "受取利息及び受取配当金は、「営業活動によるキャッシュ・フロー」の区分に表示しなければならない。",
      "キャッシュ・フロー計算書の現金及び現金同等物期末残高と、貸借対照表の現金及び預金の期末残高は一致するとは限らない。",
      "法人税等の支払額は、「財務活動によるキャッシュ・フロー」の区分に表示される。"
    ],
    correctAnswer: 2,
    explanation: `
      <p class="font-bold mb-2">正解：ウ</p>
      <ul class="text-sm space-y-2">
        [cite_start]<li><strong>ア ×：</strong> 間接法では主要な取引ごとの表示は行いません [cite: 407]。</li>
        [cite_start]<li><strong>イ ×：</strong> 投資活動の区分に表示する方法も認められています [cite: 408]。</li>
        [cite_start]<li class="text-blue-700 font-bold"><strong>ウ ○：</strong> C/Fは3ヶ月以内、B/Sは1年以内など対象範囲が異なるため、一致するとは限りません [cite: 409]。</li>
        [cite_start]<li><strong>エ ×：</strong> 法人税等の支払額は「営業活動によるキャッシュ・フロー」の小計より下に記載します [cite: 410]。</li>
      </ul>
    `
  },
  {
    id: 5,
    category: "C/Fの3区分",
    question: "キャッシュ・フロー計算書に関する記述として、最も適切なものはどれか。",
    options: [
      "財務活動によるキャッシュ・フローの区分には、資金調達に関する収入や支出、有価証券の取得や売却、および貸し付けに関する収入や支出が表示される。",
      "仕入債務の増加額は、営業活動によるキャッシュ・フローの区分（間接法）において、△（マイナス）を付けて表示される。",
      "法人税等の支払額は、財務活動によるキャッシュ・フローの区分で表示される。",
      "利息および配当金の受取額については、営業活動によるキャッシュ・フローの区分で表示する方法と投資活動によるキャッシュ・フローの区分で表示する方法が認められている。"
    ],
    correctAnswer: 3,
    explanation: `
      <p class="font-bold mb-2">正解：エ</p>
      <ul class="text-sm space-y-1">
        [cite_start]<li><strong>ア ×：</strong> 貸付や有価証券の取得等は「投資活動」に区分されます [cite: 422]。</li>
        [cite_start]<li><strong>イ ×：</strong> 仕入債務（負債）の増加は、キャッシュのプラスとして表示されます [cite: 423]。</li>
        [cite_start]<li><strong>ウ ×：</strong> 法人税支払は「営業活動」の区分です [cite: 424]。</li>
        [cite_start]<li class="text-blue-700 font-bold"><strong>エ ○：</strong> 利息・配当の受取は、第1法(営業)と第2法(投資)の選択が可能です [cite: 425]。</li>
      </ul>
    `
  },
  {
    id: 6,
    category: "資金繰り計算(設問1)",
    question: "資料に基づいて、6月末の資金残高を200万円以上に保つために必要な借入金の額を求めよ。なお、借入時に利息(年利5％)を1年分前払いするものとする。\n\n【6月の収支予測】\n・前月末残高： 470万円\n・収入合計： 1,040万円\n・支出合計： 1,500万円(現金仕入960＋諸経費540)\n・収支過不足： －460万円",
    options: [
      "190万円",
      "200万円",
      "460万円",
      "660万円"
    ],
    correctAnswer: 1,
    explanation: `
      <p class="font-bold mb-2">正解：イ (200万円)</p>
      <div class="bg-blue-50 p-3 rounded text-sm space-y-2">
        <p><strong>1. 借入前の残高を算出：</strong></p>
        [cite_start]<p>470 － 460 ＝ <strong>10万円</strong> [cite: 451, 452]</p>
        <p><strong>2. 必要な借入額(X)の計算：</strong></p>
        [cite_start]<p>残高10 ＋ 借入額X － 利息0.05X ≧ 200 [cite: 454]</p>
        <p>0.95X ≧ 190</p>
        [cite_start]<p class="font-bold text-lg text-blue-700">X ≧ 200万円 [cite: 456, 457]</p>
      </div>
    `
  },
  {
    id: 7,
    category: "資金繰り対策(設問2)",
    question: "中小企業診断士としてA社のアドバイスを求められた。6月末の資金残高を200万円以上に保つための手段として、最も適切なものはどれか。(現状の6月末残高予想は10万円である。)",
    options: [
      "5月に予定されている事務用備品の購入支出のうち半額を現金払いとし、残額の支払いは7月に延期する。",
      "6月に予定されている諸費用支払のうち400万円を現金払いとし、残額の支払いは7月に延期する。",
      "仕入先と交渉して、6月の仕入代金のうち半額を現金払いとし、残額を買掛金(翌月末払い)とする。",
      "得意先と交渉して、5月の売上代金のうち半額を現金で受け取り、残額を売掛金(翌月末回収)とする。"
    ],
    correctAnswer: 2,
    explanation: `
      <p class="font-bold mb-2">正解：ウ</p>
      [cite_start]<p class="text-sm mb-2"><strong>ウ ○：</strong> 6月の現金仕入れ(960万)を半分(480万)に抑えると、支出が480万減ります。結果、6月末残高は 10 ＋ 480 ＝ <strong>490万円</strong> となり、目標を達成できます [cite: 482]。</p>
      <ul class="text-xs text-gray-500 space-y-1">
        [cite_start]<li>ア ×：5月残高は増えますが、6月末は160万にしかならず不足します [cite: 480]。</li>
        [cite_start]<li>イ ×：支出が140万減りますが、6月末は150万となり不足します [cite: 481]。</li>
        [cite_start]<li>エ ×：5月の現金売上は増えますが、その分6月の売掛金回収が減るため、6月末は10万のままで改善されません [cite: 483]。</li>
      </ul>
    `
  }
];

// --- コンポーネント実装 ---

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('menu'); 
  const [quizMode, setQuizMode] = useState('all'); 
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [userAnswers, setUserAnswers] = useState({}); 
  const [reviewFlags, setReviewFlags] = useState({}); 
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const savedAnswers = JSON.parse(localStorage.getItem('past_exam_2_4_answers')) || {};
    const savedReviews = JSON.parse(localStorage.getItem('past_exam_2_4_reviews')) || {};
    setUserAnswers(savedAnswers);
    setReviewFlags(savedReviews);
  }, []);

  useEffect(() => {
    localStorage.setItem('past_exam_2_4_answers', JSON.stringify(userAnswers));
    localStorage.setItem('past_exam_2_4_reviews', JSON.stringify(reviewFlags));
  }, [userAnswers, reviewFlags]);

  const startQuiz = (mode) => {
    let targets = [];
    if (mode === 'all') {
      targets = problemData;
    } else if (mode === 'wrong') {
      targets = problemData.filter(p => userAnswers[p.id] && !userAnswers[p.id].isCorrect);
    } else if (mode === 'review') {
      targets = problemData.filter(p => reviewFlags[p.id]);
    }

    if (targets.length === 0) {
      alert("対象となる問題がありません。");
      return;
    }

    setQuizMode(mode);
    setFilteredProblems(targets);
    setCurrentProblemIndex(0);
    setShowExplanation(false);
    setSelectedOption(null);
    setCurrentScreen('quiz');
  };

  const handleAnswer = (optionIndex) => {
    setSelectedOption(optionIndex);
    const problem = filteredProblems[currentProblemIndex];
    const isCorrect = optionIndex === problem.correctAnswer;
    
    setUserAnswers(prev => ({
      ...prev,
      [problem.id]: { answerIndex: optionIndex, isCorrect: isCorrect }
    }));
    setShowExplanation(true);
  };

  const nextProblem = () => {
    if (currentProblemIndex < filteredProblems.length - 1) {
      setCurrentProblemIndex(prev => prev + 1);
      setShowExplanation(false);
      setSelectedOption(null);
    } else {
      setCurrentScreen('result');
    }
  };

  const toggleReview = (problemId) => {
    setReviewFlags(prev => ({ ...prev, [problemId]: !prev[problemId] }));
  };

  const stats = useMemo(() => {
    const total = problemData.length;
    const correctCount = Object.values(userAnswers).filter(a => a.isCorrect).length;
    const reviewCount = Object.values(reviewFlags).filter(Boolean).length;
    return { total, correctCount, reviewCount };
  }, [userAnswers, reviewFlags]);

  if (currentScreen === 'menu') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 p-4 font-sans">
        <div className="max-w-xl mx-auto space-y-6">
          <header className="text-center py-8">
            <div className="inline-block bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">
              財務・会計
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-2">
              <Calculator className="w-7 h-7 text-blue-600" /> 過去問セレクト 2-4
            </h1>
            <p className="text-slate-400 text-xs mt-1">キャッシュ・フロー計算書 集中演習</p>
          </header>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
            <h2 className="text-sm font-black mb-4 w-full flex items-center gap-2 text-slate-600">
              <Trophy className="w-4 h-4 text-yellow-500" /> 学習進捗
            </h2>
            <div className="w-44 h-44 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: '正解', value: stats.correctCount, color: '#2563eb' },
                      { name: '未クリア', value: stats.total - stats.correctCount, color: '#f1f5f9' },
                    ]}
                    cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value" stroke="none"
                  >
                    <Cell fill="#2563eb" />
                    <Cell fill="#f1f5f9" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-800">{Math.round((stats.correctCount/stats.total)*100)}%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center mt-4 w-full border-t border-slate-50 pt-4">
              <div>
                <p className="text-xl font-black text-blue-600">{stats.correctCount}<span className="text-xs text-slate-300">/{stats.total}</span></p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Solved</p>
              </div>
              <div>
                <p className="text-xl font-black text-orange-500">{stats.reviewCount}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Review</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <button onClick={() => startQuiz('all')} className="flex items-center justify-between p-6 bg-slate-900 text-white rounded-3xl shadow-xl hover:bg-black transition active:scale-95">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-2 rounded-xl"><Play className="w-5 h-5" /></div>
                <div className="text-left"><div className="font-black">全問題を解く</div><div className="text-[10px] opacity-50 font-bold">過去問セレクト 全7問</div></div>
              </div>
              <ArrowRight className="w-5 h-5" />
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => startQuiz('wrong')} className="p-4 bg-white border border-slate-100 text-red-600 rounded-3xl font-black text-xs flex flex-col items-center gap-2 hover:bg-red-50 transition active:scale-95">
                <RotateCcw className="w-4 h-4" /> 間違えた問題
              </button>
              <button onClick={() => startQuiz('review')} className="p-4 bg-white border border-slate-100 text-orange-600 rounded-3xl font-black text-xs flex flex-col items-center gap-2 hover:bg-orange-50 transition active:scale-95">
                <CheckSquare className="w-4 h-4" /> 復習リスト
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'quiz') {
    const problem = filteredProblems[currentProblemIndex];
    const progress = ((currentProblemIndex + 1) / filteredProblems.length) * 100;

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 font-sans">
        <div className="sticky top-0 bg-white/90 backdrop-blur-md z-10 border-b border-slate-100">
          <div className="h-1 bg-slate-100"><div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progress}%` }}></div></div>
          <div className="flex items-center justify-between p-4 max-w-2xl mx-auto">
            <button onClick={() => setCurrentScreen('menu')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quit</button>
            <div className="font-black text-slate-700 text-sm">Q.{currentProblemIndex + 1} <span className="text-slate-300">/</span> {filteredProblems.length}</div>
            <div className="text-[10px] font-black px-2 py-1 bg-blue-50 rounded text-blue-600 uppercase tracking-wider">{problem.category}</div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <p className="text-md font-bold leading-relaxed whitespace-pre-wrap">{problem.question}</p>
          </div>

          <div className="grid gap-3">
            {problem.options.map((opt, idx) => {
              let btnClass = "p-5 text-left rounded-3xl border-2 transition-all flex items-center gap-4 text-sm ";
              if (showExplanation) {
                if (idx === problem.correctAnswer) btnClass += "bg-green-50 border-green-500 text-green-700 font-bold";
                else if (idx === selectedOption) btnClass += "bg-red-50 border-red-500 text-red-700 opacity-70";
                else btnClass += "bg-white border-transparent opacity-30 shadow-none";
              } else {
                btnClass += "bg-white border-transparent shadow-sm hover:border-slate-200 active:scale-[0.98] font-medium";
              }
              return (
                <button key={idx} disabled={showExplanation} onClick={() => handleAnswer(idx)} className={btnClass}>
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${showExplanation && idx === problem.correctAnswer ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {['ア','イ','ウ','エ','オ'][idx]}
                  </span>
                  <span className="flex-1">{opt}</span>
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="space-y-4 animate-in zoom-in-95 duration-300">
              <div className={`p-6 rounded-3xl border shadow-sm ${selectedOption === problem.correctAnswer ? 'bg-white border-green-100' : 'bg-white border-red-100'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-1.5 rounded-full ${selectedOption === problem.correctAnswer ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                    {selectedOption === problem.correctAnswer ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  </div>
                  <div className={`text-lg font-black ${selectedOption === problem.correctAnswer ? 'text-green-700' : 'text-red-700'}`}>
                    {selectedOption === problem.correctAnswer ? '正解です！' : '残念...'}
                  </div>
                </div>
                <div className="text-sm leading-relaxed text-slate-600 bg-slate-50/50 p-4 rounded-2xl border border-slate-50" dangerouslySetInnerHTML={{ __html: problem.explanation }} />
                
                <label className="flex items-center gap-3 mt-4 p-3 bg-white border border-orange-50 rounded-2xl cursor-pointer shadow-sm">
                  <input type="checkbox" checked={!!reviewFlags[problem.id]} onChange={() => toggleReview(problem.id)} className="w-4 h-4 rounded border-slate-200 text-orange-500 focus:ring-orange-500" />
                  <span className="text-xs font-black text-slate-500">この問題を復習リストに追加</span>
                </label>
              </div>

              <button onClick={nextProblem} className="w-full p-6 bg-slate-900 text-white font-black rounded-3xl shadow-xl flex items-center justify-center gap-3 hover:bg-black transition active:scale-95">
                {currentProblemIndex === filteredProblems.length - 1 ? '結果を見る' : '次の問題へ'} <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentScreen === 'result') {
    const sessionCorrect = filteredProblems.filter(p => userAnswers[p.id]?.isCorrect).length;
    const score = Math.round((sessionCorrect / filteredProblems.length) * 100);

    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-white">
        <div className="max-w-md w-full space-y-8 text-center animate-in zoom-in-90 duration-500">
          <div className="relative inline-block">
            <div className="w-28 h-28 bg-yellow-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(234,179,8,0.2)]">
              <Trophy className="w-14 h-14 text-slate-900" />
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-black tracking-tighter mb-2 italic uppercase">Finish!</h2>
            <div className="text-7xl font-black mb-4 tracking-tighter text-yellow-500">{score}<span className="text-3xl font-bold text-white ml-1">%</span></div>
            <p className="text-slate-400 font-black tracking-widest uppercase text-xs">Score: {sessionCorrect} / {filteredProblems.length}</p>
          </div>

          <button onClick={() => setCurrentScreen('menu')} className="w-full p-6 bg-white text-slate-900 font-black rounded-3xl shadow-xl hover:bg-slate-100 transition active:scale-95">
            メニューに戻る
          </button>
        </div>
      </div>
    );
  }

  return null;
}