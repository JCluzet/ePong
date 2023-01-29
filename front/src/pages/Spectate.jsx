import { useState } from "react";
import Header from "../components/Header";
import Pong from "../components/Pong";

export default function Spectate() {
  const [isSpectate, setIsSpectate] = useState(true);

  return (
    <div>
      <Header />
      <br />
      <Pong isSpecate={isSpectate} />
    </div>
  );
}
