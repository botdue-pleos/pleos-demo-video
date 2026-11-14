import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { TransitionPresentation, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { RepoBig } from "./common";
import { DAY, RepoChip } from "./display";
import { EngineFlow, Look, Story } from "./story";
import { FONT, Kinetic, Line, circle, ease, p } from "./kit";

/*
 * 다음은요 시연 영상. 1920x1080 30fps, 무음·자막.
 * 공감 → 숫자 → 로고 → 실제 녹화 6장면 → 판정 엔진 → 마무리.
 * 디자인 출발점은 특수교육의 그림 일정표 띠: 카드를 띠에 붙이고, 지난 칸은 접고, 바뀐 칸은 보라색 점선.
 */

const FELT = "#DDE6DC";
const STRIP = "#C7D3C6";
const INK = "#1C3A37";
const SUB = "#4E6763";
const NOW = "#F3C969";
const CHANGED = "#6E5AA8";
const LOOK: Look = { bg: FELT, ink: INK, sub: SUB, accent: CHANGED };
// 디스플레이 틀 왼쪽 위 작은 로고 (3x3 칸): 가운데 줄이 띠, 가운데 칸이 지금 칸
const LOGO = [FELT, FELT, FELT, "#FFFFFF", NOW, "#FFFFFF", FELT, FELT, FELT];

/** 그림 카드 하나 (굵은 선 그림) */
const PIC: Record<string, string[]> = {
  home: ["M12 46 L48 16 L84 46", "M22 38 V82 H74 V38", "M40 82 V60 H56 V82"],
  road: ["M26 86 L40 12", "M70 86 L56 12", "M48 20 V28", "M48 42 V52", "M48 66 V78"],
  tunnel: ["M8 84 V50 A40 40 0 0 1 88 50 V84", "M4 84 H92"],
  detour: ["M30 88 V60 C30 42 66 44 66 26 V12", "M54 22 L66 10 L78 22"],
  hospital: ["M18 84 V20 H78 V84", "M48 34 V62", "M34 48 H62", "M8 84 H88"],
};

const Pic: React.FC<{ name: string; size: number }> = ({ name, size }) => (
  <svg width={size} height={size} viewBox="0 0 96 96" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
    {name === "tunnel" && <path d="M28 84 V58 A20 20 0 0 1 68 58 V84 Z" fill={INK} />}
    {PIC[name].map((d) => <path key={d} d={d} />)}
  </svg>
);

/** 공감: 띠 위 카드가 하나씩 채워지다가, 세 번째 칸이 예고 없이 바뀐다 */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const swap = p(f, 92, 14);
  const cards = ["home", "road", swap > 0.5 ? "detour" : "tunnel", "hospital"];
  return (
    <AbsoluteFill style={{ background: FELT, fontFamily: FONT, padding: "0 140px", justifyContent: "center" }}>
      <Kinetic text={"길이 바뀌는 순간,\n뒷자리는 아무것도 모른다"} start={0} size={88} color={INK} />
      <div style={{ display: "flex", gap: 22, marginTop: 70, background: STRIP, borderRadius: 40, padding: 22, width: "fit-content" }}>
        {cards.map((c, i) => {
          // 첫 프레임(썸네일)부터 카드 두 장은 붙어 있게
          const a = i < 2 ? 1 : p(f, 30 + i * 8, 12);
          const now = i === 2;
          const changed = now && swap > 0.5;
          return (
            <div
              key={i}
              style={{
                width: 220,
                height: 180,
                borderRadius: 28,
                background: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: a,
                translate: `0 ${(1 - a) * 30}px`,
                boxShadow: changed ? "none" : now ? `0 0 0 8px ${NOW}` : "none",
                outline: changed ? `6px dashed ${CHANGED}` : "none",
                outlineOffset: -6,
                scale: String(now ? 1 + Math.sin(Math.min(1, swap) * Math.PI) * 0.08 : 1),
              }}
            >
              <Pic name={c} size={110} />
            </div>
          );
        })}
      </div>
      <Line at={112} color={SUB} size={32} style={{ marginTop: 36 }}>
        예상하지 못한 변화는 자폐 특성이 있는 동승자에게 큰 불안이 된다.
      </Line>
    </AbsoluteFill>
  );
};

const Stat: React.FC<{ big: string; label: string; src: string; at: number }> = ({ big, label, src, at }) => {
  const f = useCurrentFrame();
  const a = p(f, at, 22);
  return (
    <div style={{ opacity: a, translate: `0 ${(1 - a) * 50}px`, maxWidth: 760 }}>
      <div style={{ fontSize: 180, fontWeight: 800, color: INK, letterSpacing: "-0.04em", lineHeight: 1 }}>{big}</div>
      <div style={{ fontSize: 30, fontWeight: 600, color: SUB, marginTop: 18, lineHeight: 1.45 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 500, color: SUB, opacity: 0.9, marginTop: 12, lineHeight: 1.45 }}>{src}</div>
    </div>
  );
};

