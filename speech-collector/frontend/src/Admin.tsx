import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import {
  DictionaryEntry,
  DictionarySource,
  Invitation,
  TaskType,
  createInvitations,
  createTaskFromEntry,
  exportManifestUrl,
  fetchDictionaryEntries,
  fetchDictionarySources,
  fetchInvitations,
  updateDictionaryEntry
} from "./api";

const dialectLabels: Record<string, string> = { ruian: "瑞安話", wenzhou: "溫州話" };
const TOKEN_KEY = "speechCollectorAdminToken";

function readToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) ?? "";
  } catch {
    return "";
  }
}

export function AdminPanel() {
  const [token, setToken] = useState(readToken);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [sources, setSources] = useState<DictionarySource[]>([]);
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [sourceFilter, setSourceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [inviteForm, setInviteForm] = useState({
    count: 5,
    dialect_hint: "ruian",
    label: "",
    max_uses: 1,
    expires_at: "",
    note: ""
  });

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "請求失敗");
    } finally {
      setBusy(false);
    }
  }

  const loadAdminData = () =>
    run(async () => {
      try {
        localStorage.setItem(TOKEN_KEY, token);
      } catch {
        // Not remembered; harmless.
      }
      const [nextInvites, nextSources, nextEntries] = await Promise.all([
        fetchInvitations(token),
        fetchDictionarySources(token),
        fetchDictionaryEntries(token, statusFilter, sourceFilter)
      ]);
      setInvitations(nextInvites);
      setSources(nextSources);
      setEntries(nextEntries);
      setLoaded(true);
      setMessage("");
    });

  const createCodes = () =>
    run(async () => {
      const created = await createInvitations(token, inviteForm);
      setMessage(`已生成 ${created.length} 個邀請碼：${created.map((item) => item.code).join("  ")}`);
      setInvitations(await fetchInvitations(token));
    });

  const patchEntry = (entry: DictionaryEntry, patch: Partial<DictionaryEntry>) =>
    run(async () => {
      const updated = await updateDictionaryEntry(token, entry.id, patch);
      setEntries((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setMessage(`已更新「${updated.text}」`);
    });

  const addTask = (entry: DictionaryEntry) =>
    run(async () => {
      const task = await createTaskFromEntry(token, entry.id);
      setEntries((current) => current.map((item) => (item.id === entry.id ? { ...item, task_id: task.id } : item)));
      setMessage(`已加入任務：${task.text}`);
    });

  const reloadEntries = (nextStatus: string, nextSource: string) =>
    run(async () => {
      setStatusFilter(nextStatus);
      setSourceFilter(nextSource);
      setEntries(await fetchDictionaryEntries(token, nextStatus, nextSource));
    });

  const editLocal = (id: string, patch: Partial<DictionaryEntry>) =>
    setEntries((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  return (
    <main className="sheet admin">
      <section className="card">
        <h2>登入</h2>
        <p className="muted">輸入管理密碼，即啟動采集服務器時設定的 <code>ADMIN_TOKEN</code>。</p>
        <form
          className="invite-row"
          onSubmit={(event) => {
            event.preventDefault();
            void loadAdminData();
          }}
        >
          <input type="password" value={token} onChange={(event) => setToken(event.target.value)} placeholder="管理密碼" aria-label="管理密碼" autoComplete="off" />
          <button className="btn primary" type="submit" disabled={busy || !token}>
            {busy && <Loader2 size={16} className="spin" />}載入
          </button>
        </form>
        {error && <p className="alert">{error}</p>}
        {message && <p className="notice">{message}</p>}
      </section>

      {loaded && (
        <>
          <div className="admin-columns">
            <section className="card">
              <h2>生成邀請碼</h2>
              <div className="form-grid">
                <label>數量<input type="number" min={1} max={200} value={inviteForm.count} onChange={(event) => setInviteForm({ ...inviteForm, count: Number(event.target.value) })} /></label>
                <label>方言<select value={inviteForm.dialect_hint} onChange={(event) => setInviteForm({ ...inviteForm, dialect_hint: event.target.value })}>
                  <option value="ruian">瑞安話</option>
                  <option value="wenzhou">溫州話</option>
                  <option value="">不限</option>
                </select></label>
                <label><span>每碼可用次數 <small>（0 = 不限）</small></span><input type="number" min={0} value={inviteForm.max_uses} onChange={(event) => setInviteForm({ ...inviteForm, max_uses: Number(event.target.value) })} /></label>
                <label>過期時間<input value={inviteForm.expires_at} onChange={(event) => setInviteForm({ ...inviteForm, expires_at: event.target.value })} placeholder="2026-12-31T23:59:59Z" /></label>
                <label>標籤<input value={inviteForm.label} onChange={(event) => setInviteForm({ ...inviteForm, label: event.target.value })} placeholder="瑞安第一批志願者" /></label>
                <label>備註<input value={inviteForm.note} onChange={(event) => setInviteForm({ ...inviteForm, note: event.target.value })} /></label>
              </div>
              <button className="btn primary" onClick={() => void createCodes()} disabled={busy}>生成</button>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>邀請碼</th><th>方言</th><th>已用</th><th>備註</th></tr></thead>
                  <tbody>
                    {invitations.slice(0, 15).map((invite) => (
                      <tr key={invite.code}>
                        <td className="mono">{invite.code}</td>
                        <td>{dialectLabels[invite.dialect_hint] ?? "不限"}</td>
                        <td>{invite.used_count}/{invite.max_uses || "∞"}</td>
                        <td>{invite.note || invite.label}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="card">
              <h2>字典來源</h2>
              <div className="source-list">
                <button className={sourceFilter === "" ? "source on" : "source"} onClick={() => void reloadEntries(statusFilter, "")}>
                  <strong>全部來源</strong>
                </button>
                {sources.map((source) => (
                  <button key={source.id} className={sourceFilter === source.id ? "source on" : "source"} onClick={() => void reloadEntries(statusFilter, source.id)}>
                    <strong>{source.title}</strong>
                    <span>{dialectLabels[source.dialect_scope] ?? source.dialect_scope} · {source.processing_status} · {source.extractable_pages}/{source.page_count} 頁可抽文字</span>
                  </button>
                ))}
              </div>
              <a className="btn ghost" href={exportManifestUrl("jsonl")} target="_blank" rel="noreferrer">
                <Download size={16} />下載已審核錄音清單（JSONL）
              </a>
            </section>
          </div>

          <section className="card">
            <div className="card-head">
              <h2>字典條目審核</h2>
              <div className="chips">
                {[["pending", "待審"], ["approved", "已通過"], ["rejected", "已駁回"]].map(([value, label]) => (
                  <button key={value} className={statusFilter === value ? "chip on" : "chip"} onClick={() => void reloadEntries(value, sourceFilter)}>{label}</button>
                ))}
              </div>
            </div>
            {entries.length === 0 && <p className="muted">沒有條目。</p>}
            <div className="entry-list">
              {entries.map((entry) => (
                <article className="entry" key={entry.id}>
                  <div className="entry-main">
                    <strong>{entry.text}</strong>
                    <span className="muted">{entry.source_title} · p.{entry.page} · {dialectLabels[entry.dialect] ?? entry.dialect}</span>
                    {entry.gloss && <p>{entry.gloss}</p>}
                  </div>
                  <div className="entry-edit">
                    <input value={entry.reading} onChange={(event) => editLocal(entry.id, { reading: event.target.value })} placeholder="讀音" />
                    <input value={entry.ipa} onChange={(event) => editLocal(entry.id, { ipa: event.target.value })} placeholder="IPA" />
                    <select value={entry.entry_type} onChange={(event) => editLocal(entry.id, { entry_type: event.target.value as TaskType })}>
                      <option value="word">字詞</option>
                      <option value="sentence">短句</option>
                    </select>
                  </div>
                  <div className="entry-actions">
                    <button className="btn small primary" disabled={busy} onClick={() => void patchEntry(entry, { reading: entry.reading, ipa: entry.ipa, entry_type: entry.entry_type, review_status: "approved" })}>通過</button>
                    <button className="btn small ghost" disabled={busy} onClick={() => void patchEntry(entry, { review_status: "rejected" })}>駁回</button>
                    <button className="btn small ghost" disabled={busy || entry.review_status !== "approved" || Boolean(entry.task_id)} onClick={() => void addTask(entry)}>{entry.task_id ? "已加入" : "加入任務"}</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
