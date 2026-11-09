import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { TransitionPresentation, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { RepoBig } from "./common";
import { NIGHT, RepoChip } from "./display";
import { EngineFlow, Look, Story } from "./story";
import { FONT, HY, Kinetic, Line, PixelLogo, circle, ease, p } from "./kit";

/*
 * 니어바이 시연 영상. 1920x1080 30fps, 무음·자막.
 * 공감 → 문제 숫자 → 로고 → 실제 녹화 8장면 → 판정 엔진 → 마무리.
 * 디자인 출발점은 현대차 아이오닉 램프 캠페인 "Pixel by Pixel": 픽셀 하나는 깜빡일 뿐이지만, 모이면 더 큰 것이 된다.
 */

const CELL = "#0E3B6F";
const LOOK: Look = { bg: HY.blue, ink: HY.lightSand, sub: HY.skyBlue, accent: HY.activeBlue };
const LOGO = [CELL, HY.red, CELL, CELL, HY.activeBlue, CELL, CELL, HY.sand, CELL];

/** 공감: 차 한 대는 픽셀 하나. 하나씩 켜지다가 모여 길이 된다 */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const cols = 24;
  return (
    <AbsoluteFill style={{ background: HY.blue, fontFamily: FONT, padding: "0 140px", justifyContent: "center" }}>
      <Kinetic text={"합류할 때, 끼어들 때\n차끼리 할 수 있는 말은 깜빡이뿐"} start={6} size={88} color={HY.lightSand} />
      <div style={{ display: "flex", gap: 10, marginTop: 70 }}>
        {Array.from({ length: cols }, (_, c) => (
          <div key={c} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[0, 1, 2].map((r) => {
              const lit = p(f, 50 + c * 1.6, 8);
              const danger = c >= 17 && c <= 18;
              const me = c === 3;
              const color = me ? HY.sand : danger ? HY.red : HY.activeBlue;
              return <div key={r} style={{ width: 52, height: 52, borderRadius: 6, background: CELL, boxShadow: `inset 0 0 0 52px ${color}${Math.round(lit * (me || danger ? 255 : 90)).toString(16).padStart(2, "0")}` }} />;
            })}
          </div>
        ))}
      </div>
      <Line at={96} color={HY.skyBlue} size={32} style={{ marginTop: 30 }}>
        픽셀 하나는 깜빡일 뿐이지만, 모이면 길이 된다.
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
  <AbsoluteFill style={{ background: HY.daySky, fontFamily: FONT, padding: "150px 140px" }}>
    <div style={{ display: "flex", gap: 140 }}>
      <Stat at={4} big="44%" label="고속도로 2차 사고 치사율 (2024). 전체 교통사고 치사율 10%의 약 4배" src="출처: 인사이트 보도 (insight.co.kr/news/539886)" />
      <Stat at={28} big="44.9%" label="고속도로 터널 사고 중 3대 이상 연쇄 추돌 (2021~2025). 전체 고속도로는 35.5%" src="출처: 한국도로공사 자료, SBS Biz 보도" />
    </div>
    <div style={{ position: "absolute", left: 140, bottom: 140 }}>
      <Kinetic text={"몇 초만 먼저 알아도\n피할 수 있었다"} start={70} size={76} color={HY.blue} />
    </div>
  </AbsoluteFill>
);

const Logo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: HY.blue, fontFamily: FONT, alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 44 }}>
        <PixelLogo size={170} colors={LOGO} at={4} />
        <div style={{ fontSize: 150, fontWeight: 800, color: HY.lightSand, letterSpacing: "-0.04em", opacity: p(f, 18, 18), translate: `${(1 - p(f, 18, 18)) * 40}px 0` }}>니어바이</div>
      </div>
      <Line at={34} color={HY.lightSand} size={44} style={{ marginTop: 44, fontWeight: 700 }}>
        근처 플레오스 차끼리 익명으로 나누는 도로 위 동네 단톡방
      </Line>
      <Line at={46} color={HY.skyBlue} size={30} style={{ marginTop: 10 }}>
        차량 번호·차종·색상은 주고받지 않는다. 정해진 문구만 오간다
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
        <span style={{ fontSize: 64, fontWeight: 800, color: HY.lightSand }}>니어바이</span>
      </div>
      <Kinetic text={"누구인지는 기억하지 않고,\n어느 도로가 위험한지만."} start={14} size={96} color={HY.lightSand} style={{ marginTop: 50 }} />
      <Line at={60} color={HY.skyBlue} size={30} style={{ marginTop: 50 }}>
        근처 플레오스 차끼리 익명으로 연결되는 Pleos Connect 앱
      </Line>
      <Line at={68} color={HY.skyBlue} size={26}>
        2026 현대자동차그룹 차량용 앱 개발 공모전 출품작
      </Line>
      <RepoBig repo="pleos-nearby" color={HY.lightSand} sub={HY.skyBlue} />
    </AbsoluteFill>
  );
};

type Next = { pres: TransitionPresentation<Record<string, unknown>>; d: number };

const SC = { look: LOOK, theme: NIGHT, logo: LOGO };
const DRIVE = { speed: 90, gear: "D" as const };

