interface IPaginationResult<PaginationEntity> {
    results?: PaginationEntity[];
    pageTotal: number;
    total: number;
}

interface IPaginationService {
    pageSize: number;
    currentPage: number;
    totalResults: number;
    queryFunc: QueryFunc;
}

type QueryFunc = (
    pageSize: number,
    pageNum: number,
    reset?: boolean
) => Promise<[PaginationEntity[], number]>;
