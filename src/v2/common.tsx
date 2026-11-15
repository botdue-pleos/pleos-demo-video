import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { CarScreen, FONT, Kinetic, Line, RecNote, Tag, p } from "../kit";

/** 앱마다 다른 색 한 벌 */
export type Look = {
  bg: string;
  ink: string;
  sub: string;
  accent: string;
  tagBg: string;
};

/**
 * 기능 장면: 왼쪽에 제목과 설명, 오른쪽에 실제 녹화.
 * 가로 2칸 녹화는 화면을 더 넓게 쓰고 글은 왼쪽 좁은 칸에 둔다.
 */
export const Feature: React.FC<{
  look: Look;
  n: string;
  tag: string;
  title: string;
  lines: string[];
  rec: { src: string; from: number; landscape?: boolean; rate?: number };
}> = ({ look, n, tag, title, lines, rec }) => {
  const f = useCurrentFrame();
  const wide = rec.landscape === true;
  const screenW = wide ? 1040 : 520;
  const enter = p(f, 0, 26);
  return (
    <AbsoluteFill style={{ background: look.bg, fontFamily: FONT }}>
      <Tag n={n} bg={look.accent} color={look.ink}>
        {tag}
      </Tag>
      <div style={{ position: "absolute", left: 96, top: wide ? 210 : 250, width: wide ? 560 : 900 }}>
        <Kinetic text={title} start={6} size={wide ? 58 : 74} color={look.ink} />
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 14 }}>
          {lines.map((l, i) => (
            <Line key={i} at={30 + i * 14} color={look.sub} size={wide ? 28 : 34}>
              {l}
            </Line>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", right: wide ? 70 : 190, top: wide ? 66 : 40, opacity: enter, translate: `${(1 - enter) * 120}px 0`, scale: String(0.94 + enter * 0.06) }}>
        <CarScreen src={rec.src} from={rec.from} landscape={wide} width={screenW} rate={rec.rate} />
        <RecNote color={look.sub} />
      </div>
    </AbsoluteFill>
  );
};

/** 화면 아래 왼쪽에 계속 떠 있는 앱 이름 */
export const BrandBar: React.FC<{ opacity: number; logo: React.ReactNode; name: string; desc: string; look: Look }> = ({ opacity, logo, name, desc, look }) => (
  <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
    <div style={{ position: "absolute", left: 40, bottom: 36, display: "flex", alignItems: "center", gap: 16, background: look.bg, borderRadius: 999, padding: "14px 30px 14px 22px", boxShadow: "0 12px 30px rgba(0,20,50,0.18)", border: `2px solid ${look.ink}22`, fontFamily: FONT }}>
      {logo}
      <span style={{ fontSize: 28, fontWeight: 800, color: look.ink }}>{name}</span>
      <div style={{ width: 2, height: 24, background: `${look.ink}33` }} />
      <span style={{ fontSize: 22, fontWeight: 600, color: look.sub }}>{desc}</span>
    </div>
  </AbsoluteFill>
);

/** 화면 아래 오른쪽: 저장소 주소와 QR. 휴대폰 카메라로 찍으면 코드와 APK 를 바로 본다 */
export const RepoCard: React.FC<{ opacity: number; repo: string; look: Look }> = ({ opacity, repo, look }) => (
  <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
    <div style={{ position: "absolute", right: 40, bottom: 36, display: "flex", alignItems: "center", gap: 18, background: "#fff", borderRadius: 24, padding: 12, paddingLeft: 26, boxShadow: "0 12px 30px rgba(0,20,50,0.18)", fontFamily: FONT }}>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#4A5D73" }}>코드와 APK 보기</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#002C5F" }}>github.com/botdue-pleos/{repo}</div>
      </div>
      <Img src={staticFile(`qr_${repo}.svg`)} style={{ width: 92, height: 92, display: "block" }} />
    </div>
  </AbsoluteFill>
);

/** 마무리 장면 오른쪽에 크게 놓는 QR */
export const RepoBig: React.FC<{ repo: string; color: string; sub: string; at?: number }> = ({ repo, color, sub, at = 40 }) => {
  const f = useCurrentFrame();
  const a = p(f, at, 22);
  return (
    <div style={{ position: "absolute", right: 140, top: "50%", translate: `0 -50%`, opacity: a, scale: String(0.92 + a * 0.08), display: "flex", flexDirection: "column", alignItems: "center", gap: 22, fontFamily: FONT }}>
      <div style={{ background: "#fff", borderRadius: 28, padding: 22, boxShadow: "0 24px 50px rgba(0,20,50,0.22)" }}>
        <Img src={staticFile(`qr_${repo}.svg`)} style={{ width: 260, height: 260, display: "block" }} />
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, color: sub }}>코드와 APK 보기</div>
      <div style={{ fontSize: 30, fontWeight: 800, color }}>github.com/botdue-pleos/{repo}</div>
    </div>
  );
};

/** 판정 엔진과 SDK 를 보여주는 장면 */
export const Engine: React.FC<{ look: Look; rules: { t: string; d: string }[]; tests: number; sdk: string[] }> = ({ look, rules, tests, sdk }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: look.bg, fontFamily: FONT, padding: "0 96px 60px", justifyContent: "center" }}>
      <Kinetic text={"판정은 화면과 분리된\n엔진이 한다"} start={4} size={70} color={look.ink} />
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${rules.length}, minmax(0, 1fr))`, gap: 24, marginTop: 64 }}>
        {rules.map((r, i) => {
          const a = p(f, 26 + i * 8, 20);
          return (
            <div key={r.t} style={{ opacity: a, translate: `0 ${(1 - a) * 40}px`, borderTop: `4px solid ${look.accent}`, paddingTop: 22 }}>
              <div style={{ fontSize: 34, fontWeight: 800, color: look.ink }}>{r.t}</div>
              <div style={{ fontSize: 24, fontWeight: 500, color: look.sub, marginTop: 12, lineHeight: 1.5 }}>{r.d}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 64, opacity: p(f, 70, 20) }}>
        <span style={{ fontSize: 30, fontWeight: 800, color: look.bg, background: look.ink, borderRadius: 14, padding: "12px 22px" }}>단위 테스트 {tests}개 통과</span>
        {sdk.map((s, i) => (
          <span key={s} style={{ fontSize: 24, fontWeight: 700, color: look.ink, border: `2px solid ${look.ink}55`, borderRadius: 999, padding: "10px 20px", opacity: p(f, 80 + i * 4, 14) }}>
            {s}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
