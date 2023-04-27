class PaginationResult<PaginationEntity> {
    public results?: PaginationEntity[];
    public pageTotal: number;
    public total: number;

    constructor(
        paginationResults: Omit<
            IPaginationResult<PaginationEntity>,
            'pageTotal'
        >
    ) {
        this.total = paginationResults.total;
        this.results = paginationResults.results;
        this.pageTotal = (paginationResults.results || []).length;
    }
}

export default PaginationResult;
