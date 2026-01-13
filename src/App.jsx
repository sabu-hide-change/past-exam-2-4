import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  BarChart3, 
  ListCircle, 
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
  Tooltip as RechartsTooltip,
  Legend
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
    answer: 3, // index of "ｃとｄ"
    explanation: `キャッシュ・フロー計算書が対象とする資金の範囲は、「現金及び現金同等物」です。
    ① 現金：手許現金、要求払預金（当座・普通・通知預金）
    ② 現金同等物：容易に換金可能、かつ価値変動リスクが僅少な短期投資（3か月以内）。
    
    ・a 株式：価値変動リスクが大きいため除外。
    ・b 株式投資信託：元本保証がなく、リスクが大きいため除外。
    ・c コマーシャル・ペーパー：現金同等物の典型例。
    ・d 定期預金：3か月以内であれば現金同等物。
    ・e 普通預金：「現金（要求払預金）」に該当し、短期投資（現金同等物）ではない。
    
    したがって、cとdが適切です。`,
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
    explanation: `ア：不適切。棚卸資産の増加はキャッシュの減少要因です。
    イ：不適切。3か月以内の定期預金は現金同等物に含まれます。
    ウ：適切。支払利息は営業活動または財務活動のいずれかでの表示が認められています。
    エ：不適切。有形固定資産の売却は「投資活動によるキャッシュ・フロー」に区分されます。`,
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
    explanation: `貸借対照表（B/S）の構造から考えると分かりやすくなります。
    ・売掛金の減少：代金を回収したことを意味するため、現金が増加します（適切）。
    ・仕入債務の減少：代金を支払ったことを意味するため、現金が減少します。
    ・棚卸資産の増加：在庫を仕入れた（現金を支払った）ことを意味するため、現金が減少します。
    ・長期借入金の減少：借金を返済したことを意味するため、現金が減少します。`,
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
    explanation: `ア：不適切。間接法では取引ごとの総額表示は行いません。
    イ：不適切。投資活動による区分での表示も認められています。
    ウ：適切。CF計算書は「3か月以内」、B/Sは「1年以内」の定期預金を含むため、範囲が異なります。
    エ：不適切。法人税等は「営業活動によるキャッシュ・フロー」の小計の下に表示されます。`,
  },
  {
    id: 5,
    title: "問題 5 営業キャッシュ・フローの計算",
    subTitle: "【平成30年 第12問】",
    text: "キャッシュ・フロー計算書に関する記述として、最も適切なものはどれか。",
    options: [
      "財務活動によるキャッシュ・フローの区分には、資金調達に関する収入や支出、有価証券の取得や売却、および貸し付けに関する収入や支出が表示される。",
      "仕入債務の増加額は、営業活動によるキャッシュ・フローの区分（間接法）において、△（マイナス）を付けて表示される。",
      "法人税等の支払額は、財務活動によるキャッシュ・フローの区分で表示される。",
      "利息および配当金の受取額については、営業活動によるキャッシュ・フローの区分で表示する方法と投資活動によるキャッシュ・フローの区分で表示する方法が認められている。"
    ],
    answer: 3,
    explanation: `ア：不適切。有価証券の取得・売却や貸付は「投資活動」です。
    イ：不適切。仕入債務の増加は「支払を待ってもらっている＝手元に資金が残る」ため、プラス表示です。
    ウ：不適切。法人税等は「営業活動」の区分です。
    エ：適切。利息・配当金の受取は、営業活動または投資活動のいずれかで表示可能です。`,
  },
  {
    id: 6,
    title: "問題 6 資金繰り",
    subTitle: "【令和4年 第13問(設問1)】",
    text: "A社では、X1年4月末に以下のような資金繰り表を作成した。6月末の時点で資金残高が200万円を下回らないようにするには、いくら借り入れればよいか。利息は年率5％で借入時に1年分を支払うものとする。",
    hasTable: true,
    options: ["190万円", "200万円", "460万円", "660万円"],
    answer: 1,
    explanation: `1. 6月の現金を計算：
    ・6月現金仕入：7月売上1,600 × 60% = 960
    ・6月支出合計：960 + 540 = 1,500
    ・6月収支過不足：1,040 - 1,500 = -460
    ・借入前6月末残高：5月末残高470 - 460 = 10万円
    
    2. 必要借入額Xの計算（利息5%引後で200万確保）：
    10 + X - 0.05X ≧ 200
    0.95X ≧ 190
    X ≧ 200
    
    よって200万円の借入が必要です。`,
  },
  {
    id: 7,
    title: "問題 7 資金繰り",
    subTitle: "【令和4年 第13問(設問2)】",
    text: "A社の経営者から、当座の資金繰り対策として銀行借り入れ以外の手段がないかアドバイスを求められた。6月末の時点で資金残高が200万円を下回らないようにするための手段として、最も適切なものはどれか。",
    hasTable: true,
    options: [
      "5月に予定されている事務用備品の購入支出のうち半額を現金払いとし、残額の支払いは7月に延期する。",
      "6月に予定されている諸費用支払のうち400万円を現金払いとし、残額の支払いは7月に延期する。",
      "仕入先と交渉して、6月の仕入代金のうち半額を現金払いとし、残額を買掛金(翌月末払い)とする。",
      "得意先と交渉して、5月の売上代金のうち半額を現金で受け取り、残額を売掛金(翌月末回収)とする。"
    ],
    answer: 2,
    explanation: `ア：5月末+150万、6月末残高は160万となり200万に届きません。
    イ：6月支出-140万、6月末残高は150万となり200万に届きません。
    ウ：適切。6月現金仕入960万の半分（480万）を延期することで、6月末残高は490万となります。
    エ：5月売上+300万されますが、6月の売掛金回収が300万減るため、6月末残高は10万のままです。`,
  }
];

