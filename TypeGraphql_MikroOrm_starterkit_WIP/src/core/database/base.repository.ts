import {AnyEntity, EntityManager, EntityRepository, FilterQuery} from "@mikro-orm/core";
import {Inject, Service} from "typedi";

@Service()
export abstract class BaseRepository<T extends AnyEntity<T>> {
    @Inject()
    protected readonly em: EntityManager;
    private _repository: EntityRepository<T>;
    protected get repository(): EntityRepository<T> {
        return this._repository;
    }
    protected set repository(value: EntityRepository<T>) {
        this._repository = value;
    }
    public save(payload: T) {
        return this.em.persistAndFlush(payload);
    }
    public findOne(where: FilterQuery<T>) {
        return this.repository.findOne(where)
    }

}
