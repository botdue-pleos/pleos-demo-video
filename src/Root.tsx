import { Composition } from "remotion";
import { JIPJUNG_DURATION, JipjungVideo } from "./Jipjung";
import { NEARBY_DURATION, NearbyVideo } from "./Nearby";
import { ORAE_DURATION, OraeVideo } from "./Orae";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Orae" component={OraeVideo} durationInFrames={ORAE_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="Jipjung" component={JipjungVideo} durationInFrames={JIPJUNG_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="Nearby" component={NearbyVideo} durationInFrames={NEARBY_DURATION} fps={30} width={1920} height={1080} />
  </>
);
