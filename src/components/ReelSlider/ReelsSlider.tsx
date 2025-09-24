import { useRef, useState, useEffect } from "react";
import "./ReelsSlider.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";

import "swiper/swiper-bundle.css";
import { useNavigate } from "react-router";

const SCROLL_THROTTLE_MS = 500;

export default function ReelsSlider() {
  const token = localStorage.getItem("usuario-token");
  const navigate = useNavigate()

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
        `http://localhost:8000/api/usuario/questoes/random`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.clear();
        navigate("/login");
      }

      const newReels = data.map((item: any) => ({
        id: item.id,
        titulo: item.titulo,
        alternativas: item.alternativas,
      }));

      setReels((prev) => [...prev, ...newReels]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Erro: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Carregar os primeiros slides ao montar
    getMoreReels();
  }, []);

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
    const swiper = swiperRef.current;
    if (!swiper) return;

    if (swiper.activeIndex >= reels.length - 1) {
      getMoreReels();
    }
  };
  return (
    <>
      <section className="reel-container">
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
                    <h3 className="titulo">{reel.titulo}</h3>
                    <div className="alternativas">
                      {reel.alternativas.map((alt: any) => (
                        <p className="alternativa">{alt.texto}</p>
                      ))}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        </div>
      </section>
    </>
  );
}
