import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

type Instrument = {
  id: number;
  name: string;
};

function App() {
  const [instruments, setInstruments] = useState<Instrument[]>([]);

  useEffect(() => {
    getInstruments();
  }, []);

  async function getInstruments() {
    const { data, error } = await supabase
      .from("instruments")
      .select("*");

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) return;
    if (data) setInstruments(data);
  }

  return (
    <>
      <ul>
        {instruments.map((instrument) => (
          <li key={instrument.id}>{instrument.name}</li>
        ))}
      </ul>
    </>
  );
}

export default App;