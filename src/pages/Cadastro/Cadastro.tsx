import React, { useState } from "react";
import "./Cadastro.scss";
import { Link, useNavigate } from "react-router";
import { apiUrl } from "../../utils/api";

export default function Cadastro() {
  const [dataUsuario, setDataUsuario] = useState({
    email: "",
    senha: "",
    nome: ""
  });
  
  const handleLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDataUsuario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  const cadastroUsuario = async (e: any) => {
    e.preventDefault();
    const response = await fetch(apiUrl('usuario/register'), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataUsuario),
    });
    if (!response.ok) {
      return alert("Login ou senha incorretos");
    }
    const data = await response.json();
    console.log(data);
    if (data.token) {
      alert("Login realizado com sucesso");
      localStorage.setItem("usuario-token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario))
      navigate("/");
    } else {
      alert("Houve um erro ao iniciar sua sessão");
      console.log("Nenhum token fornecido para armazenar");
    }
  };
  return (
    <>
      <form
        className="form-login"
        onSubmit={(e) => {
          cadastroUsuario(e);
        }}
      >
        <h1>Cadastro</h1>
        <input type="text"
        required
        placeholder="Informe seu nome"
        name="nome"
        value={dataUsuario.nome}
        onChange={handleLogin} />
        <input
          type="email"
          required
          placeholder="Informe seu e-mail"
          name="email"
          value={dataUsuario.email}
          onChange={handleLogin}
        />
        <input
          type="password"
          required
          name="senha"
          placeholder="Informe sua senha"
          value={dataUsuario.senha}
          onChange={handleLogin}
        />
        <button type="submit">Fazer Cadastro</button>
        <Link to={'/login'}>Login</Link>
      </form>
    </>
  );
}
