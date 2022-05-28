import { EntityRepository, Repository } from "typeorm";
import { Category } from "../models/Category.model";


@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {}