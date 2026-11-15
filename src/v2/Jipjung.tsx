import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { TransitionPresentation, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { BrandBar, Engine, Feature, Look, RepoBig, RepoCard } from "./common";
import { FONT, HY, Kinetic, Line, PixelLogo, circle, ease, p, pop } from "../kit";

/*
 * 집중잔량 시연 영상. 1920x1080 30fps, 무음·자막.
 * 공감 → 문제 숫자 → 로고 → 실제 녹화 4장면 → 판정 엔진 → 마무리.
 */

const DARK: Look = { bg: HY.blue, ink: HY.lightSand, sub: HY.skyBlue, accent: HY.activeBlue, tagBg: HY.activeBlue };
const LIGHT: Look = { bg: HY.lightSand, ink: HY.blue, sub: HY.sub, accent: "#007FA8", tagBg: "#007FA8" };
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
              const lit = 6 - row <= h;
              const evening = col >= 12 && col <= 14;
              const a = pop(f, 46 + col * 2 + (5 - row) * 1.5, 14);
              return <div key={row} style={{ width: 52, height: 52, borderRadius: 10, background: lit ? (evening ? HY.sand : "#3A7FB8") : HY.deepBlue, scale: String(lit ? a : 1), opacity: lit ? a : 1 }} />;
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
      <div style={{ fontSize: 180, fontWeight: 800, color: HY.blue, letterSpacing: "-0.04em", lineHeight: 1 }}>{big}</div>
      <div style={{ fontSize: 30, fontWeight: 600, color: HY.sub, marginTop: 18, lineHeight: 1.45 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 500, color: HY.sub, opacity: 0.85, marginTop: 12, lineHeight: 1.45 }}>{src}</div>
    </div>
  );
};

const Stats: React.FC = () => (
  <AbsoluteFill style={{ background: HY.lightSand, fontFamily: FONT, padding: "150px 140px" }}>
    <div style={{ display: "flex", gap: 140 }}>
      <Stat at={4} big="4.85배" label="20세 이상 ADHD 진료 인원, 2020년 2만 5,297명에서 2024년 12만 2,614명" src="출처: 국민건강보험공단 자료, 남인순 의원실 분석 (헤럴드경제 2025.10.07 보도)" />
      <Stat at={28} big="38~42%" label="ADHD 약을 먹은 달의 운전 사고 위험 감소 (남성 38%, 여성 42%)" src="출처: Chang et al., JAMA Psychiatry 2017 (미국 청구자료 230만 명)" />
    </div>
    <div style={{ position: "absolute", left: 140, bottom: 140 }}>
      <Kinetic text={"같은 사람도\n시간대마다 다르다"} start={70} size={76} color={HY.blue} />
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
  { name: "공감", d: 135, C: Hook, next: { pres: circle(140 + 13 * 62 + 26, 560) as never, d: 18 } },
  { name: "문제 숫자", d: 170, C: Stats, next: { pres: slide({ direction: "from-bottom" }) as never, d: 16 } },
  { name: "로고", d: 100, C: Logo, next: { pres: circle(960, 470) as never, d: 18 } },
  {
    name: "01 나의 집중 곡선",
    d: 225,
    C: () => <Feature look={DARK} n="01" tag="나의 집중 곡선" title={"언제 흐트러지는지\n내 운전이 알려준다"} lines={["회전 안내 대비 깜빡이 누락을 시간대별로 모은다", "평소 흐트러지는 시간에 출발하면 먼저 알린다", "약효를 추정하지 않는다. 관찰된 패턴만 본다"]} rec={{ src: "j1.mp4", from: 0.5 }} />,
    next: { pres: circle(1520, 830) as never, d: 18 },
  },
  {
    name: "02 도움 모드와 생각 주차장",
    d: 345,
    C: () => <Feature look={LIGHT} n="02" tag="도움 모드" title={"흐트러지는 시간엔\n차가 덜어준다"} lines={["회전 100m 앞에서 한 번 더 안내한다", "\"메모\"라고 말하면 떠오른 생각을 보관한다", "주행 중 화면에는 아무것도 띄우지 않는다"]} rec={{ src: "j1.mp4", from: 8 }} />,
    next: { pres: wipe({ direction: "from-right" }) as never, d: 18 },
  },
  {
    name: "03 P단에서 돌려주기",
    d: 255,
    C: () => <Feature look={DARK} n="03" tag="P단에 넣으면" title={"주차하면\n생각을 돌려준다"} lines={["오는 길에 보관한 메모를 하나씩 확인한다", "내리기 전에 창문과 전조등까지 챙긴다"]} rec={{ src: "j1.mp4", from: 19.5 }} />,
    next: { pres: circle(1610, 760) as never, d: 18 },
  },
  {
    name: "04 이번 주 집중 지도",
    d: 190,
    C: () => <Feature look={LIGHT} n="04" tag="이번 주 집중 지도" title={"이번 주를\n한눈에"} lines={["요일과 시간대별 집중 상태", "약 먹은 시각 기준으로도 볼 수 있다", "기록은 이 차 안에만 저장한다"]} rec={{ src: "j2.mp4", from: 0.5, landscape: true }} />,
    next: { pres: slide({ direction: "from-bottom" }) as never, d: 16 },
  },
  {
    name: "판정 엔진",
    d: 190,
    C: () => (
      <Engine
        look={DARK}
        tests={6}
        rules={[
          { t: "깜빡이 누락", d: "회전 안내 후 90초 안 같은 방향 회전, 직전 10초 깜빡이 확인" },
          { t: "하루 집중 곡선", d: "6~24시 1시간 단위 놓침 비율. 본인 기록 안에서만 비교" },
          { t: "도움 모드 제안", d: "지금부터 3시간의 놓침 비율이 평소의 1.5배 이상일 때" },
          { t: "주간 지도", d: "요일 x 시간대 6칸, 놓침 15%와 30%를 기준으로 나눔" },
        ]}
        sdk={["TurnSignal", "NaviHelper", "Door · Window · Light", "CarPropertyManager", "STT · TTS"]}
      />
    ),
    next: { pres: slide({ direction: "from-bottom" }) as never, d: 16 },
  },
  { name: "마무리", d: 160, C: Outro },
];

export const JIPJUNG_DURATION = SCENES.reduce((s, x) => s + x.d - (x.next?.d ?? 0), 0);
const BAR_FROM = SCENES[0].d + SCENES[1].d + SCENES[2].d - 50;
const BAR_TO = JIPJUNG_DURATION - SCENES[SCENES.length - 1].d - SCENES[SCENES.length - 2].d;

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
      <BrandBar opacity={p(f, BAR_FROM, 16) * (1 - p(f, BAR_TO, 12))} logo={<PixelLogo size={36} colors={LOGO} />} name="집중잔량" desc="성인 ADHD 운전자를 위한 Pleos Connect 앱" look={DARK} />
      <RepoCard opacity={p(f, BAR_FROM, 16) * (1 - p(f, BAR_TO, 12))} repo="jipjungjanryang" look={DARK} />
    </AbsoluteFill>
  );
};
