import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, HY, Kinetic, p, pop } from "./kit";

/*
 * 세 앱의 영상 문법. 앱마다 장면 틀이 다르다.
 * - Cinema (집중잔량): 위아래 검은 띠, 차 안에서 보는 화면에 천천히 다가가고, 자막은 아래 띠 가운데
 * - Album (오래운전): 펼친 앨범. 왼쪽 장에 날짜와 문장, 오른쪽 장에 사진처럼 붙인 앱 화면
 * - Road (니어바이): 위에서 본 도로에 차 픽셀, 아래에 여러 차의 화면을 나란히
 */

export type Rec = { src: string; from: number; rate: number; landscape?: boolean };

/** 녹화 영상에서 앱 창만 (위 36px·아래 48px 시스템 바를 자름). scale로 줄여 보여 준다 */
export const Clip: React.FC<{ rec: Rec; scale: number; radius?: number }> = ({ rec, scale, radius = 18 }) => {
  const w = rec.landscape ? 1870 : 920;
  return (
    <div style={{ width: w * scale, height: 1330 * scale, overflow: "hidden", position: "relative", borderRadius: radius }}>
      <OffthreadVideo
        src={staticFile(`rec/${rec.src}`)}
        trimBefore={Math.round(rec.from * 30)}
        playbackRate={rec.rate}
        muted
        style={{ position: "absolute", left: 0, top: -36 * scale, width: w * scale, height: 1414 * scale }}
      />
    </div>
  );
};

/* ---------------- 집중잔량: Cinema ---------------- */

export const BAR = 112;

/** 영상 전체에 덮는 위아래 검은 띠 */
export const Letterbox: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: BAR, background: "#000" }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: BAR, background: "#000" }} />
  </AbsoluteFill>
);

export const Cinema: React.FC<{ when: string; line: string; rec: Rec; side?: "left" | "right" }> = ({ when, line, rec, side = "right" }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // 장면 내내 아주 천천히 다가간다 (1인칭 시선)
  const push = interpolate(f, [0, durationInFrames], [1, 1.07], { easing: Easing.inOut(Easing.quad) });
  const enter = p(f, 0, 20);
  const sub = p(f, 10, 18);
  const wide = rec.landscape === true;
  const scale = wide ? 0.58 : 0.57;
  const w = (wide ? 1870 : 920) * scale;
  const left = wide ? (1920 - w) / 2 : side === "right" ? 1920 - w - 260 : 260;
  return (
    <AbsoluteFill style={{ background: HY.blue, fontFamily: FONT, overflow: "hidden" }}>
      {/* 계기판 너머 어두운 도로 */}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }} aria-hidden>
        <path d="M0 900 Q960 760 1920 900 L1920 1080 L0 1080 Z" fill="#001A3A" />
        <path d="M300 1080 Q620 860 960 852 Q1300 860 1620 1080" fill="none" stroke="#1E4A7C" strokeWidth={3} />
      </svg>
      <div style={{ position: "absolute", left, top: BAR + 44, scale: String(push), transformOrigin: "50% 50%", opacity: enter, boxShadow: "0 30px 80px rgba(0,0,0,0.45)", borderRadius: 22 }}>
        <Clip rec={rec} scale={scale} radius={22} />
      </div>
      {!wide && (
        <div style={{ position: "absolute", left: side === "right" ? 160 : 1920 - 160 - 620, top: BAR + 64, width: 620, opacity: p(f, 6, 18) }}>
          <div style={{ fontSize: 30, fontWeight: 700, color: HY.skyBlue }}>{when}</div>
        </div>
      )}
      {wide && <div style={{ position: "absolute", left: 160, top: BAR + 40, fontSize: 28, fontWeight: 700, color: HY.skyBlue, opacity: p(f, 6, 18) }}>{when}</div>}
      {/* 아래 띠 자막 */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: BAR, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: "#F6F3F2", opacity: sub, translate: `0 ${(1 - sub) * 12}px` }}>{line}</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- 오래운전: Album ---------------- */

const PAPER = "#FFFFFF";
const SKY = "#D9E5F1";

/** 펼친 앨범 틀: 두 장 사이 접힌 선 */
export const Spread: React.FC<{ left: React.ReactNode; right: React.ReactNode }> = ({ left, right }) => (
  <AbsoluteFill style={{ background: SKY, fontFamily: FONT, padding: "64px 96px", boxSizing: "border-box", display: "flex", flexDirection: "row" }}>
    <div style={{ flex: 1, background: PAPER, borderRadius: "10px 0 0 10px", padding: "72px 76px", boxSizing: "border-box", boxShadow: "inset -20px 0 26px -24px rgba(0,44,95,0.4)", display: "flex", flexDirection: "column" }}>{left}</div>
    <div style={{ flex: 1, background: PAPER, borderRadius: "0 10px 10px 0", padding: "56px 60px", boxSizing: "border-box", boxShadow: "inset 20px 0 26px -24px rgba(0,44,95,0.4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>{right}</div>
  </AbsoluteFill>
);

/** 사진처럼 붙인 앱 화면: 살짝 기울이고 금색 모서리 */
const Photo: React.FC<{ rec: Rec; caption: string; tilt: number }> = ({ rec, caption, tilt }) => {
  const f = useCurrentFrame();
  const a = pop(f, 6, 22);
  const wide = rec.landscape === true;
  const scale = wide ? 0.39 : 0.6;
  const corner = (pos: React.CSSProperties) => <span style={{ position: "absolute", width: 44, height: 44, ...pos }} />;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: a, scale: String(0.94 + a * 0.06) }}>
      <div style={{ position: "relative", padding: 14, background: "#F4F7FA", border: "1px solid #C9D6E4", rotate: `${tilt}deg`, boxShadow: "0 18px 40px rgba(0,44,95,0.18)" }}>
        {corner({ left: -8, top: -8, borderLeft: `5px solid ${HY.gold}`, borderTop: `5px solid ${HY.gold}` })}
        {corner({ right: -8, bottom: -8, borderRight: `5px solid ${HY.gold}`, borderBottom: `5px solid ${HY.gold}` })}
        <Clip rec={rec} scale={scale} radius={6} />
      </div>
      <div style={{ marginTop: 26, fontSize: 26, fontWeight: 600, color: HY.goldText }}>{caption}</div>
    </div>
  );
};

