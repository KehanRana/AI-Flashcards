import { Controller, Post, Body } from "@nestjs/common";
import { AIService } from "../ai/ai.service";

@Controller("flashcards")
export class FlashcardsController {

 constructor(
  private aiService: AIService
 ) {}

 @Post("generate")
 async generate(@Body() body) {

  return this.aiService.generateFlashcards(
   body.text
  );

 }

}
