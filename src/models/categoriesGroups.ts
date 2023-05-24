import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { AppBaseEntity } from './appBaseEntity';

export interface ICategoryGroup extends Record<string, any> {
    id: number;
    name: string;
    color: string;
}

@Entity('category_group')
export class CategoryGroup extends AppBaseEntity implements ICategoryGroup {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('name')
    name!: string;

    @Column('color')
    color!: string;

    static async findPaginated(pageSize: number, pageNum = 1) {
        return CategoryGroup.findAndCount({
            take: pageSize,
            skip: (pageNum - 1) * pageSize,
        });
    }
}