// --- サブコンポーネント: 貸借対照表図 ---
const BSDiagram = ({ highlight = null }) => (
  <div className="my-6 border-2 border-slate-200 rounded-lg p-4 bg-white overflow-x-auto">
    <div className="min-w-[400px]">
      <div className="grid grid-cols-2 gap-2 text-sm font-bold text-center mb-2">
        <div className="bg-slate-100 p-1">資産の部</div>
        <div className="bg-slate-100 p-1">負債・純資産の部</div>
      </div>
      <div className="grid grid-cols-2 gap-4 h-48">
        <div className="border border-slate-300 flex flex-col">
          <div className={`flex-1 flex items-center justify-center border-b ${highlight === 'cash' ? 'bg-orange-100' : 'bg-orange-50'}`}>現金</div>
          <div className={`flex-1 flex items-center justify-center border-b ${highlight === 'ar' ? 'bg-green-100 font-bold' : 'bg-green-50'}`}>売掛金</div>
          <div className={`flex-1 flex items-center justify-center border-b ${highlight === 'inv' ? 'bg-green-100' : 'bg-green-50'}`}>棚卸資産</div>
          <div className="flex-1 flex items-center justify-center bg-slate-50 text-slate-400">固定資産</div>
        </div>
        <div className="border border-slate-300 flex flex-col">
          <div className={`flex-1 flex items-center justify-center border-b ${highlight === 'ap' ? 'bg-green-100' : 'bg-green-50'}`}>仕入債務</div>
          <div className={`flex-1 flex items-center justify-center border-b ${highlight === 'loan' ? 'bg-green-100' : 'bg-green-50'}`}>長期借入金</div>
          <div className="flex-[2] flex items-center justify-center bg-slate-50 text-slate-400">純資産</div>
        </div>
      </div>
    </div>
  </div>
);

