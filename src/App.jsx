import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  BarChart, 
  List, 
  BookOpen, 
  LayoutDashboard,
  ArrowRight,
  BookmarkCheck,
  Filter,
  AlertCircle
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip
} from 'recharts';

/**
 * 依存関係インストールコマンド:
 * npm install lucide-react recharts
 */

// --- データ定義 ---
const QUESTIONS = [
  {
    id: 1,
    title: "問題 1 資金の範囲",
    subTitle: "【平成25年 第4問】",
    text: "キャッシュ・フロー計算書が対象とする資金の範囲は、現金及び現金同等物である。現金同等物に含まれる短期投資に該当する最も適切なものの組み合わせを下記の解答群から選べ。なお、ａ〜ｅの資産の運用期間はすべて3か月以内であるとする。",
    items: [
      "ａ 株式",
      "ｂ 株式投資信託",
      "ｃ コマーシャル・ペーパー",
      "ｄ 定期預金",
      "ｅ 普通預金"
    ],
    options: ["ａとｂ", "ａとｃ", "ｂとｃ", "ｃとｄ", "ｄとｅ"],
    answer: 3,
    explanation: "キャッシュ・フロー計算書が対象とする資金の範囲は、「現金及び現金同等物」です。定期預金やコマーシャル・ペーパーは取得日から3か月以内であれば現金同等物に含まれます。株式や株式投資信託はリスクが大きいため含まれません。 [cite: 3, 23, 26, 28, 29]",
  },
  {
    id: 2,
    title: "問題 2 キャッシュ･フロー計算書の構造",
    subTitle: "【令和5年 第9問】",
    text: "キャッシュ･フロー計算書に関する記述として、最も適切なものはどれか。",
    options: [
      "間接法によるキャッシュ･フロー計算書では、棚卸資産の増加額は営業活動によるキャッシュ・フローの増加要因として表示される。",
      "資金の範囲には定期預金は含まれない。",
      "支払利息は、営業活動によるキャッシュ・フローの区分で表示する方法と財務活動によるキャッシュ・フローの区分で表示する方法の2つが認められている。",
      "有形固定資産の売却による収入は、財務活動によるキャッシュ・フローの区分で表示される。"
    ],
    answer: 2,
    explanation: "支払利息は営業活動または財務活動のいずれかの区分で表示可能です。棚卸資産の増加はキャッシュの減少要因であり、3か月以内の定期預金は資金に含まれます。 [cite: 37, 38, 43, 44, 45]",
  },
  {
    id: 3,
    title: "問題 3 キャッシュ・フローの増加",
    subTitle: "【令和3年 第9問】",
    text: "キャッシュ・フローが増加する原因として、最も適切なものはどれか。",
    options: [
      "売掛金の減少",
      "仕入債務の減少",
      "棚卸資産の増加",
      "長期借入金の減少"
    ],
    answer: 0,
    hasBSDiagram: true,
    explanation: "売掛金の減少は代金の回収を意味するため、キャッシュ・フローが増加します。仕入債務の減少や長期借入金の減少は支払（流出）を意味します。 [cite: 50, 58, 59, 61]",
  },
  {
    id: 4,
    title: "問題 4 キャッシュ・フロー計算書",
    subTitle: "【令和2年 第13問】",
    text: "キャッシュ・フロー計算書に関する記述として、最も適切なものはどれか。",
    options: [
      "「営業活動によるキャッシュ・フロー」の区分では、主要な取引ごとにキャッシュ・フローを総額表示しなければならない。",
      "受取利息及び受取配当金は、「営業活動によるキャッシュ・フロー」の区分に表示しなければならない。",
      "キャッシュ・フロー計算書の現金及び現金同等物期末残高と、貸借対照表の現金及び預金の期末残高は一致するとは限らない。",
      "法人税等の支払額は、「財務活動によるキャッシュ・フロー」の区分に表示される。"
    ],
    answer: 2,
    explanation: "CF計算書上の資金（3か月以内）と貸借対照表上の現金預金（1年以内）は対象範囲が異なるため、一致するとは限りません。 [cite: 67, 76]",
  },
  {
    id: 5,
    title: "問題 5 営業キャッシュ・フローの計算",
    subTitle: "【平成30年　第12問】",
    text: "キャッシュ・フロー計算書に関する記述として、最も適切なものはどれか。",
    options: [
      "財務活動によるキャッシュ・フローの区分には、資金調達に関する収入や支出、有価証券の取得や売却、および貸し付けに関する収入や支出が表示される。",
      "仕入債務の増加額は、営業活動によるキャッシュ・フローの区分（間接法）において、△（マイナス）を付けて表示される。",
      "法人税等の支払額は、財務活動によるキャッシュ・フローの区分で表示される。",
      "利息および配当金の受取額については、営業活動によるキャッシュ・フローの区分で表示する方法と投資活動によるキャッシュ・フローの区分で表示する方法が認められている。"
    ],
    answer: 3,
    explanation: "利息および配当金の受取額は、第1法（営業活動）または第2法（投資活動）のいずれかで表示可能です。 [cite: 84, 92]",
  },
  {
    id: 6,
    title: "問題 6 資金繰り(1)",
    subTitle: "【令和4年 第13問(設問1)】",
    text: "A社は資金不足に陥ることを避けるため、金融機関から借り入れを行うことを検討している。6月末の時点で資金残高が200万円を下回らないようにするには、いくら借り入れればよいか。利息は年率5％で借入時に支払うものとする。",
    hasTable: true,
    options: ["190万円", "200万円", "460万円", "660万円"],
    answer: 1,
    explanation: "6月末の資金残高10万円に対し、必要額Xは 10 + X - 0.05X ≧ 200 となり、計算するとX ≧ 200（万円）となります。 [cite: 119, 120, 121, 124]",
  },
  {
    id: 7,
    title: "問題 7 資金繰り(2)",
    subTitle: "【令和4年 第13問(設問2)】",
    text: "6月末の時点で資金残高が200万円を下回らないようにするための「銀行借り入れ以外の手段」として、最も適切なものはどれか。",
    hasTable: true,
    options: [
      "5月に予定されている事務用備品の購入支出のうち半額を現金払いとし、残額の支払いは7月に延期する。",
      "6月に予定されている諸費用支払のうち400万円を現金払いとし、残額の支払いは7月に延期する。",
      "仕入先と交渉して、6月の仕入代金のうち半額を現金払いとし、残額を買掛金(翌月末払い)とする。",
      "得意先と交渉して、5月の売上代金のうち半額を現金で受け取り、残額を売掛金(翌月末回収)とする。"
    ],
    answer: 2,
    explanation: "6月の仕入代金（960万円）の半分を翌月末払いにすることで、6月末の残高が490万円となり、目標を達成できます。 [cite: 140, 149]",
  }
];

