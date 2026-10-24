import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronRight, List, Loader2, Mic, RotateCcw, SkipForward, Square } from "lucide-react";
import {
  Dialect,
  SpeakerMeta,
  Task,
  TaskType,
  checkHealth,
  fetchTasks,
  pickRecordingFormat,
  submitRecording,
  verifyInvitation
} from "./api";

type Step = "welcome" | "profile" | "record";
type RecState = "idle" | "recording" | "ready" | "submitting";

const dialectLabels: Record<string, string> = { ruian: "瑞安話", wenzhou: "溫州話" };
const typeLabels: Record<TaskType, string> = { word: "字詞", sentence: "短句" };

const MAX_SECONDS = 30;
const MIN_SECONDS = 0.5;
const BAR_COUNT = 28;

// Shown when the collection server is offline, so people can still try the recorder.
const practiceTasks: Task[] = [
  ["吃飯", "qi4 vo7"],
  ["天光", "tie1 gu1"],
  ["講話", "gu2 va7"],
  ["外婆", "va7 bbyu5"],
  ["落雨", "lo8 vyu6"],
  ["日晝", "neh8 zau3"],
  ["黃昏", "hhu5 xyue1"]
].map(([text, romanization], index) => ({
  id: `practice-${index}`,
  dialect: "ruian",
  type: "word" as TaskType,
  text,
  romanization,
  source: "試錄",
  priority: 0,
  status: "ready"
}));

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private browsing: the form just won't be remembered.
  }
}

function errorText(error: unknown) {
  return error instanceof Error ? error.message : "出了點問題，請再試一次。";
}

