import { useState } from "react";
import Header from "../components/Header";
import Pong from "../components/Pong";

export default function Spectate() {
  // state
  const [isSpectate, setIsSpectate] = useState(true);
  // comportements

  // affichage
  return (
    <div>
      <Header />
      <br />
      <Pong isSpecate={isSpectate}/>
    </div>
  );
}
