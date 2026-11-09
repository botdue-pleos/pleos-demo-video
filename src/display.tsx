import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FONT, HY, PixelLogo, p, pop } from "./kit";

/*
 * Pleos Connect 식 가로 디스플레이 틀.
 * 실제 Pleos UI 를 베끼지 않고 구성만 따른다: 위 상태 줄, 왼쪽 시스템 레일, 차량 상태,
 * 오른쪽 앱 창(세로 1칸 920x1330 또는 가로 2칸 1870x1330), 아래 앱 바.
 * 좌표는 모두 화면 원래 크기(DW x DH) 기준이다.
 */
export const DW = 2520;
export const DH = 1480;
const STATUS_H = 60;
const RAIL_W = 72;
export const APP_TOP = STATUS_H;
export const APP_AREA_X = 632;
const DOCK_TOP = APP_TOP + 1330;

export type Theme = { screen: string; panel: string; ink: string; sub: string; line: string; accent: string; route: string };
export const DAY: Theme = { screen: "#EEF1F5", panel: "#F8F9FB", ink: HY.blue, sub: "#6B7A8C", line: "#DCE2EA", accent: HY.activeBlue, route: "#6C8CFF" };
export const NIGHT: Theme = { screen: "#0B1B33", panel: "#11264A", ink: "#E8EDF5", sub: "#8FA6C4", line: "#1E3A63", accent: HY.activeBlue, route: "#7B93FF" };

export type Car = { speed: number; gear: "P" | "D" };

/** 녹화 영상: 위 36px·아래 48px 시스템 바를 잘라 앱 창만 보여준다 */
const AppVideo: React.FC<{ src: string; from: number; rate: number; w: number }> = ({ src, from, rate, w }) => (
  <div style={{ width: w, height: 1330, overflow: "hidden", position: "relative", borderRadius: 18 }}>
    <OffthreadVideo src={staticFile(`rec/${src}`)} trimBefore={Math.round(from * 30)} playbackRate={rate} muted style={{ position: "absolute", left: 0, top: -36, width: w, height: 1414 }} />
  </div>
);

/** 앱 창 옆을 채우는 단순한 지도 (실제 내비 화면이 아니라 배경 표시용) */
const MapFill: React.FC<{ t: Theme; w: number }> = ({ t, w }) => {
  const f = useCurrentFrame();
  const shift = (f * 0.6) % 120;
  return (
    <div style={{ width: w, height: 1330, borderRadius: 18, background: t.panel, overflow: "hidden", position: "relative" }}>
      <svg width={w} height={1330} style={{ position: "absolute", left: 0, top: 0 }}>
        {Array.from({ length: 14 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 120 - shift} x2={w} y2={i * 120 - shift + 60} stroke={t.line} strokeWidth={10} />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`v${i}`} x1={i * 140 - 40} y1={0} x2={i * 140 + 80} y2={1330} stroke={t.line} strokeWidth={14} />
        ))}
        <path d={`M ${w * 0.5} 1330 L ${w * 0.5} 760 Q ${w * 0.5} 640 ${w * 0.62} 600 L ${w} 520`} stroke={t.route} strokeWidth={22} fill="none" strokeLinecap="round" />
        <circle cx={w * 0.5} cy={1040} r={26} fill="#fff" stroke={t.route} strokeWidth={10} />
      </svg>
    </div>
  );
};