const Stats: React.FC = () => (
  <AbsoluteFill style={{ background: "#EEF3ED", fontFamily: FONT, padding: "150px 140px" }}>
    <div style={{ display: "flex", gap: 140 }}>
      <Stat at={4} big="28.8만" label="등록 발달장애인 (2025년). 2030년 33.5만 명 전망" src="출처: 정부 발표(2026.09), 보건복지부 2025 등록장애인 현황" />
      <Stat at={28} big="5·2·1분" label="자폐 특성이 있는 사람의 전환을 돕는 단계 예고. 그림 일정표와 함께 널리 쓰인다" src="출처: Indiana University 전환 지원 자료" />
    </div>
    <div style={{ position: "absolute", left: 140, bottom: 140 }}>
      <Kinetic text={"그런데 길이 바뀌는 건\n차의 내비가 가장 먼저 안다"} start={70} size={76} color={INK} />
    </div>
  </AbsoluteFill>
);

/** 로고: 띠 위 세 칸, 가운데가 지금 칸 */
const StripMark: React.FC<{ cell: number; at?: number }> = ({ cell, at }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: cell * 0.18, background: STRIP, borderRadius: cell * 0.36, padding: cell * 0.18 }}>
      {[0, 1, 2].map((i) => {
        const a = at === undefined ? 1 : p(f, at + i * 5, 12);
        return <div key={i} style={{ width: cell, height: cell * 1.15, borderRadius: cell * 0.2, background: "#FFFFFF", opacity: a, boxShadow: i === 1 ? `0 0 0 ${cell * 0.08}px ${NOW}` : "none" }} />;
      })}
    </div>
  );
};

const Logo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: FELT, fontFamily: FONT, alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
        <StripMark cell={64} at={4} />
        <div style={{ fontSize: 150, fontWeight: 800, color: INK, letterSpacing: "-0.04em", opacity: p(f, 18, 18), translate: `${(1 - p(f, 18, 18)) * 40}px 0` }}>다음은요</div>
      </div>
      <Line at={34} color={INK} size={44} style={{ marginTop: 44, fontWeight: 700 }}>
        다음에 무슨 일이 생기는지, 차가 먼저 쉬운 말로 알려 준다
      </Line>
      <Line at={46} color={SUB} size={30} style={{ marginTop: 10 }}>
        발달장애 동승자와 운전하는 보호자를 위한 Pleos Connect 앱
      </Line>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: FELT, fontFamily: FONT, padding: "0 140px", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28, opacity: p(f, 0, 18) }}>
        <StripMark cell={34} />
        <span style={{ fontSize: 64, fontWeight: 800, color: INK }}>다음은요</span>
      </div>
      <Kinetic text={"길이 바뀌어도,\n그래도 병원에 가."} start={14} size={96} color={INK} style={{ marginTop: 50 }} />
      <Line at={60} color={SUB} size={30} style={{ marginTop: 50 }}>
        보호자는 운전에만, 동승자는 미리 알고
      </Line>
      <Line at={68} color={SUB} size={26}>
        2026 현대자동차그룹 차량용 앱 개발 공모전 출품작
      </Line>
      <RepoBig repo="daeumeunyo" color={INK} sub={SUB} />
    </AbsoluteFill>
  );
};

type Next = { pres: TransitionPresentation<Record<string, unknown>>; d: number };

const SC = { look: LOOK, theme: DAY, logo: LOGO };
const DRIVE = { speed: 60, gear: "D" as const };

