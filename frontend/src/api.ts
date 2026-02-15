export async function generateFlashcards(text: string) {

 const res = await fetch(

  "http://localhost:3000/flashcards/generate",

  {
   method: "POST",

   headers: {
    "Content-Type": "application/json"
   },

   body: JSON.stringify({
    text
   })

  }

 );

 return res.json();

}
