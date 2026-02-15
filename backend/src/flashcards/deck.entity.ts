import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Flashcard } from "./flashcard.entity";

@Entity()
export class Deck {

 @PrimaryGeneratedColumn()
 id: number;

 @Column()
 title: string;

 @OneToMany(() => Flashcard, card => card.deck)
 flashcards: Flashcard[];

}
