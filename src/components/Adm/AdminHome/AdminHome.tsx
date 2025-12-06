import React, { useState } from "react";
import "./AdminHome.scss";

export default function AdminHome() {
  const [formDataQuestoes, setFormDataQuestoes] = useState({
    titulo: "",
    dificuldade: "",
    categoria: "",
  });
  const [formDataAlt, setFormDataAlt] = useState([
    { texto: "", correta: false },
  ]);
  const handleChangeQuestoes = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormDataQuestoes((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleChangeAlt = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    const updatedAlternativas = [...formDataAlt];
    updatedAlternativas[index] = {
      ...updatedAlternativas[index],
      [name]: type === "checkbox" ? checked : value,
    };
    setFormDataAlt(updatedAlternativas);
  };

  const addAlternativa = () => {
    setFormDataAlt((prev) => [...prev, { texto: "", correta: false }]);
  };

  const removeAlternativa = (index: number) => {
    setFormDataAlt((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      questoes: formDataQuestoes,
      alternativas: formDataAlt,
    };

    console.log("Submetendo:", payload);
    // Aqui você pode enviar via fetch/axios, ex:
    // axios.post("/api/questao", payload);

    const response = await fetch('https://shuffle.srv1109011.hstgr.cloud/api/questao/criar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    const data = await response.json()

    console.log(data)
    alert(data.message)
  };
  return (
    <section className="page-admin-home">
      <h2>Registra questão</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          name="titulo"
          value={formDataQuestoes.titulo}
          onChange={handleChangeQuestoes}
          placeholder="titulo"
          required
        />
        <input
          type="text"
          name="dificuldade"
          value={formDataQuestoes.dificuldade}
          onChange={handleChangeQuestoes}
          placeholder="dificuldade"
          required
        />
        <input
          type="text"
          name="categoria"
          value={formDataQuestoes.categoria}
          onChange={handleChangeQuestoes}
          placeholder="categoria"
          required
        />
        <h2>Registra alternativas</h2>
                <button type="button" onClick={addAlternativa}>
          Adicionar alternativa
        </button>
        {formDataAlt.map((alt, idx) => (
          <div className="campo" key={idx}>
            <input
              type="text"
              placeholder={"Alternativa " + (idx + 1)}
              name="texto"
              value={alt.texto}
              onChange={(e) => handleChangeAlt(idx, e)}
            />
            <label>
              Correta?
              <input
                type="checkbox"
                name="correta"
                id=""
                checked={alt.correta}
                onChange={(e) => handleChangeAlt(idx, e)}
              />
            </label>
            <button
              type="submit"
              className="btn-remove"
              onClick={() => {
                removeAlternativa(idx);
              }}
            >
              Remover
            </button>
          </div>
        ))}
        <button type="submit">Enviar</button>
      </form>
    </section>
  );
}
