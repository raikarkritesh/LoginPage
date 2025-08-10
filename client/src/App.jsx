import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Navbar } from "./components/navbar";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";

function App() {
  const [count, setCount] = useState(0);
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "login" ? <LoginForm/> : <RegisterForm/>}
    </div>
  );
}

export default App;
