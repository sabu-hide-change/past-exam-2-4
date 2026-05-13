// npm install lucide-react recharts firebase
import React, { useState, useEffect, useMemo } from 'react';
import { Check, X, Home, ChevronRight, BookOpen, List, Play, RefreshCw, AlertCircle, Save, LogOut } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

// --- Firebase Configuration ---
// ！！重要！！ APIキーなどはハードコーディングせず環境変数を使用します。
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// アプリケーション固有のID（他のアプリとデータが混ざらないようにするため）
const APP_ID = "QuizApp_001_TaxAccounting";

// --- 問題データ ---
const QUESTIONS = [
  {
    id: 1,
    year: "令和元年 第8問",
    title: "税効果会計",
    text: "決算に当たり、期首に取得した備品1,200千円（耐用年数4年、残存価額ゼロ）について定額法で減価償却を行った。しかし、この備品の税法上の耐用年数は6年であった。このとき、計上される繰延税金資産または繰延税金負債の金額として、最も適切なものはどれか。なお、法人税等の実効税率は30％とする。また、期首における一時差異はないものとする。",
    options: [
      "繰延税金資産：30千円",
      "繰延税金資産：70千円",
      "繰延税金負債：30千円",
      "繰延税金負債：70千円"
    ],
    answer: 0,
    explanation: (
      <div className="space-y-4 text-sm">
        <p>税効果会計と減価償却にかかわる計算について問われています。</p>
        <p>1,200千円の備品を耐用年数4年、残存価値ゼロで減価償却を行った場合、毎年の減価償却費は300千円になります。一方、税法上の耐用年数は6年であるため、税法上の毎年の減価償却費は200千円（1,200千円÷6年）となります。</p>
        <p>そのため、決算内容と税法上では、300千円 － 200千円 ＝ 100千円の差（将来減算一時差異）が発生します。</p>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-white p-2 border rounded shadow-sm">
            <h4 className="font-bold text-center border-b pb-1 mb-2 bg-orange-100">決算内容（会計上）</h4>
            <p>利益: 1,000千円</p>
            <p>減価償却費: 300千円</p>
            <p>税引前利益: 700千円</p>
            <p className="text-red-500 font-bold">法人税等(30%): 210千円</p>
          </div>
          <div className="flex-1 bg-white p-2 border rounded shadow-sm">
            <h4 className="font-bold text-center border-b pb-1 mb-2 bg-green-100">税法上</h4>
            <p>利益: 1,000千円</p>
            <p>減価償却費: 200千円</p>
            <p>課税所得: 800千円</p>
            <p className="text-red-500 font-bold">法人税等(30%): 240千円</p>
          </div>
        </div>
        <p>税法上は240千円を納税する必要があり、決算内容より税法上の法人税等が30千円高くなっています。これは「税法上の限度額を超える減価償却（損金不算入）」による「将来減算一時差異」であり、30千円の税金を前払いしていると考えます。</p>
        <table className="w-full border-collapse border border-gray-300 mt-2">
          <thead>
            <tr className="bg-orange-100">
              <th className="border border-gray-300 p-2">繰延税金資産</th>
              <th className="border border-gray-300 p-2">繰延税金負債</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">将来減算一時差異を認識する場合の勘定科目。資産の部に計上される。法人税等の<strong className="text-orange-600">前払い的</strong>な性質を持つ。</td>
              <td className="border border-gray-300 p-2">将来加算一時差異を認識する場合の勘定科目。負債の部に計上される。法人税等の<strong className="text-orange-600">未払い的</strong>な性質を持つ。</td>
            </tr>
          </tbody>
        </table>
        <p>よって、計上されるのは繰延税金資産30千円（100千円 × 30%）となります。</p>
      </div>
    )
  },
  {
    id: 2,
    year: "平成29年 第6問",
    title: "税効果会計",
    text: "税効果会計に関する記述として、最も適切なものはどれか。",
    options: [
      "受取配当金のうち益金に算入されない金額は、繰延税金負債を増加させる。",
      "交際費のうち損金に算入されない金額は、繰延税金資産を増加させる。",
      "税法の損金算入限度額を超える貸倒引当金繰入額は、繰延税金資産を減少させる。",
      "税法の損金算入限度額を超える減価償却費は、繰延税金資産を増加させる。"
    ],
    answer: 3,
    explanation: (
      <div className="space-y-2 text-sm">
        <p>税効果会計には、一時差異と永久差異があります。</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>ア・イ（不適切）：</strong>益金不算入の受取配当金や、損金不算入の交際費は「永久差異」に該当します。将来にわたって差異が解消されないため、税効果会計は適用されません。</li>
          <li><strong>ウ（不適切）：</strong>損金算入限度額を超える貸倒引当金繰入超過額は「将来減算一時差異」に該当します。将来減算一時差異は、繰延税金資産を「増加」させます（減少ではありません）。</li>
          <li><strong>エ（適切）：</strong>損金算入限度額を超える減価償却は「将来減算一時差異」に該当し、繰延税金資産を増加させます。</li>
        </ul>
      </div>
    )
  },
  {
    id: 3,
    year: "平成26年 第3問",
    title: "税効果会計",
    text: "税効果会計における評価性引当額に関する記述として、最も適切なものはどれか。ただし、スケジューリング不能な一時差異に係る繰延税金資産は存在しない。",
    options: [
      "他の条件が一定のとき、将来における課税所得の減少は評価性引当額の増加を招く。",
      "他の条件が一定のとき、タックスプランニングの内容は評価性引当額に影響しない。",
      "他の条件が一定のとき、当期の業績低下は評価性引当額の増加を招く。",
      "他の条件が一定のとき、当期の繰越欠損金の発生は評価性引当額の減少を招く。"
    ],
    answer: 0,
    explanation: (
      <div className="space-y-2 text-sm">
        <div className="bg-gray-100 p-3 rounded border-l-4 border-green-500">
          <strong>📝 評価性引当額とは：</strong><br/>
          税効果会計において、繰延税金資産のうち「回収可能性がない」と会社が判断した金額のことです。十分な将来加算一時差異や将来の課税所得が見込めない場合などに計上します。
        </div>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>ア（適切）：</strong>将来の課税所得が減少すると、繰延税金資産を取り崩して税金負担を軽減できる見込みが減る（回収可能性が下がる）ため、評価性引当額は「増加」します。</li>
          <li><strong>イ（不適切）：</strong>タックスプランニング（将来の法人税等の発生計画）は将来の課税所得見込みに関わるため、評価性引当額に影響します。</li>
          <li><strong>ウ（不適切）：</strong>当期の業績が低下したとしても、それが直ちに「将来の課税所得」を減らすと断定できず、評価性引当額が増加するとは限りません。</li>
          <li><strong>エ（不適切）：</strong>繰越欠損金が発生した事象自体が直接的に評価性引当額の「減少」を招くわけではありません（むしろ回収可能性の検討次第では増加要因になることもあります）。</li>
        </ul>
      </div>
    )
  },
  {
    id: 4,
    year: "平成28年 第3問",
    title: "のれん",
    text: "のれんに関する記述として最も適切なものはどれか。",
    options: [
      "｢中小企業の会計に関する指針｣では、のれんの償却を行わないとしている。",
      "のれんとは、被合併会社から受け継ぐ総資産額が被合併会社の株主に交付される金額よりも大きいときに計上される。",
      "のれんの償却期間は最長5年である。",
      "のれんはマイナスの金額になることもあり、その場合、発生時の損益計算書に特別利益として計上される。"
    ],
    answer: 3,
    explanation: (
      <div className="space-y-2 text-sm">
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>ア（不適切）：</strong>｢中小企業の会計に関する指針｣において、のれんの償却を行わないという規定はありません。</li>
          <li><strong>イ（不適切）：</strong>のれんは、買収価額が被買収企業の「時価評価純資産（総資産ではありません）」よりも大きいときに計上されます。</li>
          <li><strong>ウ（不適切）：</strong>のれんの償却期間は「20年以内」です。最長5年ではありません。</li>
          <li><strong>エ（適切）：</strong>取得原価が時価評価純資産を下回る場合、「負ののれん」としてマイナスの金額が発生します。企業結合会計基準により、負ののれんは原則として発生時の損益計算書に「特別利益」として計上されます。</li>
        </ul>
      </div>
    )
  },
  {
    id: 5,
    year: "令和元年 第3問",
    title: "連結会計",
    text: "連結会計に関する記述として、最も適切なものはどれか。",
    options: [
      "Ａ社によるＢ社の議決権の所有割合が40％未満であっても、Ｂ社の財務および営業または事業の方針決定に対して重要な影響を与えることができる場合には、Ｂ社は子会社と判定される。",
      "非支配株主持分は、連結貸借対照表の純資産の部に表示される。",
      "持分法による投資利益（または損失）は、連結損益計算書の特別利益（または特別損失）の区分に表示される。",
      "連結貸借対照表は、親会社、子会社および関連会社の個別貸借対照表を合算し、必要な調整を加えて作成される。"
    ],
    answer: 1,
    explanation: (
      <div className="space-y-4 text-sm">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-orange-100">
              <th className="border border-gray-300 p-2 w-1/3">議決権の所有割合</th>
              <th className="border border-gray-300 p-2">実質的な支配とされる場合</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2 text-center font-bold">50%超(過半数)</td>
              <td className="border border-gray-300 p-2">自己の計算において所有している場合。</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 text-center font-bold">40%〜50%</td>
              <td className="border border-gray-300 p-2">自己の計算において所有、かつ、緊密者の議決権や役員関係などの一定の条件のいずれかを満たす場合。</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 text-center font-bold">0%〜40%未満</td>
              <td className="border border-gray-300 p-2">自己の計算において所有、かつ、緊密者と合わせると過半数を所有している場合など（一定の条件あり）。</td>
            </tr>
          </tbody>
        </table>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>ア（不適切）：</strong>議決権40％未満で「重要な影響を与えることができる」場合は「関連会社」となります。子会社となるには、緊密者と合わせて過半数等の条件が必要です。</li>
          <li><strong>イ（適切）：</strong>親会社が100%所有していない場合、親会社以外の持分は「非支配株主持分」として連結貸借対照表の純資産の部に表示されます。</li>
          <li><strong>ウ（不適切）：</strong>持分法投資損益は、原則として営業外収益（または営業外費用）に計上します。特別利益ではありません。</li>
          <li><strong>エ（不適切）：</strong>連結財務諸表は親会社と「子会社」の財務諸表を合算して作成します。「関連会社」は合算せず、持分法を適用します。</li>
        </ul>
      </div>
    )
  },
  {
    id: 6,
    year: "令和5年 第4問",
    title: "連結会計",
    text: "連結会計に関する記述として、最も適切なものはどれか。",
    options: [
      "親会社による子会社株式の所有割合が100%に満たない場合、連結貸借対照表の負債の部に非支配株主持分が計上される。",
      "子会社の決算日と連結決算日の差異が3か月を超えない場合は、子会社の正規の決算を基礎として連結決算を行うことができる。",
      "負ののれんは、連結貸借対照表に固定負債として計上する。",
      "連結子会社の当期純損益に株式の所有割合を乗じた額は、持分法による投資損益として連結損益計算書に計上する。"
    ],
    answer: 1,
    explanation: (
      <div className="space-y-2 text-sm">
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>ア（不適切）：</strong>非支配株主持分は負債の部ではなく、「純資産の部」に計上されます。</li>
          <li><strong>イ（適切）：</strong>子会社の決算日と連結決算日が異なる場合、原則は仮決算を行いますが、差異が3ヶ月を超えない場合は、子会社の正規の決算を基礎として連結決算を行えます。</li>
          <li><strong>ウ（不適切）：</strong>負ののれんは、固定負債ではなく、損益計算書の「特別利益」として計上されます。</li>
          <li><strong>エ（不適切）：</strong>持分法を適用するのは「関連会社（および非連結子会社）」です。連結子会社の業績は全額を取り込んだ後、非支配株主持分を控除する形で調整します。</li>
        </ul>
      </div>
    )
  },
  {
    id: 7,
    year: "平成30年 第4問",
    title: "買収会計",
    text: "Ａ社は、20X1年12月31日にＢ社株式の80％を85百万円で取得した。取得時のＡ社およびＢ社の貸借対照表は以下のとおりである。なお、Ｂ社の諸資産および諸負債の簿価は、時価と一致している。取得時におけるのれんと非支配株主持分の金額の組み合わせとして、最も適切なものを下記の解答群から選べ。\n\n【B社貸借対照表 (単位：百万円)】\n諸資産：200 / 諸負債：120\n資本金：40 / 利益剰余金：40\n（資産合計200 / 負債・純資産合計200）",
    options: [
      "のれん：5百万円　　非支配株主持分：8百万円",
      "のれん：5百万円　　非支配株主持分：16百万円",
      "のれん：21百万円　　非支配株主持分：8百万円",
      "のれん：21百万円　　非支配株主持分：16百万円"
    ],
    answer: 3,
    explanation: (
      <div className="space-y-2 text-sm">
        <p>のれんと非支配株主持分の計算問題です。</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>B社の純資産価値の算定：</strong><br/>
          B社の資本金(40百万円) ＋ 利益剰余金(40百万円) ＝ 純資産 80百万円</li>
          <li><strong>A社の取得持分と「のれん」：</strong><br/>
          A社は80%を取得したため、取得した純資産の価値は 80百万円 × 80% ＝ 64百万円。<br/>
          取得金額は85百万円なので、差額がのれんとなります。<br/>
          のれん ＝ 85百万円 － 64百万円 ＝ <strong>21百万円</strong></li>
          <li><strong>非支配株主持分：</strong><br/>
          A社が取得しなかった残り20%の持分が非支配株主持分となります。<br/>
          非支配株主持分 ＝ 80百万円 × 20% ＝ <strong>16百万円</strong></li>
        </ol>
      </div>
    )
  },
  {
    id: 8,
    year: "平成30年 第3問",
    title: "本支店会計",
    text: "当社は本店のほかに支店があり、本支店間の債権債務は支店勘定および本店勘定により処理している。当月は、本支店間で以下の資料に記載された取引が生じた。月末時点における本店の支店勘定の残高として、最も適切なものを選べ。なお、月初の残高はゼロ、未達事項はないものとする。\n\n(1) 本店は支店の広告宣伝費30,000円を現金で支払った。\n(2) 支店は本店の買掛金70,000円を現金で支払った。\n(3) 本店は支店の売掛金15,000円を現金で回収した。\n(4) 本店は原価60,000円の商品を支店に送付した。",
    options: [
      "貸方残高：45,000円",
      "貸方残高：115,000円",
      "借方残高：5,000円",
      "借方残高：75,000円"
    ],
    answer: 2,
    explanation: (
      <div className="space-y-2 text-sm">
        <p>本店の仕訳を書き出して、支店勘定（借方・貸方）の動きを計算します。</p>
        <ul className="list-none space-y-2">
          <li>(1) 本店が支店の費用を立替払いした<br/>
            (借) 支店 30,000 / (貸) 現金 30,000</li>
          <li>(2) 支店が本店の債務を立替払いした<br/>
            (借) 買掛金 70,000 / (貸) 支店 70,000</li>
          <li>(3) 本店が支店の債権を回収した<br/>
            (借) 現金 15,000 / (貸) 支店 15,000</li>
          <li>(4) 本店から支店へ商品を送付した<br/>
            (借) 支店 60,000 / (貸) 商品 60,000</li>
        </ul>
        <p><strong>本店の支店勘定（借方ベース）の計算：</strong><br/>
        +30,000 (借) － 70,000 (貸) － 15,000 (貸) ＋ 60,000 (借) ＝ ＋5,000円</p>
        <p>よって、<strong>借方残高 5,000円</strong> となります。</p>
      </div>
    )
  },
  {
    id: 9,
    year: "令和3年 第2問",
    title: "本支店会計",
    text: "本支店会計において本店集中計算制度を採用している場合、A支店がB支店の買掛金200,000円について小切手を振り出して支払ったときの本店の仕訳として、最も適切なものはどれか。",
    options: [
      "(借) A支店 200,000 / (貸) B支店 200,000",
      "(借) B支店 200,000 / (貸) A支店 200,000",
      "(借) 買掛金 200,000 / (貸) 当座預金 200,000",
      "(借) 現金 200,000 / (貸) 買掛金 200,000"
    ],
    answer: 1,
    explanation: (
      <div className="space-y-2 text-sm">
        <p>本店集中計算制度では、支店間の取引はすべて「本店」を経由したと考えて処理します。</p>
        <ul className="list-decimal pl-5 space-y-1">
          <li><strong>A支店側の仕訳：</strong>B支店のためにお金を払ったので、本店に対する債権（または本店への支払い）として処理します。<br/>
          (借) 本店 200,000 / (貸) 当座預金 200,000</li>
          <li><strong>B支店側の仕訳：</strong>A支店（本店経由）に買掛金を払ってもらったため、本店に対する債務が増加します。<br/>
          (借) 買掛金 200,000 / (貸) 本店 200,000</li>
          <li><strong>本店側の仕訳（本問の解答）：</strong>A支店がB支店へ立替払いをしたことを認識します。B支店に対する債権（借方：B支店）が増え、A支店に対する債務（貸方：A支店）が増えます。<br/>
          <strong>(借) B支店 200,000 / (貸) A支店 200,000</strong></li>
        </ul>
      </div>
    )
  }
];

