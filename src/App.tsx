import { supabase } from "./lib/supabase";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
// type Instrument = {
//   id: number;
//   name: string;
// };


//   const [instruments, setInstruments] = useState<Instrument[]>([]);

//   useEffect(() => {
//     getInstruments();
//   }, []);

//   async function getInstruments() {
//     const { data, error } = await supabase
//       .from("instruments")
//       .select("*");

//     console.log("DATA:", data);
//     console.log("ERROR:", error);

//     if (error) return;
//     if (data) setInstruments(data);
//   }

//   return (
//     <>
//       <ul>
//         {instruments.map((instrument) => (
//           <li key={instrument.id}>{instrument.name}</li>
//         ))}
//       </ul>
//     </>
//   );
// }
