import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { TransitionPresentation, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { BrandBar, Engine, Feature, Look, RepoBig, RepoCard } from "./common";
import { CountUp, FONT, HY, Kinetic, Line, PixelLogo, TurnCell, circle, ease, p, pop } from "../kit";

/*
 * 오래운전 시연 영상. 1920x1080 30fps, 무음·자막.
 * 공감 → 문제 숫자 → 로고 → 실제 녹화 6장면 → 판정 엔진 → 마무리.
 */

const LIGHT: Look = { bg: HY.lightSand, ink: HY.blue, sub: HY.sub, accent: HY.gold, tagBg: HY.gold };
const DARK: Look = { bg: HY.blue, ink: HY.lightSand, sub: HY.skyBlue, accent: HY.gold, tagBg: HY.gold };
const LOGO = [HY.blue, HY.blue, HY.sand, HY.blue, HY.blue, HY.gold, HY.blue, HY.blue, HY.sand];

/** 회전 12번 중 놓친 회전 */
const HOOK_TURNS = [true, true, true, false, true, true, true, true, false, true, true, false];

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: HY.lightSand, fontFamily: FONT, padding: "0 140px", justifyContent: "center" }}>
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
      <div style={{ fontSize: 190, fontWeight: 800, color: HY.lightSand, letterSpacing: "-0.04em", lineHeight: 1 }}>{big}</div>
      <div style={{ fontSize: 32, fontWeight: 600, color: HY.skyBlue, marginTop: 18 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 500, color: HY.skyBlue, opacity: 0.8, marginTop: 12 }}>{src}</div>
    </div>
  );
};

const Stats: React.FC = () => (
  <AbsoluteFill style={{ background: HY.blue, fontFamily: FONT, padding: "150px 140px" }}>
    <div style={{ display: "flex", gap: 160 }}>
      <Stat at={4} big={<><CountUp to={44} start={8} />%</>} label="65세 이상 운전자 교통사고, 2021년 대비 2025년 증가" src="출처: 경찰청 집계 (매일신문 2026.10.10 보도)" />
      <Stat at={28} big="2%대" label="고령 운전자 면허 반납률, 2021년 2.09%에서 2025년 2.51%" src="출처: 경찰청 자료 (매일신문 2026.10.10 보도)" />
    </div>
    <div style={{ position: "absolute", left: 140, bottom: 150 }}>
      <Kinetic text={"반납 말고,\n계속 운전할 조건을 찾자"} start={70} size={76} color={HY.lightSand} />
    </div>
  </AbsoluteFill>
);

const Logo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: HY.lightSand, fontFamily: FONT, alignItems: "center", justifyContent: "center" }}>
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
    <AbsoluteFill style={{ background: HY.lightSand, fontFamily: FONT, padding: "0 140px", justifyContent: "center" }}>
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
const S = (src: string, from: number) => ({ src, from });

