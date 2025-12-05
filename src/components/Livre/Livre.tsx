import { useEffect, useState } from "react";
import { truncarComReticencias } from "../../utils/function";
import "./Livre.scss";
import { useNavigate } from "react-router";

export default function Livre() {
  const token = localStorage.getItem("usuario-token");
  const navigate = useNavigate();

  const [QuestaoSelecionada, setQuestaoSelecionada] = useState({
    id: "",
    titulo: "",
    dificuldade: "",
    categoria: "",
    alternativas: [
      {
        id: "",
        texto: "",
      },
    ],
  });

  const [AltSelecionada, setAltSelecionada] = useState(String);

  const [questoes, setQuestoes] = useState([]);

  useEffect(() => {
    console.log(QuestaoSelecionada)
    const getQuestoes = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/usuario/questoes",
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setQuestoes(data);
        } else {
          console.log("Erro HTTP: ", response.status);
        }
        if (response.status === 401 || response.status === 403) {
          localStorage.clear();
          navigate("/login");
        }
        console.log(data);
      } catch (error) {
        console.error("Erro: ", error);
      }
    };
    getQuestoes();
  }, []);
  const getQuestao = async (idQuestao: number) => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/usuario/questoes/questao/" + idQuestao,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setQuestaoSelecionada(data);
      console.log(data);
    } catch (error) {
      console.error("Erro: ", error);
    }
  };
  const respondeQuestao = async (e: any) => {
    e.preventDefault();
    console.log("alt selecionada: ", AltSelecionada);
    const payload = {
      questao_id: QuestaoSelecionada.id,
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
        if(data.errors.alternativa_selecionada_id){
          alert(data.errors.alternativa_selecionada_id)
        } else if(data.errors.questao_id){
          alert(data.errors.questao_id)
        }
      } else{
        alert(data.message);
      }
    } catch (error) {
      console.error("Erro: ", error);
      alert("Erro ao responder");
    }
  };
  return (
    <>
      <section className="page-livre">
        <h1>Livre</h1>
        <div className="questoes">
          {questoes
            ? questoes.map((questao: any) => (
                <div
                  className="questao"
                  key={questao.id}
                  onClick={() => {
                    getQuestao(questao.id);
                  }}
                >
                  <div className="infos">
                    <h4>Categoria: {questao.categoria}</h4>
                    <h4>{questao.dificuldade}</h4>
                  </div>
                  <p>{truncarComReticencias(questao.titulo, 150)}</p>
                </div>
              ))
            : ""}
        </div>
        {QuestaoSelecionada.id ? 
        <form className="selecionada">
          <h3 className="titulo">{QuestaoSelecionada.titulo}</h3>
          <div className="alternativas">
            {QuestaoSelecionada.alternativas.map((alt) => (
              <p
                key={alt.id}
                className={
                  "alternativa " + (AltSelecionada === alt.id ? "ativa" : "")
                }
                onClick={() => {
                  setAltSelecionada(alt.id);
                  // respondeQuestao(alt.id);
                }}
              >
                {alt.id}- {alt.texto}
              </p>
            ))}
            <button
            className="btn-responder"
              onClick={(e) => {
                respondeQuestao(e);
              }}
            >
              Enviar Resposta
            </button>
          </div>
        </form> 
        : 
        ''}
      </section>
    </>
  );
}
