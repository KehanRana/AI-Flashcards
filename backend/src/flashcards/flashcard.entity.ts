import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Deck } from "./deck.entity";

@Entity()
export class Flashcard {

 @PrimaryGeneratedColumn()
 id: number;

 @Column()
 question: string;

 @Column()
 answer: string;

 @ManyToOne(() => Deck, deck => deck.flashcards)
 deck: Deck;

}
