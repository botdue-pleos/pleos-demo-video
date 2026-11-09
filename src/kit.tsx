import React, { CSSProperties } from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { TransitionPresentation, TransitionPresentationComponentProps, linearTiming } from "@remotion/transitions";
import { loadFont } from "@remotion/fonts";

/* ---------------- 글꼴 · 색 ---------------- */

// Pleos 공식 서체 (앱과 같은 글꼴)
export const FONT = "Asta Sans";
loadFont({ family: FONT, url: staticFile("fonts/AstaSans.ttf"), weight: "300 800" });

/** 현대자동차 CI 색 */
export const HY = {
  blue: "#002C5F",
  deepBlue: "#0E3B6F",
  activeBlue: "#00AAD2",
  skyBlue: "#AACAE6",
  sand: "#E4DCD3",
  lightSand: "#F6F3F2",
  gold: "#A36B4F",
  goldText: "#7E4E37",
  sub: "#4A5D73",
  /** v0.4.0 디자인: 집중잔량 밤 남색, 오래운전 맑은 낮, 니어바이 위험 */
  night: "#00193A",
  daySky: "#EFF4F9",
  red: "#E63312",
};

/* ---------------- 움직임 ---------------- */

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const overshoot = Easing.bezier(0.34, 1.56, 0.64, 1);

/** start 부터 dur 프레임 동안 0 → 1 (부드럽게 감속) */
export const p = (f: number, start: number, dur: number) =>
  interpolate(f, [start, start + dur], [0, 1], { ...clamp, easing: easeOut });

/** 살짝 튀어나왔다 자리 잡는 0 → 1 */
export const pop = (f: number, start: number, dur = 18) =>
  interpolate(f, [start, start + dur], [0, 1], { ...clamp, easing: overshoot });

/** 앞 장면의 한 지점(x, y)에서 원이 퍼지며 다음 장면이 열린다 */
const CircleReveal: React.FC<TransitionPresentationComponentProps<{ x: number; y: number }>> = ({ children, presentationDirection, presentationProgress, passedProps }) =>
  presentationDirection === "exiting" ? (
    <AbsoluteFill style={{ scale: String(1 + presentationProgress * 0.08) }}>{children}</AbsoluteFill>
  ) : (
    <AbsoluteFill style={{ clipPath: `circle(${presentationProgress * 2300}px at ${passedProps.x}px ${passedProps.y}px)` }}>{children}</AbsoluteFill>
  );

export const circle = (x: number, y: number): TransitionPresentation<{ x: number; y: number }> => ({ component: CircleReveal, props: { x, y } });
export const ease = (d: number) => linearTiming({ durationInFrames: d, easing: Easing.inOut(Easing.cubic) });

/* ---------------- 키네틱 타이포 ---------------- */

