import "./Navbar.scss";
import type { Usuario } from "../../interfaces/Usuario";
import { Link, useNavigate } from "react-router";

export default function Navbar() {
  const usuarioString = localStorage.getItem("usuario");

  let usuario: Usuario | null = null;
  const navigate = useNavigate();

  if (usuarioString) {
    try {
      usuario = JSON.parse(usuarioString) as Usuario;
      console.log(usuario.email);
    } catch (error) {
      console.error("Erro ao obter dados do usuário", error);
      localStorage.clear;
      navigate("/login");
    }
  }
  const logout = async () => {
    try {
      const token = localStorage.getItem('usuario-token')

      if(!token){
        localStorage.clear()
        navigate('/login');
        return
      }
      const response = await fetch("http://localhost:8000/api/usuario/logout", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log(data)
      localStorage.clear(); // tirar token e usuario do localstorage
      navigate("/login");
      if(response.ok){
        alert(data.message)
      } else {
        alert('Logout realizado')
      }
    } catch (error) {
      console.error("Erro ao fazer logout: ", error);
      localStorage.clear()
      navigate("/login");
    }
  };
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
          {/* <a href="">Prova Diária</a> */}
          <Link to={"/estatisticas"}>
            <span>Estatísticas</span>
          </Link>
        </div>
        <div
          className="logout"
          onClick={logout}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="white"
            className="bi bi-box-arrow-left"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"
            />
            <path
              fill-rule="evenodd"
              d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"
            />
          </svg>
          <span>Logout</span>
        </div>
      </nav>
    </>
  );
}
