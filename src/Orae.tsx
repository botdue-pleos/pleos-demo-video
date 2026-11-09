import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { TransitionPresentation, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { RepoBig } from "./common";
import { DAY, RepoChip } from "./display";
import { EngineFlow, Look, Story } from "./story";
import { CountUp, FONT, HY, Kinetic, Line, PixelLogo, TurnCell, circle, ease, p, pop } from "./kit";

/*
 * 오래운전 시연 영상. 1920x1080 30fps, 무음·자막.
 * 공감 → 문제 숫자 → 로고 → 실제 녹화 8장면 → 판정 엔진 → 마무리.
 */

const LOOK: Look = { bg: HY.daySky, ink: HY.blue, sub: HY.sub, accent: HY.goldText };
const DARK_LOOK: Look = { bg: HY.blue, ink: HY.lightSand, sub: HY.skyBlue, accent: "#D9A07F" };
const LOGO = [HY.blue, HY.blue, HY.sand, HY.blue, HY.blue, HY.gold, HY.blue, HY.blue, HY.sand];

/** 회전 12번 중 놓친 회전 */
const HOOK_TURNS = [true, true, true, false, true, true, true, true, false, true, true, false];

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: HY.daySky, fontFamily: FONT, padding: "0 140px", justifyContent: "center" }}>
      <Kinetic text={"명절에 탄 부모님 차,\n깜빡이 없이 차선을 바꾸셨다"} start={6} size={92} color={HY.blue} />
      <div style={{ display: "flex", gap: 18, marginTop: 70 }}>
        {HOOK_TURNS.map((on, i) => (
          <TurnCell key={i} on={on} size={72} ink={HY.blue} ring={HY.gold} a={pop(f, 50 + i * 3, 16)} />
        ))}
      </div>
      <Line at={88} color={HY.sub} size={32} style={{ marginTop: 28 }}>
        괜찮으신 걸까? 판단할 근거가 없었다.
      </Line>
    </AbsoluteFill>
  );
};

const Stat: React.FC<{ big: React.ReactNode; label: string; src: string; at: number }> = ({ big, label, src, at }) => {
  const f = useCurrentFrame();
  const a = p(f, at, 22);
  return (
    <div style={{ opacity: a, translate: `0 ${(1 - a) * 50}px` }}>
      <div style={{ fontSize: 190, fontWeight: 800, color: HY.blue, letterSpacing: "-0.04em", lineHeight: 1 }}>{big}</div>
      <div style={{ fontSize: 32, fontWeight: 600, color: HY.sub, marginTop: 18 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 500, color: HY.sub, opacity: 0.85, marginTop: 12 }}>{src}</div>
    </div>
  );
};

const Stats: React.FC = () => (
  <AbsoluteFill style={{ background: "#FFFFFF", fontFamily: FONT, padding: "150px 140px" }}>
    <div style={{ display: "flex", gap: 160 }}>
      <Stat at={4} big={<><CountUp to={44} start={8} />%</>} label="65세 이상 운전자 교통사고, 2021년 대비 2025년 증가" src="출처: 경찰청 집계 (매일신문 2026.10.10 보도)" />
      <Stat at={28} big="2%대" label="고령 운전자 면허 반납률, 2021년 2.09%에서 2025년 2.51%" src="출처: 경찰청 자료 (매일신문 2026.10.10 보도)" />
    </div>
    <div style={{ position: "absolute", left: 140, bottom: 150 }}>
      <Kinetic text={"반납 말고,\n계속 운전할 조건을 찾자"} start={70} size={76} color={HY.blue} />
    </div>
  </AbsoluteFill>
);

