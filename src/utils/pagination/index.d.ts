interface IPaginationResult<PaginationEntity> {
    results?: PaginationEntity[];
    pageTotal: number;
    total: number;
}

type QueryFunc = (
    pageSize: number,
    pageNum: number
) => Promise<[PaginationEntity[], number]>;
