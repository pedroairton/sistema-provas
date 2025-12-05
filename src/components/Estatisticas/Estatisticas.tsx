import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./Estatisticas.scss";

export default function Estatisticas() {
  const token = localStorage.getItem("usuario-token");
  const navigate = useNavigate();

  // const [percentualAcerto, setPercentualAcerto] = useState(0);
  const [estatisticas, setEstatisticas] = useState({
    percentual_acerto: '',
    percentual_erro: '',
    total_questoes_respondidas: '',
    total_respostas_corretas: '',
  })
  const [percentualAcertoSvg, setPercentualAcertoSvg] = useState(282.7); // valor 0 da circunferencia

  const updateProgressBar = (percentage: number) => {
    const circumference = 2 * Math.PI * 45; // 2 * pi * r
    const offset = circumference - (percentage / 100) * circumference;
    setPercentualAcertoSvg(offset);
  };

  const getEstatisticas = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/usuario/estatisticas",
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
      console.log(data);
      updateProgressBar(data.estatisticas.percentual_acerto);
      setEstatisticas(data.estatisticas);
    } catch (error) {
      console.error("Erro: ", error);
    }
  };

  useEffect(() => {
    getEstatisticas();
  }, []);

  return (
    <>
      <section className="page-estatisticas">
        <h1>Suas Estatísticas</h1>
        <div className="estatisticas">
          <i>*Suas estatísticas são atualizadas a cada alguns minutos</i>
          <div className="perc-acerto stat">
            <h3 className="titulo">Percentual de Acerto Geral</h3>
            <div className="grafico">
              <svg width="250" height="250" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e0e0e0"
                  strokeWidth={10}
                />
                <circle
                  id="progressCircle"
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#0A3566"
                  strokeWidth={10}
                  strokeDasharray={282.7}
                  strokeDashoffset={percentualAcertoSvg}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <h2 className="percentual">{estatisticas.percentual_acerto}%</h2>
            </div>
          </div>
          <div className="total-questoes stat">
            <h3 className="titulo">Total de questões respondidas</h3>
            <h2>{estatisticas.total_questoes_respondidas}</h2>
          </div>
        </div>
      </section>
    </>
  );
}
