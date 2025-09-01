import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import Navbar from "../Navbar/Navbar";

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("usuario-token");
  console.log("token atual: ", token);
  useEffect(() => {
    if (!token && location.pathname !== "/login") {
      console.log("sem token identificado");
      navigate("/login");
    } 
  }, [])
  
  return (
    <>
      <Navbar />
      <Outlet></Outlet>
    </>
  );
}
