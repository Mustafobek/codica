import { EntityRepository, Repository } from "typeorm";
import { Transaction } from "../models/Transaction.model";


@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {}