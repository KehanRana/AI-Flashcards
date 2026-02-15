import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlashcardsController } from './flashcards.controller';
import { Deck } from './deck.entity';
import { Flashcard } from './flashcard.entity';
import { AIModule } from '../ai/ai.module';

@Module({
  imports: [TypeOrmModule.forFeature([Deck, Flashcard]), AIModule],
  controllers: [FlashcardsController],
})
export class FlashcardsModule {}
