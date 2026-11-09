import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { TransitionPresentation, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { RepoBig } from "./common";
import { RepoChip } from "./display";
import { EngineFlow, Look } from "./story";
import { Cinema, Letterbox } from "./grammar";
import { FONT, HY, Kinetic, Line, PixelLogo, ease, p, pop } from "./kit";

/*
 * 집중잔량 시연 영상. 1920x1080 30fps, 무음·자막.
 * 공감 → 문제 숫자 → 로고 → 실제 녹화 7장면 → 판정 엔진 → 마무리.
 */

const LOOK: Look = { bg: HY.blue, ink: HY.lightSand, sub: HY.skyBlue, accent: HY.activeBlue };
const LOGO = [HY.activeBlue, HY.activeBlue, HY.deepBlue, HY.activeBlue, HY.sand, HY.deepBlue, HY.activeBlue, HY.activeBlue, HY.activeBlue];

/** 6시~24시 막대 높이 (앱의 하루 집중 곡선과 같은 모양) */
const CURVE = [1, 1, 1, 1, 3, 1, 2, 1, 2, 2, 4, 1, 6, 2, 4, 2, 2, 1];

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: HY.blue, fontFamily: FONT, padding: "0 140px", justifyContent: "center" }}>
      <Kinetic text={"퇴근길, 약효가 떨어질 즈음\n회전 안내를 또 놓쳤다"} start={6} size={88} color={HY.lightSand} />
      <div style={{ display: "flex", gap: 10, marginTop: 64, alignItems: "flex-end" }}>
        {CURVE.map((h, col) => (
          <div key={col} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {Array.from({ length: 6 }, (_, row) => {
              // 앱과 같은 충전 칸: 잘 따른 시간일수록 칸이 찬다. 저녁 3시간은 충전 빛(Active Blue)
              const charge = 7 - h;
              const filled = 6 - row <= charge;
              const evening = col >= 12 && col <= 14;
              const a = pop(f, 46 + col * 2 + (5 - row) * 1.5, 14);
              const color = evening ? HY.activeBlue : "#3A7FB8";
              return (
                <div
                  key={row}
                  style={{
                    width: 52, height: 52, borderRadius: 26, boxSizing: "border-box",
                    background: filled ? color : "transparent",
                    border: filled ? "none" : `3px solid ${evening ? HY.activeBlue : "#2A5A8F"}`,
                    scale: String(filled ? a : 1), opacity: filled ? a : p(f, 40, 12),
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
      <Line at={92} color={HY.skyBlue} size={32} style={{ marginTop: 28 }}>
        내가 언제 흐트러지는지, 나도 몰랐다.
      </Line>
    </AbsoluteFill>
  );
};

const Stat: React.FC<{ big: string; label: string; src: string; at: number }> = ({ big, label, src, at }) => {
  const f = useCurrentFrame();
  const a = p(f, at, 22);
  return (
    <div style={{ opacity: a, translate: `0 ${(1 - a) * 50}px`, maxWidth: 760 }}>
      <div style={{ fontSize: 170, fontWeight: 800, color: HY.lightSand, letterSpacing: "-0.04em", lineHeight: 1 }}>{big}</div>
      <div style={{ fontSize: 30, fontWeight: 600, color: HY.skyBlue, marginTop: 18, lineHeight: 1.45 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 500, color: HY.skyBlue, opacity: 0.85, marginTop: 12, lineHeight: 1.45 }}>{src}</div>
    </div>
  );
};

const Stats: React.FC = () => (
  <AbsoluteFill style={{ background: HY.blue, fontFamily: FONT, padding: "190px 140px" }}>
    <div style={{ display: "flex", gap: 140 }}>
      <Stat at={4} big="4.85배" label="20세 이상 ADHD 진료 인원, 2020년 2만 5,297명에서 2024년 12만 2,614명" src="출처: 국민건강보험공단 자료, 남인순 의원실 분석 (헤럴드경제 2025.10.07 보도)" />
      <Stat at={28} big="38~42%" label="ADHD 약을 먹은 달의 운전 사고 위험 감소 (남성 38%, 여성 42%)" src="출처: Chang et al., JAMA Psychiatry 2017 (미국 청구자료 230만 명)" />
    </div>
    <div style={{ position: "absolute", left: 140, bottom: 170 }}>
      <Kinetic text={"같은 사람도\n시간대마다 다르다"} start={70} size={70} color={HY.lightSand} />
    </div>
  </AbsoluteFill>
);

const Logo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: HY.blue, fontFamily: FONT, alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 44 }}>
        <PixelLogo size={170} colors={LOGO} at={4} />
        <div style={{ fontSize: 150, fontWeight: 800, color: HY.lightSand, letterSpacing: "-0.04em", opacity: p(f, 18, 18), translate: `${(1 - p(f, 18, 18)) * 40}px 0` }}>집중잔량</div>
      </div>
      <Line at={34} color={HY.lightSand} size={44} style={{ marginTop: 44, fontWeight: 700 }}>
        내 운전으로 찾은 집중 시간대, 그 시간엔 차가 덜어준다
      </Line>
      <Line at={46} color={HY.skyBlue} size={30} style={{ marginTop: 10 }}>
        성인 ADHD 운전자를 위한 Pleos Connect 앱
      </Line>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: HY.blue, fontFamily: FONT, padding: "0 140px", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28, opacity: p(f, 0, 18) }}>
        <PixelLogo size={84} colors={LOGO} />
        <span style={{ fontSize: 64, fontWeight: 800, color: HY.lightSand }}>집중잔량</span>
      </div>
      <Kinetic text={"고쳐야 할 결함이 아니라,\n차가 맞춰주는 특성으로."} start={14} size={96} color={HY.lightSand} style={{ marginTop: 50 }} />
      <Line at={60} color={HY.skyBlue} size={30} style={{ marginTop: 50 }}>
        성인 ADHD 운전자를 위한 Pleos Connect 앱
      </Line>
      <Line at={68} color={HY.skyBlue} size={26}>
        2026 현대자동차그룹 차량용 앱 개발 공모전 출품작
      </Line>
      <RepoBig repo="jipjungjanryang" color={HY.lightSand} sub={HY.skyBlue} />
    </AbsoluteFill>
  );
};

type Next = { pres: TransitionPresentation<Record<string, unknown>>; d: number };


const SCENES: { name: string; d: number; C: React.FC; next?: Next }[] = [
  { name: "공감", d: 120, C: Hook, next: { pres: fade() as never, d: 20 } },
  { name: "문제 숫자", d: 140, C: Stats, next: { pres: fade() as never, d: 20 } },
  { name: "로고", d: 80, C: Logo, next: { pres: fade() as never, d: 20 } },
  {
    name: "18:40 출발",
    d: 188,
    C: () => <Cinema when="오후 6:40 퇴근길" line="충전 칸이 적은 시간, 지금이 평소 흐트러지는 때" rec={{ src: "j3.mp4", from: 0.5, rate: 1.2 }} side="right" />,
    next: { pres: fade() as never, d: 20 },
  },
  {
    name: "지난 3주",
    d: 150,
    C: () => <Cinema when="지난 3주, 이 시간대" line="깜빡이 놓침에 더해, 안내받고 지나친 갈림길도 센다" rec={{ src: "j3.mp4", from: 2, rate: 1 }} side="left" />,
    next: { pres: fade() as never, d: 20 },
  },
  {
    name: "18:52 주행 중",
    d: 246,
    C: () => <Cinema when="오후 6:52 주행 중" line="회전 앞에서 한 번 더, 떠오른 생각은 말로" rec={{ src: "j1.mp4", from: 8, rate: 1.4 }} side="right" />,
    next: { pres: fade() as never, d: 20 },
  },
  {
    name: "19:10 P단",
    d: 196,
    C: () => <Cinema when="오후 7:10 도착" line="주차하면 보관한 생각을 돌려준다" rec={{ src: "j2.mp4", from: 0.5, rate: 1 }} side="left" />,
    next: { pres: fade() as never, d: 20 },
  },
  {
    name: "19:11 내리기 전",
    d: 225,
    C: () => <Cinema when="오후 7:11 내리기 전" line="몇 층 어디에 세웠는지 말로 남기고, 원하면 휴대폰으로" rec={{ src: "j5.mp4", from: 3, rate: 1.6 }} side="right" />,
    next: { pres: fade() as never, d: 20 },
  },
  {
    name: "주말",
    d: 150,
    C: () => <Cinema when="주말" line="평일 퇴근길에 가장 자주 흐트러졌다" rec={{ src: "j4.mp4", from: 0.5, rate: 1.2, landscape: true }} side="left" />,
    next: { pres: fade() as never, d: 20 },
  },
  {
    name: "주말 도움 모드 효과",
    d: 150,
    C: () => <Cinema when="주말" line="도움 모드를 켠 날, 퇴근길 놓침은 51%에서 16%로" rec={{ src: "j4.mp4", from: 5, rate: 1, landscape: true }} side="right" />,
    next: { pres: fade() as never, d: 20 },
  },
  {
    name: "판정 엔진",
    d: 160,
    C: () => (
      <EngineFlow
        look={LOOK}
        tests={19}
        signals={["방향지시등 TurnSignal", "회전 안내 NaviHelper TBT", "경로 재탐색", "기어 P단 감지", "창문·전조등"]}
        rules={["깜빡이 누락 판정", "지나친 갈림길 판정", "시간대별 집중 곡선", "도움 모드 제안·효과", "주간 집중 지도"]}
        outputs={["출발 시 먼저 알림", "회전 전 한 번 더 안내", "P단에서 메모·세운 자리", "내리기 전 확인", "켠 날·끈 날 비교"]}
      />
    ),
    next: { pres: fade() as never, d: 20 },
  },
  { name: "마무리", d: 160, C: Outro },
];

export const JIPJUNG_DURATION = SCENES.reduce((s, x) => s + x.d - (x.next?.d ?? 0), 0);
const CHIP_FROM = SCENES[0].d + SCENES[1].d + SCENES[2].d - 46;
const CHIP_TO = JIPJUNG_DURATION - SCENES[SCENES.length - 1].d;

export const JipjungVideo: React.FC = () => {
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
      <Letterbox />
      <RepoChip repo="jipjungjanryang" dark pos={{ right: 48, top: 7 }} opacity={p(f, CHIP_FROM, 16) * (1 - p(f, CHIP_TO - 10, 10))} />
    </AbsoluteFill>
  );
};
