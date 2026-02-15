import { useState } from "react";
import { generateFlashcards } from "./api";

function App() {

 const [text, setText] = useState("");

 const [cards, setCards] = useState([]);

 async function handleGenerate() {

  const data = await generateFlashcards(text);

  setCards(data.flashcards || []);

 }

 return (

  <div>

   <textarea

    onChange={e =>
     setText(e.target.value)
    }

   />

   <button
    onClick={handleGenerate}
   >
    Generate
   </button>

   {cards.map((card:any) => (

    <div>

     <h3>
      {card.question}
     </h3>

     <p>
      {card.answer}
     </p>

    </div>

   ))}

  </div>

 );

}

export default App;
