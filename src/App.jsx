/**
 * 依存関係のインストールコマンド:
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

// --- クイズデータ定義 ---
const QUIZ_DATA = [
  {
    id: 1,
    year: "平成25年",
    number: "第4問",
    title: "資金の範囲",
    question: "キャッシュ・フロー計算書が対象とする資金の範囲は、現金及び現金同等物である。現金同等物に含まれる短期投資に該当する最も適切なものの組み合わせを下記の解答群から選べ。なお、ａ〜ｅの資産の運用期間はすべて3か月以内であるとする。\n\nａ　株式\nｂ　株式投資信託\nｃ　コマーシャル・ペーパー\nｄ　定期預金\nｅ　普通預金",
    options: ["ａとｂ", "ａとｃ", "ｂとｃ", "ｃとｄ", "ｄとｅ"],
    answer: 3,
    explanation: "キャッシュ・フロー計算書が対象とする資金の範囲は、「現金及び現金同等物」です。\n① 現金：手許現金、要求払預金（当座預金、普通預金、通知預金など）\n② 現金同等物：容易に換金可能であり、かつ、価値の変動について僅少なリスクしか負わない短期投資（取得日から3ヶ月以内の定期預金、CP、公社債投資信託など）\n\n記述ａ（株式）およびｂ（株式投資信託）は、価値の変動リスクが僅少とはいえないため、現金同等物には含まれません。記述ｅ（普通預金）は「現金」に該当し、「現金同等物」ではありません。"
  },
  {
    id: 2,
    year: "令和5年",
    number: "第9問",
    title: "キャッシュ･フロー計算書の構造",
    question: "キャッシュ･フロー計算書に関する記述として、最も適切なものはどれか。",
    options: [
      "間接法によるキャッシュ･フロー計算書では、棚卸資産の増加額は営業活動によるキャッシュ・フローの増加要因として表示される。",
      "資金の範囲には定期預金は含まれない。",
      "支払利息は、営業活動によるキャッシュ・フローの区分で表示する方法と財務活動によるキャッシュ・フローの区分で表示する方法の2つが認められている。",
      "有形固定資産の売却による収入は、財務活動によるキャッシュ・フローの区分で表示される。"
    ],
    answer: 2,
    explanation: "ア：不適切。棚卸資産が増加した場合はキャッシュが減少するため、営業CFの減少要因となります。\nイ：不適切。取得日から3ヶ月以内の定期預金は現金同等物に含まれます。\nウ：適切。支払利息は、原則として財務活動ですが、営業活動に含める方法も認められています。\nエ：不適切。有形固定資産の売却は「投資活動によるキャッシュ・フロー」です。"
  },
  {
    id: 3,
    year: "令和3年",
    number: "第9問",
    title: "キャッシュ・フローの増加",
    question: "キャッシュ・フローが増加する原因として、最も適切なものはどれか。",
    options: ["売掛金の減少", "仕入債務の減少", "棚卸資産の増加", "長期借入金の減少"],
    answer: 0,
    isBsStructure: true,
    explanation: "売掛金が減少するということは、代金を回収して現金が増えたことを意味します。貸借対照表の左側（資産）が減ると現金が増え、右側（負債・純資産）が増えると現金が増えるという構造を理解しましょう。"
  },
  {
    id: 4,
    year: "令和2年",
    number: "第13問",
    title: "キャッシュ・フロー計算書",
    question: "キャッシュ・フロー計算書に関する記述として、最も適切なものはどれか。",
    options: [
      "「営業活動によるキャッシュ・フロー」の区分では、主要な取引ごとにキャッシュ・フローを総額表示しなければならない。",
      "受取利息及び受取配当金は、「営業活動によるキャッシュ・フロー」の区分に表示しなければならない。",
      "キャッシュ・フロー計算書の現金及び現金同等物期末残高と、貸借対照表の現金及び預金の期末残高は一致するとは限らない。",
      "法人税等の支払額は、「財務活動によるキャッシュ・フロー」の区分に表示される。"
    ],
    answer: 2,
    explanation: "ア：不適切。間接法では総額表示は行いません。\nイ：不適切。投資活動CFに表示する方法も認められています。\nウ：適切。C/Fの現金同等物は「3ヶ月以内」、B/Sの現金預金は「1年以内」の定期預金を含むため、範囲が異なり一致しないことがあります。\nエ：不適切。法人税等は「営業活動によるキャッシュ・フロー」の小計の下に記載されます。"
  },
  {
    id: 5,
    year: "平成30年",
    number: "第12問",
    title: "営業キャッシュ・フローの計算",
    question: "キャッシュ・フロー計算書に関する記述として、最も適切なものはどれか。",
    options: [
      "財務活動によるキャッシュ・フローの区分には、資金調達に関する収入や支出、有価証券の取得や売却、および貸し付けに関する収入や支出が表示される。",
      "仕入債務の増加額は、営業活動によるキャッシュ・フローの区分（間接法）において、△（マイナス）を付けて表示される。",
      "法人税等の支払額は、財務活動によるキャッシュ・フローの区分で表示される。",
      "利息および配当金の受取額については、営業活動によるキャッシュ・フローの区分で表示する方法と投資活動によるキャッシュ・フローの区分で表示する方法が認められている。"
    ],
    answer: 3,
    explanation: "ア：不適切。有価証券や貸し付けは「投資活動CF」です。\nイ：不適切。仕入債務の増加は「支払を待ってもらっている＝資金が手元に残る」ためプラス表示です。\nウ：不適切。営業活動CFの区分です。\nエ：適切。利息・配当金の受取は営業活動と投資活動のいずれでも表示可能です。"
  },
  {
    id: 6,
    year: "令和4年",
    number: "第13問(設問1)",
    title: "資金繰り (設問1)",
    question: "A社ではX1年4月末に作成した資金繰り表に基づき、6月末時点で資金残高が200万円を下回らないようにするための必要借入額を検討している。以下の表と条件に基づき、いくら借り入れればよいか。なお、借入金の利息は年利率5％で、1年分の利息を借入時に支払うものとする。\n\n【条件】\n①売上代金の20％は現金受取、残額は翌月末。\n②仕入高は翌月予想売上高の60％、全額現金支払。\n③収入・支出は月末発生。\n④資金残高は200万円を下回らないこと。",
    isSpecialTable: true,
    options: ["190万円", "200万円", "460万円", "660万円"],
    answer: 1,
    explanation: "6月の現金仕入 = 7月予想売上1600 × 60% = 960万円\n6月支出合計 = 960 + 540(諸経費) = 1,500万円\n6月収支過不足 = 1,040(収入計) - 1,500 = -460万円\n6月当月残高(借入前) = 5月末470 - 460 = 10万円\n借入額をXとすると：10 + X - 0.05X ≧ 200 \n0.95X ≧ 190 \nX ≧ 200万円"
  },
  {
    id: 7,
    year: "令和4年",
    number: "第13問(設問2)",
    title: "資金繰り (設問2)",
    question: "中小企業診断士として、銀行借り入れ以外の手段で、6月末の資金残高を200万円以上に保つためのアドバイスとして最も適切なものはどれか。",
    options: [
      "5月に予定されている事務用備品の購入支出のうち半額を現金払いとし、残額の支払いは7月に延期する。",
      "6月に予定されている諸費用支払のうち400万円を現金払いとし、残額の支払いは7月に延期する。",
      "仕入先と交渉して、6月の仕入代金のうち半額を現金払いとし、残額を買掛金(翌月末払い)とする。",
      "得意先と交渉して、5月の売上代金のうち半額を現金で受け取り、残額を売掛金(翌月末回収)とする。"
    ],
    answer: 2,
    explanation: "ウが適切です。6月の現金仕入れ予定額は960万円であり、その半額(480万円)を翌月払いにすることで、6月の現金支出が480万円減少します。これにより6月末残高は10 + 480 = 490万円となり、目標を達成します。"
  }
];

// --- スタイル定義 ---
const styles = {
  card: "bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden",
  buttonPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50",
  buttonSecondary: "bg-white hover:bg-blue-50 text-blue-600 border-2 border-blue-600 font-bold py-3 px-6 rounded-xl transition-all active:scale-95",
  optionButton: (isSelected, isCorrect, isWrong) => `
    w-full text-left p-4 rounded-xl border-2 transition-all mb-3 flex items-center justify-between
    ${isSelected ? 'scale-[0.98]' : 'hover:border-blue-300 hover:bg-blue-50'}
    ${isCorrect ? 'border-green-500 bg-green-50 text-green-700' : 
      isWrong ? 'border-red-500 bg-red-50 text-red-700' : 
      'border-slate-200 bg-white text-slate-700'}
  `
};

export default function App() {
  const [screen, setScreen] = useState('home'); // home, list, quiz, result
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { id: { answer, isCorrect } }
  const [reviewList, setReviewList] = useState([]); // Array of IDs
  const [isAnswered, setIsAnswered] = useState(false);
  const [filter, setFilter] = useState('all'); // all, incorrect, review
  const [shuffledQuizzes, setShuffledQuizzes] = useState([]);

  // 永続化の読み込み
  useEffect(() => {
    console.log("初期データを読み込み中...");
    const savedResults = localStorage.getItem('accounting_quiz_v2_4_results');
    const savedReviews = localStorage.getItem('accounting_quiz_v2_4_reviews');
    if (savedResults) setUserAnswers(JSON.parse(savedResults));
    if (savedReviews) setReviewList(JSON.parse(savedReviews));
  }, []);

  // 永続化の保存
  useEffect(() => {
    localStorage.setItem('accounting_quiz_v2_4_results', JSON.stringify(userAnswers));
    localStorage.setItem('accounting_quiz_v2_4_reviews', JSON.stringify(reviewList));
    console.log("データを保存しました。現在のステート:", { userAnswers, reviewList });
  }, [userAnswers, reviewList]);

  // クイズ開始処理
  const startQuiz = (mode) => {
    setFilter(mode);
    let list = [];
    if (mode === 'all') list = [...QUIZ_DATA];
    if (mode === 'incorrect') list = QUIZ_DATA.filter(q => userAnswers[q.id] && !userAnswers[q.id].isCorrect);
    if (mode === 'review') list = QUIZ_DATA.filter(q => reviewList.includes(q.id));

    if (list.length === 0) {
      alert("該当する問題がありません。");
      return;
    }
    setShuffledQuizzes(list);
    setCurrentQuizIndex(0);
    setIsAnswered(false);
    setScreen('quiz');
    console.log(`クイズ開始 モード: ${mode}, 問題数: ${list.length}`);
  };

  const handleSelectOption = (idx) => {
    if (isAnswered) return;
    const currentQ = shuffledQuizzes[currentQuizIndex];
    const isCorrect = idx === currentQ.answer;
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: { answer: idx, isCorrect }
    }));
    setIsAnswered(true);
  };

  const toggleReview = (id) => {
    setReviewList(prev => 
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );
  };

  const chartData = useMemo(() => {
    const correctCount = Object.values(userAnswers).filter(a => a.isCorrect).length;
    const incorrectCount = Object.values(userAnswers).length - correctCount;
    const remaining = QUIZ_DATA.length - Object.values(userAnswers).length;
    return [
      { name: '正解', value: correctCount, color: '#10b981' },
      { name: '不正解', value: incorrectCount, color: '#ef4444' },
      { name: '未解答', value: remaining, color: '#cbd5e1' }
    ];
  }, [userAnswers]);

  // --- 画面コンポーネント ---

  const Header = () => (
    <div className="bg-blue-600 text-white p-6 shadow-md flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold">会計クイズ Web</h1>
        <p className="text-xs opacity-80 text-blue-100 tracking-wider uppercase">Cash Flow Statement Master</p>
      </div>
      <Activity className="w-8 h-8 text-blue-200" />
    </div>
  );

  if (screen === 'home') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
        <Header />
        <main className="p-4 sm:p-8 max-w-4xl mx-auto w-full flex-1">
          <section className="mb-8 text-center">
            <h2 className="text-2xl font-black text-slate-800 mb-2">学習状況</h2>
            <div className="h-[250px] w-full flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis hide />
                  <RechartsTooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button onClick={() => setScreen('list')} className={styles.buttonSecondary + " flex items-center justify-center gap-2"}>
              <List className="w-5 h-5" /> 問題一覧を確認
            </button>
            <button onClick={() => startQuiz('all')} className={styles.buttonPrimary + " flex items-center justify-center gap-2"}>
              <BookOpen className="w-5 h-5" /> 最初からチャレンジ
            </button>
            <button 
              onClick={() => startQuiz('incorrect')} 
              className="bg-red-100 hover:bg-red-200 text-red-700 font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 border-2 border-red-200"
            >
              <XCircle className="w-5 h-5" /> 前回不正解のみ
            </button>
            <button 
              onClick={() => startQuiz('review')} 
              className="bg-amber-100 hover:bg-amber-200 text-amber-700 font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 border-2 border-amber-200"
            >
              <Bookmark className="w-5 h-5" /> 要復習のみ
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (screen === 'list') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Header />
        <div className="p-4 sm:p-8 max-w-4xl mx-auto w-full">
          <button onClick={() => setScreen('home')} className="flex items-center text-blue-600 mb-6 font-bold">
            <ChevronLeft /> メニューに戻る
          </button>
          <h2 className="text-2xl font-bold mb-6 text-slate-800">問題一覧</h2>
          <div className="space-y-3">
            {QUIZ_DATA.map((q, idx) => {
              const result = userAnswers[q.id];
              return (
                <div key={q.id} className={styles.card + " p-4 flex items-center justify-between"}>
                  <div className="flex items-center gap-4">
                    <span className="bg-slate-100 text-slate-500 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-xs text-slate-400 font-bold">{q.year} {q.number}</div>
                      <div className="font-bold text-slate-700">{q.title}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {result && (
                      result.isCorrect ? 
                      <CheckCircle2 className="text-green-500 w-6 h-6" /> : 
                      <XCircle className="text-red-500 w-6 h-6" />
                    )}
                    {reviewList.includes(q.id) && <Bookmark className="text-amber-500 w-6 h-6 fill-amber-500" />}
                    <button 
                      onClick={() => { setShuffledQuizzes([q]); setCurrentQuizIndex(0); setIsAnswered(false); setScreen('quiz'); }}
                      className="ml-2 text-blue-600 hover:underline text-sm font-bold"
                    >
                      開始
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'quiz') {
    const q = shuffledQuizzes[currentQuizIndex];
    if (!q) return null;
    const userAnswer = userAnswers[q.id];

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <div className="bg-white border-b border-blue-100 p-4 sticky top-0 z-10 flex items-center justify-between shadow-sm">
          <button onClick={() => setScreen('home')} className="text-slate-400 p-1">
            <Home className="w-6 h-6" />
          </button>
          <div className="text-center">
            <span className="text-xs font-black text-blue-600 block uppercase">Progress</span>
            <span className="text-sm font-bold text-slate-700">{currentQuizIndex + 1} / {shuffledQuizzes.length}</span>
          </div>
          <div className="w-8" />
        </div>

        <main className="p-4 sm:p-8 max-w-2xl mx-auto w-full flex-1">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-2 py-1 rounded">
                {q.year} {q.number}
              </span>
              <span className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">
                {q.title}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 leading-relaxed whitespace-pre-wrap">{q.question}</h3>
          </div>

          {/* 画像をHTMLテーブルで再現 (問題3、問題6用) */}
          {q.isBsStructure && (
            <div className="mb-6 border-2 border-slate-300 rounded overflow-hidden max-w-sm mx-auto">
              <div className="grid grid-cols-2 bg-white">
                <div className="border-r border-b p-2 font-bold bg-green-50">流動資産</div>
                <div className="border-b p-2 font-bold bg-green-50">流動負債</div>
                <div className="border-r border-b p-2 pl-4 flex justify-between bg-orange-50"><span>現金</span></div>
                <div className="border-b p-2 pl-4 bg-green-50">仕入債務</div>
                <div className="border-r border-b p-2 pl-4 bg-green-50">売掛金</div>
                <div className="border-b p-2 font-bold bg-green-50">固定負債</div>
                <div className="border-r border-b p-2 pl-4 bg-green-50">棚卸資産</div>
                <div className="border-b p-2 pl-4 bg-green-50 text-xs">長期借入金</div>
                <div className="border-r p-2 font-bold bg-green-50">固定資産</div>
                <div className="p-2 font-bold bg-green-50 border-t">純資産</div>
              </div>
            </div>
          )}

          {q.isSpecialTable && (
            <div className="mb-6 overflow-x-auto text-[10px] sm:text-xs">
              <table className="w-full border-collapse border border-slate-400 bg-white">
                <thead>
                  <tr className="bg-slate-100">
                    <th colSpan="3" className="border border-slate-400 p-1">資金繰り表(一部)</th>
                    <th className="border border-slate-400 p-1">5月</th>
                    <th className="border border-slate-400 p-1">6月</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td colSpan="3" className="border border-slate-400 p-1">前月末残高</td><td className="border border-slate-400 p-1">1,000</td><td className="border border-slate-400 p-1">470</td></tr>
                  <tr><td rowSpan="3" className="border border-slate-400 p-1 vertical-text">経常収支</td><td rowSpan="2" className="border border-slate-400 p-1">収入</td><td className="border border-slate-400 p-1">現金売上</td><td className="border border-slate-400 p-1">200</td><td className="border border-slate-400 p-1">240</td></tr>
                  <tr><td className="border border-slate-400 p-1">売掛金回収</td><td className="border border-slate-400 p-1">800</td><td className="border border-slate-400 p-1">800</td></tr>
                  <tr className="bg-slate-50 font-bold"><td></td><td></td><td className="border border-slate-400 p-1">収入合計</td><td className="border border-slate-400 p-1">1,000</td><td className="border border-slate-400 p-1">1,040</td></tr>
                  <tr><td></td><td rowSpan="2" className="border border-slate-400 p-1">支出</td><td className="border border-slate-400 p-1">現金仕入</td><td className="border border-slate-400 p-1">720</td><td className="border border-slate-400 p-1">(   )</td></tr>
                  <tr><td></td><td className="border border-slate-400 p-1">諸費用支払</td><td className="border border-slate-400 p-1">510</td><td className="border border-slate-400 p-1">540</td></tr>
                  <tr className="bg-slate-50 font-bold"><td colSpan="3" className="border border-slate-400 p-1">支出合計</td><td className="border border-slate-400 p-1">1,230</td><td className="border border-slate-400 p-1">(   )</td></tr>
                  <tr><td colSpan="3" className="border border-slate-400 p-1">収支過不足</td><td className="border border-slate-400 p-1">-230</td><td className="border border-slate-400 p-1">(   )</td></tr>
                  <tr className="bg-blue-50 font-bold"><td colSpan="3" className="border border-slate-400 p-1 underline">当月末残高</td><td className="border border-slate-400 p-1">470</td><td className="border border-slate-400 p-1">(   )</td></tr>
                </tbody>
              </table>
              <div className="mt-2 grid grid-cols-4 gap-1 text-center border-t border-slate-200 pt-2">
                <div className="font-bold">売上予想:</div>
                <div className="border border-slate-300 p-1 bg-white">5月: 1,000</div>
                <div className="border border-slate-300 p-1 bg-white">6月: 1,200</div>
                <div className="border border-slate-300 p-1 bg-white">7月: 1,600</div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {q.options.map((opt, idx) => {
              const isSelected = userAnswer?.answer === idx;
              const isCorrect = q.answer === idx;
              return (
                <button 
                  key={idx} 
                  onClick={() => handleSelectOption(idx)}
                  className={styles.optionButton(isSelected, isAnswered && isCorrect, isAnswered && isSelected && !isCorrect)}
                >
                  <span className="flex-1 pr-2">{opt}</span>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="mt-8 animate-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white p-6 rounded-2xl border-2 border-blue-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="text-blue-600 w-6 h-6" />
                  <h4 className="text-lg font-black text-slate-800 tracking-tighter uppercase">解説</h4>
                </div>
                <p className="text-slate-700 leading-relaxed mb-6 whitespace-pre-wrap text-sm border-l-4 border-blue-600 pl-4 py-1">
                  {q.explanation}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-slate-100 pt-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${reviewList.includes(q.id) ? 'bg-amber-500 border-amber-500' : 'bg-white border-slate-300'}`}>
                      {reviewList.includes(q.id) && <Check className="text-white w-4 h-4" />}
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={reviewList.includes(q.id)} 
                      onChange={() => toggleReview(q.id)} 
                    />
                    <span className="text-sm font-bold text-slate-600 group-hover:text-amber-600 transition-colors italic uppercase tracking-wider">要復習リストに追加</span>
                  </label>

                  <button 
                    onClick={() => {
                      if (currentQuizIndex < shuffledQuizzes.length - 1) {
                        setCurrentQuizIndex(prev => prev + 1);
                        setIsAnswered(false);
                      } else {
                        setScreen('home');
                      }
                    }}
                    className={styles.buttonPrimary + " px-10 flex items-center gap-2"}
                  >
                    {currentQuizIndex < shuffledQuizzes.length - 1 ? '次の問題へ' : '結果を確認'} <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  return null;
}