// --- サブコンポーネント: 貸借対照表図 ---
const BSDiagram = () => (
  <div className="my-6 border-2 border-slate-200 rounded-lg p-4 bg-white">
    <div className="grid grid-cols-2 gap-2 text-sm font-bold text-center mb-2">
      <div className="bg-slate-100 p-1">資産の部</div>
      <div className="bg-slate-100 p-1">負債・純資産の部</div>
    </div>
    <div className="grid grid-cols-2 gap-4 h-40">
      <div className="border border-slate-300 flex flex-col">
        <div className="flex-1 flex items-center justify-center border-b bg-orange-50 font-bold">現金</div>
        <div className="flex-1 flex items-center justify-center border-b bg-green-50">売掛金</div>
        <div className="flex-1 flex items-center justify-center bg-green-50">棚卸資産</div>
      </div>
      <div className="border border-slate-300 flex flex-col">
        <div className="flex-1 flex items-center justify-center border-b bg-green-50">仕入債務</div>
        <div className="flex-1 flex items-center justify-center border-b bg-green-50">長期借入金</div>
        <div className="flex-[2] flex items-center justify-center bg-slate-50 text-slate-400">純資産</div>
      </div>
    </div>
  </div>
);

// --- サブコンポーネント: 資金繰り表 ---
const CashFlowTable = () => (
  <div className="my-6 overflow-x-auto">
    <table className="w-full text-xs text-left border-collapse border border-slate-200">
      <thead>
        <tr className="bg-slate-100">
          <th className="border p-2">（単位：万円）</th>
          <th className="border p-2">5月</th>
          <th className="border p-2">6月</th>
        </tr>
      </thead>
      <tbody>
        <tr className="bg-white">
          <td className="border p-2">収入合計</td>
          <td className="border p-2 text-right">1,000</td>
          <td className="border p-2 text-right">1,040</td>
        </tr>
        <tr className="bg-white">
          <td className="border p-2">支出合計</td>
          <td className="border p-2 text-right">1,230</td>
          <td className="border p-2 text-right text-blue-500">（　）</td>
        </tr>
        <tr className="bg-yellow-50 font-bold">
          <td className="border p-2">当月末残高</td>
          <td className="border p-2 text-right">470</td>
          <td className="border p-2 text-right text-blue-500">（　）</td>
        </tr>
      </tbody>
    </table>
  </div>
);

