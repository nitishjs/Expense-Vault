import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://wuskseikauwbrjiqeepk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1c2tzZWlrYXV3YnJqaXFlZXBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0NDczNjcsImV4cCI6MjA5ODAyMzM2N30.qW-XGCqRakd5w5gjiKP4Q3Rg0qr8QTqRkc9alYFur8w";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CATEGORIES = [
  { value: "food",   label: "Dining",  icon: "🍽️" },
  { value: "travel", label: "Travel",  icon: "✈️" },
  { value: "bills",  label: "Bills",   icon: "📄" },
  { value: "other",  label: "Other",   icon: "◆"  },
];

const CAT_COLORS = {
  food:   { bg: "#1a1208", accent: "#C9A84C", text: "#e8c97a" },
  travel: { bg: "#081218", accent: "#4C8EC9", text: "#7ab8e8" },
  bills:  { bg: "#120818", accent: "#9C4CC9", text: "#c27ae8" },
  other:  { bg: "#0a120a", accent: "#4CC97A", text: "#7ae8a0" },
};

const s = {
  app: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #080810 0%, #0c0c18 50%, #080810 100%)",
    fontFamily: "'Inter', -apple-system, sans-serif",
    color: "#E8E8F0",
  },
  authWrapper: {
    display: "flex", alignItems: "center", justifyContent: "center",
    minHeight: "100vh", padding: "2rem",
  },
  authCard: {
    background: "linear-gradient(145deg, #13131f, #0f0f1a)",
    border: "1px solid #2a2a45", borderRadius: "20px", padding: "3rem",
    width: "100%", maxWidth: "420px",
    boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(201,168,76,0.15)",
  },
  logoMark: {
    width: "52px", height: "52px",
    background: "linear-gradient(135deg, #C9A84C, #9a7a2e)",
    borderRadius: "14px", display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "22px", marginBottom: "1.5rem",
    boxShadow: "0 8px 24px rgba(201,168,76,0.3)",
  },
  brandName: {
    fontSize: "11px", fontWeight: "600", letterSpacing: "0.2em",
    color: "#C9A84C", textTransform: "uppercase", marginBottom: "0.4rem",
  },
  authTitle: {
    fontSize: "26px", fontWeight: "700", color: "#F0EFE8",
    marginBottom: "0.4rem", letterSpacing: "-0.02em",
  },
  authSub: { fontSize: "14px", color: "#6a6a8a", marginBottom: "2rem" },
  label: {
    display: "block", fontSize: "12px", fontWeight: "600",
    letterSpacing: "0.08em", color: "#8a8aaa", textTransform: "uppercase",
    marginBottom: "0.5rem",
  },
  input: {
    width: "100%", background: "#0a0a14", border: "1px solid #2a2a45",
    borderRadius: "10px", padding: "0.75rem 1rem", color: "#E8E8F0",
    fontSize: "14px", outline: "none", transition: "border-color 0.2s",
    boxSizing: "border-box",
  },
  primaryBtn: {
    width: "100%",
    background: "linear-gradient(135deg, #C9A84C, #9a7a2e)",
    color: "#080810", border: "none", borderRadius: "10px",
    padding: "0.85rem", fontSize: "14px", fontWeight: "700",
    letterSpacing: "0.05em", cursor: "pointer", marginTop: "1.5rem",
    transition: "opacity 0.2s", textTransform: "uppercase",
    boxShadow: "0 4px 20px rgba(201,168,76,0.3)",
  },
  switchLink: { textAlign: "center", marginTop: "1.5rem", fontSize: "13px", color: "#6a6a8a" },
  switchBtn: {
    background: "none", border: "none", color: "#C9A84C", cursor: "pointer",
    fontSize: "13px", fontWeight: "600", padding: "0",
    textDecoration: "underline", textUnderlineOffset: "3px",
  },
  errorBox: {
    background: "rgba(180,40,40,0.15)", border: "1px solid rgba(180,40,40,0.4)",
    borderRadius: "8px", padding: "0.75rem 1rem", fontSize: "13px",
    color: "#f08080", marginBottom: "1rem",
  },
  dashboard: { maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem" },
  topBar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: "2.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid #1e1e2e",
  },
  topBarLeft: { display: "flex", alignItems: "center", gap: "12px" },
  dashLogoMark: {
    width: "36px", height: "36px",
    background: "linear-gradient(135deg, #C9A84C, #9a7a2e)",
    borderRadius: "9px", display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "14px",
  },
  summaryGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "1rem", marginBottom: "2rem",
  },
  summaryCard: {
    background: "linear-gradient(145deg, #13131f, #0f0f1a)",
    border: "1px solid #1e1e2e", borderRadius: "16px",
    padding: "1.25rem 1.5rem", position: "relative", overflow: "hidden",
  },
  summaryLabel: {
    fontSize: "11px", fontWeight: "600", letterSpacing: "0.12em",
    color: "#5a5a7a", textTransform: "uppercase", marginBottom: "0.5rem",
  },
  summaryValue: {
    fontSize: "26px", fontWeight: "700", color: "#F0EFE8", letterSpacing: "-0.03em",
  },
  summaryValueGold: {
    fontSize: "26px", fontWeight: "700",
    background: "linear-gradient(135deg, #C9A84C, #e8d090)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    letterSpacing: "-0.03em",
  },
  mainGrid: {
    display: "grid", gridTemplateColumns: "380px 1fr",
    gap: "1.5rem", alignItems: "start",
  },
  card: {
    background: "linear-gradient(145deg, #13131f, #0f0f1a)",
    border: "1px solid #1e1e2e", borderRadius: "16px", padding: "1.75rem",
  },
  cardTitle: {
    fontSize: "13px", fontWeight: "700", letterSpacing: "0.12em",
    color: "#8a8aaa", textTransform: "uppercase", marginBottom: "1.5rem",
    display: "flex", alignItems: "center", gap: "8px",
  },
  formInput: {
    width: "100%", background: "#0a0a14", border: "1px solid #1e1e2e",
    borderRadius: "10px", padding: "0.7rem 0.9rem", color: "#E8E8F0",
    fontSize: "14px", outline: "none", boxSizing: "border-box",
    marginBottom: "0.75rem", transition: "border-color 0.2s",
  },
  catGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.75rem" },
  addBtn: {
    width: "100%",
    background: "linear-gradient(135deg, #C9A84C, #9a7a2e)",
    color: "#080810", border: "none", borderRadius: "10px",
    padding: "0.8rem", fontSize: "13px", fontWeight: "700",
    letterSpacing: "0.08em", cursor: "pointer", marginTop: "0.5rem",
    textTransform: "uppercase", transition: "opacity 0.2s",
  },
  expenseList: {
    display: "flex", flexDirection: "column", gap: "0.6rem",
    maxHeight: "520px", overflowY: "auto",
  },
  expenseItem: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    background: "#0a0a14", border: "1px solid #1a1a28",
    borderRadius: "12px", padding: "1rem 1.25rem", transition: "border-color 0.2s",
  },
  expenseLeft: { display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 },
  expenseName: {
    fontSize: "14px", fontWeight: "500", color: "#D8D8E8",
    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
  },
  expenseMeta: { fontSize: "12px", color: "#4a4a6a", marginTop: "2px" },
  expenseAmount: {
    fontSize: "15px", fontWeight: "700", color: "#C9A84C",
    marginLeft: "1rem", flexShrink: 0,
  },
  deleteBtn: {
    background: "none", border: "none", color: "#3a3a5a",
    cursor: "pointer", fontSize: "18px", padding: "0 0 0 0.75rem",
    transition: "color 0.2s", flexShrink: 0, lineHeight: 1,
  },
  signOutBtn: {
    background: "transparent", border: "1px solid #2a2a45",
    borderRadius: "8px", padding: "0.5rem 1rem", color: "#6a6a8a",
    fontSize: "12px", cursor: "pointer", letterSpacing: "0.05em",
  },
  emptyState: { textAlign: "center", padding: "3rem 1rem", color: "#3a3a5a", fontSize: "14px" },
  spinner: { textAlign: "center", padding: "3rem 1rem", color: "#4a4a6a", fontSize: "13px" },
};

