"use client";

import type { CSSProperties, ReactNode } from "react";
import "./editor-layout.css";

export type EditorLayoutSkeletonProps = {
  /** Top bar left */
  title?: ReactNode;
  /** Top bar right (export, user, shorts…) */
  headerRight?: ReactNode;
  /** Horizontal mode tabs row */
  modeTabs?: ReactNode;
  /** Left work stack (caption list / packs / tools) */
  work?: ReactNode;
  /** Middle inspector column (media / selection) */
  inspector?: ReactNode;
  /** Preview column header (undo/redo chips) */
  previewHeader?: ReactNode;
  /** Video stage content (video + overlays) */
  previewStage?: ReactNode;
  /** Transport under video */
  playerBar?: ReactNode;
  /** Bottom timeline under work + inspector */
  timeline?: ReactNode;
  /** CSS vars */
  timelineH?: number;
  inspectorW?: number;
  previewW?: number;
  /** 9/16 default; set 16/9 via landscape */
  landscape?: boolean;
  className?: string;
};

/**
 * Lykhaari-style editor chrome (grid positions only).
 * ClipForge light colors live in editor-layout.css.
 */
export function EditorLayoutSkeleton({
  title = "Clip editor",
  headerRight,
  modeTabs,
  work,
  inspector,
  previewHeader,
  previewStage,
  playerBar,
  timeline,
  timelineH = 220,
  inspectorW = 280,
  previewW = 420,
  landscape = false,
  className,
}: EditorLayoutSkeletonProps) {
  return (
    <div
      className={["editor-shell", className].filter(Boolean).join(" ")}
      style={
        {
          "--timeline-h": `${timelineH}px`,
          "--inspector-w": `${inspectorW}px`,
          "--preview-w": `${previewW}px`,
        } as CSSProperties
      }
    >
      <header className="editor-header">
        <div className="min-w-0 shrink-0">{title}</div>
        <div className="editor-header-right">{headerRight}</div>
      </header>

      <div className="editor-mode-tabs-wrap">
        <nav className="editor-mode-tabs" aria-label="Editor modes">
          {modeTabs}
        </nav>
      </div>

      <div className="editor-grid">
        <div className="editor-left-stack editor-panel">{work}</div>

        <aside className="editor-inspector editor-panel">{inspector}</aside>

        <section className="editor-video-col editor-panel">
          {previewHeader ? (
            <div className="editor-preview-header">{previewHeader}</div>
          ) : null}
          <div className="editor-video-stage">
            <div
              className={[
                "editor-video-frame",
                landscape ? "is-landscape" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {previewStage}
            </div>
          </div>
          {playerBar ? (
            <div className="editor-player-bar">{playerBar}</div>
          ) : null}
        </section>

        <div className="editor-timeline editor-panel">{timeline}</div>
      </div>
    </div>
  );
}