export const Album: React.FC<{ when: string; what: string; line: string; rec: Rec; caption: string; tilt?: number }> = ({ when, what, line, rec, caption, tilt = -1.5 }) => {
  const f = useCurrentFrame();
  return (
    <Spread
      left={
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 18, borderBottom: `4px solid ${HY.blue}`, opacity: p(f, 0, 16) }}>
            <span style={{ fontSize: 36, fontWeight: 800, color: HY.blue }}>{when}</span>
            <span style={{ fontSize: 28, fontWeight: 600, color: HY.sub }}>{what}</span>
          </div>
          <Kinetic text={line} start={10} size={66} color={HY.blue} stagger={0.9} style={{ marginTop: 60 }} />
        </>
      }
      right={<Photo rec={rec} caption={caption} tilt={tilt} />}
    />
  );
};

/* ---------------- 니어바이: Road ---------------- */

const ROAD = { bg: "#EEF0F2", road: "#C9CED4", tunnel: "#9DA5AE", ink: "#1C2430", sub: "#5B6672", red: "#C42A0E", blue: HY.blue, cyan: "#00789C" };

export type CarDot = { id: string; x: number; lane: 0 | 1; tone: "me" | "red" | "cyan" | "dim"; at?: number };

/** 위에서 본 도로 한 줄: 차 픽셀이 x 위치에 놓인다 (x는 0~1920) */
const RoadBand: React.FC<{ cars: CarDot[]; tunnel?: [number, number]; hazard?: [number, number] }> = ({ cars, tunnel, hazard }) => {
  const f = useCurrentFrame();
  const dash = (f * 4) % 112;
  return (
    <div style={{ position: "absolute", left: 0, top: 150, width: 1920, height: 200 }}>
      <div style={{ position: "absolute", inset: 0, background: ROAD.road }} />
      {tunnel && <div style={{ position: "absolute", left: tunnel[0], width: tunnel[1] - tunnel[0], top: 0, bottom: 0, background: ROAD.tunnel }} />}
      {tunnel && <div style={{ position: "absolute", left: tunnel[0], top: -40, fontSize: 24, fontWeight: 700, color: ROAD.sub }}>터널</div>}
      {hazard && <div style={{ position: "absolute", left: hazard[0], width: hazard[1] - hazard[0], top: 0, bottom: 0, background: ROAD.red, opacity: 0.22 + 0.08 * Math.sin(f / 6) }} />}
      <div style={{ position: "absolute", left: -dash, top: 98, width: 2100, height: 4, background: "repeating-linear-gradient(90deg, #FFFFFF 0 56px, transparent 56px 112px)" }} />
      {cars.map((c) => {
        const a = pop(f, c.at ?? 0, 14);
        const color = c.tone === "me" ? ROAD.blue : c.tone === "red" ? ROAD.red : c.tone === "cyan" ? ROAD.cyan : "#8C949C";
        return (
          <div key={c.id} style={{ position: "absolute", left: c.x - 22, top: c.lane === 0 ? 38 : 118, opacity: a, scale: String(0.6 + a * 0.4) }}>
            <div style={{ width: 44, height: 44, borderRadius: 4, background: color }} />
            <div style={{ position: "absolute", left: 0, width: 44, textAlign: "center", top: c.lane === 0 ? -34 : 50, fontSize: 24, fontWeight: 800, color }}>{c.id}</div>
          </div>
        );
      })}
    </div>
  );
};

export const Road: React.FC<{
  when: string;
  line: string;
  cars: CarDot[];
  tunnel?: [number, number];
  hazard?: [number, number];
  screens: { label: string; rec: Rec }[];
}> = ({ when, line, cars, tunnel, hazard, screens }) => {
  const f = useCurrentFrame();
  const scale = screens.length > 1 ? 0.5 : 0.52;
  return (
    <AbsoluteFill style={{ background: ROAD.bg, fontFamily: FONT, color: ROAD.ink, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 80, top: 44, display: "flex", gap: 28, alignItems: "baseline", opacity: p(f, 0, 12) }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: ROAD.sub }}>{when}</span>
        <span style={{ fontSize: 40, fontWeight: 800 }}>{line}</span>
      </div>
      <RoadBand cars={cars} tunnel={tunnel} hazard={hazard} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 384, display: "flex", justifyContent: "center", gap: 48 }}>
        {screens.map((s, i) => {
          const a = p(f, 8 + i * 6, 14);
          return (
            <div key={s.label} style={{ display: "flex", gap: 22, alignItems: "flex-start", opacity: a, translate: `0 ${(1 - a) * 30}px` }}>
              <div style={{ width: 200, fontSize: 26, fontWeight: 700, color: ROAD.sub, paddingTop: 8 }}>{s.label}</div>
              <div style={{ boxShadow: "0 12px 30px rgba(28,36,48,0.18)", borderRadius: 6, overflow: "hidden", height: 640, width: (s.rec.landscape ? 1870 : 920) * scale }}>
                <Clip rec={s.rec} scale={scale} radius={6} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
