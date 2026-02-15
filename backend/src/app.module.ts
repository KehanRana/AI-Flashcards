import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlashcardsModule } from './flashcards/flashcards.module';

import { User } from './users/user.entity';
import { Deck } from './flashcards/deck.entity';
import { Flashcard } from './flashcards/flashcard.entity';

@Module({
 imports: [
  TypeOrmModule.forRoot({
   type: 'postgres',
   url: process.env.DATABASE_URL,
   entities: [User, Deck, Flashcard],
   synchronize: true,
  }),
  FlashcardsModule,
 ],
})
export class AppModule {}
