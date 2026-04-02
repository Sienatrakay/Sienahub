import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./screens/Home";
import Profile from "./screens/Profile";

function App() {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/profile"
        element={<Profile key={location.state?.user?.login} />}
      />
    </Routes>
  );
}

export default App;
