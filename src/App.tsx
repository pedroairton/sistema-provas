import "./App.scss";
import AdminHome from "./components/Adm/AdminHome/AdminHome";
import Home from "./components/Home/Home";
import Livre from "./components/Livre/Livre";
import ReelsSlider from "./components/ReelSlider/ReelsSlider";
import { BrowserRouter as Router, Routes, Route} from "react-router";
import UsuarioHome from "./components/Usuario/UsuarioHome";
import Login from "./pages/Login/Login";
import Estatisticas from "./components/Estatisticas/Estatisticas";
import Cadastro from "./pages/Cadastro/Cadastro";

// import ReelSlider from './components/ReelSlider/ReelSlider'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/cadastro" element={<Cadastro />}></Route>
          <Route path="/" element={<Home />}>
            <Route path="/" element={<ReelsSlider />}></Route>
            <Route path="/livre" element={<Livre />}></Route>
            <Route path="/admin/home" element={<AdminHome />}></Route>
            <Route path="/usuario/home" element={<UsuarioHome />}></Route>
            <Route path="/estatisticas" element={<Estatisticas/>}></Route>
          </Route>
        </Routes>
      </Router>
      {/* <ReelsSlider/> */}
    </>
  );
}

export default App;
