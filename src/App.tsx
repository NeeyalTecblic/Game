import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { GameProvider } from "./context/GameContext";
import Header from "./components/Header";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <GameProvider>
          <div className="app-container">
            <Header />
            <main className="main-content">
              <AppRoutes />
            </main>
          </div>
        </GameProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
