"use client";

import { useState, useEffect } from "react";

export default function PlacementTree({
  node,
  mode = "placement", // "view" | "placement"
  onSelect,
}) {
  const [originalTree, setOriginalTree] = useState(node);
  const [focusNode, setFocusNode] = useState(node);
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  /* ================= SYNC TREE ================= */

  useEffect(() => {
    setOriginalTree(node);
    setFocusNode(node);
    setHistory([]);
  }, [node]);

  if (!focusNode) {
    return (
      <p className="text-sm text-slate-500 text-center">
        No network found.
      </p>
    );
  }

  /* ================= SAFE NODE FINDER ================= */

  function findNodeById(root, id) {
    if (!root) return null;
    if (root.id === id) return root;

    return (
      findNodeById(root.left, id) ||
      findNodeById(root.right, id)
    );
  }

  /* ================= SEARCH ================= */

  async function handleSearch() {
    if (!search.trim()) return;

    const { auth } = await import("@/lib/firebase/client");
    const token = await auth.currentUser.getIdToken();

    const res = await fetch("/api/admin/search-downline", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rootId: originalTree.id,
        keyword: search,
      }),
    });

    const data = await res.json();
    setResults(data.results || []);
  }

  /* ================= AUTO PLACE ================= */

  function findNextLeft(root) {
    let current = root;
    while (current) {
      if (!current.left) {
        return {
          parentId: current.id,
          parentName: current.name,
          leg: "left",
        };
      }
      current = current.left;
    }
    return null;
  }

  function findNextRight(root) {
    let current = root;
    while (current) {
      if (!current.right) {
        return {
          parentId: current.id,
          parentName: current.name,
          leg: "right",
        };
      }
      current = current.right;
    }
    return null;
  }

  const levels = buildLevels(focusNode, 3);

  return (
    <div className="space-y-8">

      {/* SEARCH + AUTO */}
      {mode === "placement" && (
        <div className="space-y-4">

          {/* Search Bar */}
          <div className="flex gap-2">
            <input
              className="flex-1 px-3 py-2 border rounded-md text-sm"
              placeholder="Search downline..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="hiroma-btn hiroma-btn-secondary"
            >
              Search
            </button>
          </div>

          {/* Search Results */}
          {results.length > 0 && (
            <div className="bg-slate-50 rounded p-3 space-y-2 max-h-40 overflow-y-auto">
              {results.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    const realNode = findNodeById(originalTree, r.id);
                    if (realNode) {
                      setHistory((h) => [...h, focusNode]);
                      setFocusNode(realNode);
                    }
                    setResults([]);
                    setSearch("");
                  }}
                  className="block w-full text-left text-sm hover:underline"
                >
                  {r.name} ({r.email})
                </button>
              ))}
            </div>
          )}

          {/* Auto Placement */}
          <div className="flex gap-3">
            <button
              className="hiroma-btn hiroma-btn-secondary"
              onClick={() => {
                const slot = findNextLeft(originalTree);
                if (slot) onSelect(slot);
              }}
            >
              Auto Place LEFT
            </button>

            <button
              className="hiroma-btn hiroma-btn-secondary"
              onClick={() => {
                const slot = findNextRight(originalTree);
                if (slot) onSelect(slot);
              }}
            >
              Auto Place RIGHT
            </button>
          </div>
        </div>
      )}

      {/* BACK BUTTON */}
      {history.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={() => {
              const h = [...history];
              const prev = h.pop();
              setHistory(h);
              setFocusNode(prev);
            }}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back
          </button>
        </div>
      )}

      {/* TREE */}
      <div className="overflow-x-auto">
        <div className="min-w-[900px] space-y-10">
          {levels.map((level, depth) => (
            <div key={depth} className="flex justify-center gap-12">
              {level.map((node, i) => (
                <div
                  key={node?.id || `empty-${depth}-${i}`}
                  style={{ width: `${400 / Math.pow(2, depth)}px` }}
                  className="flex justify-center"
                >
                  {node ? (
                    <NodeCard
                      node={node}
                      mode={mode}
                      onClick={() => {
                        setHistory((h) => [...h, focusNode]);
                        setFocusNode(node);
                      }}
                      onSelect={onSelect}
                    />
                  ) : (
                    <EmptySlot />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= TREE BUILDER ================= */

function buildLevels(root, maxDepth) {
  const levels = [];
  let queue = [{ node: root, level: 0 }];

  while (queue.length) {
    const { node, level } = queue.shift();

    if (!levels[level]) levels[level] = [];
    levels[level].push(node);

    if (level < maxDepth - 1) {
      queue.push({ node: node?.left || null, level: level + 1 });
      queue.push({ node: node?.right || null, level: level + 1 });
    }
  }

  return levels;
}

/* ================= NODE CARD ================= */

function NodeCard({ node, onClick, mode, onSelect }) {
  return (
    <div
      onClick={onClick}
      className="
        w-56 rounded-xl bg-white
        shadow-sm border border-slate-200
        px-4 py-3 text-center
        hover:shadow-md hover:-translate-y-0.5
        transition cursor-pointer
      "
    >
      <p className="text-sm font-medium">{node.name}</p>
      <p className="text-xs text-slate-500">@{node.username}</p>

      {mode === "placement" && (
        <div className="mt-3 flex justify-center gap-3 text-xs">
          {!node.left && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect({
                  parentId: node.id,
                  parentName: node.name,
                  leg: "left",
                });
              }}
              className="text-blue-600 hover:underline"
            >
              LEFT
            </button>
          )}

          {!node.right && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect({
                  parentId: node.id,
                  parentName: node.name,
                  leg: "right",
                });
              }}
              className="text-green-600 hover:underline"
            >
              RIGHT
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ================= EMPTY SLOT ================= */

function EmptySlot() {
  return (
    <div
      className="
        w-44 h-16 rounded-xl
        border border-dashed border-slate-300
        flex items-center justify-center
        text-xs text-slate-400
      "
    >
      Empty
    </div>
  );
}
