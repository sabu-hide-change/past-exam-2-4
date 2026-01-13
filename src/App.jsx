/**
 * 依存関係のインストールコマンド:
 * npm install lucide-react recharts
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  AlertCircle, 
  Bookmark, 
  RotateCcw, 
  List, 
  BookOpen,
  ArrowRight,
  ClipboardList,
  Check
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

// --- クイズデータ定義 (過去問セレクト演習2-4 全7問) ---
const QUIZ_DATA = [
  {
    id: 1,
    year: "平成25年 第4問",
    title: "資金の範囲",
    question: "キャッシュ・フロー計算書が対象とする資金の範囲は、現金及び現金同等物である。現金同等物に含まれる短期投資に該当する最も適切なものの組み合わせを下記の解答群から選べ。なお、ａ〜ｅの資産の運用期間はすべて3か月以内であるとする。",
    subText: "ａ 株式 / ｂ 株式投資信託 / ｃ コマーシャル・ペーパー / ｄ 定期預金 / ｅ 普通預金",
    options: ["ａとｂ", "ａとｃ", "ｂとｃ", "ｃとｄ", "ｄとｅ"],
    answer: 3,
    explanation: "【解答：エ】資金の範囲は「現金及び現金同等物」です。現金同等物は、容易に換金可能で価値変動リスクが僅少な短期投資を指します。ｃ（CP）とｄ（3ヶ月以内の定期預金）は該当しますが、株式や株式投資信託はリスクが僅少とはいえないため含まれません。"
  },
  {
    id: 2,
    year: "令和5年 第9問",
    title: "キャッシュ･フロー計算書の構造",
    question: "キャッシュ･フロー計算書に関する記述として、最も適切なものはどれか。",
    options: [
      "間接法では、棚卸資産の増加額は営業活動によるキャッシュ・フローの増加要因として表示される。",
      "資金の範囲には定期預金は含まれない。",
      "支払利息は、営業活動による区分と財務活動による区分の2つが認められている。",
      "有形固定資産の売却による収入は、財務活動によるキャッシュ・フローの区分で表示される。"
    ],
    answer: 2,
    explanation: "【解答：ウ】支払利息は原則として財務活動ですが、営業活動の区分で表示する方法も認められています。ア：棚卸資産増加はキャッシュ減少要因です。イ：3ヶ月以内の定期預金は含まれます。エ：資産売却は投資活動です。"
  },
  {
    id: 3,
    year: "令和3年 第9問",
    title: "キャッシュ・フローの増加",
    question: "キャッシュ・フローが増加する原因として、最も適切なものはどれか。",
    options: ["売掛金の減少", "仕入債務の減少", "棚卸資産の増加", "長期借入金の減少"],
    answer: 0,
    hasBsTable: true,
    explanation: "【解答：ア】売掛金が減少するということは、代金を回収したことを意味するため、現金が増加します。資産（左側）の減少、または負債（右側）の増加がキャッシュのプラス要因となります。"
  },
  {
    id: 4,
    year: "令和2年 第13問",
    title: "キャッシュ・フロー計算書",
    question: "キャッシュ・フロー計算書に関する記述として、最も適切なものはどれか。",
    options: [
      "営業活動CFの区分では、主要な取引ごとにキャッシュ・フローを総額表示しなければならない。",
      "受取利息及び受取配当金は、必ず営業活動の区分に表示しなければならない。",
      "C/Fの現金等期末残高と、B/Sの現金及び預金の期末残高は一致するとは限らない。",
      "法人税等の支払額は、財務活動によるキャッシュ・フローの区分に表示される。"
    ],
    answer: 2,
    explanation: "【解答：ウ】C/Fの資金（3ヶ月以内）とB/Sの現金預金（1年以内）では対象範囲が異なるため、一致しないことがあります。エ：法人税等は営業活動CFの小計より下です。"
  },
  {
    id: 5,
    year: "平成30年 第12問",
    title: "営業キャッシュ・フローの計算",
    question: "キャッシュ・フロー計算書に関する記述として、最も適切なものはどれか。",
    options: [
      "財務活動CFには、有価証券の取得や貸し付けに関する収入や支出が表示される。",
      "仕入債務の増加額は、間接法の営業活動CFにおいて△（マイナス）で表示される。",
      "法人税等の支払額は、財務活動によるキャッシュ・フローの区分で表示される。",
      "利息および配当金の受取額については、営業活動CFと投資活動CFのいずれの区分でも認められている。"
    ],
    answer: 3,
    explanation: "【解答：エ】利息・配当金の受取は営業活動（第1法）または投資活動（第2法）で表示可能です。ア：有価証券等は投資活動です。イ：仕入債務の増加はプラス項目です。"
  },
  {
    id: 6,
    year: "令和4年 第13問(設問1)",
    title: "資金繰り (設問1)",
    question: "以下の資金繰り表に基づき、6月末の資金残高を200万円以上に保つための必要借入額を求めよ。利息は年率5％で借入時に1年分を支払うものとする。",
    hasCfTable: true,
    options: ["190万円", "200万円", "460万円", "660万円"],
    answer: 1,
    explanation: "【解答：イ】6月の不足額は460万円ですが、5月末残高470万円を考慮すると借入前の6月末残高は10万円。目標200万円に対し不足は190万円。利息5%を差し引いて190万円残る額Xは、0.95X = 190より X = 200万円です。"
  },
  {
    id: 7,
    year: "令和4年 第13問(設問2)",
    title: "資金繰り (設問2)",
    question: "6月末の資金残高を200万円以上に保つための「銀行借り入れ以外の手段」として、最も適切なものはどれか。",
    options: [
      "5月の備品購入支出のうち半額を現金払いとし、残額を7月に延期する。",
      "6月の諸費用支払のうち400万円を現金払いとし、残額を7月に延期する。",
      "6月の仕入代金のうち半額を現金払いとし、残額を買掛金(翌月末払い)とする。",
      "5月の売上代金のうち半額を現金で受け取り、残額を売掛金とする。"
    ],
    answer: 2,
    explanation: "【解答：ウ】6月の現金仕入れ予定額は960万円（7月売上1600×0.6）。その半額480万円を延期すれば、6月末残高は10(当初)+480 = 490万円となり目標を達成します。"
  }
];

// --- 防衛的コンポーネント ---

export default function App() {
  const [screen, setScreen] = useState('home'); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); 
  const [reviews, setReviews] = useState([]); 
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizList, setQuizList] = useState([]);

  // 初期化と保存
  useEffect(() => {
    console.log("App Mounting...");
    try {
      const savedAns = localStorage.getItem('app_ans_v24');
      const savedRev = localStorage.getItem('app_rev_v24');
      if (savedAns) setUserAnswers(JSON.parse(savedAns));
      if (savedRev) setReviews(JSON.parse(savedRev));
    } catch (e) { console.error("Storage load error", e); }
  }, []);

  useEffect(() => {
    localStorage.setItem('app_ans_v24', JSON.stringify(userAnswers));
    localStorage.setItem('app_rev_v24', JSON.stringify(reviews));
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

  const statsData = useMemo(() => {
    const correct = Object.values(userAnswers).filter(a => a.isCorrect).length;
    const wrong = Object.keys(userAnswers).length - correct;
    const remaining = QUIZ_DATA.length - Object.keys(userAnswers).length;
    return [
      { name: '正解', value: correct, color: '#3b82f6' },
      { name: '不正解', value: wrong, color: '#f87171' },
      { name: '未解答', value: remaining, color: '#e2e8f0' }
    ];
  }, [userAnswers]);

  // レンダリング・ガード
  const currentQuiz = quizList[currentIndex] || null;

  // --- UI Parts ---

  const BSTable = () => (
    <div className="my-6 border-2 border-slate-300 rounded-lg overflow-hidden text-[10px] sm:text-xs font-bold bg-white max-w-sm mx-auto shadow-sm">
      <div className="grid grid-cols-2">
        <div className="border-r border-b p-2 bg-emerald-50">流動資産</div>
        <div className="border-b p-2 bg-rose-50">流動負債</div>
        <div className="border-r border-b p-2 pl-4 bg-orange-50 text-orange-700">現金</div>
        <div className="border-b p-2 pl-4 bg-rose-50/30">仕入債務</div>
        <div className="border-r border-b p-2 pl-4 bg-emerald-50/30">売掛金</div>
        <div className="border-b p-2 bg-rose-50">固定負債</div>
        <div className="border-r border-b p-2 pl-4 bg-emerald-50/30">棚卸資産</div>
        <div className="border-b p-2 pl-4 bg-rose-50/30 text-[8px]">長期借入金</div>
        <div className="border-r p-2 bg-emerald-50">固定資産</div>
        <div className="p-2 bg-slate-100 border-t">純資産</div>
      </div>
    </div>
  );

  const CFPlanTable = () => (
    <div className="my-6 overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-[10px] text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr><th colSpan="3" className="p-2 border-r border-slate-200">資金繰り表（抜粋）</th><th className="p-2 text-center border-r border-slate-200">5月</th><th className="p-2 text-center">6月</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          <tr><td colSpan="3" className="p-2 border-r border-slate-200">前月末残高</td><td className="p-2 text-center border-r border-slate-200 font-bold">1,000</td><td className="p-2 text-center font-bold">470</td></tr>
          <tr className="bg-blue-50/20">
            <td className="p-2 border-r border-slate-200 font-black text-blue-600 bg-blue-50 w-6 text-center" style={{writingMode: 'vertical-rl'}}>経常収支</td>
            <td className="p-2 border-r border-slate-200 font-medium">収入合計</td><td className="p-2 border-r border-slate-200"></td>
            <td className="p-2 text-center border-r border-slate-200">1,000</td><td className="p-2 text-center">1,040</td>
          </tr>
          <tr>
            <td className="border-r border-slate-200"></td>
            <td className="p-2 border-r border-slate-200 font-medium">支出</td><td className="p-2 border-r border-slate-200 text-slate-400">現金仕入等</td>
            <td className="p-2 text-center border-r border-slate-200 font-bold italic text-slate-400">省略</td><td className="p-2 text-center font-black text-blue-500">( ? )</td>
          </tr>
          <tr className="bg-slate-100 font-black">
            <td colSpan="3" className="p-2 border-r border-slate-200">収支過不足</td><td className="p-2 text-center border-r border-slate-200">-230</td><td className="p-2 text-center text-blue-600">( ? )</td>
          </tr>
          <tr className="bg-blue-600 text-white font-black">
            <td colSpan="3" className="p-2">当月末残高</td><td className="p-2 text-center">470</td><td className="p-2 text-center">( ? )</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  // --- Screens ---

  if (screen === 'home') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <header className="bg-blue-600 p-8 text-white text-center shadow-lg rounded-b-[2.5rem]">
          <h1 className="text-2xl font-black mb-1">キャッシュフロー計算書</h1>
          <p className="text-[10px] uppercase font-bold opacity-75 tracking-widest">Master Edition 2.4</p>
        </header>

        <main className="p-4 sm:p-8 max-w-2xl mx-auto w-full flex-1">
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-white mb-8">
            <div className="h-[200px] w-full">
              <ResponsiveContainer>
                <BarChart data={statsData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {statsData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-4">
            <button onClick={() => startMode('all')} className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black flex items-center justify-between shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all">
              <div className="flex items-center gap-4"><BookOpen size={24} /> <span className="text-lg text-left">すべての問題に挑戦<br/><span className="text-[10px] font-bold opacity-60">全7問の学習を開始</span></span></div>
              <ChevronRight />
            </button>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => startMode('incorrect')} className="bg-white text-rose-500 border-2 border-rose-100 p-4 rounded-2xl font-black flex flex-col items-center hover:bg-rose-50 active:scale-95 transition-all shadow-sm">
                <XCircle size={24} className="mb-1" /> 不正解のみ
              </button>
              <button onClick={() => startMode('review')} className="bg-white text-amber-500 border-2 border-amber-100 p-4 rounded-2xl font-black flex flex-col items-center hover:bg-amber-50 active:scale-95 transition-all shadow-sm">
                <Bookmark size={24} className="mb-1" /> 要復習
              </button>
            </div>
            <button onClick={() => setScreen('list')} className="w-full text-slate-400 p-4 font-black flex items-center justify-center gap-2 hover:text-blue-600 transition-all text-sm uppercase tracking-tighter">
              <ClipboardList size={18} /> 問題リストと履歴
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (screen === 'list') {
    return (
      <div className="min-h-screen bg-slate-50 p-6 max-w-2xl mx-auto w-full">
        <button onClick={() => setScreen('home')} className="mb-6 flex items-center text-slate-500 font-bold active:scale-95"><ChevronLeft /> 戻る</button>
        <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><List className="text-blue-600" /> 問題一覧</h2>
        <div className="space-y-3">
          {QUIZ_DATA.map((q, i) => (
            <div key={q.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between border border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-slate-300 w-4">{i + 1}</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-700">{q.title}</h4>
                  <div className="flex gap-2 mt-0.5">
                    {userAnswers[q.id] && (userAnswers[q.id].isCorrect ? <CheckCircle size={12} className="text-blue-500"/> : <XCircle size={12} className="text-red-400"/>)}
                    {reviews.includes(q.id) && <Bookmark size={12} className="text-amber-400 fill-amber-400"/>}
                  </div>
                </div>
              </div>
              <button onClick={() => { setQuizList([q]); setCurrentIndex(0); setIsAnswered(false); setScreen('quiz'); }} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><ArrowRight size={16}/></button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (screen === 'quiz' && currentQuiz) {
    const userAns = userAnswers[currentQuiz.id];
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <div className="bg-white p-4 sticky top-0 z-20 flex items-center justify-between shadow-sm">
          <button onClick={() => setScreen('home')} className="text-slate-300 p-1 active:scale-90"><Home size={20}/></button>
          <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black">{currentIndex + 1} / {quizList.length}</div>
          <div className="w-6"/>
        </div>

        <main className="p-4 sm:p-6 max-w-xl mx-auto w-full flex-1">
          <div className="bg-white rounded-[2rem] shadow-xl p-6 sm:p-8 border border-white">
            <span className="bg-slate-800 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase mb-2 inline-block">{currentQuiz.year}</span>
            <h3 className="text-lg font-black text-slate-800 leading-snug mb-4">{currentQuiz.question}</h3>
            
            {currentQuiz.subText && <div className="p-4 bg-slate-50 rounded-xl mb-4 text-xs font-bold text-slate-500 border border-slate-100 whitespace-pre-wrap leading-relaxed">{currentQuiz.subText}</div>}
            {currentQuiz.hasBsTable && <BSTable />}
            {currentQuiz.hasCfTable && <CFPlanTable />}

            <div className="space-y-3 mt-6">
              {currentQuiz.options.map((opt, idx) => {
                let colorClass = "border-slate-100 bg-white";
                if (isAnswered) {
                  if (idx === currentQuiz.answer) colorClass = "border-blue-500 bg-blue-50 text-blue-700 shadow-md ring-1 ring-blue-500";
                  else if (userAns?.choice === idx) colorClass = "border-rose-300 bg-rose-50 text-rose-600";
                  else colorClass = "opacity-40 grayscale border-slate-50";
                }
                return (
                  <button key={idx} onClick={() => !isAnswered && handleSelect(idx)} className={`w-full text-left p-4 rounded-xl border-2 font-bold text-sm transition-all flex items-center ${colorClass}`}>
                    <span className="flex-1">{opt}</span>
                    {isAnswered && idx === currentQuiz.answer && <Check size={16} className="text-blue-500"/>}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="mt-8 animate-in fade-in slide-in-from-bottom-2">
                <div className={`p-4 rounded-2xl mb-4 border ${userAns?.isCorrect ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                  <h4 className="font-black flex items-center gap-2 mb-1">{userAns?.isCorrect ? <CheckCircle size={18}/> : <AlertCircle size={18}/>} {userAns?.isCorrect ? '正解！' : '不正解です'}</h4>
                  <p className="text-[11px] font-bold opacity-80 leading-relaxed whitespace-pre-wrap">{currentQuiz.explanation}</p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => {
                    const id = currentQuiz.id;
                    setReviews(prev => prev.includes(id) ? prev.filter(i=>i!==id) : [...prev, id]);
                  }} className={`flex-1 p-3 rounded-xl font-black text-[10px] border-2 flex items-center justify-center gap-2 transition-all ${reviews.includes(currentQuiz.id) ? 'bg-amber-100 border-amber-200 text-amber-600' : 'bg-white border-slate-100 text-slate-400'}`}>
                    <Bookmark size={14} fill={reviews.includes(currentQuiz.id) ? "currentColor" : "none"}/> 要復習
                  </button>
                  <button onClick={() => {
                    if (currentIndex < quizList.length - 1) { setCurrentIndex(i=>i+1); setIsAnswered(false); }
                    else { setScreen('home'); }
                  }} className="flex-[2] bg-slate-900 text-white p-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
                    {currentIndex < quizList.length - 1 ? '次へ' : 'メニューへ戻る'} <ChevronRight size={14}/>
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return null;
}