export default function ExpenseTracker() {
  // Auth state
  const [view, setView]           = useState("login");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [fullName, setFullName]   = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [session, setSession]     = useState(null);
  const [bootDone, setBootDone]   = useState(false);

  // Expense form state
  const [name, setName]           = useState("");
  const [amount, setAmount]       = useState("");
  const [category, setCategory]   = useState("food");
  const [date, setDate]           = useState(new Date().toISOString().split("T")[0]);
  const [addLoading, setAddLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Data state
  const [expenses, setExpenses]   = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  // ── Bootstrap: restore session on mount ──────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setBootDone(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── Load expenses whenever session changes ────────────────────────────────
  const loadExpenses = useCallback(async () => {
    setDataLoading(true);
    const { data, error } = await supabase
      .from("expenses")
      .select("id, name, amount, category, date, created_at")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });
    if (!error) setExpenses(data || []);
    setDataLoading(false);
  }, []);

  useEffect(() => {
    if (session) loadExpenses();
    else setExpenses([]);
  }, [session, loadExpenses]);

  // ── Auth handlers ─────────────────────────────────────────────────────────
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      const { error } = view === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName.trim() } } });
      if (error) setAuthError(error.message);
      // on success onAuthStateChange fires → session updates → useEffect loads data
    } catch {
      setAuthError("Something went wrong. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // ── Add expense ───────────────────────────────────────────────────────────
  const handleAdd = async () => {
    if (!name.trim() || !amount || !date) return;
    setFormError("");
    setAddLoading(true);
    const { error } = await supabase.from("expenses").insert({
      user_id:  session.user.id,
      name:     name.trim(),
      amount:   parseFloat(amount),
      category,
      date,
    });
    if (error) {
      setFormError(error.message);
    } else {
      setName(""); setAmount(""); setCategory("food");
      setDate(new Date().toISOString().split("T")[0]);
      await loadExpenses();
    }
    setAddLoading(false);
  };

  // ── Delete expense ────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id)); // optimistic
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) await loadExpenses(); // rollback on failure
  };

  // ── Derived stats ─────────────────────────────────────────────────────────
  const total = expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0);
  const now   = new Date();
  const thisMonth = expenses
    .filter(e => { const d = new Date(e.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); })
    .reduce((s, e) => s + parseFloat(e.amount || 0), 0);
  const catTotals = CATEGORIES.map(c => ({
    ...c,
    total: expenses.filter(e => e.category === c.value).reduce((s, e) => s + parseFloat(e.amount || 0), 0),
  })).sort((a, b) => b.total - a.total);

  const fmt = (n) => `₹${parseFloat(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // ── Boot splash ───────────────────────────────────────────────────────────
  if (!bootDone) return (
    <div style={{ ...s.app, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#4a4a6a", fontSize: "14px" }}>Loading Vault…</div>
    </div>
  );

  // ── Auth screen ───────────────────────────────────────────────────────────
  if (!session) return (
    <div style={s.app}>
      <div style={s.authWrapper}>
        <div style={s.authCard}>
          <div style={s.logoMark}>◆</div>
          <div style={s.brandName}>Vault</div>
          <div style={s.authTitle}>{view === "login" ? "Welcome back" : "Create account"}</div>
          <div style={s.authSub}>{view === "login" ? "Sign in to your expense vault" : "Start tracking your finances"}</div>
          {authError && <div style={s.errorBox}>{authError}</div>}
          <form onSubmit={handleAuth}>
            {view === "signup" && (
              <div style={{ marginBottom: "1rem" }}>
                <label style={s.label}>Full Name</label>
                <input style={s.input} type="text" placeholder="Nitish Kumar"
                  value={fullName} onChange={e => setFullName(e.target.value)} required
                  onFocus={e => e.target.style.borderColor = "#C9A84C"}
                  onBlur={e => e.target.style.borderColor = "#2a2a45"} />
              </div>
            )}
            <div style={{ marginBottom: "1rem" }}>
              <label style={s.label}>Email</label>
              <input style={s.input} type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required
                onFocus={e => e.target.style.borderColor = "#C9A84C"}
                onBlur={e => e.target.style.borderColor = "#2a2a45"} />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={s.label}>Password</label>
              <input style={s.input} type="password" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} required
                onFocus={e => e.target.style.borderColor = "#C9A84C"}
                onBlur={e => e.target.style.borderColor = "#2a2a45"} />
            </div>
            <button type="submit" style={{ ...s.primaryBtn, opacity: authLoading ? 0.6 : 1 }}
              disabled={authLoading}>
              {authLoading ? "Please wait…" : view === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>
          <div style={s.switchLink}>
            {view === "login" ? "New to Vault? " : "Already have an account? "}
            <button style={s.switchBtn} onClick={() => { setView(view === "login" ? "signup" : "login"); setAuthError(""); setFullName(""); }}>
              {view === "login" ? "Create account" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div style={s.app}>
      <div style={s.dashboard}>

        {/* Top bar */}
        <div style={s.topBar}>
          <div style={s.topBarLeft}>
            <div style={s.dashLogoMark}>◆</div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "#F0EFE8", letterSpacing: "-0.02em" }}>Vault</div>
              <div style={{ fontSize: "11px", color: "#5a5a7a", letterSpacing: "0.1em", textTransform: "uppercase" }}>Expense Tracker</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "13px", color: "#4a4a6a" }}>{session.user.user_metadata?.full_name || session.user.email}</span>
            <button style={s.signOutBtn} onClick={handleSignOut}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#C9A84C"; e.currentTarget.style.color = "#C9A84C"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a45"; e.currentTarget.style.color = "#6a6a8a"; }}>
              Sign out
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div style={s.summaryGrid}>
          {[
            { label: "Total Spent",   value: fmt(total),             gold: true,  bar: "linear-gradient(90deg,#C9A84C,transparent)" },
            { label: "This Month",    value: fmt(thisMonth),          gold: false, bar: "linear-gradient(90deg,#4C8EC9,transparent)" },
            { label: "Transactions",  value: expenses.length,         gold: false, bar: "linear-gradient(90deg,#9C4CC9,transparent)" },
            { label: "Top Category",  value: catTotals[0]?.total > 0 ? `${catTotals[0].icon} ${catTotals[0].label}` : "—", gold: false, bar: "linear-gradient(90deg,#4CC97A,transparent)" },
          ].map(({ label, value, gold, bar }) => (
            <div key={label} style={s.summaryCard}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: bar }} />
              <div style={s.summaryLabel}>{label}</div>
              <div style={gold ? s.summaryValueGold : s.summaryValue}>{value}</div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div style={s.mainGrid}>

          {/* Left: Add form + category breakdown */}
          <div style={s.card}>
            <div style={s.cardTitle}><span style={{ color: "#C9A84C" }}>+</span> Add Expense</div>

            <input style={s.formInput} placeholder="Expense name" value={name}
              onChange={e => setName(e.target.value)}
              onFocus={e => e.target.style.borderColor = "#C9A84C40"}
              onBlur={e => e.target.style.borderColor = "#1e1e2e"} />

            <input style={s.formInput} type="number" placeholder="Amount (₹)" value={amount}
              onChange={e => setAmount(e.target.value)} min="0.01" step="0.01"
              onFocus={e => e.target.style.borderColor = "#C9A84C40"}
              onBlur={e => e.target.style.borderColor = "#1e1e2e"} />

            <input style={s.formInput} type="date" value={date}
              onChange={e => setDate(e.target.value)}
              onFocus={e => e.target.style.borderColor = "#C9A84C40"}
              onBlur={e => e.target.style.borderColor = "#1e1e2e"} />

            <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: "0.1em", color: "#5a5a7a", textTransform: "uppercase", marginBottom: "0.5rem" }}>Category</div>
            <div style={s.catGrid}>
              {CATEGORIES.map(c => (
                <button key={c.value} onClick={() => setCategory(c.value)}
                  style={{
                    background: category === c.value ? CAT_COLORS[c.value].bg : "#0a0a14",
                    border: `1px solid ${category === c.value ? CAT_COLORS[c.value].accent : "#1e1e2e"}`,
                    borderRadius: "10px", padding: "0.6rem 0.5rem",
                    color: category === c.value ? CAT_COLORS[c.value].text : "#5a5a7a",
                    fontSize: "13px", fontWeight: category === c.value ? "600" : "400",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
                    transition: "all 0.18s",
                  }}>
                  {c.icon} {c.label}
                </button>
              ))}
            </div>

            {formError && <div style={{ ...s.errorBox, marginBottom: "0.75rem" }}>{formError}</div>}

            <button style={{ ...s.addBtn, opacity: addLoading || !name.trim() || !amount ? 0.5 : 1 }}
              onClick={handleAdd} disabled={addLoading || !name.trim() || !amount}>
              {addLoading ? "Adding…" : "Add Expense"}
            </button>

            {/* Category breakdown */}
            <div style={{ marginTop: "2rem", borderTop: "1px solid #1a1a28", paddingTop: "1.5rem" }}>
              <div style={s.cardTitle}>By Category</div>
              {catTotals.map(c => (
                <div key={c.value} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: CAT_COLORS[c.value].accent }} />
                    <span style={{ fontSize: "13px", color: "#8a8aaa" }}>{c.icon} {c.label}</span>
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: c.total > 0 ? "#C9A84C" : "#3a3a5a" }}>
                    {c.total > 0 ? fmt(c.total) : "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Expense list */}
          <div style={s.card}>
            <div style={s.cardTitle}>
              <span style={{ color: "#C9A84C" }}>◆</span> Expenses
              {expenses.length > 0 && (
                <span style={{ marginLeft: "auto", fontSize: "11px", color: "#3a3a5a", fontWeight: "400" }}>
                  {expenses.length} entries
                </span>
              )}
            </div>

            {dataLoading ? (
              <div style={s.spinner}>Loading your expenses…</div>
            ) : expenses.length === 0 ? (
              <div style={s.emptyState}>
                <div style={{ fontSize: "32px", marginBottom: "0.75rem" }}>◆</div>
                <div style={{ color: "#3a3a5a", fontWeight: "500" }}>No expenses yet</div>
                <div style={{ marginTop: "0.4rem" }}>Add your first expense to get started</div>
              </div>
            ) : (
              <div style={s.expenseList}>
                {expenses.map(exp => {
                  const cat = CATEGORIES.find(c => c.value === exp.category);
                  return (
                    <div key={exp.id} style={s.expenseItem}
                      onMouseEnter={e => e.currentTarget.style.borderColor = "#2a2a45"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "#1a1a28"}>
                      <div style={s.expenseLeft}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: CAT_COLORS[exp.category]?.accent || "#C9A84C", flexShrink: 0 }} />
                        <div style={{ minWidth: 0 }}>
                          <div style={s.expenseName}>{exp.name}</div>
                          <div style={s.expenseMeta}>
                            {cat?.icon} {cat?.label} · {new Date(exp.date + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          </div>
                        </div>
                      </div>
                      <div style={s.expenseAmount}>{fmt(exp.amount)}</div>
                      <button style={s.deleteBtn} onClick={() => handleDelete(exp.id)} title="Delete"
                        onMouseEnter={e => e.currentTarget.style.color = "#e05050"}
                        onMouseLeave={e => e.currentTarget.style.color = "#3a3a5a"}>
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
