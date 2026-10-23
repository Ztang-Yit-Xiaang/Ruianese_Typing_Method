import { useEffect, useState } from "react";
import { AdminPanel } from "./Admin";
import { Collector } from "./Collector";

function currentView() {
  return window.location.hash === "#admin" ? "admin" : "collect";
}

export function App() {
  const [view, setView] = useState(currentView);

  useEffect(() => {
    const onHashChange = () => setView(currentView());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <div className="page">
      <header className="masthead">
        <a className="brand" href="#">
          <span className="seal" aria-hidden="true">瑞</span>
          <span>
            <strong>瑞安話語音采集</strong>
            <small>{view === "admin" ? "管理頁" : "幫瑞安話留下聲音"}</small>
          </span>
        </a>
        <a className="masthead-link" href="../">瑞安話輸入法 ↗</a>
      </header>

      {view === "admin" ? <AdminPanel /> : <Collector />}

      <footer className="footnote">
        <span>錄音只用於方言研究和語音識別訓練，公開前會再審核。</span>
        {view === "admin" ? <a href="#">回到采集</a> : <a href="#admin">管理</a>}
      </footer>
    </div>
  );
}
