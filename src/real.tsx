import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FONT, p } from "./kit";

/**
 * 실제 Pleos Connect Emulator v2.1.0(2560×1440) 전체 화면 녹화를 그대로 보여 주는 장면.
 * 녹화는 1920×1080으로 줄여 찍었고, 처음 몇 초는 앱이 켜지는 화면이라 from으로 건너뛴다.
 */
export const PleosReal: React.FC<{ src: string; from: number; rate?: number; line: string; accent: string }> = ({ src, from, rate = 1, line, accent }) => {
  const f = useCurrentFrame();
  const a = p(f, 6, 16);
  const s = interpolate(f, [0, 240], [1, 1.04], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#0B1220" }}>
      <OffthreadVideo src={staticFile(`rec/${src}`)} trimBefore={Math.round(from * 30)} playbackRate={rate} muted style={{ width: 1920, height: 1080, transform: `scale(${s})`, transformOrigin: "60% 45%" }} />
      <div style={{ position: "absolute", left: 40, bottom: 40, display: "flex", alignItems: "center", gap: 18, opacity: a, translate: `0 ${(1 - a) * 20}px`, fontFamily: FONT }}>
        <div style={{ background: accent, color: "#fff", fontWeight: 800, fontSize: 26, padding: "12px 22px", borderRadius: 999 }}>Pleos Connect Emulator v2.1.0 · 실제 실행 화면</div>
        <div style={{ background: "rgba(10,18,32,.82)", color: "#fff", fontWeight: 700, fontSize: 30, padding: "12px 26px", borderRadius: 999 }}>{line}</div>
      </div>
    </AbsoluteFill>
  );
};