// --- サブコンポーネント: 資金繰り表 ---
const CashFlowTable = () => (
  <div className="my-6 overflow-x-auto border border-slate-200 rounded-lg">
    <table className="w-full text-xs text-left border-collapse min-w-[500px]">
      <thead>
        <tr className="bg-slate-100">
          <th colSpan="3" className="border p-2">（単位：万円）</th>
          <th className="border p-2 w-24">5月</th>
          <th className="border p-2 w-24">6月</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colSpan="3" className="border p-2 font-bold">前月末残高</td>
          <td className="border p-2">1,000</td>
          <td className="border p-2">470</td>
        </tr>
        <tr>
          <td rowSpan="6" className="border p-2 bg-slate-50 font-bold [writing-mode:vertical-rl] text-center">経常収支</td>
          <td rowSpan="3" className="border p-2 bg-slate-50 font-bold">収入</td>
          <td className="border p-2">現金売上</td>
          <td className="border p-2">200</td>
          <td className="border p-2">240</td>
        </tr>
        <tr>
          <td className="border p-2">売掛金回収</td>
          <td className="border p-2">800</td>
          <td className="border p-2">800</td>
        </tr>
        <tr className="bg-blue-50">
          <td className="border p-2 font-bold">収入合計</td>
          <td className="border p-2">1,000</td>
          <td className="border p-2">1,040</td>
        </tr>
        <tr>
          <td rowSpan="3" className="border p-2 bg-slate-50 font-bold">支出</td>
          <td className="border p-2">現金仕入</td>
          <td className="border p-2">720</td>
          <td className="border p-2 text-blue-600 font-bold">（　）</td>
        </tr>
        <tr>
          <td className="border p-2">諸費用支払</td>
          <td className="border p-2">510</td>
          <td className="border p-2">540</td>
        </tr>
        <tr className="bg-red-50">
          <td className="border p-2 font-bold">支出合計</td>
          <td className="border p-2">1,230</td>
          <td className="border p-2 text-blue-600 font-bold">（　）</td>
        </tr>
        <tr>
          <td colSpan="3" className="border p-2 font-bold">収支過不足</td>
          <td className="border p-2">-230</td>
          <td className="border p-2 text-blue-600 font-bold">（　）</td>
        </tr>
        <tr>
          <td colSpan="3" className="border p-2">備品購入支出</td>
          <td className="border p-2">300</td>
          <td className="border p-2">0</td>
        </tr>
        <tr className="bg-yellow-50 font-bold">
          <td colSpan="3" className="border p-2">当月末残高</td>
          <td className="border p-2">470</td>
          <td className="border p-2 text-blue-600 font-bold">（　）</td>
        </tr>
      </tbody>
    </table>
    <div className="p-3 bg-slate-50 text-[10px] space-y-1">
      <p>【売上実績・予想】 4月: 1,000万 / 5月: 1,000万 / 6月: 1,200万 / 7月: 1,600万</p>
      <p>【条件】 ①売上20％現金、残額翌月末回収。 ②仕入は翌月売上の60％、全額現金払。 ③全収支月末発生。</p>
    </div>
  </div>
);