const SCENES: { name: string; d: number; C: React.FC; next?: Next }[] = [
  { name: "공감", d: 130, C: Hook, next: { pres: circle(140 + 11 * 90 + 36, 640) as never, d: 18 } },
  { name: "문제 숫자", d: 170, C: Stats, next: { pres: slide({ direction: "from-bottom" }) as never, d: 16 } },
  { name: "로고", d: 100, C: Logo, next: { pres: circle(960, 470) as never, d: 18 } },
  {
    name: "01 출발 인사",
    d: 210,
    C: () => <Feature look={LIGHT} n="01" tag="출발 인사" title={"시동을 걸면\n먼저 묻는다"} lines={["\"좋은 아침이에요. 오늘 어디 가세요?\"", "말로 답하면 목적지가 정해진다 (STT·TTS)", "자주 가는 곳은 큰 버튼으로"]} rec={S("o1.mp4", 3)} />,
    next: { pres: slide({ direction: "from-right" }) as never, d: 16 },
  },
  {
    name: "02 나만의 기준선",
    d: 345,
    C: () => <Feature look={LIGHT} n="02" tag="나만의 기준선" title={"처음 4주가 평소,\n그다음은 변화만 본다"} lines={["칸 하나가 회전 한 번, 빈 칸은 깜빡이를 놓친 회전", "최근 3주가 계속 높을 때만 본인에게 먼저 알린다", "남과 비교하지 않는다. 진단이 아니다"]} rec={S("o1.mp4", 12)} />,
    next: { pres: circle(1610, 800) as never, d: 18 },
  },
  {
    name: "03 깜빡이 알림",
    d: 170,
    C: () => <Feature look={DARK} n="03" tag="깜빡이 알림" title={"수락하면 회전 앞에서\n한 번 더 알려준다"} lines={["회전 200m 앞부터 화면과 음성으로", "주행 중에는 큰 글씨 안내만 보여준다"]} rec={S("o2.mp4", 8.5)} />,
    next: { pres: wipe({ direction: "from-right" }) as never, d: 18 },
  },
  {
    name: "04 가족과 같이 보기",
    d: 255,
    C: () => <Feature look={LIGHT} n="04" tag="가족과 같이 보기" title={"반납 말고,\n조건을 함께 정한다"} lines={["가족이 동승한 주차 중에 함께 본다", "\"운전 그만하세요\" 대신 \"밤 운전만 줄여볼까요?\"", "조건부 면허 논의와 같은 기준: 야간, 고속도로"]} rec={{ src: "o3.mp4", from: 0.8, landscape: true }} />,
    next: { pres: circle(1540, 870) as never, d: 18 },
  },
  {
    name: "05 조건이 작동",
    d: 372,
    C: () => <Feature look={DARK} n="05" tag="조건이 작동" title={"정한 조건이\n출발할 때 작동한다"} lines={["해 진 뒤 먼 곳이면 \"내일 낮에 가실까요?\"", "막지 않는다. 고르는 건 언제나 운전자 본인", "고속도로는 휴게소를 경유지로 넣는다"]} rec={{ src: "o4.mp4", from: 7, rate: 1.25 }} />,
    next: { pres: slide({ direction: "from-right" }) as never, d: 16 },
  },
  {
    name: "06 길 헤맴 감지",
    d: 315,
    C: () => <Feature look={LIGHT} n="06" tag="길 헤맴 감지" title={"늘 다니던 길에서\n헤매면 집으로"} lines={["5분 안에 경로를 두 번 다시 찾으면 알아챈다", "처음 가는 길의 재탐색은 세지 않는다", "탓하지 않고 \"천천히 가셔도 괜찮아요\""]} rec={S("o4.mp4", 22.5)} />,
    next: { pres: circle(1470, 790) as never, d: 18 },
  },
  {
    name: "판정 엔진",
    d: 190,
    C: () => (
      <Engine
        look={DARK}
        tests={17}
        rules={[
          { t: "깜빡이 누락", d: "회전 안내 후 90초 안 같은 방향 회전, 직전 10초 깜빡이 확인" },
          { t: "나만의 기준선", d: "처음 4주가 평소. 최근 3주 모두 높고 지난주 +10%p" },
          { t: "조건 적용", d: "18~6시에 10km 넘으면 낮에 가기 제안, 고속도로는 휴게소" },
          { t: "길 헤맴", d: "5번 넘게 다닌 길에서 5분 안 재탐색 2번" },
        ]}
        sdk={["TurnSignal", "NaviHelper", "Door · Safety · Light", "CarPropertyManager", "STT · TTS"]}
      />
    ),
    next: { pres: slide({ direction: "from-bottom" }) as never, d: 16 },
  },
  { name: "마무리", d: 160, C: Outro },
];

export const ORAE_DURATION = SCENES.reduce((s, x) => s + x.d - (x.next?.d ?? 0), 0);
const BAR_FROM = SCENES[0].d + SCENES[1].d + SCENES[2].d - 50;
const BAR_TO = ORAE_DURATION - SCENES[SCENES.length - 1].d - SCENES[SCENES.length - 2].d;

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
      <BrandBar opacity={p(f, BAR_FROM, 16) * (1 - p(f, BAR_TO, 12))} logo={<PixelLogo size={36} colors={LOGO} />} name="오래운전" desc="고령 운전자를 위한 Pleos Connect 앱" look={LIGHT} />
      <RepoCard opacity={p(f, BAR_FROM, 16) * (1 - p(f, BAR_TO, 12))} repo="oraeunjeon" look={LIGHT} />
    </AbsoluteFill>
  );
};
