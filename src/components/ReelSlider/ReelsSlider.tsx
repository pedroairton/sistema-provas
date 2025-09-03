import { useRef, useState, useEffect } from "react";
import "./Shuffle.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";

import "swiper/swiper-bundle.css";

const SCROLL_THROTTLE_MS = 500;
const PAGE_SIZE = 5;

export default function Shuffle() {
  const swiperRef = useRef<SwiperType | null>(null);
  const isThrottledRef = useRef(false);

  const [reels, setReels] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const getMoreReels = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_start=${
          page * PAGE_SIZE
        }&_limit=${PAGE_SIZE}`
      );
      const data = await response.json();

      const newReels = data.map((item: any) => ({
        id: item.id,
        content: item.title,
      }));

      setReels((prev) => [...prev, ...newReels])
      setPage((prev) => prev+1)
    } catch (error) {
        console.error("Erro: ", error)
    } finally{
        setIsLoading(false)
    }
  };

  useEffect(()=>{
    // Carregar os primeiros slides ao montar
    getMoreReels()
  }, [])

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
  const handleSlideChange = () => {
    const swiper = swiperRef.current
    if(!swiper) return

    if(swiper.activeIndex >= reels.length - 1){
        getMoreReels()
    }
  }
  return (
    <>
      <div className="reel-container">
        <h1>Shuffle</h1>
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
              onSlideChange={handleSlideChange}
            >
              {reels.map((reel) => (
                <SwiperSlide key={reel.id}>
                  <div className="reel-card">
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