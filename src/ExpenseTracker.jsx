import { useState, useEffect, useCallback } from "react";

const SUPABASE_URL = "https://mcp.supabase.com/mcp";

const CATEGORIES = [
  { value: "food", label: "Dining", icon: "🍽️" },
  { value: "travel", label: "Travel", icon: "✈️" },
  { value: "bills", label: "Bills", icon: "📄" },
  { value: "other", label: "Other", icon: "◆" },
];

const CAT_COLORS = {
  food: { bg: "#1a1208", accent: "#C9A84C", text: "#e8c97a" },
  travel: { bg: "#081218", accent: "#4C8EC9", text: "#7ab8e8" },
  bills: { bg: "#120818", accent: "#9C4CC9", text: "#c27ae8" },
  other: { bg: "#0a120a", accent: "#4CC97A", text: "#7ae8a0" },
};

async function callClaude(messages, systemPrompt) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: systemPrompt,
      messages,
      mcp_servers: [{ type: "url", url: SUPABASE_URL, name: "supabase" }],
    }),
  });
  const data = await response.json();
  return data;
}

function extractText(data) {
  if (!data?.content) return "";
  return data.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
}

function extractJson(data) {
  const text = extractText(data);
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    const match = clean.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]);
  } catch {}
  return null;
}

const styles = {
  app: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #080810 0%, #0c0c18 50%, #080810 100%)",
    fontFamily: "'Inter', -apple-system, sans-serif",
    color: "#E8E8F0",
  },
  authWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "2rem",
  },
  authCard: {
    background: "linear-gradient(145deg, #13131f, #0f0f1a)",
    border: "1px solid #2a2a45",
    borderRadius: "20px",
    padding: "3rem",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(201,168,76,0.15)",
  },
  logoMark: {
    width: "52px",
    height: "52px",
    background: "linear-gradient(135deg, #C9A84C, #9a7a2e)",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    marginBottom: "1.5rem",
    boxShadow: "0 8px 24px rgba(201,168,76,0.3)",
  },
  brandName: {
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "0.2em",
    color: "#C9A84C",
    textTransform: "uppercase",
    marginBottom: "0.4rem",
  },
  authTitle: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#F0EFE8",
    marginBottom: "0.4rem",
    letterSpacing: "-0.02em",
  },
  authSub: {
    fontSize: "14px",
    color: "#6a6a8a",
    marginBottom: "2rem",
  },
  inputGroup: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "0.08em",
    color: "#8a8aaa",
    textTransform: "uppercase",
    marginBottom: "0.5rem",
  },
  input: {
    width: "100%",
    background: "#0a0a14",
    border: "1px solid #2a2a45",
    borderRadius: "10px",
    padding: "0.75rem 1rem",
    color: "#E8E8F0",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },
  primaryBtn: {
    width: "100%",
    background: "linear-gradient(135deg, #C9A84C, #9a7a2e)",
    color: "#080810",
    border: "none",
    borderRadius: "10px",
    padding: "0.85rem",
    fontSize: "14px",
    fontWeight: "700",
    letterSpacing: "0.05em",
    cursor: "pointer",
    marginTop: "1.5rem",
    transition: "opacity 0.2s, transform 0.1s",
    textTransform: "uppercase",
    boxShadow: "0 4px 20px rgba(201,168,76,0.3)",
  },
  switchLink: {
    textAlign: "center",
    marginTop: "1.5rem",
    fontSize: "13px",
    color: "#6a6a8a",
  },
  switchBtn: {
    background: "none",
    border: "none",
    color: "#C9A84C",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    padding: "0",
    textDecoration: "underline",
    textUnderlineOffset: "3px",
  },
  errorBox: {
    background: "rgba(180,40,40,0.15)",
    border: "1px solid rgba(180,40,40,0.4)",
    borderRadius: "8px",
    padding: "0.75rem 1rem",
    fontSize: "13px",
    color: "#f08080",
    marginBottom: "1rem",
  },
  dashboard: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "2rem 1.5rem",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "2.5rem",
    paddingBottom: "1.5rem",
    borderBottom: "1px solid #1e1e2e",
  },
  topBarLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  dashLogoMark: {
    width: "36px",
    height: "36px",
    background: "linear-gradient(135deg, #C9A84C, #9a7a2e)",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
  },
  dashBrand: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#F0EFE8",
    letterSpacing: "-0.02em",
  },
  dashSub: {
    fontSize: "11px",
    color: "#5a5a7a",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  signOutBtn: {
    background: "transparent",
    border: "1px solid #2a2a45",
    borderRadius: "8px",
    padding: "0.5rem 1rem",
    color: "#6a6a8a",
    fontSize: "12px",
    cursor: "pointer",
    letterSpacing: "0.05em",
    transition: "all 0.2s",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },
  summaryCard: {
    background: "linear-gradient(145deg, #13131f, #0f0f1a)",
    border: "1px solid #1e1e2e",
    borderRadius: "16px",
    padding: "1.25rem 1.5rem",
    position: "relative",
    overflow: "hidden",
  },
  summaryCardAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "linear-gradient(90deg, #C9A84C, transparent)",
  },
  summaryLabel: {
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "0.12em",
    color: "#5a5a7a",
    textTransform: "uppercase",
    marginBottom: "0.5rem",
  },
  summaryValue: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#F0EFE8",
    letterSpacing: "-0.03em",
  },
  summaryValueGold: {
    fontSize: "28px",
    fontWeight: "700",
    background: "linear-gradient(135deg, #C9A84C, #e8d090)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-0.03em",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "380px 1fr",
    gap: "1.5rem",
    alignItems: "start",
  },
  card: {
    background: "linear-gradient(145deg, #13131f, #0f0f1a)",
    border: "1px solid #1e1e2e",
    borderRadius: "16px",
    padding: "1.75rem",
  },
  cardTitle: {
    fontSize: "13px",
    fontWeight: "700",
    letterSpacing: "0.12em",
    color: "#8a8aaa",
    textTransform: "uppercase",
    marginBottom: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  formInput: {
    width: "100%",
    background: "#0a0a14",
    border: "1px solid #1e1e2e",
    borderRadius: "10px",
    padding: "0.7rem 0.9rem",
    color: "#E8E8F0",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    marginBottom: "0.75rem",
    transition: "border-color 0.2s",
  },
  catGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.5rem",
    marginBottom: "0.75rem",
  },
  catBtn: (selected, cat) => ({
    background: selected ? CAT_COLORS[cat].bg : "#0a0a14",
    border: `1px solid ${selected ? CAT_COLORS[cat].accent : "#1e1e2e"}`,
    borderRadius: "10px",
    padding: "0.6rem 0.5rem",
    color: selected ? CAT_COLORS[cat].text : "#5a5a7a",
    fontSize: "13px",
    fontWeight: selected ? "600" : "400",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "all 0.18s",
  }),
  addBtn: {
    width: "100%",
    background: "linear-gradient(135deg, #C9A84C, #9a7a2e)",
    color: "#080810",
    border: "none",
    borderRadius: "10px",
    padding: "0.8rem",
    fontSize: "13px",
    fontWeight: "700",
    letterSpacing: "0.08em",
    cursor: "pointer",
    marginTop: "0.5rem",
    textTransform: "uppercase",
    transition: "opacity 0.2s",
  },
  expenseList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
    maxHeight: "520px",
    overflowY: "auto",
  },
  expenseItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#0a0a14",
    border: "1px solid #1a1a28",
    borderRadius: "12px",
    padding: "1rem 1.25rem",
    transition: "border-color 0.2s",
  },
  expenseLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flex: 1,
    minWidth: 0,
  },
  expenseCatDot: (cat) => ({
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: CAT_COLORS[cat]?.accent || "#C9A84C",
    flexShrink: 0,
  }),
  expenseName: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#D8D8E8",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  expenseMeta: {
    fontSize: "12px",
    color: "#4a4a6a",
    marginTop: "2px",
  },
  expenseAmount: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#C9A84C",
    marginLeft: "1rem",
    flexShrink: 0,
  },
  deleteBtn: {
    background: "none",
    border: "none",
    color: "#3a3a5a",
    cursor: "pointer",
    fontSize: "16px",
    padding: "0 0 0 0.75rem",
    transition: "color 0.2s",
    flexShrink: 0,
  },
  emptyState: {
    textAlign: "center",
    padding: "3rem 1rem",
    color: "#3a3a5a",
    fontSize: "14px",
  },
  loadingSpinner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "3rem",
    color: "#4a4a6a",
    fontSize: "14px",
  },
};