const Logo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: HY.daySky, fontFamily: FONT, alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 44 }}>
        <PixelLogo size={170} colors={LOGO} at={4} />
        <div style={{ fontSize: 150, fontWeight: 800, color: HY.blue, letterSpacing: "-0.04em", opacity: p(f, 18, 18), translate: `${(1 - p(f, 18, 18)) * 40}px 0` }}>오래운전</div>
      </div>
      <Line at={34} color={HY.blue} size={44} style={{ marginTop: 44, fontWeight: 700 }}>
        부모님 차가 먼저 알아채는 운전 컨디션 변화
      </Line>
      <Line at={46} color={HY.sub} size={30} style={{ marginTop: 10 }}>
        고령 운전자를 위한 Pleos Connect 앱
      </Line>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: HY.daySky, fontFamily: FONT, padding: "0 140px", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28, opacity: p(f, 0, 18) }}>
        <PixelLogo size={84} colors={LOGO} />
        <span style={{ fontSize: 64, fontWeight: 800, color: HY.blue }}>오래운전</span>
      </div>
      <Kinetic text={"이동권은 지키고,\n사고 위험은 낮추고."} start={14} size={104} color={HY.blue} style={{ marginTop: 50 }} />
      <Line at={60} color={HY.sub} size={30} style={{ marginTop: 50 }}>
        고령 운전자를 위한 Pleos Connect 앱
      </Line>
      <Line at={68} color={HY.sub} size={26}>
        2026 현대자동차그룹 차량용 앱 개발 공모전 출품작
      </Line>
      <RepoBig repo="oraeunjeon" color={HY.blue} sub={HY.sub} />
    </AbsoluteFill>
  );
};

type Next = { pres: TransitionPresentation<Record<string, unknown>>; d: number };

const SC = { look: LOOK, theme: DAY, logo: LOGO };

