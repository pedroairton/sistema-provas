import React, { useState, useEffect } from "react";
import "./UsuarioHome.scss";
import { truncarComReticencias } from "../../function";
import { Navigate, useNavigate } from "react-router";

export default function UsuarioHome() {
  const token = localStorage.getItem('usuario-token')
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

  const [questoes, setQuestoes] = useState([]);
  useEffect(() => {
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
        if(response.ok){
          setQuestoes(data);
        } else {
          console.log("Erro HTTP: ", response.status)
        }
        if(response.status === 401 || response.status === 403){
          localStorage.removeItem('token')
          // navigate('/login');
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
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
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
  const respondeQuestao = async (idAlt: string) => {
    const payload = {
      usuario_id: 2, // simulando
      questao_id: QuestaoSelecionada.id,
      alternativa_selecionada_id: idAlt,
    };
    console.log(payload);

    
    try {
      const response = await fetch(
        "http://localhost:8000/api/usuario/questoes/responder",
        {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(payload)
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Erro: ", error);
    }
  };

  return (
    <>
      <section className="page">
        <h1>Questões</h1>
        <div className="questoes">
          { questoes ? 
          questoes.map((questao: any) => (
            <div
              className="questao"
              key={questao.id}
              onClick={() => {
                getQuestao(questao.id);
              }}
            >
              {truncarComReticencias(questao.titulo, 150)}
            </div>
          ))
          : ''
         }
        </div>
        <form className="selecionada">
          <h3 className="titulo">{QuestaoSelecionada.titulo}</h3>
          <div className="alternativas">
            {QuestaoSelecionada.alternativas.map((alt) => (
              <div
                className="alternativa"
                key={alt.id}
                onClick={() => {
                  respondeQuestao(alt.id);
                }}
              >
                {alt.texto}
              </div>
            ))}
          </div>
        </form>
      </section>
    </>
  );
}