export default function App() {
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [session, setSession] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  const [expenses, setExpenses] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState("");

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [addLoading, setAddLoading] = useState(false);

  const [dbReady, setDbReady] = useState(false);

  const ensureDb = useCallback(async (token) => {
    const sys = `You are a Supabase database admin. Always respond only in JSON: {"success": true/false, "error": "..."}.`;
    const checkRes = await callClaude([{
      role: "user",
      content: `Check if a table called 'expenses' exists in the public schema. Use list_tables or execute_sql: SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name='expenses';`
    }], sys);
    const checkText = extractText(checkRes).toLowerCase();
    if (!checkText.includes("expenses")) {
      await callClaude([{
        role: "user",
        content: `Execute this SQL to create the expenses table:
CREATE TABLE IF NOT EXISTS public.expenses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  name text NOT NULL,
  amount numeric(10,2) NOT NULL,
  category text NOT NULL,
  date date NOT NULL,
  created_at timestamptz DEFAULT now()
);
Then enable RLS: ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
Create a permissive policy: CREATE POLICY IF NOT EXISTS "user_expenses" ON public.expenses FOR ALL USING (true);`
      }], sys);
    }
    setDbReady(true);
  }, []);

  const loadExpenses = useCallback(async (uid) => {
    setDataLoading(true);
    setDataError("");
    try {
      const res = await callClaude([{
        role: "user",
        content: `Execute this SQL and return ALL rows as JSON array:
SELECT id, name, amount, category, date, created_at FROM public.expenses WHERE user_id = '${uid}' ORDER BY date DESC, created_at DESC;
Return exactly this JSON structure: {"expenses": [{"id":"...","name":"...","amount":0,"category":"...","date":"..."}]}`
      }], `You are a Supabase query runner. Extract SQL results and return ONLY valid JSON with no extra text. If no rows, return {"expenses":[]}.`);

      const json = extractJson(res);
      if (json?.expenses) {
        setExpenses(json.expenses);
      } else {
        const text = extractText(res);
        const arrMatch = text.match(/\[[\s\S]*\]/);
        if (arrMatch) {
          try { setExpenses(JSON.parse(arrMatch[0])); } catch { setExpenses([]); }
        } else {
          setExpenses([]);
        }
      }
    } catch (e) {
      setDataError("Failed to load expenses.");
    } finally {
      setDataLoading(false);
    }
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    const action = view === "login" ? "Sign in" : "Sign up";
    try {
      const res = await callClaude([{
        role: "user",
        content: `${action} a user with email "${email}" and password "${password}". Use the Supabase auth tools. Return JSON: {"success": true/false, "user_id": "...", "email": "...", "error": "..."}`
      }], `You are a Supabase auth manager. Use sign_in_with_password for login, sign_up for registration. Return ONLY JSON with no extra text.`);

      const text = extractText(res);
      const json = extractJson(res);

      if (json?.success && json?.user_id) {
        setUserId(json.user_id);
        setUserEmail(json.email || email);
        setSession(true);
        await ensureDb();
        await loadExpenses(json.user_id);
      } else if (json?.error) {
        setAuthError(json.error);
      } else if (text.toLowerCase().includes("invalid") || text.toLowerCase().includes("incorrect") || text.toLowerCase().includes("wrong")) {
        setAuthError("Invalid email or password.");
      } else if (text.toLowerCase().includes("already") || text.toLowerCase().includes("exists")) {
        setAuthError("An account with this email already exists. Try signing in.");
      } else if (text.toLowerCase().includes("success") || text.toLowerCase().includes("signed") || text.toLowerCase().includes("logged")) {
        const idMatch = text.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
        const uid = idMatch ? idMatch[0] : email;
        setUserId(uid);
        setUserEmail(email);
        setSession(true);
        await ensureDb();
        await loadExpenses(uid);
      } else {
        setAuthError("Authentication failed. Please try again.");
      }
    } catch (err) {
      setAuthError("Something went wrong. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAddExpense = async () => {
    if (!name.trim() || !amount || !date) return;
    setAddLoading(true);
    try {
      const amountNum = parseFloat(amount).toFixed(2);
      await callClaude([{
        role: "user",
        content: `Execute this SQL:
INSERT INTO public.expenses (user_id, name, amount, category, date) VALUES ('${userId}', '${name.replace(/'/g, "''")}', ${amountNum}, '${category}', '${date}');`
      }], `You are a Supabase query runner. Execute the SQL and confirm success.`);

      setName("");
      setAmount("");
      setCategory("food");
      setDate(new Date().toISOString().split("T")[0]);
      await loadExpenses(userId);
    } catch (e) {
      console.error("Add failed", e);
    } finally {
      setAddLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    try {
      await callClaude([{
        role: "user",
        content: `Execute this SQL: DELETE FROM public.expenses WHERE id = '${id}';`
      }], `You are a Supabase query runner. Execute the SQL.`);
    } catch (e) {
      loadExpenses(userId);
    }
  };

  const handleSignOut = () => {
    setSession(null);
    setUserId(null);
    setUserEmail("");
    setExpenses([]);
    setDbReady(false);
    setEmail("");
    setPassword("");
    setView("login");
  };

  const total = expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0);
  const thisMonth = expenses.filter((e) => {
    const d = new Date(e.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((s, e) => s + parseFloat(e.amount || 0), 0);

  const catTotals = CATEGORIES.map((c) => ({
    ...c,
    total: expenses.filter((e) => e.category === c.value).reduce((s, e) => s + parseFloat(e.amount || 0), 0),
  })).sort((a, b) => b.total - a.total);

  if (!session) {
    return (
      <div style={styles.app}>
        <div style={styles.authWrapper}>
          <div style={styles.authCard}>
            <div style={styles.logoMark}>◆</div>
            <div style={styles.brandName}>Vault</div>
            <div style={styles.authTitle}>{view === "login" ? "Welcome back" : "Create account"}</div>
            <div style={styles.authSub}>{view === "login" ? "Sign in to your expense vault" : "Start tracking your finances"}</div>

            {authError && <div style={styles.errorBox}>{authError}</div>}

            <form onSubmit={handleAuth}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <input
                  style={styles.input}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  onFocus={(e) => { e.target.style.borderColor = "#C9A84C"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#2a2a45"; }}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <input
                  style={styles.input}
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  onFocus={(e) => { e.target.style.borderColor = "#C9A84C"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#2a2a45"; }}
                />
              </div>
              <button
                type="submit"
                style={{ ...styles.primaryBtn, opacity: authLoading ? 0.6 : 1 }}
                disabled={authLoading}
                onMouseEnter={(e) => { e.target.style.opacity = "0.85"; }}
                onMouseLeave={(e) => { e.target.style.opacity = authLoading ? "0.6" : "1"; }}
              >
                {authLoading ? "Please wait…" : view === "login" ? "Sign In" : "Create Account"}
              </button>
            </form>

            <div style={styles.switchLink}>
              {view === "login" ? "New to Vault? " : "Already have an account? "}
              <button style={styles.switchBtn} onClick={() => { setView(view === "login" ? "signup" : "login"); setAuthError(""); }}>
                {view === "login" ? "Create account" : "Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <div style={styles.dashboard}>
        <div style={styles.topBar}>
          <div style={styles.topBarLeft}>
            <div style={styles.dashLogoMark}>◆</div>
            <div>
              <div style={styles.dashBrand}>Vault</div>
              <div style={styles.dashSub}>Expense Tracker</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "13px", color: "#4a4a6a" }}>{userEmail}</span>
            <button
              style={styles.signOutBtn}
              onClick={handleSignOut}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#C9A84C"; e.currentTarget.style.color = "#C9A84C"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2a2a45"; e.currentTarget.style.color = "#6a6a8a"; }}
            >
              Sign out
            </button>
          </div>
        </div>

        <div style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <div style={styles.summaryCardAccent} />
            <div style={styles.summaryLabel}>Total Spent</div>
            <div style={styles.summaryValueGold}>₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={{ ...styles.summaryCardAccent, background: "linear-gradient(90deg, #4C8EC9, transparent)" }} />
            <div style={styles.summaryLabel}>This Month</div>
            <div style={styles.summaryValue}>₹{thisMonth.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={{ ...styles.summaryCardAccent, background: "linear-gradient(90deg, #9C4CC9, transparent)" }} />
            <div style={styles.summaryLabel}>Transactions</div>
            <div style={styles.summaryValue}>{expenses.length}</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={{ ...styles.summaryCardAccent, background: "linear-gradient(90deg, #4CC97A, transparent)" }} />
            <div style={styles.summaryLabel}>Top Category</div>
            <div style={styles.summaryValue} title={catTotals[0]?.label}>
              {catTotals[0]?.total > 0 ? `${catTotals[0].icon} ${catTotals[0].label}` : "—"}
            </div>
          </div>
        </div>

        <div style={styles.mainGrid}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>
              <span style={{ color: "#C9A84C" }}>+</span> Add Expense
            </div>
            <input
              style={styles.formInput}
              placeholder="Expense name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={(e) => { e.target.style.borderColor = "#C9A84C40"; }}
              onBlur={(e) => { e.target.style.borderColor = "#1e1e2e"; }}
            />
            <input
              style={styles.formInput}
              type="number"
              placeholder="Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
              onFocus={(e) => { e.target.style.borderColor = "#C9A84C40"; }}
              onBlur={(e) => { e.target.style.borderColor = "#1e1e2e"; }}
            />
            <input
              style={styles.formInput}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              onFocus={(e) => { e.target.style.borderColor = "#C9A84C40"; }}
              onBlur={(e) => { e.target.style.borderColor = "#1e1e2e"; }}
            />
            <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: "0.1em", color: "#5a5a7a", textTransform: "uppercase", marginBottom: "0.5rem" }}>Category</div>
            <div style={styles.catGrid}>
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  style={styles.catBtn(category === c.value, c.value)}
                  onClick={() => setCategory(c.value)}
                  onMouseEnter={(e) => { if (category !== c.value) e.currentTarget.style.borderColor = "#2a2a45"; }}
                  onMouseLeave={(e) => { if (category !== c.value) e.currentTarget.style.borderColor = "#1e1e2e"; }}
                >
                  <span>{c.icon}</span> {c.label}
                </button>
              ))}
            </div>
            <button
              style={{ ...styles.addBtn, opacity: addLoading || !name || !amount ? 0.5 : 1 }}
              onClick={handleAddExpense}
              disabled={addLoading || !name || !amount}
            >
              {addLoading ? "Adding…" : "Add Expense"}
            </button>

            {dataError && <div style={{ ...styles.errorBox, marginTop: "1rem" }}>{dataError}</div>}

            <div style={{ marginTop: "2rem", borderTop: "1px solid #1a1a28", paddingTop: "1.5rem" }}>
              <div style={styles.cardTitle}>By Category</div>
              {catTotals.map((c) => (
                <div key={c.value} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: CAT_COLORS[c.value].accent }} />
                    <span style={{ fontSize: "13px", color: "#8a8aaa" }}>{c.icon} {c.label}</span>
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: c.total > 0 ? "#C9A84C" : "#3a3a5a" }}>
                    {c.total > 0 ? `₹${c.total.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>
              <span style={{ color: "#C9A84C" }}>◆</span> Expenses
              {expenses.length > 0 && <span style={{ marginLeft: "auto", fontSize: "11px", color: "#3a3a5a", fontWeight: "400", letterSpacing: "0.05em" }}>{expenses.length} entries</span>}
            </div>

            {dataLoading ? (
              <div style={styles.loadingSpinner}>Loading your expenses…</div>
            ) : expenses.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={{ fontSize: "32px", marginBottom: "0.75rem" }}>◆</div>
                <div style={{ color: "#3a3a5a", fontWeight: "500" }}>No expenses yet</div>
                <div style={{ marginTop: "0.4rem", fontSize: "13px" }}>Add your first expense to get started</div>
              </div>
            ) : (
              <div style={styles.expenseList}>
                {expenses.map((exp) => {
                  const cat = CATEGORIES.find((c) => c.value === exp.category);
                  return (
                    <div
                      key={exp.id}
                      style={styles.expenseItem}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#2a2a45"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1a1a28"; }}
                    >
                      <div style={styles.expenseLeft}>
                        <div style={styles.expenseCatDot(exp.category)} />
                        <div style={{ minWidth: 0 }}>
                          <div style={styles.expenseName}>{exp.name}</div>
                          <div style={styles.expenseMeta}>
                            {cat?.icon} {cat?.label} · {new Date(exp.date + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          </div>
                        </div>
                      </div>
                      <div style={styles.expenseAmount}>
                        ₹{parseFloat(exp.amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <button
                        style={styles.deleteBtn}
                        onClick={() => handleDelete(exp.id)}
                        title="Delete expense"
                        onMouseEnter={(e) => { e.currentTarget.style.color = "#e05050"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "#3a3a5a"; }}
                      >
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