const SCENES: { name: string; d: number; C: React.FC; next?: Next }[] = [
  { name: "공감", d: 115, C: Hook, next: { pres: circle(140 + 11 * 90 + 36, 640) as never, d: 16 } },
  { name: "문제 숫자", d: 140, C: Stats, next: { pres: slide({ direction: "from-bottom" }) as never, d: 14 } },
  { name: "로고", d: 80, C: Logo, next: { pres: circle(960, 470) as never, d: 16 } },
  {
    name: "1주차 아침",
    d: 165,
    C: () => <Story {...SC} when="1주차 아침" what="출발 인사" line="시동을 걸면 먼저 묻는다, 오늘 어디 가세요?" clock="오전 8:12" car={{ speed: 0, gear: "P" }} rec={{ src: "o1.mp4", from: 0.5, rate: 1 }} focus={[460, 330]} zoom={[20, 44, 88, 108]} k={1.7} />,
    next: { pres: slide({ direction: "from-right" }) as never, d: 14 },
  },
  {
    name: "5주차",
    d: 236,
    C: () => <Story {...SC} when="5주차" what="나만의 기준선" line="평소보다 자주 놓치면, 본인에게 먼저 알린다" clock="오전 8:31" car={{ speed: 0, gear: "P" }} rec={{ src: "o1b.mp4", from: 0.5, rate: 1 }} focus={[450, 470]} zoom={[128, 150, 205, 228]} k={1.75} />,
    next: { pres: slide({ direction: "from-bottom" }) as never, d: 14 },
  },
  {
    name: "5주차 그다음",
    d: 190,
    C: () => <Story {...SC} when="5주차, 그다음" what="다음 할 일" line="가까운 곳에서 무료로 확인해 볼 수 있게, 길을 열어 둔다" clock="오전 8:32" car={{ speed: 0, gear: "P" }} rec={{ src: "o5.mp4", from: 0.5, rate: 1 }} focus={[460, 1040]} zoom={[44, 66, 118, 134]} k={1.7} />,
    next: { pres: circle(960, 700) as never, d: 16 },
  },
  {
    name: "6주차 주행 중",
    d: 150,
    C: () => <Story {...SC} when="6주차 주행 중" what="깜빡이 알림" line="회전 200m 앞에서 한 번 더" clock="오전 9:05" car={{ speed: 38, gear: "D" }} rec={{ src: "o2.mp4", from: 6.5, rate: 1.2 }} focus={[460, 960]} zoom={[68, 90, 132, 150]} k={1.8} />,
    next: { pres: wipe({ direction: "from-right" }) as never, d: 16 },
  },
  {
    name: "주말 가족과",
    d: 180,
    C: () => <Story {...SC} when="주말, 가족과" what="같이 보기" line="반납 말고, 계속 운전할 조건을 함께 정한다" clock="오후 2:20" car={{ speed: 0, gear: "P" }} rec={{ src: "o3.mp4", from: 1.5, rate: 1.3, landscape: true }} focus={[1400, 860]} zoom={[40, 64, 150, 175]} k={1.8} />,
    next: { pres: circle(960, 650) as never, d: 16 },
  },
  {
    name: "저녁 7시",
    d: 300,
    C: () => <Story {...SC} when="저녁 7시" what="조건이 작동" line="해가 지면 먼 길은 내일 낮에. 고르는 건 본인" clock="오후 7:10" car={{ speed: 0, gear: "P" }} rec={{ src: "o4.mp4", from: 0.5, rate: 1 }} focus={[460, 470]} zoom={[40, 62, 140, 160]} k={1.5} />,
    next: { pres: slide({ direction: "from-right" }) as never, d: 14 },
  },
  {
    name: "늘 가던 길",
    d: 235,
    C: () => <Story {...SC} when="늘 가던 읍내 길" what="길 헤맴 감지" line="경로를 몇 번 다시 찾으면, 집으로 안내한다" clock="오후 7:40" car={{ speed: 24, gear: "D" }} rec={{ src: "o7.mp4", from: 2, rate: 1 }} focus={[460, 640]} zoom={[64, 86, 160, 182]} k={1.4} />,
    next: { pres: wipe({ direction: "from-right" }) as never, d: 16 },
  },
  {
    name: "다음 주말",
    d: 160,
    C: () => <Story {...SC} when="다음 주말, 다시 가족과" what="조건 지킨 기록" line="함께 정한 조건을 얼마나 지켰는지, 같이 본다" clock="오후 2:10" car={{ speed: 0, gear: "P" }} rec={{ src: "o6.mp4", from: 0.5, rate: 1, landscape: true }} focus={[480, 1120]} zoom={[20, 44, 122, 144]} k={1.8} />,
    next: { pres: circle(960, 760) as never, d: 16 },
  },
  {
    name: "판정 엔진",
    d: 160,
    C: () => (
      <EngineFlow
        look={DARK_LOOK}
        tests={35}
        signals={["방향지시등 TurnSignal", "회전 안내 NaviHelper TBT", "경로 재탐색", "기어·문·경고등", "치매안심센터 공공데이터"]}
        rules={["깜빡이 누락 판정", "나만의 기준선 (처음 4주)", "조건 적용·지킨 기록", "길 헤맴 감지", "다음 할 일 (만 60세 이상)"]}
        outputs={["회전 전 깜빡이 알림", "본인에게 먼저 변화 안내", "낮에 가기·휴게소 제안", "집으로 안내", "가까운 센터 길 안내"]}
      />
    ),
    next: { pres: slide({ direction: "from-bottom" }) as never, d: 14 },
  },
  { name: "마무리", d: 160, C: Outro },
];

export const ORAE_DURATION = SCENES.reduce((s, x) => s + x.d - (x.next?.d ?? 0), 0);
const CHIP_FROM = SCENES[0].d + SCENES[1].d + SCENES[2].d - 46;
const CHIP_TO = ORAE_DURATION - SCENES[SCENES.length - 1].d;

export const OraeVideo: React.FC = () => {
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
      <RepoChip repo="oraeunjeon" dark={false} opacity={p(f, CHIP_FROM, 16) * (1 - p(f, CHIP_TO - 10, 10))} />
    </AbsoluteFill>
  );
};
