import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, Kinetic, p } from "./kit";
import { Camera, Car, PleosDisplay, StoryHead, Theme, appPoint } from "./display";

export type Look = { bg: string; ink: string; sub: string; accent: string };

/**
 * 이야기 장면: 위에 시간 라벨과 한 문장, 아래에 Pleos 디스플레이 속 실제 녹화.
 * focus(앱 창 좌표)와 zoom(프레임)을 주면 그 UI 로 밀고 들어갔다 나온다.
 */
export const Story: React.FC<{
  look: Look;
  theme: Theme;
  logo: string[];
  when: string;
  what: string;
  line: string;
  clock: string;
  car: Car;
  rec: { src: string; from: number; rate: number; landscape?: boolean };
  focus?: [number, number];
  zoom?: [number, number, number, number];
  k?: number;
}> = ({ look, theme, logo, when, what, line, clock, car, rec, focus, zoom, k }) => (
  <AbsoluteFill style={{ background: look.bg }}>
    <StoryHead when={when} what={what} line={line} ink={look.ink} sub={look.sub} accent={look.accent} />
    <Camera scale={0.6} box={{ x: 0, y: 172, w: 1920, h: 900 }} focus={focus ? appPoint(focus[0], focus[1], rec.landscape) : undefined} zoom={zoom} k={k}>
      <PleosDisplay t={theme} clock={clock} car={car} rec={rec} logo={logo} />
    </Camera>
  </AbsoluteFill>
);

/** 판정 흐름: 차량 신호 → 판정 엔진 → 안내 */
export const EngineFlow: React.FC<{ look: Look; signals: string[]; rules: string[]; outputs: string[]; tests: number }> = ({ look, signals, rules, outputs, tests }) => {
  const f = useCurrentFrame();
  const col = (title: string, items: string[], at: number, strong = false) => {
    const a = p(f, at, 20);
    return (
      <div style={{ flex: 1, opacity: a, translate: `0 ${(1 - a) * 40}px` }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: look.accent, marginBottom: 20 }}>{title}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {items.map((it, i) => (
            <div key={it} style={{ fontSize: 30, fontWeight: 700, color: strong ? look.bg : look.ink, background: strong ? look.ink : "transparent", border: `2px solid ${look.ink}${strong ? "" : "44"}`, borderRadius: 16, padding: "16px 22px", opacity: p(f, at + 6 + i * 4, 14) }}>
              {it}
            </div>
          ))}
        </div>
      </div>
    );
  };
  const arrow = (at: number) => {
    const a = p(f, at, 16);
    return (
      <svg width={90} height={40} viewBox="0 0 90 40" style={{ alignSelf: "center", marginTop: 50, opacity: a }}>
        <path d={`M 4 20 L ${4 + 70 * a} 20`} stroke={look.accent} strokeWidth={5} strokeLinecap="round" />
        <path d="M 64 8 L 80 20 L 64 32" stroke={look.accent} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={a} />
      </svg>
    );
  };
  return (
    <AbsoluteFill style={{ background: look.bg, fontFamily: FONT, padding: "0 110px", justifyContent: "center" }}>
      <Kinetic text="판정은 화면과 분리된 엔진이 한다" start={2} size={60} color={look.ink} />
      <div style={{ display: "flex", gap: 30, marginTop: 56 }}>
        {col("차량 신호", signals, 14)}
        {arrow(34)}
        {col("판정 엔진", rules, 40, true)}
        {arrow(60)}
        {col("안내", outputs, 66)}
      </div>
      <div style={{ marginTop: 44, fontSize: 28, fontWeight: 700, color: look.sub, opacity: p(f, 84, 18) }}>판정 엔진 단위 테스트 {tests}개 통과. 지금은 시연용 주행 데이터, Pleos SDK 콜백으로 바꿔 끼우는 구조</div>
    </AbsoluteFill>
  );
};