// --- メインコンポーネント ---
export default function App() {
  // --- State ---
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'quiz'
  const [filter, setFilter] = useState('all'); // 'all' | 'wrong' | 'review'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userProgress, setUserProgress] = useState({});
  const [quizList, setQuizList] = useState([]);

  // --- Initial Load ---
  useEffect(() => {
    const saved = localStorage.getItem('diagnosis_quiz_progress');
    if (saved) {
      setUserProgress(JSON.parse(saved));
    }
    console.log("App initialized. Progress loaded from localStorage.");
  }, []);

  // --- Save Logic ---
  const saveProgress = (newProgress) => {
    setUserProgress(newProgress);
    localStorage.setItem('diagnosis_quiz_progress', JSON.stringify(newProgress));
  };

  // --- Quiz Logic ---
  const startQuiz = (mode) => {
    console.log(`Starting quiz mode: ${mode}`);
    let filtered = [];
    if (mode === 'all') filtered = [...QUESTIONS];
    else if (mode === 'wrong') filtered = QUESTIONS.filter(q => userProgress[q.id]?.status === 'incorrect');
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
  };

  const handleAnswer = (index) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    const isCorrect = index === quizList[currentIndex].answer;
    
    const newProgress = {
      ...userProgress,
      [quizList[currentIndex].id]: {
        ...userProgress[quizList[currentIndex].id],
        status: isCorrect ? 'correct' : 'incorrect',
        lastAnswer: index
      }
    };
    saveProgress(newProgress);
    setShowExplanation(true);
  };

  const toggleReview = (id) => {
    const newProgress = {
      ...userProgress,
      [id]: {
        ...userProgress[id],
        isReview: !userProgress[id]?.isReview
      }
    };
    saveProgress(newProgress);
  };

  const nextQuestion = () => {
    if (currentIndex < quizList.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setView('dashboard');
    }
  };

  // --- Stats Calculation ---
  const stats = useMemo(() => {
    const total = QUESTIONS.length;
    const correct = QUESTIONS.filter(q => userProgress[q.id]?.status === 'correct').length;
    const incorrect = QUESTIONS.filter(q => userProgress[q.id]?.status === 'incorrect').length;
    const reviewCount = QUESTIONS.filter(q => userProgress[q.id]?.isReview).length;
    const unanswered = total - (correct + incorrect);

    return [
      { name: '正解', value: correct, color: '#22c55e' },
      { name: '不正解', value: incorrect, color: '#ef4444' },
      { name: '未回答', value: unanswered, color: '#94a3b8' }
    ];
  }, [userProgress]);

  // --- View: Dashboard ---
  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-slate-50 pb-20">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="text-blue-600" />
              <span>CF計算書 過去問演習</span>
            </h1>
            <div className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
              2026年度版
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 pt-6 space-y-6">
          {/* Progress Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-sm font-bold text-slate-500 mb-4 flex items-center gap-2">
              <BarChart3 size={18} /> 学習の進捗
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats}
                      innerRadius={35}
                      outerRadius={55}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                {stats.map((s) => (
                  <div key={s.name} className="p-3 bg-slate-50 rounded-xl">
                    <div className="text-xs text-slate-500">{s.name}</div>
                    <div className="text-xl font-bold" style={{ color: s.color }}>{s.value} <span className="text-xs text-slate-400">問</span></div>
                  </div>
                ))}
                <div className="p-3 bg-blue-50 rounded-xl">
                  <div className="text-xs text-blue-600">要復習</div>
                  <div className="text-xl font-bold text-blue-700">
                    {QUESTIONS.filter(q => userProgress[q.id]?.isReview).length} <span className="text-xs text-blue-400">問</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Start Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button 
              onClick={() => startQuiz('all')}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md active:scale-95"
            >
              <RotateCcw size={18} /> 全問題を解く
            </button>
            <button 
              onClick={() => startQuiz('wrong')}
              className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md active:scale-95"
            >
              <XCircle size={18} /> 不正解のみ
            </button>
            <button 
              onClick={() => startQuiz('review')}
              className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md active:scale-95"
            >
              <BookmarkCheck size={18} /> 要復習のみ
            </button>
          </div>

          {/* Question List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                <ListCircle size={20} className="text-blue-500" />
                問題一覧
              </h2>
              <div className="flex gap-1">
                {['all', 'wrong', 'review'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`text-[10px] px-2 py-1 rounded-full border transition-colors ${
                      filter === f ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200'
                    }`}
                  >
                    {f === 'all' ? 'すべて' : f === 'wrong' ? '不正解' : '要復習'}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              {QUESTIONS?.filter(q => {
                if (filter === 'wrong') return userProgress[q.id]?.status === 'incorrect';
                if (filter === 'review') return userProgress[q.id]?.isReview;
                return true;
              }).map((q) => (
                <div 
                  key={q.id}
                  className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between group hover:border-blue-300 transition-colors cursor-pointer"
                  onClick={() => {
                    setQuizList([q]);
                    setCurrentIndex(0);
                    setSelectedAnswer(null);
                    setShowExplanation(false);
                    setView('quiz');
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 font-bold text-sm">
                      {userProgress[q.id]?.status === 'correct' ? <CheckCircle2 className="text-green-500" size={24} /> :
                       userProgress[q.id]?.status === 'incorrect' ? <XCircle className="text-red-500" size={24} /> : q.id}
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">{q.subTitle}</div>
                      <div className="text-sm font-bold text-slate-700">{q.title}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {userProgress[q.id]?.isReview && <BookmarkCheck className="text-orange-400" size={18} />}
                    <ChevronRight className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // --- View: Quiz ---
  const currentQuestion = quizList[currentIndex];
  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => setView('dashboard')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <LayoutDashboard size={24} className="text-slate-600" />
          </button>
          <div className="text-sm font-bold text-slate-700">
             {currentIndex + 1} / {quizList.length}
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>
        {/* Progress bar */}
        <div className="w-full h-1 bg-slate-100">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / quizList.length) * 100}%` }}
          />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Question Text */}
          <div className="p-6 md:p-8">
            <span className="inline-block px-2 py-1 rounded bg-blue-50 text-blue-600 text-[10px] font-bold mb-2 uppercase tracking-widest">
              {currentQuestion.subTitle}
            </span>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 leading-relaxed">
              {currentQuestion.text}
            </h2>

            {/* Injected Content (Tables/Diagrams) */}
            {currentQuestion.hasBSDiagram && <BSDiagram highlight={currentIndex === 0 ? 'ar' : null} />}
            {currentQuestion.hasTable && <CashFlowTable />}
            
            {currentQuestion.items && (
              <ul className="mt-4 space-y-1 bg-slate-50 p-4 rounded-lg border border-slate-100">
                {currentQuestion.items.map((item, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span> {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Options */}
          <div className="bg-slate-50 p-6 md:p-8 space-y-3">
            {currentQuestion.options.map((option, i) => {
              const isSelected = selectedAnswer === i;
              const isCorrect = i === currentQuestion.answer;
              let style = "bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50";
              
              if (showExplanation) {
                if (isCorrect) style = "bg-green-50 border-green-500 text-green-700 ring-2 ring-green-100";
                else if (isSelected) style = "bg-red-50 border-red-500 text-red-700";
                else style = "bg-white border-slate-200 text-slate-400 opacity-60";
              }

              return (
                <button
                  key={i}
                  disabled={showExplanation}
                  onClick={() => handleAnswer(i)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${style}`}
                >
                  <span className="text-sm font-bold leading-snug">{option}</span>
                  {showExplanation && isCorrect && <CheckCircle2 className="text-green-500 shrink-0" size={20} />}
                  {showExplanation && isSelected && !isCorrect && <XCircle className="text-red-500 shrink-0" size={20} />}
                  {!showExplanation && <ChevronRight className="text-slate-300 group-hover:text-blue-400" size={18} />}
                </button>
              );
            })}
          </div>

          {/* Explanation Section */}
          {showExplanation && (
            <div className="p-6 md:p-8 bg-white border-t-4 border-blue-500">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded ${selectedAnswer === currentQuestion.answer ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {selectedAnswer === currentQuestion.answer ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                  </div>
                  <h3 className="text-lg font-bold">
                    {selectedAnswer === currentQuestion.answer ? '正解です！' : '不正解です'}
                  </h3>
                </div>
                {/* Review Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer bg-orange-50 px-3 py-2 rounded-lg border border-orange-100 select-none active:scale-95 transition-transform">
                  <input 
                    type="checkbox" 
                    checked={userProgress[currentQuestion.id]?.isReview || false}
                    onChange={() => toggleReview(currentQuestion.id)}
                    className="w-4 h-4 accent-orange-500"
                  />
                  <span className="text-xs font-bold text-orange-700 flex items-center gap-1">
                    <BookmarkCheck size={14} /> 要復習
                  </span>
                </label>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">解説</h4>
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {currentQuestion.explanation}
                </div>
              </div>

              <button 
                onClick={nextQuestion}
                className="w-full mt-6 bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
              >
                {currentIndex < quizList.length - 1 ? '次の問題へ' : '結果一覧に戻る'}
                <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer hint */}
      {!showExplanation && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xs px-4">
          <div className="bg-slate-800/90 backdrop-blur text-white text-[10px] text-center py-2 px-4 rounded-full shadow-xl flex items-center justify-center gap-2">
            <AlertCircle size={14} /> 最も適切な選択肢を1つ選んでください
          </div>
        </div>
      )}
    </div>
  );
}