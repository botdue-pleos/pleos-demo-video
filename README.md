# Pleos Connect 앱 시연 영상

2026 현대자동차그룹 차량용 앱 개발 공모전 출품작 네 개의 시연 영상과 그 제작 소스 (팀 봇듀). 최종판(2026-11-15)은 네 앱의 제출 버전 화면(평소처럼 v0.8.0, 집중잔량 v0.6.0, 니어바이 v0.3.0, 다음은요 v0.2.0)을 다시 녹화해, 시간 라벨·기능 이름·한 문장 자막과 가상 가로 디스플레이 속 실제 녹화를 확대해 보여 주는 형식으로 만들었다.

| 영상 | 길이 | 앱 저장소 |
| --- | --- | --- |
| [평소처럼 (구 오래운전)](out/평소처럼_시연영상_v10.mp4) | 70초 | [botdue-pleos/pyeongsocheoreom](https://github.com/botdue-pleos/pyeongsocheoreom) |
| [집중잔량](out/집중잔량_시연영상_v9.mp4) | 65초 | [botdue-pleos/jipjungjanryang](https://github.com/botdue-pleos/jipjungjanryang) |
| [니어바이](out/니어바이_시연영상_v9.mp4) | 83초 | [botdue-pleos/pleos-nearby](https://github.com/botdue-pleos/pleos-nearby) |
| [다음은요](out/다음은요_시연영상_v2.mp4) | 66초 | [botdue-pleos/daeumeunyo](https://github.com/botdue-pleos/daeumeunyo) |

- 1920×1080, 30fps, 무음·자막
- 앱 화면은 모두 에뮬레이터에서 실제로 동작하는 모습을 녹화한 것이다 (`public/rec/`). 에뮬레이터 화면을 Pleos Connect 앱 창 크기(세로 1칸 920×1330, 가로 2칸 1870×1330)에 맞추고 위아래 시스템 바는 잘라냈다.
- 통계에는 화면에 출처를 함께 적었다.
- 니어바이는 차 4대가 같은 도로를 달리는 시연 시나리오를 앱 안에서 재생하며 차마다 시점을 바꿔 녹화했다 (시연 조작판은 숨김).
- `screenrecord`는 화면이 바뀔 때만 프레임을 남겨서, 녹화마다 마지막 앱 화면을 10초 이어 붙여 장면 끝까지 멈춘 화면이 유지되게 했다.

## 구조

```
src/
├── display.tsx   Pleos 식 가로 디스플레이 틀(차량 상태·지도·앱 창·앱 바)과 확대 카메라
├── story.tsx     이야기 장면(시간 라벨 + 한 문장 + 실제 녹화), 판정 흐름도
├── grammar.tsx   v7에서 쓴 다른 장면 형식(지금은 쓰지 않음)
├── kit.tsx       글꼴(Asta Sans)·현대차 CI 색, 키네틱 타이포, 원형 전환, 차량 화면 틀
├── common.tsx    마무리 장면의 저장소 QR
├── Orae.tsx      평소처럼(구 오래운전) 영상 (컴포지션 Orae)
├── Jipjung.tsx   집중잔량 영상 (컴포지션 Jipjung)
├── Nearby.tsx    니어바이 영상 (컴포지션 Nearby)
└── Daeum.tsx     다음은요 영상 (컴포지션 Daeum)
public/
├── rec/          에뮬레이터 녹화 원본
└── fonts/        Asta Sans (SIL Open Font License 1.1)
```

## 다시 만들기

```bash
npm ci
npx remotion studio                       # 미리보기
npx remotion render Orae out/평소처럼.mp4
npx remotion render Jipjung out/집중잔량.mp4
npx remotion render Nearby out/니어바이.mp4
```

Remotion으로 만들었다 (https://www.remotion.dev, 개인·소규모 팀 무료 라이선스).
