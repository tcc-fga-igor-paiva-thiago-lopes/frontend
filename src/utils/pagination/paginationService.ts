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

    async reset() {
        return this.getFirstPage();
    }

    async getFirstPage() {
        const result = await this.getPage(1);

        this.currentPage = 1;

        return result;
    }

    async getNextPage() {
        const result = await this.getPage(this.currentPage + 1);

        this.currentPage++;

        return result;
    }

    async getPage(page: number) {
        const result = await this.queryPageResult(page);

        this.result = result;

        return result;
    }

    async queryPageResult(page: number) {
        const [results, total] = await this.queryFunc(this.pageSize, page);

        this.totalResults = total;

        return new PaginationResult<PaginationEntity>({
            results: this.options.saveResults ? results : undefined,
            total,
        });
    }
}

export default PaginationService;