/** 차량 상태: 속도, 기어, 위에서 본 차 */
const Cluster: React.FC<{ t: Theme; car: Car }> = ({ t, car }) => (
  <div style={{ width: 540, height: 1330, borderRadius: 18, background: t.panel, fontFamily: FONT, padding: 40, boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
    <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
      <span style={{ fontSize: 120, fontWeight: 700, color: t.ink, lineHeight: 1 }}>{car.speed}</span>
      <span style={{ fontSize: 30, fontWeight: 600, color: t.sub }}>km/h</span>
    </div>
    <div style={{ display: "flex", gap: 22, marginTop: 24, fontSize: 34, fontWeight: 700 }}>
      {["P", "R", "N", "D"].map((g) => (
        <span key={g} style={{ color: g === car.gear ? t.accent : t.sub, opacity: g === car.gear ? 1 : 0.5 }}>{g}</span>
      ))}
    </div>
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={220} height={420} viewBox="0 0 220 420">
        <rect x={20} y={10} width={180} height={400} rx={80} fill={t.line} />
        <rect x={45} y={95} width={130} height={110} rx={28} fill={t.screen} />
        <rect x={45} y={250} width={130} height={90} rx={24} fill={t.screen} />
      </svg>
    </div>
    <div style={{ fontSize: 28, fontWeight: 600, color: t.sub }}>주행 가능 480km</div>
  </div>
);

/** Pleos 식 가로 디스플레이. 앱 창 안에서는 실제 에뮬레이터 녹화가 재생된다 */
export const PleosDisplay: React.FC<{
  t: Theme;
  clock: string;
  car: Car;
  rec: { src: string; from: number; rate: number; landscape?: boolean };
  logo: string[];
}> = ({ t, clock, car, rec, logo }) => {
  const wide = rec.landscape === true;
  return (
    <div style={{ width: DW, height: DH, background: t.screen, borderRadius: 48, position: "relative", overflow: "hidden", fontFamily: FONT, outline: "22px solid #151D28" }}>
      {/* 상태 줄 */}
      <div style={{ position: "absolute", left: RAIL_W + 24, right: 40, top: 0, height: STATUS_H, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 28, fontWeight: 700, color: t.sub }}>
        <span>{clock}</span>
        <span style={{ display: "flex", gap: 14 }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: 22, height: 22, borderRadius: 6, background: t.sub, opacity: 0.5 }} />
          ))}
        </span>
      </div>
      {/* 시스템 레일 */}
      <div style={{ position: "absolute", left: 0, top: 0, width: RAIL_W, height: DH, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, paddingTop: 90 }}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} style={{ width: 34, height: 34, borderRadius: 10, background: t.sub, opacity: 0.35 }} />
        ))}
      </div>
      {/* 차량 상태 */}
      <div style={{ position: "absolute", left: RAIL_W + 8, top: APP_TOP }}>
        <Cluster t={t} car={car} />
      </div>
      {/* 앱 영역 */}
      <div style={{ position: "absolute", left: APP_AREA_X, top: APP_TOP, display: "flex", gap: 16 }}>
        {!wide && <MapFill t={t} w={934} />}
        <div style={{ boxShadow: "0 12px 40px rgba(0,20,60,0.25)", borderRadius: 18 }}>
          <AppVideo src={rec.src} from={rec.from} rate={rec.rate} w={wide ? 1870 : 920} />
        </div>
      </div>
      {/* 앱 바: 우리 앱 아이콘만 켜져 있다 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: DOCK_TOP + 8, display: "flex", justifyContent: "center", gap: 34 }}>
        {Array.from({ length: 9 }, (_, i) =>
          i === 6 ? (
            <div key={i} style={{ width: 64, height: 64, borderRadius: 18, background: t.panel, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 3px ${t.accent}` }}>
              <PixelLogo size={40} colors={logo} />
            </div>
          ) : (
            <span key={i} style={{ width: 64, height: 64, borderRadius: 18, background: t.sub, opacity: 0.22 }} />
          ),
        )}
      </div>
    </div>
  );
};

/** 앱 창 안 좌표(세로 1칸 또는 가로 2칸 기준)를 디스플레이 좌표로 바꾼다 */
export const appPoint = (x: number, y: number, landscape = false) => ({ x: APP_AREA_X + (landscape ? 0 : 950) + x, y: APP_TOP + y });

/**
 * 카메라: 디스플레이를 화면 크기 scale 로 보여주다가, zoom 구간에서 focus 지점으로 밀고 들어간다.
 * zoom = [들어가기 시작, 다 들어감, 나오기 시작, 다 나옴] 프레임, k = 확대 배율
 */
export const Camera: React.FC<{
  children: React.ReactNode;
  scale: number;
  box: { x: number; y: number; w: number; h: number };
  focus?: { x: number; y: number };
  zoom?: [number, number, number, number];
  k?: number;
}> = ({ children, scale, box, focus, zoom, k = 2 }) => {
  const f = useCurrentFrame();
  const z = zoom && focus ? interpolate(f, zoom, [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }) : 0;
  const s = scale * (1 + (k - 1) * z);
  // 확대하면서 focus 지점을 상자 가운데로 옮긴다
  const fx = focus ? focus.x : DW / 2;
  const fy = focus ? focus.y : DH / 2;
  const cx = box.w / 2;
  const cy = box.h / 2;
  const baseX = (box.w - DW * scale) / 2;
  const baseY = (box.h - DH * scale) / 2;
  const tx = baseX + (cx - (baseX + fx * scale)) * z + fx * scale - fx * s;
  const ty = baseY + (cy - (baseY + fy * scale)) * z + fy * scale - fy * s;
  const enter = p(f, 0, 24);
  return (
    <div style={{ position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h, overflow: "hidden", borderRadius: 28 }}>
      <div style={{ position: "absolute", left: tx, top: ty + (1 - enter) * 60, width: DW, height: DH, scale: String(s), transformOrigin: "0 0", opacity: enter }}>{children}</div>
    </div>
  );
};

/** 저장소 주소와 QR (오른쪽 위, 작게) */
export const RepoChip: React.FC<{ repo: string; dark: boolean; opacity: number; pos?: React.CSSProperties }> = ({ repo, dark, opacity, pos = { right: 48, top: 40 } }) => (
  <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
    <div style={{ position: "absolute", ...pos, display: "flex", alignItems: "center", gap: 16, background: "#fff", borderRadius: 20, padding: 10, paddingLeft: 22, boxShadow: dark ? "0 10px 30px rgba(0,0,0,0.35)" : "0 10px 30px rgba(0,20,50,0.16)", fontFamily: FONT }}>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: HY.sub }}>코드와 APK 보기</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: HY.blue }}>github.com/botdue-pleos/{repo}</div>
      </div>
      <Img src={staticFile(`qr_${repo}.svg`)} style={{ width: 78, height: 78, display: "block" }} />
    </div>
  </AbsoluteFill>
);

/** 장면 위쪽 머리글: 시간 라벨 · 기능 이름 (작게), 그 아래 한 문장 */
export const StoryHead: React.FC<{ when: string; what: string; line: string; ink: string; sub: string; accent: string }> = ({ when, what, line, ink, sub, accent }) => {
  const f = useCurrentFrame();
  const a = pop(f, 2, 14);
  const b = p(f, 10, 20);
  return (
    <div style={{ position: "absolute", left: 96, top: 50, fontFamily: FONT }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: a, translate: `${(1 - a) * -30}px 0` }}>
        <span style={{ fontSize: 26, fontWeight: 800, color: accent }}>{when}</span>
        <span style={{ fontSize: 22, fontWeight: 700, color: sub, border: `2px solid ${sub}88`, borderRadius: 999, padding: "4px 16px" }}>{what}</span>
      </div>
      <div style={{ marginTop: 10, fontSize: 52, fontWeight: 800, color: ink, letterSpacing: "-0.03em", opacity: b, translate: `0 ${(1 - b) * 20}px`, filter: `blur(${(1 - b) * 6}px)` }}>{line}</div>
    </div>
  );
};
