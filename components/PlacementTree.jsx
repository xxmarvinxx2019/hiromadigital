"use client";

import { useState } from "react";

export default function PlacementTree({ node, onSelect }) {
  const [depth, setDepth] = useState(3);

  /* ================= EMPTY TREE (FIRST RESELLER) ================= */
  if (!node) {
    return (
      <div className="flex justify-center">
        <button
          onClick={() =>
            onSelect({
              parentId: null,
              parentName: "ROOT",
              leg: "root",
            })
          }
          className="
            w-56 h-20 rounded-xl
            border-2 border-dashed border-blue-500
            text-blue-600
            hover:bg-blue-50
            transition
          "
        >
          Place as Root
        </button>
      </div>
    );
  }

  const levels = buildLevels(node, depth);
  const canExpand = levels[depth - 1]?.some((n) => n !== null);

  return (
    <div className="space-y-10">
      {levels.map((level, d) => (
        <div key={d} className="flex justify-center gap-12">
          {level.map((item, index) => (
            <div
              key={index}
              className="flex justify-center"
              style={{
                width: `${420 / Math.pow(2, d)}px`,
              }}
            >
              {item ? (
                <NodeCard node={item} />
              ) : (
                <EmptySlot
                  parent={getParent(levels, d, index)}
                  onSelect={onSelect}
                />
              )}
            </div>
          ))}
        </div>
      ))}

      {canExpand && (
        <div className="flex justify-center">
          <button
            onClick={() => setDepth((d) => d + 1)}
            className="text-sm text-blue-600 hover:underline"
          >
            Show next level
          </button>
        </div>
      )}
    </div>
  );
}

/* ================= TREE HELPERS ================= */

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

function getParent(levels, depth, index) {
  if (depth === 0) return null;

  const parentIndex = Math.floor(index / 2);
  const parentNode = levels[depth - 1][parentIndex];

  if (!parentNode) return null;

  const leg = index % 2 === 0 ? "left" : "right";

  // ✅ allow selection ONLY if the slot is empty
  const slotEmpty =
    leg === "left"
      ? !parentNode.left
      : !parentNode.right;

  if (!slotEmpty) return null;

  return {
    parentId: parentNode.id,
    parentName: parentNode.name,
    leg,
  };
}

/* ================= UI ================= */

function NodeCard({ node }) {
  return (
    <div className="w-44 rounded-xl bg-slate-100 px-3 py-2 text-center text-sm">
      <p className="font-medium">{node.name}</p>
      <p className="text-xs text-slate-500">@{node.username}</p>
    </div>
  );
}

function EmptySlot({ parent, onSelect }) {
  if (!parent) {
    return (
      <div className="w-44 h-16 rounded-xl border border-dashed border-slate-300" />
    );
  }

  if (typeof onSelect !== "function") {
    return (
      <div className="w-44 h-16 rounded-xl border border-dashed border-slate-300" />
    );
  }

  return (
    <button
      onClick={() => onSelect(parent)}
      className="
        w-44 h-16 rounded-xl
        border-2 border-dashed border-blue-400
        text-blue-600 text-xs
        hover:bg-blue-50 transition
      "
    >
      Select Here
      <div className="mt-1 text-[10px] text-slate-400 uppercase">
        {parent.leg}
      </div>
    </button>
  );
}
