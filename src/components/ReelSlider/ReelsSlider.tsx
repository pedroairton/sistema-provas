import { useRef } from "react";
import "./ReelsSlider.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";

import "swiper/swiper-bundle.css";

const initialReels = [
  { id: 1, content: "Slide 1" },
  { id: 2, content: "Slide 2" },
  { id: 3, content: "Slide 3" },
  { id: 4, content: "Slide 4" },
  { id: 5, content: "Slide 5" },
];

const SCROLL_THROTTLE_MS = 500;

export default function ReelsSlider() {
  const swiperRef = useRef<SwiperType | null>(null);
  const isThrottledRef = useRef(false);

  const handleScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    if (isThrottledRef.current) return;

    const deltaY = event.deltaY;

    if (deltaY > 0) {
      swiperRef.current?.slideNext();
    } else if (deltaY < 0) {
      swiperRef.current?.slidePrev();
    }

    isThrottledRef.current = true;

    setTimeout(() => {
      isThrottledRef.current = false;
    }, SCROLL_THROTTLE_MS);
  };
  return (
    <>
      <div className="reel-container">
        <h1>Questões aleatórias</h1>
        <div
          className="reel"
          onWheel={(e) => {
            handleScroll(e);
          }}
        >
          <>
            <Swiper
              direction={"vertical"}
              pagination={{
                clickable: true,
              }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
            >
              {initialReels.map((reel) => (
                <SwiperSlide>
                  <div key={reel.id} className="reel-card">
                    {reel.content}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        </div>
      </div>
    </>
  );
}
