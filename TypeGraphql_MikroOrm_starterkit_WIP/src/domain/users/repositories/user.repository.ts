import {Service} from "typedi";
import { User } from "@domain/users/entities";
import { BaseRepository } from "@core/database";

@Service()
export class UserRepository extends BaseRepository<User>{

    findAll() {
        return this.repository.findAll();
    }

    create(email: string, password: string) {
        return this.repository.create({ email, password});
    }


    protected get repository() {
        return this.em.getRepository(User);
    }


}
