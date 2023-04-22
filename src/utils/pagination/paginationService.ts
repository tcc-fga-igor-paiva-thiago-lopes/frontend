import PaginationResult from './paginationResult';

export const DEFAULT_PAGE_SIZE = 100;

class PaginationService<PaginationEntity> {
    public pageSize: number;
    public totalResults = 0;
    public currentPage: number;
    public queryFunc: QueryFunc;
    public result: PaginationResult<PaginationEntity>;

    constructor(queryFunc: QueryFunc, pageSize = DEFAULT_PAGE_SIZE) {
        this.currentPage = 0;
        this.pageSize = pageSize;
        this.queryFunc = queryFunc;
        this.result = new PaginationResult<PaginationEntity>({ total: 0 });
    }

    async getFirstPage() {
        return this.getNextPage();
    }

    async getNextPage() {
        const result = await this.queryPageResult(this.currentPage + 1);

        this.currentPage++;

        this.result = result;

        return result;
    }

    async queryPageResult(page: number) {
        const [results, total] = await this.queryFunc(this.pageSize, page);

        this.totalResults = total;

        return new PaginationResult<PaginationEntity>({ results, total });
    }
}

export default PaginationService;
