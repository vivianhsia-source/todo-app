import { useState, useEffect } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    font-family: 'DM Sans', sans-serif;
    background: #f0f4ff;
    color: #111827;
  }
  body { min-height: 100vh; }
  .wrap { max-width: 540px; margin: 0 auto; padding: 48px 20px; }
  h1 { font-size: 32px; font-weight: 900; color: #1e3a8a; margin-bottom: 8px; }
  .subtitle { color: #6b7280; margin-bottom: 32px; font-size: 15px; }
  .input-row { display: flex; gap: 10px; margin-bottom: 24px; }
  input {
    flex: 1; height: 48px; padding: 0 16px;
    border: 2px solid #e4e7ec; border-radius: 12px;
    font: inherit; font-size: 15px; outline: none;
    background: white; transition: border-color .15s;
  }
  input:focus { border-color: #2f6de0; }
  .btn {
    height: 48px; padding: 0 20px; border: none; border-radius: 12px;
    font: inherit; font-weight: 700; cursor: pointer;
    transition: opacity .15s, transform .1s;
  }
  .btn:hover { opacity: .88; }
  .btn:active { transform: scale(.97); }
  .btn-primary { background: #2f6de0; color: white; }
  .btn-danger { background: #fee2e2; color: #dc2626; font-size: 13px; padding: 0 12px; height: 34px; border-radius: 8px; }
  .filters { display: flex; gap: 8px; margin-bottom: 16px; }
  .filter-btn {
    padding: 6px 16px; border: 2px solid #e4e7ec; border-radius: 99px;
    background: white; font: inherit; font-size: 13px; font-weight: 700;
    color: #6b7280; cursor: pointer; transition: all .15s;
  }
  .filter-btn.active { background: #2f6de0; border-color: #2f6de0; color: white; }
  .todo-list { display: flex; flex-direction: column; gap: 10px; }
  .todo-item {
    display: flex; align-items: center; gap: 12px;
    background: white; border: 1px solid #e4e7ec;
    border-radius: 14px; padding: 14px 16px;
    box-shadow: 0 1px 4px rgba(0,0,0,.05);
    transition: opacity .2s;
  }
  .todo-item.done { opacity: .5; }
  .todo-item.done .todo-text { text-decoration: line-through; color: #9ca3af; }
  .checkbox {
    width: 22px; height: 22px; border-radius: 6px;
    border: 2px solid #d1d5db; background: white;
    cursor: pointer; flex-shrink: 0;
    display: grid; place-items: center; transition: all .15s;
  }
  .checkbox.checked { background: #2f6de0; border-color: #2f6de0; }
  .checkbox.checked::after { content: '✓'; color: white; font-size: 13px; font-weight: 900; }
  .todo-text { flex: 1; font-size: 15px; line-height: 1.5; }
  .empty { text-align: center; padding: 48px 20px; color: #9ca3af; }
  .empty strong { display: block; font-size: 18px; color: #d1d5db; margin-bottom: 8px; }
  .stats { margin-top: 20px; font-size: 13px; color: #9ca3af; text-align: center; }
  .clear-btn { background: none; border: none; color: #9ca3af; font: inherit; font-size: 13px; cursor: pointer; text-decoration: underline; margin-left: 8px; }
  .clear-btn:hover { color: #dc2626; }
`;

const STORAGE_KEY = "vivian_todos";

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}
function save(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export default function App() {
  const [todos, setTodos] = useState(load);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => save(todos), [todos]);

  function add() {
    const text = input.trim();
    if (!text) return;
    setTodos(t => [{ id: Date.now(), text, done: false }, ...t]);
    setInput("");
  }

  function toggle(id) {
    setTodos(t => t.map(i => i.id === id ? { ...i, done: !i.done } : i));
  }

  function remove(id) {
    setTodos(t => t.filter(i => i.id !== id));
  }

  function clearDone() {
    setTodos(t => t.filter(i => !i.done));
  }

  const filtered = todos.filter(t =>
    filter === "all" ? true : filter === "active" ? !t.done : t.done
  );
  const doneCount = todos.filter(t => t.done).length;

  return (
    <>
      <style>{css}</style>
      <div className="wrap">
        <h1>📝 Todo List</h1>
        <p className="subtitle">簡單記事，輕鬆完成</p>

        <div className="input-row">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && add()}
            placeholder="新增待辦事項…"
          />
          <button className="btn btn-primary" onClick={add}>新增</button>
        </div>

        <div className="filters">
          {["all","active","done"].map(f => (
            <button key={f} className={`filter-btn${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
              {{ all: "全部", active: "未完成", done: "已完成" }[f]}
            </button>
          ))}
        </div>

        <div className="todo-list">
          {filtered.length === 0
            ? <div className="empty"><strong>沒有項目</strong>新增一個待辦事項吧！</div>
            : filtered.map(todo => (
              <div key={todo.id} className={`todo-item${todo.done ? " done" : ""}`}>
                <div className={`checkbox${todo.done ? " checked" : ""}`} onClick={() => toggle(todo.id)} />
                <span className="todo-text">{todo.text}</span>
                <button className="btn btn-danger" onClick={() => remove(todo.id)}>刪除</button>
              </div>
            ))
          }
        </div>

        {todos.length > 0 && (
          <div className="stats">
            {doneCount}/{todos.length} 已完成
            {doneCount > 0 && <button className="clear-btn" onClick={clearDone}>清除已完成</button>}
          </div>
        )}
      </div>
    </>
  );
}