// --- メインコンポーネント ---
export default function App() {
  const [view, setView] = useState('dashboard');
  const [filter, setFilter] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userProgress, setUserProgress] = useState({});
  const [quizList, setQuizList] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('diagnosis_quiz_v2');
    if (saved) setUserProgress(JSON.parse(saved));
    console.log("Status Check: Dashboard View loaded.");
  }, []);

  const saveProgress = (newProgress) => {
    setUserProgress(newProgress);
    localStorage.setItem('diagnosis_quiz_v2', JSON.stringify(newProgress));
  };

  const startQuiz = (mode) => {
    let filtered = [...QUESTIONS];
    if (mode === 'wrong') filtered = QUESTIONS.filter(q => userProgress[q.id]?.status === 'incorrect');
    else if (mode === 'review') filtered = QUESTIONS.filter(q => userProgress[q.id]?.isReview);

    if (filtered.length === 0) {
      alert("該当する問題がありません。");
      return;
    }
    setQuizList(filtered);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setView('quiz');
    console.log(`Quiz Started: ${mode} mode, ${filtered.length} questions.`);
  };

  const handleAnswer = (index) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    const isCorrect = index === quizList[currentIndex].answer;
    const newProgress = {
      ...userProgress,
      [quizList[currentIndex].id]: { ...userProgress[quizList[currentIndex].id], status: isCorrect ? 'correct' : 'incorrect' }
    };
    saveProgress(newProgress);
    setShowExplanation(true);
  };

  const toggleReview = (id) => {
    const newProgress = { ...userProgress, [id]: { ...userProgress[id], isReview: !userProgress[id]?.isReview } };
    saveProgress(newProgress);
  };

  const stats = useMemo(() => {
    const total = QUESTIONS.length;
    const correct = QUESTIONS.filter(q => userProgress[q.id]?.status === 'correct').length;
    const incorrect = QUESTIONS.filter(q => userProgress[q.id]?.status === 'incorrect').length;
    return [
      { name: '正解', value: correct, color: '#22c55e' },
      { name: '不正解', value: incorrect, color: '#ef4444' },
      { name: '未回答', value: total - correct - incorrect, color: '#94a3b8' }
    ];
  }, [userProgress]);

  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-slate-50 p-4 font-sans text-slate-800">
        <header className="max-w-2xl mx-auto mb-8 text-center pt-8">
          <h1 className="text-2xl font-black text-blue-700 flex items-center justify-center gap-2">
            <BookOpen className="text-blue-500" /> 中小企業診断士：CF演習
          </h1>
        </header>

        <main className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2 uppercase tracking-widest">
              <BarChart size={16} /> 進捗状況
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-32 h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stats} innerRadius={30} outerRadius={45} paddingAngle={5} dataKey="value">
                      {stats.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 grid grid-cols-3 gap-2 w-full text-center">
                {stats.map(s => (
                  <div key={s.name} className="p-2 bg-slate-50 rounded-2xl">
                    <div className="text-[10px] font-bold text-slate-400">{s.name}</div>
                    <div className="text-lg font-black" style={{ color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button onClick={() => startQuiz('all')} className="bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2">
              <RotateCcw size={18} /> 全問開始
            </button>
            <button onClick={() => startQuiz('wrong')} className="bg-red-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-red-600 active:scale-95 transition-all flex items-center justify-center gap-2">
              <XCircle size={18} /> 不正解のみ
            </button>
            <button onClick={() => startQuiz('review')} className="bg-orange-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-orange-600 active:scale-95 transition-all flex items-center justify-center gap-2">
              <BookmarkCheck size={18} /> 要復習のみ
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-black flex items-center gap-2"><List size={18} /> 問題リスト</h3>
              <div className="flex gap-1">
                {['all', 'wrong', 'review'].map(f => (
                  <button key={f} onClick={() => setFilter(f)} className={`text-[10px] px-3 py-1 rounded-full border ${filter === f ? 'bg-slate-800 text-white' : 'bg-white text-slate-400'}`}>{f === 'all' ? 'すべて' : f === 'wrong' ? '不正解' : '要復習'}</button>
                ))}
              </div>
            </div>
            {QUESTIONS.filter(q => {
              if (filter === 'wrong') return userProgress[q.id]?.status === 'incorrect';
              if (filter === 'review') return userProgress[q.id]?.isReview;
              return true;
            }).map(q => (
              <div key={q.id} onClick={() => { setQuizList([q]); setCurrentIndex(0); setView('quiz'); }} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer hover:border-blue-400 transition-all">
                <div className="flex items-center gap-3">
                  {userProgress[q.id]?.status === 'correct' ? <CheckCircle className="text-green-500" size={20} /> : userProgress[q.id]?.status === 'incorrect' ? <XCircle className="text-red-500" size={20} /> : <div className="w-5 h-5 rounded-full bg-slate-100" />}
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">{q.subTitle}</div>
                    <div className="text-sm font-black">{q.title}</div>
                  </div>
                </div>
                <ChevronRight className="text-slate-200" size={16} />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  const currentQ = quizList[currentIndex];
  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur border-b border-slate-100 px-4 py-4 z-20 flex items-center justify-between">
        <button onClick={() => setView('dashboard')}><LayoutDashboard size={24} className="text-slate-400" /></button>
        <div className="text-xs font-black text-slate-400">{currentIndex + 1} / {quizList.length}</div>
        <div className="w-6" />
      </header>

      <main className="max-w-xl mx-auto px-6 pt-24 pb-32">
        <div className="mb-8">
          <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-1 rounded uppercase tracking-widest">{currentQ.subTitle}</span>
          <h2 className="text-xl font-black mt-3 leading-relaxed">{currentQ.text}</h2>
          {currentQ.hasBSDiagram && <BSDiagram />}
          {currentQ.hasTable && <CashFlowTable />}
          {currentQ.items && (
            <div className="mt-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm space-y-1">
              {currentQ.items.map((it, i) => <div key={i} className="flex gap-2"><span>•</span>{it}</div>)}
            </div>
          )}
        </div>

        <div className="space-y-3">
          {currentQ.options.map((opt, i) => {
            let style = "border-slate-200 bg-white text-slate-700";
            if (showExplanation) {
              if (i === currentQ.answer) style = "border-green-500 bg-green-50 text-green-700 ring-2 ring-green-100";
              else if (i === selectedAnswer) style = "border-red-500 bg-red-50 text-red-700";
              else style = "border-slate-100 opacity-40";
            }
            return (
              <button key={i} disabled={showExplanation} onClick={() => handleAnswer(i)} className={`w-full text-left p-5 rounded-2xl border-2 font-bold transition-all flex items-center justify-between ${style}`}>
                <span className="text-sm leading-snug">{opt}</span>
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="mt-8 p-6 bg-slate-900 text-white rounded-3xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedAnswer === currentQ.answer ? <CheckCircle className="text-green-400" size={28} /> : <XCircle className="text-red-400" size={28} />}
                <span className="text-xl font-black">{selectedAnswer === currentQ.answer ? "正解！" : "残念..."}</span>
              </div>
              <button onClick={() => toggleReview(currentQ.id)} className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-1 transition-all ${userProgress[currentQ.id]?.isReview ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-700 text-slate-400'}`}>
                <BookmarkCheck size={14} /> 要復習
              </button>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">{currentQ.explanation}</p>
            <button onClick={() => { if (currentIndex < quizList.length - 1) { setCurrentIndex(v => v + 1); setSelectedAnswer(null); setShowExplanation(false); } else setView('dashboard'); }} className="w-full bg-blue-600 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-700 transition-all">
              {currentIndex < quizList.length - 1 ? "次の問題へ" : "一覧へ戻る"} <ArrowRight size={20} />
            </button>
          </div>
        )}
      </main>

      {!showExplanation && (
        <div className="fixed bottom-8 w-full flex justify-center px-6">
          <div className="bg-slate-800 text-white text-[10px] font-black px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
            <AlertCircle size={14} className="text-blue-400" /> 正解だと思う肢を選んでください
          </div>
        </div>
      )}
    </div>
  );
}