export default function App() {
  const [screen, setScreen] = useState('login');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState({});
  const [progress, setProgress] = useState(null); // { index: number, mode: string }

  const [mode, setMode] = useState('all'); // 'all', 'wrong', 'review'
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // --- Firebase Functions ---
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!userId.trim()) return;
    setLoading(true);
    try {
      await signInAnonymously(auth);
      const userDocRef = doc(db, "users", `${APP_ID}_${userId}`);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        setHistory(data.history || {});
        setProgress(data.progress || null);
        console.log("Data loaded:", data);
      } else {
        setHistory({});
        setProgress(null);
      }
      setScreen('home');
    } catch (error) {
      console.error("Login Error:", error);
      alert("ログイン（データ取得）に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUserId('');
    setHistory({});
    setProgress(null);
    setScreen('login');
  };

  const saveHistoryToDB = async (newHistory, currentProgress = progress) => {
    try {
      const userDocRef = doc(db, "users", `${APP_ID}_${userId}`);
      await setDoc(userDocRef, { history: newHistory, progress: currentProgress }, { merge: true });
      console.log("Saved to DB:", { history: newHistory, progress: currentProgress });
    } catch (error) {
      console.error("Save Error:", error);
    }
  };

  // --- Quiz Functions ---
  const prepareQuiz = (selectedMode) => {
    let filtered = [];
    if (selectedMode === 'all') {
      filtered = QUESTIONS;
    } else if (selectedMode === 'wrong') {
      filtered = QUESTIONS.filter(q => history[q.id]?.lastCorrect === false);
    } else if (selectedMode === 'review') {
      filtered = QUESTIONS.filter(q => history[q.id]?.needsReview === true);
    }

    if (filtered.length === 0) {
      alert("該当する問題がありません！");
      return;
    }
    
    setMode(selectedMode);
    setCurrentQuestions(filtered);
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScreen('quiz');
    
    const newProgress = { index: 0, mode: selectedMode };
    setProgress(newProgress);
    saveHistoryToDB(history, newProgress);
  };

  const resumeQuiz = () => {
    if (!progress) return;
    
    const pMode = progress.mode;
    let filtered = [];
    if (pMode === 'all') {
      filtered = QUESTIONS;
    } else if (pMode === 'wrong') {
      filtered = QUESTIONS.filter(q => history[q.id]?.lastCorrect === false);
    } else if (pMode === 'review') {
      filtered = QUESTIONS.filter(q => history[q.id]?.needsReview === true);
    }

    if (filtered.length === 0 || progress.index >= filtered.length) {
      alert("再開できる問題がありません。最初から開始します。");
      handleResetProgress();
      return;
    }

    setMode(pMode);
    setCurrentQuestions(filtered);
    setCurrentIndex(progress.index);
    setSelectedOption(null);
    setShowExplanation(false);
    setScreen('quiz');
  };

  const handleResetProgress = async () => {
    setProgress(null);
    await saveHistoryToDB(history, null);
  };

  const handleAnswer = async (index) => {
    if (showExplanation) return; // Prevent double clicking
    setSelectedOption(index);
    setShowExplanation(true);

    const question = currentQuestions[currentIndex];
    const isCorrect = index === question.answer;

    const prevStat = history[question.id] || { attempts: 0, needsReview: false };
    const newHistory = {
      ...history,
      [question.id]: {
        ...prevStat,
        lastCorrect: isCorrect,
        attempts: prevStat.attempts + 1
      }
    };
    
    setHistory(newHistory);
    // 回答時もProgressは維持したまま保存
    await saveHistoryToDB(newHistory, progress);
  };

  const toggleReview = async (qId) => {
    const prevStat = history[qId] || { attempts: 0, lastCorrect: false };
    const newHistory = {
      ...history,
      [qId]: {
        ...prevStat,
        needsReview: !prevStat.needsReview
      }
    };
    setHistory(newHistory);
    await saveHistoryToDB(newHistory, progress);
  };

  const handleNext = async () => {
    if (currentIndex < currentQuestions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedOption(null);
      setShowExplanation(false);
      
      const newProgress = { index: nextIndex, mode: mode };
      setProgress(newProgress);
      await saveHistoryToDB(history, newProgress);
    } else {
      // 完走した場合はProgressを消去
      setProgress(null);
      await saveHistoryToDB(history, null);
      setScreen('history');
    }
  };

  const returnToHome = () => {
    setScreen('home');
  };

  // --- Render Functions ---
  const renderLogin = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-2 text-blue-800">税務・結合会計 演習</h1>
        <p className="text-gray-600 mb-6 text-sm">合言葉（ユーザーID）を入力して開始</p>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="例: my-secret-id-01"
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition flex justify-center items-center gap-2"
          >
            {loading ? <RefreshCw className="animate-spin w-5 h-5" /> : "ログインして開始"}
          </button>
        </form>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">学習メニュー</h1>
        <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1">
          <LogOut className="w-4 h-4"/> ログアウト
        </button>
      </div>

      {progress && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex items-center gap-2 text-blue-800 font-bold mb-2">
            <Play className="w-5 h-5" /> 続きから再開
          </div>
          <p className="text-sm text-gray-700 mb-4">
            前回は【{progress.mode === 'all' ? 'すべての問題' : progress.mode === 'wrong' ? '前回不正解' : '要復習'}】の<br/>
            <strong>第{progress.index + 1}問目</strong>まで進んでいます。
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={resumeQuiz}
              className="bg-blue-600 text-white py-2 px-4 rounded font-bold hover:bg-blue-700 transition"
            >
              続きから再開する
            </button>
            <button
              onClick={handleResetProgress}
              className="bg-white text-blue-600 border border-blue-600 py-2 px-4 rounded font-bold hover:bg-blue-50 transition"
            >
              最初から始める
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={() => prepareQuiz('all')}
          className="w-full bg-white border border-gray-200 p-4 rounded-lg shadow-sm flex items-center justify-between hover:border-blue-500 transition"
        >
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="font-bold text-gray-800">すべての問題</div>
              <div className="text-xs text-gray-500">全{QUESTIONS.length}問</div>
            </div>
          </div>
          <ChevronRight className="text-gray-400" />
        </button>

        <button
          onClick={() => prepareQuiz('wrong')}
          className="w-full bg-white border border-gray-200 p-4 rounded-lg shadow-sm flex items-center justify-between hover:border-red-500 transition"
        >
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-full text-red-600">
              <X className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="font-bold text-gray-800">前回不正解の問題</div>
              <div className="text-xs text-gray-500">弱点を克服する</div>
            </div>
          </div>
          <ChevronRight className="text-gray-400" />
        </button>

        <button
          onClick={() => prepareQuiz('review')}
          className="w-full bg-white border border-gray-200 p-4 rounded-lg shadow-sm flex items-center justify-between hover:border-yellow-500 transition"
        >
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-full text-yellow-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="font-bold text-gray-800">要復習の問題</div>
              <div className="text-xs text-gray-500">チェックした問題を解く</div>
            </div>
          </div>
          <ChevronRight className="text-gray-400" />
        </button>

        <button
          onClick={() => setScreen('history')}
          className="w-full bg-gray-800 text-white p-4 rounded-lg shadow-sm flex items-center justify-between hover:bg-gray-700 transition mt-6"
        >
          <div className="flex items-center gap-3">
            <List className="w-6 h-6" />
            <span className="font-bold">学習履歴を確認</span>
          </div>
          <ChevronRight />
        </button>
      </div>
    </div>
  );

  const renderQuiz = () => {
    const question = currentQuestions[currentIndex];
    if (!question) return null;

    const isCorrect = selectedOption === question.answer;
    const qStat = history[question.id] || {};

    return (
      <div className="max-w-xl mx-auto min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b p-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <button onClick={returnToHome} className="p-2 text-gray-500 hover:bg-gray-100 rounded">
            <Home className="w-5 h-5" />
          </button>
          <div className="font-bold text-gray-700">
            {currentIndex + 1} / {currentQuestions.length}
          </div>
          <div className="w-9"></div> {/* Balancer */}
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full bg-gray-200">
          <div 
            className="h-1 bg-blue-600 transition-all duration-300" 
            style={{ width: `${((currentIndex + 1) / currentQuestions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question Content */}
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                {question.year}
              </span>
              <span className="text-sm font-bold text-gray-600">{question.title}</span>
            </div>
            <h2 className="text-lg font-bold leading-relaxed whitespace-pre-wrap text-gray-800">
              {question.text}
            </h2>
          </div>

          <div className="space-y-3">
            {question.options.map((option, idx) => {
              let btnClass = "w-full text-left p-4 rounded border shadow-sm transition-all ";
              if (!showExplanation) {
                btnClass += "bg-white hover:border-blue-500 active:bg-blue-50";
              } else {
                if (idx === question.answer) {
                  btnClass += "bg-green-100 border-green-500 font-bold";
                } else if (idx === selectedOption) {
                  btnClass += "bg-red-100 border-red-500";
                } else {
                  btnClass += "bg-white opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={showExplanation}
                  className={btnClass}
                >
                  <div className="flex gap-3 items-center">
                    <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center flex-shrink-0 bg-white">
                      {["ア", "イ", "ウ", "エ"][idx]}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation Section */}
          {showExplanation && (
            <div className="mt-8 animate-fade-in pb-20">
              <div className={`p-4 rounded-t-lg text-white font-bold flex items-center gap-2 ${isCorrect ? 'bg-green-600' : 'bg-red-600'}`}>
                {isCorrect ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
                {isCorrect ? "正解！" : "不正解"}
              </div>
              <div className="bg-white border border-t-0 p-4 rounded-b-lg shadow-sm">
                <div className="flex justify-between items-start mb-4 border-b pb-2">
                  <h3 className="font-bold text-gray-800">解説</h3>
                  <label className="flex items-center gap-2 cursor-pointer bg-yellow-50 p-2 rounded border border-yellow-200">
                    <input 
                      type="checkbox" 
                      checked={!!qStat.needsReview}
                      onChange={() => toggleReview(question.id)}
                      className="w-4 h-4 text-yellow-600"
                    />
                    <span className="text-sm font-bold text-yellow-800 text-nowrap">要復習</span>
                  </label>
                </div>
                <div className="text-gray-700">
                  {question.explanation}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Action */}
        {showExplanation && (
          <div className="bg-white p-4 border-t sticky bottom-0 z-10 shadow-lg">
            <button
              onClick={handleNext}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
            >
              {currentIndex < currentQuestions.length - 1 ? "次の問題へ" : "結果を見る"}
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderHistory = () => {
    const totalAns = Object.keys(history).length;
    const correctAns = Object.values(history).filter(h => h.lastCorrect).length;
    const wrongAns = totalAns - correctAns;
    
    const pieData = [
      { name: '正解', value: correctAns, color: '#16a34a' },
      { name: '不正解', value: wrongAns, color: '#dc2626' },
      { name: '未解答', value: QUESTIONS.length - totalAns, color: '#e5e7eb' },
    ];

    return (
      <div className="max-w-md mx-auto min-h-screen bg-gray-50 p-4">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={returnToHome} className="p-2 bg-white rounded-full shadow-sm">
            <Home className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">学習履歴</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <h2 className="text-center font-bold text-gray-600 mb-4">全体の進捗</h2>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="font-bold text-gray-800 pl-1">問題別ステータス</h2>
          {QUESTIONS.map((q, i) => {
            const stat = history[q.id];
            const isAttempted = !!stat;
            const isCorrect = stat?.lastCorrect;
            const needsReview = stat?.needsReview;

            return (
              <div key={q.id} className="bg-white p-3 rounded shadow-sm border flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">第{i + 1}問 ({q.year})</span>
                  <span className="font-bold text-sm truncate w-48">{q.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  {needsReview && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded border border-yellow-200">要復習</span>}
                  {isAttempted ? (
                    isCorrect ? 
                      <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded">正解</span> : 
                      <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded">不正解</span>
                  ) : (
                    <span className="text-gray-400 text-sm">未解答</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="font-sans antialiased text-gray-900">
      {screen === 'login' && renderLogin()}
      {screen === 'home' && renderHome()}
      {screen === 'quiz' && renderQuiz()}
      {screen === 'history' && renderHistory()}
      
      {/* 簡易的なアニメーション用CSSの注入 */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}} />
    </div>
  );
}