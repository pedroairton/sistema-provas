import React, { useState } from "react";
import "./Login.scss";
import { Link, useNavigate } from "react-router";
import { apiUrl } from "../../utils/api";

export default function Login() {
  const [dataUsuario, setDataUsuario] = useState({
    email: "",
    senha: "",
  });
  
  const handleLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDataUsuario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  const loginUsuario = async (e: any) => {
    e.preventDefault();
    const response = await fetch(apiUrl('usuario/login'), {
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
          loginUsuario(e);
        }}
      >
        <h1>Login</h1>
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
        <button type="submit">Fazer Login</button>
        <Link to={'/cadastro'}>Cadastrar-se</Link>
      </form>
    </>
  );
}
