import {Service} from "typedi";
import {UserRepository} from "@domain/users/repositories";
import {hash} from "argon2";
import {RegisterDto} from "@domain/auth/dto";

@Service()
export class UserService {
    constructor(private readonly usersRepo: UserRepository) {
    }

    getUsers() {
        return this.usersRepo.findAll();
    }

    async create(payload: RegisterDto) {
        const user = await this.usersRepo.create(payload);
        user.password = hash(entity.password);

        await this.usersRepo.save(user);
        return user;
    }

    async findOnyByEmail(email: string) {
        console.log(email);
        try {
            const user = await this.usersRepo.findOne({email});
            console.log(user);
            return user;
        } catch (e) {
            console.error(e);
        }

        return null;
    }

    async findOnyById(id: string) {
        return this.usersRepo.findOne({id});
    }

}
