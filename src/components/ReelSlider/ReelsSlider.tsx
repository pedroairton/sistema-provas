import { useRef, useState, useEffect } from "react";
import "./ReelsSlider.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";

import "swiper/swiper-bundle.css";
import { useNavigate } from "react-router";

const SCROLL_THROTTLE_MS = 500;

export default function ReelsSlider() {
  const token = localStorage.getItem("usuario-token");
  const navigate = useNavigate();

  const swiperRef = useRef<SwiperType | null>(null);
  const isThrottledRef = useRef(false);

  const [reels, setReels] = useState<any[]>([]);
  // const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [AltSelecionada, setAltSelecionada] = useState(String);

  const [submittedForms, setSubmittedForms] = useState<any[]>([]);

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
      if (response.status === 404) {
        alert(data.message);
        return
      }

      const newReels = data.map((item: any) => ({
        id: item.id,
        titulo: item.titulo,
        alternativas: item.alternativas,
      }));

      setReels((prev) => [...prev, ...newReels]);
    } catch (error) {
      console.error("Erro: ", error);
    } finally {
      setIsLoading(false);
      console.log(reels);
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

  const respondeQuestao = async (e: any, idQuestao: number) => {
    e.preventDefault();
    console.log("alt selecionada: ", AltSelecionada, "\n event: ", e.target);
    const payload = {
      questao_id: idQuestao,
      alternativa_selecionada_id: AltSelecionada,
    };

    console.log("payload: ", payload);

    try {
      const response = await fetch(
        "http://localhost:8000/api/usuario/questoes/responder",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        console.log("Erro HTTP: ", response.status);
        if (data.errors.alternativa_selecionada_id) {
          alert(data.errors.alternativa_selecionada_id);
        } else if (data.errors.questao_id) {
          alert(data.errors.questao_id);
        }
      } else {
        setSubmittedForms((prev) => [...prev, idQuestao]);
        swiperRef.current?.slideNext();
        alert(data.message);
      }
    } catch (error) {
      console.error("Erro: ", error);
      alert("Erro ao responder");
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
                  <form
                    className={
                      "reel-card " +
                      reel.id +
                      (submittedForms.includes(reel.id) ? " respondido" : "")
                    }
                    onSubmit={(e) => {
                      respondeQuestao(e, reel.id);
                    }}
                  >
                    <h3 className="titulo">{reel.titulo}</h3>
                    <div className="alternativas">
                      {reel.alternativas.map((alt: any, idx: number) => (
                        <p
                          className={
                            "alternativa " +
                            (AltSelecionada === alt.id ? "ativa" : "")
                          }
                          onClick={() => {
                            submittedForms.includes(reel.id)
                              ? console.log("Questão já respondida")
                              : setAltSelecionada(alt.id);
                          }}
                        >
                          {idx + 1}- {alt.texto}
                        </p>
                      ))}
                    </div>
                    <button
                      className="btn-responder"
                      type="submit"
                      disabled={submittedForms.includes(reel.id)}
                    >
                      Enviar Resposta
                    </button>
                  </form>
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        </div>
      </section>
    </>
  );
}
