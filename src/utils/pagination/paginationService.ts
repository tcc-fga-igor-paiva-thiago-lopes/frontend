import PaginationResult from './paginationResult';

export const DEFAULT_PAGE_SIZE = 100;

type Options = { saveResults?: boolean };

class PaginationService<PaginationEntity> {
    public pageSize: number;
    public totalResults = 0;
    public currentPage: number;
    public queryFunc: QueryFunc;
    public options: Options = {};
    public result: PaginationResult<PaginationEntity>;

    constructor(
        queryFunc: QueryFunc,
        pageSize = DEFAULT_PAGE_SIZE,
        options: Options = {}
    ) {
        this.currentPage = 0;
        this.pageSize = pageSize;
        this.queryFunc = queryFunc;
        this.options = options;
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

    async queryPageResult(page: number, reset = false) {
        const [results, total] = await this.queryFunc(
            this.pageSize,
            page,
            reset
        );

        this.totalResults = total;

        return new PaginationResult<PaginationEntity>({
            results: this.options.saveResults ? results : undefined,
            total,
        });
    }

    async reset() {
        this.currentPage = 0;

        return this.queryPageResult(0, true);
    }
}

export default PaginationService;
