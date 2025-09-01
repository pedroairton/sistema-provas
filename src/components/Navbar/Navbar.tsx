import React from "react";
import "./Navbar.scss";
import type { Usuario } from "../../interfaces/Usuario";
import { Link, useNavigate } from "react-router";

export default function Navbar() {
  const usuarioString = localStorage.getItem("usuario");

  let usuario: Usuario | null = null;

  if (usuarioString) {
    try {
      usuario = JSON.parse(usuarioString) as Usuario;
      console.log(usuario.email);
    } catch (error) {
      console.error("Erro ao obter dados do usuário", error);
      localStorage.clear;
      const navigate = useNavigate();
      navigate("/login");
    }
  }
  return (
    <>
      <nav>
        <a className="logo" href="">
          Logo
        </a>
        <div className="user">
          <h3>
            Olá, <br /> {usuario?.nome}
          </h3>
        </div>
        <div className="list-items">
          <Link to={"/"}>
            <span>Shuffle</span>
          </Link>
          <Link to={"/livre"}>
            <span>Modo Livre</span>
          </Link>
          <a href="">Prova Diária</a>
          <a href="">Estatísticas</a>
        </div>
      </nav>
    </>
  );
}
