import PaginationService from '@/utils/pagination/paginationService';

describe('PaginationService', () => {
    it('should instantiate pagination service', async () => {
        const queryFuncMock = jest.fn();

        const paginationService = new PaginationService(queryFuncMock);

        expect(paginationService.currentPage).toBe(0);
        expect(paginationService.pageSize).toBe(100);
        expect(paginationService.queryFunc).toBe(queryFuncMock);
        expect(paginationService.options.saveResults).toBeFalsy();
        expect(paginationService.result.results).toBeFalsy();
        expect(paginationService.result.total).toBeFalsy();
        expect(paginationService.result.pageTotal).toBe(0);
    });

    it('should call query function when fetching first page', async () => {
        const queryFuncMock = jest
            .fn()
            .mockResolvedValue([[{ name: 'name' }], 1]);

        const paginationService = new PaginationService<object>(queryFuncMock);

        await paginationService.getFirstPage();

        expect(queryFuncMock).toHaveBeenCalledWith(100, 1);

        expect(paginationService.currentPage).toBe(1);
        expect(paginationService.totalResults).toBe(1);
        expect(paginationService.result.total).toBe(1);
        expect(paginationService.result.results).toBeFalsy();
    });

    it('should fetch next page when saving results', async () => {
        const queryFuncMock = jest
            .fn()
            .mockResolvedValue([[{ name: 'name' }], 1]);

        const paginationService = new PaginationService<object>(
            queryFuncMock,
            10,
            { saveResults: true }
        );

        await paginationService.getFirstPage();

        await paginationService.getNextPage();

        expect(queryFuncMock).toHaveBeenNthCalledWith(2, 10, 2);

        expect(paginationService.currentPage).toBe(2);
        expect(paginationService.result.results).toEqual([{ name: 'name' }]);
    });
});