const SCENES: { name: string; d: number; C: React.FC; next?: Next }[] = [
  { name: "공감", d: 130, C: Hook, next: { pres: circle(140 + 18 * 62 + 26, 600) as never, d: 16 } },
  { name: "문제 숫자", d: 140, C: Stats, next: { pres: slide({ direction: "from-bottom" }) as never, d: 14 } },
  { name: "로고", d: 80, C: Logo, next: { pres: circle(960, 470) as never, d: 16 } },
  {
    name: "합류 예고",
    d: 186,
    C: () => <Story {...SC} when="오후 6:20 본선" what="합류 예고" line="진입로 차의 내비 경로를 미리 나눈다. 1km 앞, 1대 합류 예정" clock="오후 6:20" car={DRIVE} rec={{ src: "n1.mp4", from: 4.5, rate: 1 }} focus={[600, 260]} zoom={[40, 64, 150, 172]} k={1.6} />,
    next: { pres: wipe({ direction: "from-bottom" }) as never, d: 14 },
  },
  {
    name: "비상등 감사",
    d: 150,
    C: () => <Story {...SC} when="합류한 뒤" what="비상등 감사 인사" line="끼어든 앞차가 비상등을 짧게 켜면, 뒤차에 고맙다는 말로 전한다" clock="오후 6:21" car={DRIVE} rec={{ src: "n2.mp4", from: 4.5, rate: 1 }} focus={[600, 230]} zoom={[30, 54, 120, 142]} k={1.6} />,
    next: { pres: slide({ direction: "from-right" }) as never, d: 14 },
  },
  {
    name: "문제 알림",
    d: 140,
    C: () => <Story {...SC} when="바로 앞 차에게" what="문제 알림" line="남만 볼 수 있는 문제를, 정해진 문구로만 알려 준다" clock="오후 6:21" car={{ speed: 80, gear: "D" }} rec={{ src: "n3.mp4", from: 2.5, rate: 1 }} focus={[600, 230]} zoom={[30, 54, 112, 134]} k={1.6} />,
    next: { pres: wipe({ direction: "from-right" }) as never, d: 16 },
  },
  {
    name: "앞길 주의보",
    d: 330,
    C: () => <Story {...SC} when="오후 6:40 터널 2km 뒤" what="앞길 주의보" line="서로 다른 차 2대의 급제동이 겹칠 때만. 램프가 거리를 보여 준다" clock="오후 6:40" car={DRIVE} rec={{ src: "n4.mp4", from: 2.5, rate: 1.3 }} focus={[200, 480]} zoom={[20, 44, 290, 314]} k={1.55} />,
    next: { pres: slide({ direction: "from-bottom" }) as never, d: 14 },
  },
  {
    name: "후방 주의",
    d: 140,
    C: () => <Story {...SC} when="터널 안, 앞서 가는 차" what="후방 주의" line="누구인지 몰라도, 방향과 시간만으로 대비한다" clock="오후 6:40" car={DRIVE} rec={{ src: "n6.mp4", from: 2.5, rate: 1 }} focus={[600, 260]} zoom={[30, 54, 112, 134]} k={1.6} />,
    next: { pres: circle(960, 600) as never, d: 16 },
  },
  {
    name: "행동요령 확인",
    d: 360,
    C: () => <Story {...SC} when="터널 안에 멈춘 차" what="행동요령 확인" line="비상등·트렁크·문 신호로 한 단계씩 확인하고, 남은 것만 말한다" clock="오후 6:41" car={{ speed: 0, gear: "P" }} rec={{ src: "n5.mp4", from: 7, rate: 1.8 }} focus={[620, 520]} zoom={[30, 54, 320, 344]} k={1.5} />,
    next: { pres: slide({ direction: "from-right" }) as never, d: 14 },
  },
  {
    name: "신고 도우미",
    d: 150,
    C: () => <Story {...SC} when="휴게소에 세운 뒤" what="신고 도우미" line="'신고해줘'라고 말한 순간을 이 차 안에만 적어 두었다가 돌려준다" clock="오후 6:42" car={{ speed: 0, gear: "P" }} rec={{ src: "n7.mp4", from: 4.5, rate: 1 }} focus={[620, 420]} zoom={[30, 54, 120, 142]} k={1.5} />,
    next: { pres: wipe({ direction: "from-bottom" }) as never, d: 14 },
  },
  {
    name: "위험 지점 지도",
    d: 150,
    C: () => <Story {...SC} when="5분 뒤" what="위험 지점 지도" line="주의보는 사라지고, 칸별 건수만 남는다. 5건 이상 쌓인 곳만" clock="오후 6:47" car={{ speed: 0, gear: "P" }} rec={{ src: "n8.mp4", from: 0.5, rate: 1 }} focus={[560, 600]} zoom={[24, 48, 120, 142]} k={1.5} />,
    next: { pres: slide({ direction: "from-bottom" }) as never, d: 14 },
  },
  {
    name: "판정 엔진",
    d: 170,
    C: () => (
      <EngineFlow
        look={LOOK}
        tests={26}
        signals={["브레이크·차속 (급제동)", "비상등 Light", "트렁크·문 Door", "내비 경로·합류 지점·터널", "음성 STT"]}
        rules={["합류 예고", "2대 규칙 주의보", "정차·행동요령 확인", "비상등 감사 인식", "감사·문제 배달"]}
        outputs={["본선 차에 합류 예정", "전방·후방 주의", "남은 단계만 안내", "뒤차에 감사 문구", "주차 후 신고 안내"]}
      />
    ),
    next: { pres: slide({ direction: "from-bottom" }) as never, d: 14 },
  },
  { name: "마무리", d: 160, C: Outro },
];

export const NEARBY_DURATION = SCENES.reduce((s, x) => s + x.d - (x.next?.d ?? 0), 0);
const CHIP_FROM = SCENES[0].d + SCENES[1].d + SCENES[2].d - 46;
const CHIP_TO = NEARBY_DURATION - SCENES[SCENES.length - 1].d;

export const NearbyVideo: React.FC = () => {
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
      <RepoChip repo="pleos-nearby" dark opacity={p(f, CHIP_FROM, 16) * (1 - p(f, CHIP_TO - 10, 10))} />
    </AbsoluteFill>
  );
};