/** 글자 하나씩 흐림에서 떠오른다. "\n" 으로 줄을 나눈다 */
export const Kinetic: React.FC<{
  text: string;
  start?: number;
  size: number;
  color: string;
  weight?: number;
  stagger?: number;
  lh?: number;
  align?: CSSProperties["textAlign"];
  style?: CSSProperties;
}> = ({ text, start = 0, size, color, weight = 800, stagger = 1.4, lh = 1.22, align = "left", style }) => {
  const f = useCurrentFrame();
  let idx = 0;
  return (
    <div style={{ fontFamily: FONT, fontSize: size, lineHeight: lh, letterSpacing: "-0.03em", textAlign: align, color, fontWeight: weight, ...style }}>
      {text.split("\n").map((line, li) => (
        <div key={li} style={{ whiteSpace: "nowrap" }}>
          {[...line].map((ch, ci) => {
            const a = p(f, start + idx++ * stagger, 16);
            return (
              <span key={ci} style={{ display: "inline-block", whiteSpace: "pre", opacity: a, translate: `0 ${(1 - a) * 0.45}em`, filter: `blur(${(1 - a) * 8}px)` }}>
                {ch}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** 아래에서 올라오는 한 줄 설명 */
export const Line: React.FC<{ children: React.ReactNode; at: number; color: string; size?: number; style?: CSSProperties }> = ({ children, at, color, size = 34, style }) => {
  const f = useCurrentFrame();
  const a = p(f, at, 18);
  return (
    <div style={{ fontFamily: FONT, fontSize: size, lineHeight: 1.45, color, fontWeight: 600, opacity: a, translate: `0 ${(1 - a) * 24}px`, ...style }}>
      {children}
    </div>
  );
};

export const CountUp: React.FC<{ to: number; start: number; dur?: number; suffix?: string }> = ({ to, start, dur = 30, suffix = "" }) => {
  const f = useCurrentFrame();
  const v = Math.round(interpolate(f, [start, start + dur], [0, to], { ...clamp, easing: Easing.out(Easing.cubic) }));
  return (
    <span style={{ fontVariantNumeric: "tabular-nums" }}>
      {v.toLocaleString("ko-KR")}
      {suffix}
    </span>
  );
};

/* ---------------- 픽셀 ---------------- */

/** 3x3 픽셀 로고. colors 는 9칸, 왼쪽 위부터 */
export const PixelLogo: React.FC<{ size: number; colors: string[]; at?: number }> = ({ size, colors, at }) => {
  const f = useCurrentFrame();
  const cell = (size * 7) / 26;
  const step = (size * 9.5) / 26;
  return (
    <div style={{ width: size, height: size, position: "relative", flexShrink: 0 }}>
      {colors.map((c, i) => {
        const a = at === undefined ? 1 : pop(f, at + i * 2, 16);
        return (
          <div key={i} style={{ position: "absolute", left: (i % 3) * step, top: Math.floor(i / 3) * step, width: cell, height: cell, borderRadius: cell * 0.2, background: c, scale: String(a), opacity: Math.min(1, a * 1.4) }} />
        );
      })}
    </div>
  );
};

/** 회전 칸: true = 깜빡이 켠 회전(채움), false = 놓친 회전(테두리만) */
export const TurnCell: React.FC<{ on: boolean; size: number; ink: string; ring: string; a?: number }> = ({ on, size, ink, ring, a = 1 }) => (
  <div
    style={{
      width: size,
      height: size,
      boxSizing: "border-box",
      borderRadius: size * 0.22,
      background: on ? ink : "transparent",
      border: on ? "none" : `${Math.max(3, size * 0.16)}px solid ${ring}`,
      scale: String(a),
      opacity: Math.min(1, a * 1.5),
      flexShrink: 0,
    }}
  />
);

/* ---------------- 차량 화면 ---------------- */

/**
 * 에뮬레이터 녹화를 차량 디스플레이 틀 안에 보여준다.
 * 녹화는 앱 창(920x1330 또는 1870x1330) 위아래로 시스템 바 36px·48px 가 붙어 있어 잘라낸다.
 */
export const CarScreen: React.FC<{
  src: string;
  /** 녹화의 몇 초부터 */
  from: number;
  landscape?: boolean;
  width: number;
  rate?: number;
  style?: CSSProperties;
}> = ({ src, from, landscape = false, width, rate = 1, style }) => {
  const appW = landscape ? 1870 : 920;
  const scale = width / appW;
  const bezel = 18;
  return (
    <div style={{ padding: bezel, borderRadius: 34, background: "#1B2430", boxShadow: "0 40px 80px rgba(0,20,50,0.35), inset 0 0 0 2px rgba(255,255,255,0.06)", ...style }}>
      <div style={{ width, height: 1330 * scale, overflow: "hidden", borderRadius: 16, position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: -36 * scale, width: appW, height: 1414, scale: String(scale), transformOrigin: "0 0" }}>
          <OffthreadVideo src={staticFile(`rec/${src}`)} trimBefore={Math.round(from * 30)} playbackRate={rate} muted style={{ width: appW, height: 1414, display: "block" }} />
        </div>
      </div>
    </div>
  );
};

/** 화면 왼쪽 위 기능 라벨 */
export const Tag: React.FC<{ n: string; children: React.ReactNode; bg: string; color: string }> = ({ n, children, bg, color }) => {
  const f = useCurrentFrame();
  const a = pop(f, 2, 14);
  return (
    <div style={{ position: "absolute", left: 96, top: 72, opacity: a, translate: `${(1 - a) * -40}px 0`, display: "flex", alignItems: "center", gap: 14, fontFamily: FONT }}>
      <span style={{ fontSize: 26, fontWeight: 800, color: bg === "transparent" ? color : bg, fontVariantNumeric: "tabular-nums" }}>{n}</span>
      <span style={{ fontSize: 26, fontWeight: 700, color, padding: "8px 20px", borderRadius: 999, border: `2px solid ${color}` }}>{children}</span>
    </div>
  );
};

/** 녹화 밑에 붙는 출처 표시 */
export const RecNote: React.FC<{ color: string; at?: number }> = ({ color, at = 10 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ fontFamily: FONT, fontSize: 20, fontWeight: 600, color, opacity: p(f, at, 20) * 0.85, marginTop: 18, display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
      <span style={{ width: 10, height: 10, borderRadius: 3, background: "#E5484D", opacity: 0.5 + 0.5 * Math.abs(Math.sin(f / 9)) }} />
      Pleos Connect 앱 창 크기 에뮬레이터 실제 화면
    </div>
  );
};
