import { Entity, Column } from 'typeorm';
import { AppBaseEntity, IAppBaseEntity } from './appBaseEntity';

export interface ICategoryGroup extends IAppBaseEntity {
    id: number;
    name: string;
    color: string;
    createdAt: Date;
    updatedAt?: Date;
}

@Entity('CATEGORY_GROUP')
export class CategoryGroup extends AppBaseEntity implements ICategoryGroup {
    @Column({ nullable: false })
    name!: string;

    @Column({ nullable: false })
    color!: string;

    static async findPaginated(pageSize: number, pageNum = 1) {
        return CategoryGroup.findAndCount({
            take: pageSize,
            skip: (pageNum - 1) * pageSize,
        });
    }
}