export function Collector() {
  const [server, setServer] = useState<"checking" | "online" | "offline">("checking");
  const [practice, setPractice] = useState(false);
  const [step, setStep] = useState<Step>("welcome");
  const [inviteCode, setInviteCode] = useState(() => load("collector.invite", ""));
  const [verifiedCode, setVerifiedCode] = useState("");
  const [meta, setMeta] = useState<SpeakerMeta>(() =>
    load("collector.meta", { region: "", ageGroup: "", gender: "", dialectPoint: "" })
  );
  const [consent, setConsent] = useState(() => load("collector.consent", false));
  const [dialect, setDialect] = useState<Dialect>("ruian");
  const [taskType, setTaskType] = useState<TaskType | "">("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [done, setDone] = useState<string[]>(() => load("collector.done", []));
  const [index, setIndex] = useState(0);
  const [showList, setShowList] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [recState, setRecState] = useState<RecState>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [audioUrl, setAudioUrl] = useState("");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const blobRef = useRef<Blob | null>(null);
  const durationRef = useRef(0);
  const formatRef = useRef(pickRecordingFormat());
  const meterRef = useRef<HTMLDivElement | null>(null);
  const cleanupRef = useRef<() => void>(() => {});

  const task = tasks[index];
  const doneSet = useMemo(() => new Set(done), [done]);
  const doneCount = tasks.filter((item) => doneSet.has(item.id)).length;

  useEffect(() => {
    void checkHealth().then((ok) => setServer(ok ? "online" : "offline"));
    return () => cleanupRef.current();
  }, []);

  useEffect(() => save("collector.done", done), [done]);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const clearMeter = useCallback(() => {
    const bars = meterRef.current?.children;
    if (bars) Array.from(bars).forEach((bar) => ((bar as HTMLElement).style.transform = ""));
  }, []);

  const resetRecording = useCallback(() => {
    clearMeter();
    blobRef.current = null;
    durationRef.current = 0;
    setAudioUrl("");
    setElapsed(0);
    setRecState("idle");
  }, [clearMeter]);

  function goTo(nextIndex: number) {
    if (recState === "recording") return;
    resetRecording();
    setNotice("");
    setError("");
    setIndex(nextIndex);
    setShowList(false);
  }

  function nextUndone(from: number, list = tasks, finished = doneSet) {
    for (let offset = 1; offset <= list.length; offset += 1) {
      const candidate = (from + offset) % list.length;
      if (!finished.has(list[candidate].id)) return candidate;
    }
    return -1;
  }

  async function loadTasks(code: string, nextDialect: Dialect, nextType: TaskType | "") {
    const nextTasks = await fetchTasks(code, nextDialect, nextType);
    setTasks(nextTasks);
    const first = nextTasks.findIndex((item) => !doneSet.has(item.id));
    setIndex(first === -1 ? 0 : first);
    resetRecording();
  }

  async function enterWithCode() {
    const code = inviteCode.trim().toUpperCase();
    if (!code) {
      setError("請輸入邀請碼。");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const invite = await verifyInvitation(code);
      const hinted = invite.dialect_hint === "ruian" || invite.dialect_hint === "wenzhou" ? invite.dialect_hint : "ruian";
      setVerifiedCode(invite.code);
      setDialect(hinted);
      save("collector.invite", invite.code);
      await loadTasks(invite.code, hinted, taskType);
      setPractice(false);
      setStep("profile");
    } catch (caught) {
      setError(errorText(caught));
    } finally {
      setBusy(false);
    }
  }

  function enterPractice() {
    setPractice(true);
    setTasks(practiceTasks);
    setIndex(0);
    setError("");
    resetRecording();
    setStep("record");
  }

  function saveProfile() {
    if (!meta.region.trim() || !meta.ageGroup || !meta.dialectPoint.trim()) {
      setError("請填好地區、年齡段和方言點。");
      return;
    }
    if (!consent) {
      setError("需要先勾選同意，才能提交錄音。");
      return;
    }
    save("collector.meta", meta);
    save("collector.consent", consent);
    setError("");
    setStep("record");
  }

  async function changeFilter(nextDialect: Dialect, nextType: TaskType | "") {
    setDialect(nextDialect);
    setTaskType(nextType);
    try {
      await loadTasks(verifiedCode, nextDialect, nextType);
    } catch (caught) {
      setError(errorText(caught));
    }
  }

  async function startRecording() {
    if (!task) return;
    setError("");
    setNotice("");
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: true }
      });
    } catch {
      setError("沒有拿到麥克風權限。請在瀏覽器地址欄旁邊允許使用麥克風，再按一次。");
      return;
    }

    const { mimeType } = formatRef.current;
    const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    chunksRef.current = [];
    recorderRef.current = recorder;

    // Live level meter, drawn straight to the DOM to avoid re-rendering every frame.
    const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const context = new AudioCtx();
    const analyser = context.createAnalyser();
    analyser.fftSize = 512;
    context.createMediaStreamSource(stream).connect(analyser);
    const samples = new Uint8Array(analyser.fftSize);
    const levels: number[] = Array(BAR_COUNT).fill(0);
    const startedAt = performance.now();
    let frame = 0;
    let lastPush = 0;

    const tick = (now: number) => {
      analyser.getByteTimeDomainData(samples);
      let peak = 0;
      for (const sample of samples) peak = Math.max(peak, Math.abs(sample - 128));
      if (now - lastPush > 70) {
        levels.shift();
        levels.push(Math.min(1, peak / 70));
        lastPush = now;
        const bars = meterRef.current?.children;
        if (bars) levels.forEach((level, i) => ((bars[i] as HTMLElement).style.transform = `scaleY(${0.08 + level * 0.92})`));
      }
      const seconds = (now - startedAt) / 1000;
      setElapsed(seconds);
      if (seconds >= MAX_SECONDS && recorder.state === "recording") recorder.stop();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    cleanupRef.current = () => {
      cancelAnimationFrame(frame);
      stream.getTracks().forEach((track) => track.stop());
      void context.close().catch(() => {});
    };

    recorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    });
    recorder.addEventListener("stop", () => {
      cleanupRef.current();
      clearMeter();
      const seconds = (performance.now() - startedAt) / 1000;
      if (seconds < MIN_SECONDS) {
        resetRecording();
        setError("錄音太短了。按一下開始，讀完再按一下停止。");
        return;
      }
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || mimeType || "audio/webm" });
      blobRef.current = blob;
      durationRef.current = seconds;
      setElapsed(seconds);
      setAudioUrl(URL.createObjectURL(blob));
      setRecState("ready");
    });

    recorder.start();
    setRecState("recording");
  }

  function stopRecording() {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  }

  async function submitAndNext() {
    if (!task || !blobRef.current) return;
    setRecState("submitting");
    setError("");
    try {
      if (!practice) {
        const result = await submitRecording({
          inviteCode: verifiedCode,
          task,
          meta,
          consent,
          duration: durationRef.current,
          browserInfo: {
            userAgent: navigator.userAgent,
            mimeType: blobRef.current.type,
            recordedAt: new Date().toISOString()
          },
          blob: blobRef.current,
          extension: formatRef.current.extension
        });
        setNotice(result.review_status === "needs_review" ? `「${task.text}」已提交，等待人工審核。` : `「${task.text}」已提交，多謝！`);
      } else {
        setNotice(`「${task.text}」試錄完成（沒有上傳）。`);
      }
      const finished = new Set(doneSet).add(task.id);
      setDone([...finished]);
      resetRecording();
      const next = nextUndone(index, tasks, finished);
      if (next !== -1) setIndex(next);
    } catch (caught) {
      setRecState("ready");
      setError(`提交失敗：${errorText(caught)}`);
    }
  }

  // Space: record / stop. Enter: submit. Right arrow: skip.
  useEffect(() => {
    if (step !== "record") return;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest("input, select, textarea, audio")) return;
      if (event.code === "Space") {
        event.preventDefault();
        if (recState === "recording") stopRecording();
        else if (recState !== "submitting") void startRecording();
      } else if (event.key === "Enter" && recState === "ready") {
        event.preventDefault();
        void submitAndNext();
      } else if (event.key === "ArrowRight" && recState !== "recording" && tasks.length) {
        goTo((index + 1) % tasks.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (step === "welcome") {
    return (
      <main className="sheet narrow">
        <p className="kicker">一 · 進入</p>
        <h1 className="headline">用你的瑞安話，讀幾個字詞給我們聽。</h1>
        <p className="lede">
          每次顯示一個字詞或短句。按下錄音，照你平時的講法讀一遍，聽一下，滿意就提交。
          錄好的聲音會用來做瑞安話的語音識別和方言研究。
        </p>

        {server === "offline" ? (
          <div className="callout">
            <strong>采集服務器暫時沒有開放。</strong>
            <span>你可以先試錄，熟悉一下流程；試錄的聲音不會上傳。</span>
            <button className="btn primary" onClick={enterPractice}>
              開始試錄 <ChevronRight size={18} />
            </button>
          </div>
        ) : (
          <form
            className="invite"
            onSubmit={(event) => {
              event.preventDefault();
              void enterWithCode();
            }}
          >
            <label htmlFor="invite-code">邀請碼</label>
            <div className="invite-row">
              <input
                id="invite-code"
                value={inviteCode}
                onChange={(event) => setInviteCode(event.target.value)}
                placeholder="例：RUIAN-XXXX"
                autoCapitalize="characters"
                autoComplete="off"
                spellCheck={false}
              />
              <button className="btn primary" type="submit" disabled={busy || server === "checking"}>
                {busy || server === "checking" ? <Loader2 size={18} className="spin" /> : null}
                進入
              </button>
            </div>
            <p className="hint">沒有邀請碼？請向組織者索取。也可以<button type="button" className="text-btn" onClick={enterPractice}>先試錄一下</button>。</p>
          </form>
        )}
        {error && <p className="alert">{error}</p>}

        <ol className="how">
          <li><span>1</span>填一次你的基本資料</li>
          <li><span>2</span>按錄音，讀出屏幕上的字</li>
          <li><span>3</span>聽一遍，提交，自動到下一條</li>
        </ol>
      </main>
    );
  }

  if (step === "profile") {
    return (
      <main className="sheet narrow">
        <p className="kicker">二 · 關於你</p>
        <h1 className="headline">先告訴我們你講的是哪裡的話。</h1>
        <p className="lede">只問一次，這台設備會記住。不收集姓名和電話。</p>

        <form
          className="profile"
          onSubmit={(event) => {
            event.preventDefault();
            saveProfile();
          }}
        >
          <label>
            你在哪裡長大
            <input value={meta.region} onChange={(event) => setMeta({ ...meta, region: event.target.value })} placeholder="例：瑞安塘下、飛雲、湖嶺" />
          </label>
          <label>
            你講的方言點
            <input value={meta.dialectPoint} onChange={(event) => setMeta({ ...meta, dialectPoint: event.target.value })} placeholder="例：瑞安城關" />
          </label>
          <fieldset>
            <legend>年齡段</legend>
            <div className="chips">
              {["18-29", "30-39", "40-49", "50-64", "65+"].map((age) => (
                <button type="button" key={age} className={meta.ageGroup === age ? "chip on" : "chip"} onClick={() => setMeta({ ...meta, ageGroup: age })}>
                  {age}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>性別 <small>（可不填）</small></legend>
            <div className="chips">
              {["女", "男", "不便透露"].map((gender) => (
                <button type="button" key={gender} className={meta.gender === gender ? "chip on" : "chip"} onClick={() => setMeta({ ...meta, gender: meta.gender === gender ? "" : gender })}>
                  {gender}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="consent">
            <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
            <span>我同意這些錄音用於方言研究和語音識別訓練。公開資料集發布前會另行審核。</span>
          </label>
          {error && <p className="alert">{error}</p>}
          <div className="actions">
            <button type="button" className="btn ghost" onClick={() => setStep("welcome")}>返回</button>
            <button type="submit" className="btn primary">開始錄音 <ChevronRight size={18} /></button>
          </div>
        </form>
      </main>
    );
  }

  const percent = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  return (
    <main className="studio">
      <div className="studio-bar">
        <div className="progress" aria-label={`已完成 ${doneCount} / ${tasks.length}`}>
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <span className="progress-text">
          {practice ? "試錄 · " : ""}已錄 <strong>{doneCount}</strong> / {tasks.length}
        </span>
        <button className="btn ghost small" onClick={() => setShowList((open) => !open)} aria-expanded={showList}>
          <List size={16} />全部
        </button>
      </div>

      {showList && (
        <div className="drawer">
          {!practice && (
            <div className="filters">
              <div className="chips">
                {(["ruian", "wenzhou"] as Dialect[]).map((value) => (
                  <button key={value} className={dialect === value ? "chip on" : "chip"} onClick={() => void changeFilter(value, taskType)}>
                    {dialectLabels[value]}
                  </button>
                ))}
              </div>
              <div className="chips">
                {([["", "全部"], ["word", "字詞"], ["sentence", "短句"]] as Array<[TaskType | "", string]>).map(([value, label]) => (
                  <button key={value || "all"} className={taskType === value ? "chip on" : "chip"} onClick={() => void changeFilter(dialect, value)}>
                    {label}
                  </button>
                ))}
              </div>
              <button className="text-btn" onClick={() => setStep("profile")}>修改我的資料</button>
            </div>
          )}
          <ul className="task-grid">
            {tasks.map((item, i) => (
              <li key={item.id}>
                <button className={`task-chip${i === index ? " current" : ""}${doneSet.has(item.id) ? " done" : ""}`} onClick={() => goTo(i)}>
                  {doneSet.has(item.id) && <Check size={13} />}
                  {item.text}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {task ? (
        <section className="prompt-card">
          <div className="prompt-tags">
            <span>{dialectLabels[task.dialect] ?? task.dialect}</span>
            <span>{typeLabels[task.type]}</span>
            {doneSet.has(task.id) && <span className="tag-done">已錄過</span>}
          </div>
          <p className={`prompt-text${task.text.length > 8 ? " long" : ""}`}>{task.text}</p>
          <p className="prompt-roman">{task.romanization || "照你平時的講法自然讀出來"}</p>

          <div className={`meter${recState === "recording" ? " live" : ""}`} ref={meterRef} aria-hidden="true">
            {Array.from({ length: BAR_COUNT }).map((_, i) => <i key={i} />)}
          </div>

          <div className="record-zone">
            {recState === "recording" ? (
              <button className="rec-btn stop" onClick={stopRecording} aria-label="停止錄音">
                <Square size={30} fill="currentColor" />
              </button>
            ) : (
              <button
                className="rec-btn"
                onClick={() => void startRecording()}
                disabled={recState === "submitting"}
                aria-label={recState === "ready" ? "重新錄音" : "開始錄音"}
              >
                <Mic size={34} />
              </button>
            )}
            <p className="rec-status">
              {recState === "idle" && "按一下開始錄音"}
              {recState === "recording" && <><span className="dot" />錄音中 {elapsed.toFixed(1)}s · 讀完按停止</>}
              {recState === "ready" && `錄好了 ${elapsed.toFixed(1)}s · 聽一遍再提交`}
              {recState === "submitting" && "提交中…"}
            </p>
          </div>

          {audioUrl && <audio className="playback" controls src={audioUrl} />}

          <div className="actions">
            {recState === "ready" || recState === "submitting" ? (
              <>
                <button className="btn ghost" onClick={resetRecording} disabled={recState === "submitting"}>
                  <RotateCcw size={17} />重錄
                </button>
                <button className="btn primary" onClick={() => void submitAndNext()} disabled={recState === "submitting"}>
                  {recState === "submitting" ? <Loader2 size={18} className="spin" /> : <Check size={18} />}
                  {practice ? "下一條" : "提交 · 下一條"}
                </button>
              </>
            ) : (
              <button className="btn ghost" onClick={() => goTo((index + 1) % tasks.length)} disabled={recState === "recording"}>
                <SkipForward size={17} />跳過這條
              </button>
            )}
          </div>

          {error && <p className="alert">{error}</p>}
          {notice && !error && <p className="notice">{notice}</p>}
          {doneCount === tasks.length && tasks.length > 0 && (
            <p className="notice">這一組全部錄完了，多謝你！可以在「全部」裡換一組，或者隨時再來。</p>
          )}
        </section>
      ) : (
        <section className="prompt-card empty">
          <p>暫時沒有可錄的任務。換一個方言或類型試試。</p>
        </section>
      )}

      <p className="tips">
        小提示：在安靜的房間裡錄，手機離嘴巴一拳左右。電腦上可以用空格鍵開始/停止，回車鍵提交。
      </p>
    </main>
  );
}
