// npm install lucide-react recharts firebase
import React, { useState, useEffect } from 'react';
import { Check, X, Home, ChevronRight, BarChart, RefreshCcw, LogOut, ArrowRight, Play, AlertCircle, Bookmark } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

// ==========================================
// Firebase Configuration (Strictly adhering to requirements)
// ==========================================
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

// Application specific ID for Firestore isolation
const APP_ID = "QuizApp_CF_001";

// ==========================================
// Quiz Data
// ==========================================
const questionsData = [
  {
    id: "q1",
    year: "平成25年 第4問",
    title: "資金の範囲",
    text: "キャッシュ・フロー計算書が対象とする資金の範囲は、現金及び現金同等物である。現金同等物に含まれる短期投資に該当する最も適切なものの組み合わせを下記の解答群から選べ。なお、ａ〜ｅの資産の運用期間はすべて3か月以内であるとする。\n\nａ　株式\nｂ　株式投資信託\nｃ　コマーシャル・ペーパー\ｄ　定期預金\nｅ　普通預金",
    options: [
      "ａとｂ",
      "ａとｃ",
      "ｂとｃ",
      "ｃとｄ",
      "ｄとｅ"
    ],
    correctIndex: 3,
    explanation: (
      <div className="space-y-2">
        <p><strong>解答：エ (ｃとｄ)</strong></p>
        <p>キャッシュ・フロー計算書が対象とする資金の範囲に関する問題です。</p>
        <p>キャッシュ・フロー計算書が対象とする資金の範囲は、「現金及び現金同等物」です。<br/>
        ① 現金: a手許現金、b要求払預金（当座預金、普通預金、通知預金など）<br/>
        ② 現金同等物: 容易に換金可能であり、かつ、価値の変動について僅少なリスクしか負わない短期投資（取得日から満期日又は償還日までの期間が3か月以内の短期投資である定期預金、譲渡性預金、コマーシャル・ペーパー、売戻し条件付現先、公社債投資信託など）</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>ａ 株式：現金同等物ではありません。価値の変動リスクが僅少とはいえないためです。</li>
          <li>ｂ 株式投資信託：現金同等物ではありません。価値の変動リスクが僅少とはいえないからです。</li>
          <li>ｃ コマーシャル・ペーパー：現金同等物に該当します。（企業が短期資金の調達を目的に、割引形式により発行する無担保の約束手形）</li>
          <li>ｄ 定期預金：期間が3か月以内の短期投資であるため、現金同等物に該当します。</li>
          <li>ｅ 普通預金：現金同等物ではなく「現金（要求払預金）」に該当します。</li>
        </ul>
        <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
          <p className="font-bold border-b border-gray-300 mb-2">～補足～ 資金の範囲</p>
          <p><strong>売戻し条件付現先:</strong> 一定期間後に売り戻す契約で購入した債権。</p>
          <p><strong>投資信託:</strong> 運用の専門家が株式や債券などに投資・運用する金融商品。預金と違い元本保証がなく、株式・債券と違い銘柄判断を専門家に委ねる点が異なります。</p>
        </div>
      </div>
    )
  },
  {
    id: "q2",
    year: "令和5年 第9問",
    title: "キャッシュ･フロー計算書の構造",
    text: "キャッシュ･フロー計算書に関する記述として、最も適切なものはどれか。",
    options: [
      "間接法によるキャッシュ･フロー計算書では、棚卸資産の増加額は営業活動によるキャッシュ・フローの増加要因として表示される。",
      "資金の範囲には定期預金は含まれない。",
      "支払利息は、営業活動によるキャッシュ・フローの区分で表示する方法と財務活動によるキャッシュ・フローの区分で表示する方法の2つが認められている。",
      "有形固定資産の売却による収入は、財務活動によるキャッシュ・フローの区分で表示される。"
    ],
    correctIndex: 2,
    explanation: (
      <div className="space-y-2">
        <p><strong>解答：ウ</strong></p>
        <p>選択肢ア：不適切。棚卸資産が増加した場合は、キャッシュが減少するため、営業活動によるキャッシュ･フローの減少要因となります。</p>
        <p>選択肢イ：不適切。期間が3か月以内の定期預金は、現金同等物として資金の範囲に含まれます。</p>
        <p>選択肢ウ：適切。一般的には支払利息は財務活動による区分で表示しますが、営業活動による区分で表示する方法も認められています。</p>
        <p>選択肢エ：不適切。有形固定資産の売却による収入は、投資活動によるキャッシュ･フローの区分で表示されます。</p>
      </div>
    )
  },
  {
    id: "q3",
    year: "令和3年 第9問",
    title: "キャッシュ・フローの増加",
    text: "キャッシュ・フローが増加する原因として、最も適切なものはどれか。",
    options: [
      "売掛金の減少",
      "仕入債務の減少",
      "棚卸資産の増加",
      "長期借入金の減少"
    ],
    correctIndex: 0,
    explanation: (
      <div className="space-y-4">
        <p><strong>解答：ア</strong></p>
        <p>貸借対照表の項目の変化により、キャッシュ・フローがどう変化するかを問う問題です。貸借対照表の構造（左側が資産、右側が負債・純資産）を理解していれば素早く解けます。</p>
        <div className="grid grid-cols-2 border-2 border-black max-w-md bg-white text-center text-sm">
          <div className="p-2 border-r border-b border-black font-bold bg-gray-100">流動資産</div>
          <div className="p-2 border-b border-black font-bold bg-gray-100">流動負債</div>
          <div className="p-2 border-r border-b border-black bg-orange-100">現金</div>
          <div className="p-2 border-b border-black">仕入債務</div>
          <div className="p-2 border-r border-b border-black">売掛金</div>
          <div className="p-2 border-b border-black font-bold bg-gray-100">固定負債</div>
          <div className="p-2 border-r border-b border-black">棚卸資産</div>
          <div className="p-2 border-b border-black">長期借入金</div>
          <div className="p-2 border-r border-black font-bold bg-gray-100">固定資産</div>
          <div className="p-2 border-t-2 border-black font-bold bg-gray-100 h-full flex items-center justify-center">純資産</div>
        </div>
        <p>選択肢ア：売掛金が減少すると、その分キャッシュ・フロー(現金)は増加します。よって適切です。</p>
        <div className="flex items-center space-x-2 text-sm max-w-md">
           <div className="grid grid-cols-2 border border-black w-full text-center">
              <div className="p-1 border-b border-r border-black bg-orange-100">現金 ↑</div>
              <div className="p-1 border-b border-black bg-gray-50"></div>
              <div className="p-1 border-r border-black bg-green-100">売掛金 ↓</div>
              <div className="p-1 border-black bg-gray-50"></div>
           </div>
        </div>
        <p>選択肢イ：仕入債務が減少すると、キャッシュ・フロー(現金)も減少します。不適切です。</p>
        <p>選択肢ウ：棚卸資産が増加すると、キャッシュ・フロー(現金)は減少します。不適切です。</p>
        <p>選択肢エ：長期借入金が減少すると、キャッシュ・フロー(現金)も減少します。不適切です。</p>
      </div>
    )
  },
  {
    id: "q4",
    year: "令和2年 第13問",
    title: "キャッシュ・フロー計算書",
    text: "キャッシュ・フロー計算書に関する記述として、最も適切なものはどれか。",
    options: [
      "「営業活動によるキャッシュ・フロー」の区分では、主要な取引ごとにキャッシュ・フローを総額表示しなければならない。",
      "受取利息及び受取配当金は、「営業活動によるキャッシュ・フロー」の区分に表示しなければならない。",
      "キャッシュ・フロー計算書の現金及び現金同等物期末残高と、貸借対照表の現金及び預金の期末残高は一致するとは限らない。",
      "法人税等の支払額は、「財務活動によるキャッシュ・フロー」の区分に表示される。"
    ],
    correctIndex: 2,
    explanation: (
      <div className="space-y-2">
        <p><strong>解答：ウ</strong></p>
        <p>選択肢ア：不適切。表示方法には直接法と間接法があり、間接法では取引ごとの総額表示は行いません。</p>
        <table className="w-full text-sm border-collapse border border-gray-400 mt-2">
          <thead>
            <tr className="bg-gray-100"><th className="border border-gray-400 p-2">表示方法</th><th className="border border-gray-400 p-2">特徴</th></tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-400 p-2 font-bold whitespace-nowrap">直接法</td>
              <td className="border border-gray-400 p-2">直接キャッシュの動きを伴う取引を記録し集計。活動ごとの資金の流れが分かりやすい。</td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-2 font-bold whitespace-nowrap">間接法</td>
              <td className="border border-gray-400 p-2">税引前当期純利益から出発し、キャッシュの動きを表すように修正。利益との差異の原因が分かりやすい。</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-2">選択肢イ：不適切。受取利息等は「営業活動」または「投資活動」のどちらかに表示することが認められています。</p>
        <p>選択肢ウ：適切。CF計算書の「現金及び現金同等物」は3ヶ月以内の定期預金を含みますが、貸借対照表の「現金及び預金」は1年以内の定期預金を含むため、範囲が異なり一致するとは限りません。</p>
        <p>選択肢エ：不適切。法人税等の支払額は、「営業活動によるキャッシュ・フロー」に区分されます。</p>
      </div>
    )
  },
  {
    id: "q5",
    year: "平成30年 第12問",
    title: "営業キャッシュ・フローの計算",
    text: "キャッシュ・フロー計算書に関する記述として、最も適切なものはどれか。",
    options: [
      "財務活動によるキャッシュ・フローの区分には、資金調達に関する収入や支出、有価証券の取得や売却、および貸し付けに関する収入や支出が表示される。",
      "仕入債務の増加額は、営業活動によるキャッシュ・フローの区分（間接法）において、△（マイナス）を付けて表示される。",
      "法人税等の支払額は、財務活動によるキャッシュ・フローの区分で表示される。",
      "利息および配当金の受取額については、営業活動によるキャッシュ・フローの区分で表示する方法と投資活動によるキャッシュ・フローの区分で表示する方法が認められている。"
    ],
    correctIndex: 3,
    explanation: (
      <div className="space-y-2">
        <p><strong>解答：エ</strong></p>
        <p>選択肢ア：不適切。有価証券の取得・売却、貸付に関する収支は「投資活動によるキャッシュ・フロー」に表示されます。</p>
        <p>選択肢イ：不適切。仕入債務の増加額は、間接法の営業活動CFにおいて、キャッシュ・フローのプラス要因として表示されます（調達源泉となるため）。</p>
        <p>選択肢ウ：不適切。法人税等の支払額は、「営業活動によるキャッシュ・フロー」区分に表示されます。</p>
        <p>選択肢エ：適切。利息および配当金の受取額は「営業活動」または「投資活動」の区分に表示する方法が認められています。</p>
      </div>
    )
  },
  {
    id: "q6",
    year: "令和4年 第13問(設問1)",
    title: "資金繰り",
    text: "A社では、X1年4月末に以下のような資金繰り表(一部抜粋)を作成した。\n【条件】\n①売上代金の20％は現金で受け取り、残額は翌月末に受け取る。\n②仕入高は翌月予想売上高の60％とする。仕入代金は全額現金で支払う。\n③すべての収入、支出は月末時点で発生するものとする。\n④5月末に事務用備品の購入支出が300万円予定されているが、それを除き、経常収支以外の収支はゼロである。\n⑤月末時点で資金残高が200万円を下回らないようにすることを資金管理の方針としている。\n\n【売上高予想】4月実績1000万, 5月予想1000万, 6月予想1200万, 7月予想1600万\n\nA社は資金不足を避けるため、金融機関からの借り入れを検討している。6月末の時点で資金残高が200万円を下回らないようにするには、いくら借り入れればよいか。最も適切なものを選べ。ただし、借入金の利息は年利率5％であり、1年分の利息を借入時に支払うものとする。",
    options: [
      "190万円",
      "200万円",
      "460万円",
      "660万円"
    ],
    correctIndex: 1,
    explanation: (
      <div className="space-y-2">
        <p><strong>解答：イ (200万円)</strong></p>
        <p>6月の資金状況を計算します。</p>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>6月現金仕入 ＝ 7月予想売上(1600) × 60％ ＝ 960万円</li>
          <li>6月支出合計 ＝ 6月現金仕入(960) ＋ 諸費用支払(表より540) ＝ 1,500万円</li>
          <li>6月収支過不足 ＝ 6月収入合計(表より1040) － 6月支出合計(1500) ＝ －460万円</li>
          <li>6月当月末残高(借入前) ＝ 5月末残高(470) ＋ 6月収支過不足(－460) ＝ 10万円</li>
        </ul>
        <p>6月末残高が200万円を下回らないために必要な借入金(Ｘ)を求めます。利息は5%先払いです。</p>
        <p className="bg-gray-100 p-2 font-mono text-sm">
          10 ＋ Ｘ － 0.05Ｘ ≧ 200<br/>
          0.95Ｘ ≧ 190<br/>
          Ｘ ≧ 200
        </p>
        <p>よって200万円以上の借入が必要です。</p>
      </div>
    )
  },
  {
    id: "q7",
    year: "令和4年 第13問(設問2)",
    title: "資金繰り",
    text: "【設問1と同条件】\n中小企業診断士であるあなたは、A社の経営者から、当座の資金繰り対策として銀行借り入れ以外の手段がないか、アドバイスを求められた。6月末の時点で資金残高が200万円を下回らないようにするための手段として、最も適切なものはどれか。",
    options: [
      "5月に予定されている事務用備品の購入支出のうち半額を現金払いとし、残額の支払いは7月に延期する。",
      "6月に予定されている諸費用支払のうち400万円を現金払いとし、残額の支払いは7月に延期する。",
      "仕入先と交渉して、6月の仕入代金のうち半額を現金払いとし、残額を買掛金(翌月末払い)とする。",
      "得意先と交渉して、5月の売上代金のうち半額を現金で受け取り、残額を売掛金(翌月末回収)とする。"
    ],
    correctIndex: 2,
    explanation: (
      <div className="space-y-2">
        <p><strong>解答：ウ</strong></p>
        <p>何もしない場合の6月末残高は 10万円 です。（設問1より）</p>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li><strong>選択肢ア：不適切。</strong>5月の備品(300万)の半額150万を延期すると、5月末残高は＋150万(＝620万)になりますが、6月末残高は 10＋150＝160万円 となり、200万円を下回ります。</li>
          <li><strong>選択肢イ：不適切。</strong>6月の諸費用(540万)のうち400万のみ支払い(140万延期)とすると、6月末残高は 10＋140＝150万円 となり、200万円を下回ります。</li>
          <li><strong>選択肢ウ：適切。</strong>6月の仕入(960万)の半額(480万)を翌月払いにすると、6月の支出が480万円減少し、6月末残高は 10＋480＝490万円 となり、200万円をクリアします。</li>
          <li><strong>選択肢エ：不適切。</strong>5月の現金売上が増えますが(元20%→50%)、その分6月に回収する売掛金が減るため、6月末時点での累計キャッシュ(残高)としては10万円のままであり、200万円を下回ります。</li>
        </ul>
      </div>
    )
  }
];

