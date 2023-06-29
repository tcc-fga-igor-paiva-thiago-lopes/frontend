import { Entity, Column } from 'typeorm';
import { AppBaseEntity, IAppBaseEntity } from './appBaseEntity';

export interface ICategory extends IAppBaseEntity {
    id: number;
    name: string;
    color: string;
    createdAt: Date;
    updatedAt?: Date;
}

@Entity('CATEGORY')
export class Category extends AppBaseEntity implements ICategory {
    @Column({ nullable: false })
    name!: string;

    @Column({ nullable: false })
    color!: string;

    static async findPaginated(pageSize: number, pageNum = 1) {
        return Category.findAndCount({
            take: pageSize,
            skip: (pageNum - 1) * pageSize,
        });
    }
}
