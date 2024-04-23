import { Routes, Route } from "react-router-dom";
import { Messages } from "./components/Messages";

function App() {
  return (
    <Routes>
      <Route path="/messages" element={<Messages />} />
    </Routes>
  );
}

export default App;