const SCENES: { name: string; d: number; C: React.FC; next?: Next }[] = [
  { name: "공감", d: 170, C: Hook, next: { pres: circle(140 + 2 * 242 + 132, 600) as never, d: 16 } },
  { name: "문제 숫자", d: 140, C: Stats, next: { pres: slide({ direction: "from-bottom" }) as never, d: 14 } },
  { name: "로고", d: 80, C: Logo, next: { pres: circle(960, 470) as never, d: 16 } },
  {
    name: "오늘의 길",
    d: 180,
    C: () => <Story {...SC} when="오후 2:00 출발 전" what="오늘의 길 카드" line="내비 경로를 그림 카드 5칸으로. 남은 시간은 노래 5곡" clock="오후 2:00" car={{ speed: 0, gear: "P" }} rec={{ src: "d1.mp4", from: 3, rate: 1 }} focus={[460, 520]} zoom={[20, 44, 110, 132]} k={1.45} />,
    next: { pres: wipe({ direction: "from-bottom" }) as never, d: 14 },
  },
  {
    name: "터널 전 노래",
    d: 270,
    C: () => <Story {...SC} when="오후 2:06 터널 900m 앞" what="터널 전 좋아하는 노래" line="1분 전에 말하고, 골라 둔 노래를 틀고, 바깥 공기를 막는다" clock="오후 2:06" car={DRIVE} rec={{ src: "d2.mp4", from: 3, rate: 1 }} focus={[460, 1000]} zoom={[60, 84, 190, 214]} k={1.55} />,
    next: { pres: slide({ direction: "from-right" }) as never, d: 14 },
  },
  {
    name: "길 바뀜",
    d: 195,
    C: () => <Story {...SC} when="오후 2:09 빠른 길 앞 사고" what="변화 미리 알리기" line="목적지가 그대로라는 말부터. 바뀐 칸만 보라색으로" clock="오후 2:09" car={DRIVE} rec={{ src: "d3.mp4", from: 3, rate: 1 }} focus={[460, 560]} zoom={[40, 64, 150, 172]} k={1.5} />,
    next: { pres: slide({ direction: "from-right" }) as never, d: 14 },
  },
  {
    name: "그 자리에서 표시",
    d: 180,
    C: () => <Story {...SC} when="오후 2:10 길이 바뀐 직후" what="운전 중 그 자리에서 표시" line="'표시해' 한마디면 효과음만. 동승자는 아무 말도 듣지 않는다" clock="오후 2:10" car={DRIVE} rec={{ src: "d7.mp4", from: 3, rate: 1 }} focus={[200, 80]} zoom={[30, 54, 140, 162]} k={2.0} />,
    next: { pres: wipe({ direction: "from-right" }) as never, d: 16 },
  },
  {
    name: "보호자 안심 신호",
    d: 210,
    C: () => <Story {...SC} when="오후 2:12 뒷자리" what="보호자 안심 신호" line="벨트가 풀리면 쉬어 갈 곳부터. 뒷자리가 들어도 괜찮은 말로" clock="오후 2:12" car={DRIVE} rec={{ src: "d4.mp4", from: 3, rate: 1 }} focus={[460, 420]} zoom={[10, 34, 80, 100]} k={1.45} />,
    next: { pres: slide({ direction: "from-bottom" }) as never, d: 14 },
  },
  {
    name: "도착",
    d: 180,
    C: () => <Story {...SC} when="오후 2:20 병원 주차장" what="표시한 순간 확인" line="새로 묻지 않는다. 오늘 표시한 순간이 맞는지만" clock="오후 2:20" car={{ speed: 0, gear: "P" }} rec={{ src: "d5.mp4", from: 3, rate: 1 }} focus={[460, 900]} zoom={[10, 34, 70, 90]} k={1.5} />,
    next: { pres: circle(960, 700) as never, d: 16 },
  },
  {
    name: "이동 노트",
    d: 210,
    C: () => <Story {...SC} when="한 달 뒤, 주차 중" what="이동 노트" line="그 터널은 2분 전부터, 길 바뀜 예고는 1분 전으로" clock="오후 6:30" car={{ speed: 0, gear: "P" }} rec={{ src: "d6.mp4", from: 3, rate: 1, landscape: true }} focus={[1420, 520]} zoom={[40, 64, 170, 192]} k={1.4} />,
    next: { pres: slide({ direction: "from-bottom" }) as never, d: 14 },
  },
  {
    name: "판정 엔진",
    d: 170,
    C: () => (
      <EngineFlow
        look={LOOK}
        tests={28}
        signals={["내비 경로·TBT (터널)", "재탐색·남은 시간", "뒷자리 벨트·문·창문", "차속·기어", "보호자 말 STT"]}
        rules={["오늘의 길 카드", "변화 미리 알리기", "터널 단계 예고", "보호자 안심 신호", "표시한 순간 기록"]}
        outputs={["그림 카드 3~5칸", "목적지부터 쉬운 말", "노래·내기순환", "뒷자리도 괜찮은 한 줄", "다음 예고 앞당김"]}
      />
    ),
    next: { pres: slide({ direction: "from-bottom" }) as never, d: 14 },
  },
  { name: "마무리", d: 160, C: Outro },
];

export const DAEUM_DURATION = SCENES.reduce((s, x) => s + x.d - (x.next?.d ?? 0), 0);
const CHIP_FROM = SCENES[0].d + SCENES[1].d + SCENES[2].d - 46;
const CHIP_TO = DAEUM_DURATION - SCENES[SCENES.length - 1].d - SCENES[SCENES.length - 2].d;

export const DaeumVideo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <TransitionSeries>
        {SCENES.map(({ name, d, C, next }) => (
          <React.Fragment key={name}>
            <TransitionSeries.Sequence name={name} durationInFrames={d}>
              <C />
            </TransitionSeries.Sequence>
            {next && <TransitionSeries.Transition presentation={next.pres} timing={ease(next.d)} />}
          </React.Fragment>
        ))}
      </TransitionSeries>
      <RepoChip repo="daeumeunyo" dark={false} opacity={p(f, CHIP_FROM, 16) * (1 - p(f, CHIP_TO - 10, 10))} />
    </AbsoluteFill>
  );
};
