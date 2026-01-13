/**
 * 依存関係のインストール:
 * npm install lucide-react recharts
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Bookmark, 
  List, 
  RotateCcw, 
  AlertCircle,
  BarChart3,
  Check,
  Search,
  HelpCircle,
  ArrowRight,
  ClipboardList
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

// --- クイズデータ定義 ---
const QUIZ_DATA = [
  {
    id: 1,
    year: "平成25年 第4問",
    title: "資金の範囲",
    question: "キャッシュ・フロー計算書が対象とする資金の範囲は、現金及び現金同等物である。現金同等物に含まれる短期投資に該当する最も適切なものの組み合わせを下記の解答群から選べ。なお、ａ〜ｅの資産の運用期間はすべて3か月以内であるとする。",
    subInfo: "ａ：株式\nｂ：株式投資信託\nｃ：コマーシャル・ペーパー\nｄ：定期預金\nｅ：普通預金",
    options: ["ａとｂ", "ａとｃ", "ｂとｃ", "ｃとｄ", "ｄとｅ"],
    answer: 3, // エ
    explanation: "キャッシュ・フロー計算書が対象とする資金の範囲は「現金及び現金同等物」です [cite: 20]。現金同等物は、容易に換金可能で価値変動リスクが僅少な短期投資を指します [cite: 23]。\n● ｃ（コマーシャル・ペーパー）とｄ（定期預金）は現金同等物の例です [cite: 28, 29]。\n● ａ（株式）やｂ（株式投資信託）はリスクが僅少とはいえないため含まれません [cite: 26, 27]。\n● ｅ（普通預金）は「現金」に該当します [cite: 30]。"
  },
  {
    id: 2,
    year: "令和5年 第9問",
    title: "キャッシュ･フロー計算書の構造",
    question: "キャッシュ･フロー計算書に関する記述として、最も適切なものはどれか。",
    options: [
      "間接法によるキャッシュ･フロー計算書では、棚卸資産の増加額は営業活動によるキャッシュ・フローの増加要因として表示される。",
      "資金の範囲には定期預金は含まれない。",
      "支払利息は、営業活動によるキャッシュ・フローの区分で表示する方法と財務活動によるキャッシュ・フローの区分で表示する方法の2つが認められている。",
      "有形固定資産の売却による収入は、財務活動によるキャッシュ・フローの区分で表示される。"
    ],
    answer: 2, // ウ
    explanation: "ウが適切です。一般的に支払利息は財務活動ですが、営業活動の区分で表示する方法も認められています [cite: 45]。\n● ア：棚卸資産の増加はキャッシュの減少要因です [cite: 43]。\n● イ：期間が3ヶ月以内の定期預金は資金の範囲に含まれます [cite: 44]。\n● エ：有形固定資産の売却は投資活動に区分されます [cite: 46]。"
  },
  {
    id: 3,
    year: "令和3年 第9問",
    title: "キャッシュ・フローの増加",
    question: "キャッシュ・フローが増加する原因として、最も適切なものはどれか。",
    options: ["売掛金の減少", "仕入債務の減少", "棚卸資産の増加", "長期借入金の減少"],
    answer: 0, // ア
    hasTable: true,
    tableType: "bs_increase",
    explanation: "売掛金が減少すると、代金を回収したことになりキャッシュが増加します [cite: 58]。\n● 仕入債務の減少、棚卸資産の増加、長期借入金の減少は、いずれもキャッシュの減少要因となります [cite: 59, 60, 61]。"
  },
  {
    id: 4,
    year: "令和2年 第13問",
    title: "キャッシュ・フロー計算書",
    question: "キャッシュ・フロー計算書に関する記述として、最も適切なものはどれか。",
    options: [
      "「営業活動によるキャッシュ・フロー」の区分では、主要な取引ごとにキャッシュ・フローを総額表示しなければならない。",
      "受取利息及び受取配当金は、「営業活動によるキャッシュ・フロー」の区分に表示しなければならない。",
      "キャッシュ・フロー計算書の現金及び現金同等物期末残高と、貸借対照表の現金及び預金の期末残高は一致するとは限らない。",
      "法人税等の支払額は、「財務活動によるキャッシュ・フロー」の区分に表示される。"
    ],
    answer: 2, // ウ
    explanation: "ウが適切です。C/Fの現金同等物は「3ヶ月以内」、B/Sの現金及び預金は「1年以内」の定期預金が含まれるため、対象範囲が異なり一致しないことがあります [cite: 76]。\n● ア：間接法では取引ごとの表示は行いません [cite: 74]。\n● イ：投資活動の区分に表示する方法も認められています [cite: 75]。\n● エ：法人税等の支払は営業活動の区分です [cite: 77]。"
  },
  {
    id: 5,
    year: "平成30年 第12問",
    title: "営業キャッシュ・フローの計算",
    question: "キャッシュ・フロー計算書に関する記述として、最も適切なものはどれか。",
    options: [
      "財務活動によるキャッシュ・フローの区分には、資金調達に関する収入や支出、有価証券の取得や売却、および貸し付けに関する収入や支出が表示される。",
      "仕入債務の増加額は、営業活動によるキャッシュ・フローの区分（間接法）において、△（マイナス）を付けて表示される。",
      "法人税等の支払額は、財務活動によるキャッシュ・フローの区分で表示される。",
      "利息および配当金の受取額については、営業活動によるキャッシュ・フローの区分で表示する方法と投資活動によるキャッシュ・フローの区分で表示する方法が認められている。"
    ],
    answer: 3, // エ
    explanation: "エが適切です。利息および配当金の受取額は、営業活動（第1法）または投資活動（第2法）のいずれでも表示可能です [cite: 92]。\n● ア：有価証券や貸付は投資活動です [cite: 89]。\n● イ：仕入債務の増加はキャッシュのプラスとして表示されます [cite: 90]。\n● ウ：法人税等は営業活動CFです [cite: 91]。"
  },
  {
    id: 6,
    year: "令和4年 第13問(設問1)",
    title: "資金繰り(設問1)",
    question: "A社ではX1年4月末に以下の資金繰り表を作成した。6月末の資金残高を200万円以上に保つための必要借入額を求めよ。なお、利息は年率5％で借入時に1年分を支払うものとする。",
    hasTable: true,
    tableType: "cash_flow_plan",
    options: ["190万円", "200万円", "460万円", "660万円"],
    answer: 1, // イ
    explanation: "計算過程 [cite: 118, 120-123]：\n1. 6月の仕入支出 = 1,600 × 0.6 = 960\n2. 6月支出合計 = 960 + 540 = 1,500\n3. 6月収支不足 = 1,040 - 1,500 = -460\n4. 借入前残高 = 470 - 460 = 10\n5. 借入額Xとすると：10 + X - 0.05X ≧ 200 → 0.95X ≧ 190 → X ≧ 200万円。"
  },
  {
    id: 7,
    year: "令和4年 第13問(設問2)",
    title: "資金繰り(設問2)",
    question: "6月末の時点で資金残高が200万円を下回らないようにするための「銀行借り入れ以外の手段」として最も適切なものはどれか。",
    options: [
      "5月に予定されている事務用備品の購入支出のうち半額を現金払いとし、残額の支払いは7月に延期する。",
      "6月に予定されている諸費用支払のうち400万円を現金払いとし、残額の支払いは7月に延期する。",
      "仕入先と交渉して、6月の仕入代金のうち半額を現金払いとし、残額を買掛金(翌月末払い)とする。",
      "得意先と交渉して、5月の売上代金のうち半額を現金で受け取り、残額を売掛金(翌月末回収)とする。"
    ],
    answer: 2, // ウ
    explanation: "ウが適切です。6月の現金仕入（960万円）の半額（480万円）を延期することで、6月末残高は490万円（10+480）となり200万円を達成します [cite: 149]。\n● ア、イ、エの対策ではいずれも6月末残高が200万円を下回ります [cite: 147, 148, 150]。"
  }
];

// --- サブコンポーネント ---

const ErrorFallback = ({ onReset }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
    <h1 className="text-xl font-bold text-slate-800 mb-2">エラーが発生しました</h1>
    <p className="text-slate-500 mb-6">アプリを正常に読み込めませんでした。</p>
    <button onClick={onReset} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all">
      データを初期化してリロード
    </button>
  </div>
);

const BSStructureTable = () => (
  <div className="my-6 border-2 border-slate-300 rounded-xl overflow-hidden max-w-md mx-auto shadow-sm">
    <div className="grid grid-cols-2 bg-white text-xs sm:text-sm font-bold">
      <div className="border-r border-b p-3 bg-emerald-50 text-emerald-800">流動資産</div>
      <div className="border-b p-3 bg-rose-50 text-rose-800">流動負債</div>
      <div className="border-r border-b p-3 bg-orange-50 text-orange-900 pl-6">現金</div>
      <div className="border-b p-3 bg-rose-50/50 pl-6">仕入債務</div>
      <div className="border-r border-b p-3 bg-emerald-50/50 pl-6">売掛金</div>
      <div className="border-b p-3 bg-rose-50 text-rose-800">固定負債</div>
      <div className="border-r border-b p-3 bg-emerald-50/50 pl-6">棚卸資産</div>
      <div className="border-b p-3 bg-rose-50/50 pl-6">長期借入金</div>
      <div className="border-r p-3 bg-emerald-50 text-emerald-800">固定資産</div>
      <div className="p-3 bg-slate-100 text-slate-800 border-t">純資産</div>
    </div>
  </div>
);

const CashFlowPlanTable = () => (
  <div className="my-6 overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
    <table className="w-full text-[10px] sm:text-xs text-left border-collapse">
      <thead>
        <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
          <th colSpan="3" className="p-2 font-bold border-r border-slate-200">資金繰り表（一部）</th>
          <th className="p-2 text-center border-r border-slate-200">5月</th>
          <th className="p-2 text-center">6月</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        <tr><td colSpan="3" className="p-2 border-r border-slate-200">前月末残高</td><td className="p-2 text-center border-r border-slate-200">1,000</td><td className="p-2 text-center">470</td></tr>
        <tr className="bg-blue-50/30">
          <td rowSpan="3" className="p-2 border-r border-slate-200 font-bold bg-blue-50 w-8 text-center uppercase tracking-tighter" style={{writingMode: 'vertical-rl'}}>経常収支</td>
          <td rowSpan="2" className="p-2 border-r border-slate-200 font-medium">収入</td>
          <td className="p-2 border-r border-slate-200">売掛金回収等</td><td className="p-2 text-center border-r border-slate-200 text-slate-400 italic">省略</td><td className="p-2 text-center text-slate-400 italic">省略</td>
        </tr>
        <tr className="bg-blue-50/30">
          <td className="p-2 border-r border-slate-200 font-bold">収入合計</td><td className="p-2 text-center border-r border-slate-200 font-bold">1,000</td><td className="p-2 text-center font-bold">1,040</td>
        </tr>
        <tr>
          <td className="p-2 border-r border-slate-200 font-medium">支出</td>
          <td className="p-2 border-r border-slate-200">現金仕入</td><td className="p-2 text-center border-r border-slate-200">720</td><td className="p-2 text-center font-bold text-blue-600">(  )</td>
        </tr>
        <tr className="bg-slate-50 font-bold border-t border-slate-200">
          <td colSpan="3" className="p-2 border-r border-slate-200">支出合計</td><td className="p-2 text-center border-r border-slate-200">1,230</td><td className="p-2 text-center font-bold text-blue-600">(  )</td>
        </tr>
        <tr><td colSpan="3" className="p-2 border-r border-slate-200">収支過不足</td><td className="p-2 text-center border-r border-slate-200">-230</td><td className="p-2 text-center font-bold text-blue-600">(  )</td></tr>
        <tr className="bg-blue-600 text-white font-black"><td colSpan="3" className="p-2">当月末残高</td><td className="p-2 text-center">470</td><td className="p-2 text-center">(  )</td></tr>
      </tbody>
    </table>
  </div>
);

// --- メインアプリケーション ---

export default function App() {
  const [screen, setScreen] = useState('home'); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); 
  const [reviews, setReviews] = useState([]); 
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizList, setQuizList] = useState([]);
  const [error, setError] = useState(false);

  // 初回データ読み込み
  useEffect(() => {
    console.log("App Initializing...");
    try {
      const savedResults = localStorage.getItem('accounting_quiz_v2_results');
      const savedReviews = localStorage.getItem('accounting_quiz_v2_reviews');
      if (savedResults) setUserAnswers(JSON.parse(savedResults));
      if (savedReviews) setReviews(JSON.parse(savedReviews));
    } catch (e) {
      console.error("Local Storage Load Error", e);
    }
  }, []);

  // 保存
  useEffect(() => {
    localStorage.setItem('accounting_quiz_v2_results', JSON.stringify(userAnswers));
    localStorage.setItem('accounting_quiz_v2_reviews', JSON.stringify(reviews));
  }, [userAnswers, reviews]);

  const startMode = (mode) => {
    console.log(`Starting Mode: ${mode}`);
    let list = [];
    if (mode === 'all') list = [...QUIZ_DATA];
    if (mode === 'incorrect') list = QUIZ_DATA.filter(q => userAnswers[q.id] && !userAnswers[q.id].isCorrect);
    if (mode === 'review') list = QUIZ_DATA.filter(q => reviews.includes(q.id));

    if (list.length === 0) {
      alert("該当する問題がありません。");
      return;
    }
    setQuizList(list);
    setCurrentIndex(0);
    setIsAnswered(false);
    setScreen('quiz');
  };

  const currentQuiz = quizList[currentIndex] || null;

  const handleSelect = (idx) => {
    if (isAnswered || !currentQuiz) return;
    const isCorrect = idx === currentQuiz.answer;
    setUserAnswers(prev => ({ ...prev, [currentQuiz.id]: { choice: idx, isCorrect } }));
    setIsAnswered(true);
  };

  const chartData = useMemo(() => {
    const total = QUIZ_DATA.length;
    const correct = Object.values(userAnswers).filter(a => a.isCorrect).length;
    const attempted = Object.keys(userAnswers).length;
    return [
      { name: '正解', value: correct, color: '#3b82f6' },
      { name: '不正解', value: attempted - correct, color: '#f87171' },
      { name: '未実施', value: total - attempted, color: '#e2e8f0' }
    ];
  }, [userAnswers]);

  if (error) return <ErrorFallback onReset={() => { localStorage.clear(); window.location.reload(); }} />;

  // --- Screens ---

  if (screen === 'home') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 pb-10">
        <header className="bg-blue-600 p-8 text-white text-center shadow-lg rounded-b-[3rem]">
          <h1 className="text-3xl font-black tracking-tighter mb-1">過去問マスター 2-4</h1>
          <p className="text-xs uppercase tracking-widest font-bold opacity-80">Cash Flow Statement Quiz</p>
        </header>

        <main className="p-4 sm:p-8 max-w-4xl mx-auto w-full -mt-4">
          <div className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-blue-100 flex flex-col md:flex-row items-center gap-8 mb-8">
            <div className="w-full md:w-1/2 h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} />
                  <RechartsTooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {chartData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl font-black text-slate-800 mb-2">学習の進捗</h2>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-4">
                キャッシュフロー計算書の全7問を収録しています。正解率を高めて試験に備えましょう。
              </p>
              <button onClick={() => setScreen('list')} className="text-blue-600 font-bold text-sm flex items-center gap-2 hover:underline">
                <ClipboardList size={18} /> 全問題の履歴を見る
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button onClick={() => startMode('all')} className="bg-blue-600 text-white p-6 rounded-3xl font-black flex items-center justify-between shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all">
              <div className="flex items-center gap-4"><BookOpen size={28} /> <span className="text-lg">最初から開始</span></div>
              <ChevronRight />
            </button>
            <button onClick={() => startMode('incorrect')} disabled={chartData[1].value === 0} className="bg-rose-50 text-rose-600 p-6 rounded-3xl font-black border-2 border-rose-100 flex items-center justify-between shadow-sm hover:bg-rose-100 active:scale-95 disabled:opacity-30 disabled:grayscale transition-all">
              <div className="flex items-center gap-4"><XCircle size={28} /> <span className="text-lg">不正解を解く</span></div>
              <span className="bg-rose-200 text-rose-700 px-3 py-1 rounded-full text-xs">{chartData[1].value}</span>
            </button>
            <button onClick={() => startMode('review')} disabled={reviews.length === 0} className="bg-amber-50 text-amber-600 p-6 rounded-3xl font-black border-2 border-amber-100 flex items-center justify-between shadow-sm hover:bg-amber-100 active:scale-95 disabled:opacity-30 disabled:grayscale transition-all sm:col-span-2">
              <div className="flex items-center gap-4"><Bookmark size={28} /> <span className="text-lg">要復習リスト ({reviews.length}問)</span></div>
              <ChevronRight />
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (screen === 'list') {
    return (
      <div className="min-h-screen bg-slate-50 p-6 max-w-4xl mx-auto w-full">
        <button onClick={() => setScreen('home')} className="flex items-center text-slate-500 font-bold mb-6 hover:text-blue-600 transition-colors">
          <ChevronLeft /> メニューに戻る
        </button>
        <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
          <ClipboardList className="text-blue-600" /> 問題一覧・履歴
        </h2>
        <div className="space-y-3">
          {QUIZ_DATA.map((q, i) => {
            const ans = userAnswers[q.id];
            return (
              <div key={q.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center font-black">{i + 1}</div>
                  <div>
                    <h4 className="font-bold text-slate-700">{q.title}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{q.year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {ans && (ans.isCorrect ? <CheckCircle2 className="text-blue-500" /> : <XCircle className="text-red-500" />)}
                  {reviews.includes(q.id) && <Bookmark className="text-amber-500 fill-amber-500" size={20} />}
                  <button onClick={() => { setQuizList([q]); setCurrentIndex(0); setIsAnswered(false); setScreen('quiz'); }} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-colors">
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (screen === 'quiz' && currentQuiz) {
    const userAnswer = userAnswers[currentQuiz.id];
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-10">
        <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-20 flex items-center justify-between shadow-sm">
          <button onClick={() => setScreen('home')} className="text-slate-400 p-2"><Home size={24} /></button>
          <div className="text-center">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Progress</p>
            <p className="text-sm font-bold text-slate-700">{currentIndex + 1} / {quizList.length}</p>
          </div>
          <div className="w-10" />
        </header>

        <main className="p-4 sm:p-8 max-w-3xl mx-auto w-full flex-1">
          <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-white">
            <div className="h-2 bg-slate-100">
              <div className="h-full bg-blue-500 transition-all duration-700" style={{ width: `${((currentIndex + 1) / quizList.length) * 100}%` }} />
            </div>

            <div className="p-8 sm:p-12">
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-slate-800 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter">{currentQuiz.year}</span>
                  <span className="text-blue-500 text-[10px] font-black uppercase tracking-widest">{currentQuiz.title}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-800 leading-snug mb-6 whitespace-pre-wrap">{currentQuiz.question}</h3>
                {currentQuiz.subInfo && (
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-slate-600 font-bold text-sm leading-relaxed mb-6">
                    {currentQuiz.subInfo.split('\n').map((line, k) => <p key={k}>{line}</p>)}
                  </div>
                )}
                {currentQuiz.hasTable && currentQuiz.tableType === 'bs_increase' && <BSStructureTable />}
                {currentQuiz.hasTable && currentQuiz.tableType === 'cash_flow_plan' && <CashFlowPlanTable />}
              </div>

              <div className="space-y-4">
                {currentQuiz.options.map((opt, idx) => {
                  let borderClass = "border-slate-100 hover:border-blue-200 bg-white";
                  let textClass = "text-slate-700";
                  let icon = <div className="w-6 h-6 rounded-full border-2 border-slate-200 mr-4" />;

                  if (isAnswered) {
                    if (idx === currentQuiz.answer) {
                      borderClass = "border-blue-500 bg-blue-50 ring-2 ring-blue-200 shadow-lg";
                      textClass = "text-blue-900 font-black";
                      icon = <CheckCircle2 className="text-blue-600 mr-4" />;
                    } else if (userAnswer?.choice === idx) {
                      borderClass = "border-rose-400 bg-rose-50 shadow-md";
                      textClass = "text-rose-700 font-black";
                      icon = <XCircle className="text-rose-500 mr-4" />;
                    } else {
                      borderClass = "border-slate-50 bg-slate-50 opacity-40";
                    }
                  }

                  return (
                    <button key={idx} onClick={() => handleSelect(idx)} className={`w-full text-left p-6 rounded-[2rem] border-4 transition-all flex items-center active:scale-[0.98] ${borderClass}`}>
                      {icon}
                      <span className={`flex-1 text-lg ${textClass}`}>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="mt-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                  <div className={`p-8 rounded-[2.5rem] mb-8 border-4 shadow-xl flex items-start gap-6 ${userAnswer?.isCorrect ? 'bg-blue-50 border-blue-200' : 'bg-rose-50 border-rose-200'}`}>
                    <div className="mt-1">
                      {userAnswer?.isCorrect ? <CheckCircle2 size={40} className="text-blue-600" /> : <XCircle size={40} className="text-rose-600" />}
                    </div>
                    <div>
                      <h4 className={`text-2xl font-black mb-1 ${userAnswer?.isCorrect ? 'text-blue-800' : 'text-rose-800'}`}>
                        {userAnswer?.isCorrect ? '正解！素晴らしい。' : '不正解です'}
                      </h4>
                      <p className="text-sm font-bold opacity-70">正解：{currentQuiz.options[currentQuiz.answer]}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 relative">
                    <div className="flex items-center gap-2 mb-6 text-blue-600 font-black text-xs uppercase tracking-widest italic">
                      <HelpCircle size={20} /> Explanation
                    </div>
                    <p className="text-slate-600 text-base font-bold leading-relaxed whitespace-pre-wrap border-l-4 border-blue-400 pl-6 py-2">
                      {currentQuiz.explanation}
                    </p>

                    <div className="mt-10 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-6">
                      <button 
                        onClick={() => toggleReview(currentQuiz.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all border-4 w-full sm:w-auto justify-center active:scale-95 ${reviews.includes(currentQuiz.id) ? 'bg-amber-100 border-amber-400 text-amber-600' : 'bg-white border-slate-100 text-slate-400 hover:border-amber-200 hover:text-amber-500'}`}
                      >
                        <Bookmark fill={reviews.includes(currentQuiz.id) ? "currentColor" : "none"} /> <span>Review List</span>
                      </button>
                      <button onClick={() => {
                        if (currentIndex < quizList.length - 1) {
                          setCurrentIndex(prev => prev + 1);
                          setIsAnswered(false);
                        } else {
                          setScreen('home');
                        }
                      }} className="flex-1 w-full bg-slate-900 text-white p-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 hover:bg-blue-600 shadow-2xl transition-all active:scale-95">
                        {currentIndex < quizList.length - 1 ? '次の問題へ' : '結果を見る'} <ChevronRight size={28} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
}