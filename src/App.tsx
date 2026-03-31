import { Routes, Route } from "react-router-dom";
import Home from "./screens/Home";
import Profile from "./screens/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
