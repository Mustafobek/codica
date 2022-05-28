import { EntityRepository, Repository } from "typeorm";
import { Bank } from '../models/Bank.model';


@EntityRepository(Bank)
export class BankRepository extends Repository<Bank> {}