// ==========================================
// Main Application
// ==========================================
export default function App() {
  const [appState, setAppState] = useState('login'); // login, home, quiz, history
  const [userId, setUserId] = useState('');
  const [userData, setUserData] = useState({ results: {}, reviewFlags: {}, progress: { index: 0, mode: 'all' } });
  
  const [currentMode, setCurrentMode] = useState('all');
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resumePrompt, setResumePrompt] = useState(false);

  // Initialize Firebase Auth exactly once
  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
        console.log("Firebase anonymous auth successful");
      } catch (err) {
        console.error("Auth error:", err);
      }
    };
    initAuth();
  }, []);

  // Fetch user data from Firestore
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!userId.trim()) return;
    
    setIsLoading(true);
    setErrorMsg('');
    try {
      const docRef = doc(db, APP_ID, userId);
      const docSnap = await getDoc(docRef);
      
      let data = { results: {}, reviewFlags: {}, progress: { index: 0, mode: 'all' } };
      if (docSnap.exists()) {
        const d = docSnap.data();
        data = {
          results: d?.results || {},
          reviewFlags: d?.reviewFlags || {},
          progress: d?.progress || { index: 0, mode: 'all' }
        };
        console.log("Data loaded from Firestore:", data);
      } else {
        await setDoc(docRef, data);
        console.log("New user initialized");
      }
      setUserData(data);
      
      if (data.progress && data.progress.index > 0) {
        setResumePrompt(true);
      } else {
        setAppState('home');
      }
    } catch (err) {
      console.error("Login/Fetch error:", err);
      setErrorMsg("データの取得に失敗しました。通信環境を確認してください。");
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    setUserId('');
    setUserData({ results: {}, reviewFlags: {}, progress: { index: 0, mode: 'all' } });
    setAppState('login');
    setResumePrompt(false);
  };

  // Build question list based on mode
  const getFilteredList = (mode, data) => {
    if (mode === 'wrong') {
      return questionsData.filter(q => data.results?.[q.id]?.last === false);
    }
    if (mode === 'review') {
      return questionsData.filter(q => data.reviewFlags?.[q.id] === true);
    }
    return questionsData;
  };

  const startQuiz = async (mode, isResume = false) => {
    const list = getFilteredList(mode, userData);
    if (list.length === 0 && !isResume) {
      alert("該当する問題がありません。");
      return;
    }
    setCurrentMode(mode);
    setFilteredQuestions(list);
    setCurrentIndex(isResume ? userData.progress.index : 0);
    setIsAnswered(false);
    setSelectedOption(null);
    setAppState('quiz');
    setResumePrompt(false);
    
    if (!isResume) {
      await updateProgressInDb(0, mode);
    }
  };

  const resumeQuiz = () => {
    startQuiz(userData.progress.mode, true);
  };

  const discardProgressAndGoHome = async () => {
    await updateProgressInDb(0, 'all');
    setResumePrompt(false);
    setAppState('home');
  };

  const updateProgressInDb = async (index, mode) => {
    try {
      const docRef = doc(db, APP_ID, userId);
      const newProgress = { index, mode };
      await updateDoc(docRef, { progress: newProgress });
      setUserData(prev => ({ ...prev, progress: newProgress }));
      console.log(`Progress saved: index ${index}, mode ${mode}`);
    } catch (err) {
      console.error("Failed to save progress", err);
    }
  };

  const handleAnswer = async (optIdx) => {
    if (isAnswered) return;
    
    setSelectedOption(optIdx);
    setIsAnswered(true);
    
    const q = filteredQuestions[currentIndex];
    const isCorrect = optIdx === q.correctIndex;
    
    const currentResults = userData.results?.[q.id] || { correct: 0, wrong: 0 };
    const newResults = {
      ...userData.results,
      [q.id]: {
        correct: currentResults.correct + (isCorrect ? 1 : 0),
        wrong: currentResults.wrong + (isCorrect ? 0 : 1),
        last: isCorrect
      }
    };
    
    try {
      const docRef = doc(db, APP_ID, userId);
      await updateDoc(docRef, { results: newResults });
      setUserData(prev => ({ ...prev, results: newResults }));
      console.log("Result saved to Firestore");
    } catch (err) {
      console.error("Failed to save result", err);
    }
  };

  const handleNext = async () => {
    const nextIdx = currentIndex + 1;
    if (nextIdx < filteredQuestions.length) {
      setCurrentIndex(nextIdx);
      setIsAnswered(false);
      setSelectedOption(null);
      await updateProgressInDb(nextIdx, currentMode);
    } else {
      // Finished
      await updateProgressInDb(0, 'all');
      setAppState('home');
    }
  };

  const toggleReview = async (qId) => {
    const isReviewed = !userData.reviewFlags?.[qId];
    const newFlags = { ...userData.reviewFlags, [qId]: isReviewed };
    
    try {
      const docRef = doc(db, APP_ID, userId);
      await updateDoc(docRef, { reviewFlags: newFlags });
      setUserData(prev => ({ ...prev, reviewFlags: newFlags }));
      console.log(`Review flag for ${qId} set to ${isReviewed}`);
    } catch (err) {
      console.error("Failed to toggle review", err);
    }
  };

  const backToHome = async () => {
    // Save progress on exit
    await updateProgressInDb(currentIndex, currentMode);
    setAppState('home');
  };

  // ==========================================
  // Render: Loading Overlay
  // ==========================================
  const renderLoading = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg text-center flex flex-col items-center">
        <RefreshCcw className="w-8 h-8 animate-spin text-blue-500 mb-4" />
        <p>Loading...</p>
      </div>
    </div>
  );

  // ==========================================
  // Render: Login Screen
  // ==========================================
  if (appState === 'login') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        {isLoading && renderLoading()}
        {!resumePrompt ? (
          <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full">
                <Bookmark className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center mb-2">過去問セレクト演習</h1>
            <p className="text-center text-gray-500 mb-8">キャッシュ・フロー計算書</p>
            
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  合言葉 (ユーザーID)
                </label>
                <input 
                  type="text" 
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="PCとスマホで同じ言葉を入力"
                  required
                />
                <p className="text-xs text-gray-400 mt-2">入力した合言葉で学習履歴が同期されます。</p>
              </div>
              {errorMsg && <p className="text-red-500 text-sm mb-4">{errorMsg}</p>}
              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded hover:bg-blue-700 transition"
              >
                学習をはじめる
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
            <AlertCircle className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-4">学習の続きから再開しますか？</h2>
            <p className="text-gray-600 mb-6">前回は【問題{userData.progress.index + 1}】まで進んでいます。</p>
            <div className="space-y-3">
              <button 
                onClick={resumeQuiz}
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded hover:bg-blue-700 transition flex justify-center items-center"
              >
                <Play className="w-5 h-5 mr-2" /> 続きから再開する
              </button>
              <button 
                onClick={discardProgressAndGoHome}
                className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded hover:bg-gray-300 transition"
              >
                最初から始める (ホームへ)
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // Render: Home Screen
  // ==========================================
  if (appState === 'home') {
    const wrongCount = questionsData.filter(q => userData.results?.[q.id]?.last === false).length;
    const reviewCount = questionsData.filter(q => userData.reviewFlags?.[q.id] === true).length;
    
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
        {isLoading && renderLoading()}
        <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">メニュー</h1>
              <p className="text-blue-200 text-sm mt-1">ID: {userId}</p>
            </div>
            <button onClick={handleLogout} className="p-2 bg-blue-700 rounded hover:bg-blue-800" title="ログアウト">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            <button 
              onClick={() => startQuiz('all')}
              className="w-full text-left bg-gray-50 hover:bg-blue-50 border border-gray-200 p-4 rounded flex items-center justify-between group transition"
            >
              <div>
                <h3 className="font-bold text-gray-800 group-hover:text-blue-600">すべての問題</h3>
                <p className="text-xs text-gray-500 mt-1">全{questionsData.length}問を通しで学習します</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
            </button>
            
            <button 
              onClick={() => startQuiz('wrong')}
              disabled={wrongCount === 0}
              className={`w-full text-left border p-4 rounded flex items-center justify-between group transition ${wrongCount === 0 ? 'bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed' : 'bg-red-50 hover:bg-red-100 border-red-200'}`}
            >
              <div>
                <h3 className="font-bold text-gray-800 group-hover:text-red-600">前回不正解のみ</h3>
                <p className="text-xs text-gray-500 mt-1">該当: {wrongCount}問</p>
              </div>
              <ChevronRight className={`w-5 h-5 ${wrongCount === 0 ? 'text-gray-300' : 'text-red-400 group-hover:text-red-600'}`} />
            </button>
            
            <button 
              onClick={() => startQuiz('review')}
              disabled={reviewCount === 0}
              className={`w-full text-left border p-4 rounded flex items-center justify-between group transition ${reviewCount === 0 ? 'bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed' : 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200'}`}
            >
              <div>
                <h3 className="font-bold text-gray-800 group-hover:text-yellow-600">要復習のみ</h3>
                <p className="text-xs text-gray-500 mt-1">該当: {reviewCount}問</p>
              </div>
              <ChevronRight className={`w-5 h-5 ${reviewCount === 0 ? 'text-gray-300' : 'text-yellow-400 group-hover:text-yellow-600'}`} />
            </button>
            
            <button 
              onClick={() => setAppState('history')}
              className="w-full text-center bg-gray-800 text-white font-bold py-3 rounded hover:bg-gray-900 mt-4 flex items-center justify-center transition"
            >
              <BarChart className="w-5 h-5 mr-2" /> 学習履歴を見る
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // Render: Quiz Screen
  // ==========================================
  if (appState === 'quiz') {
    if (!filteredQuestions || filteredQuestions.length === 0) return null;
    const q = filteredQuestions[currentIndex];
    
    return (
      <div className="min-h-screen bg-gray-50 py-6 px-4 flex justify-center">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={backToHome} className="text-gray-500 hover:text-gray-800 flex items-center text-sm">
              <Home className="w-4 h-4 mr-1" /> ホームに戻る
            </button>
            <div className="text-sm font-bold text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
              {currentIndex + 1} / {filteredQuestions.length}
            </div>
          </div>
          
          {/* Question Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded mr-2">
                  {q.year}
                </span>
                <h2 className="text-lg font-bold text-gray-800 mt-2">{q.title}</h2>
              </div>
              <button 
                onClick={() => toggleReview(q.id)}
                className={`flex items-center text-sm font-bold px-3 py-1.5 rounded transition border ${userData.reviewFlags?.[q.id] ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200'}`}
              >
                <Bookmark className={`w-4 h-4 mr-1 ${userData.reviewFlags?.[q.id] ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                要復習
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed mb-6">{q.text}</p>
              
              <div className="space-y-3">
                {q.options.map((opt, idx) => {
                  let btnClass = "w-full text-left p-4 rounded border-2 transition ";
                  if (!isAnswered) {
                    btnClass += "border-gray-200 hover:border-blue-400 hover:bg-blue-50 bg-white";
                  } else {
                    if (idx === q.correctIndex) {
                      btnClass += "border-green-500 bg-green-50 font-bold";
                    } else if (idx === selectedOption) {
                      btnClass += "border-red-500 bg-red-50";
                    } else {
                      btnClass += "border-gray-200 bg-gray-50 opacity-50";
                    }
                  }
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={isAnswered}
                      className={btnClass}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex-1">{opt}</span>
                        {isAnswered && idx === q.correctIndex && <Check className="w-5 h-5 text-green-600 ml-2 flex-shrink-0" />}
                        {isAnswered && idx === selectedOption && idx !== q.correctIndex && <X className="w-5 h-5 text-red-600 ml-2 flex-shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Explanation Area */}
          {isAnswered && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden animate-fade-in-up">
              <div className={`px-6 py-3 border-b text-white font-bold flex items-center ${selectedOption === q.correctIndex ? 'bg-green-600' : 'bg-red-600'}`}>
                {selectedOption === q.correctIndex ? (
                  <><Check className="w-5 h-5 mr-2" /> 正解</>
                ) : (
                  <><X className="w-5 h-5 mr-2" /> 不正解</>
                )}
              </div>
              <div className="p-6 text-gray-700 text-sm leading-relaxed">
                <h3 className="font-bold text-lg mb-3 border-b pb-2">解説</h3>
                {q.explanation}
              </div>
              
              <div className="p-6 bg-gray-50 border-t flex justify-end">
                <button 
                  onClick={handleNext}
                  className="bg-blue-600 text-white font-bold py-3 px-6 rounded hover:bg-blue-700 transition flex items-center"
                >
                  {currentIndex + 1 < filteredQuestions.length ? (
                    <>次の問題へ <ArrowRight className="w-5 h-5 ml-2" /></>
                  ) : (
                    <>完了してホームへ <Home className="w-5 h-5 ml-2" /></>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // Render: History Screen
  // ==========================================
  if (appState === 'history') {
    const chartData = questionsData.map((q, i) => {
      const res = userData.results?.[q.id] || { correct: 0, wrong: 0 };
      return {
        name: `問${i + 1}`,
        correct: res.correct,
        wrong: res.wrong,
        total: res.correct + res.wrong,
      };
    });

    return (
      <div className="min-h-screen bg-gray-50 py-6 px-4 flex justify-center">
        <div className="w-full max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">学習履歴</h1>
            <button onClick={() => setAppState('home')} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition flex items-center">
              <Home className="w-4 h-4 mr-2" /> 戻る
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">正答回数グラフ</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="correct" name="正解" stackId="a" fill="#10B981" />
                  <Bar dataKey="wrong" name="不正解" stackId="a" fill="#EF4444" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <h2 className="text-lg font-bold p-6 border-b">問題別ステータス</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3">問題</th>
                    <th className="px-6 py-3">直近の結果</th>
                    <th className="px-6 py-3">正解 / 挑戦</th>
                    <th className="px-6 py-3 text-center">要復習</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {questionsData.map((q, i) => {
                    const res = userData.results?.[q.id];
                    const isReviewed = userData.reviewFlags?.[q.id];
                    return (
                      <tr key={q.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          問{i + 1} <span className="text-xs text-gray-500 ml-1">({q.year})</span>
                        </td>
                        <td className="px-6 py-4">
                          {res === undefined ? (
                            <span className="text-gray-400">-</span>
                          ) : res.last ? (
                            <span className="text-green-600 font-bold flex items-center"><Check className="w-4 h-4 mr-1"/>正解</span>
                          ) : (
                            <span className="text-red-600 font-bold flex items-center"><X className="w-4 h-4 mr-1"/>不正解</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {res ? `${res.correct} / ${res.correct + res.wrong}` : '0 / 0'}
                        </td>
                        <td className="px-6 py-4 flex justify-center">
                          {isReviewed && <Bookmark className="w-5 h-5 text-yellow-500 fill-yellow-500" />}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}