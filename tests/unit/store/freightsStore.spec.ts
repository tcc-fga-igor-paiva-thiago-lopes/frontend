import { setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

const mockApiPost = jest.fn();
const mockApiPatch = jest.fn();
const mockApiDelete = jest.fn();

import { DatabaseHelper } from '../../databaseHelper';
import { Freight, FreightCargo, FreightStatus } from '@/models/freight';
import DatabaseCrudPlugin from '@/store/plugins/databaseCrud';
import { initialState, useFreightsStore } from '@/store/freights';

const mockDataSource = DatabaseHelper.dataSource();

jest.mock('@/database/dataSource', () => {
    return jest.fn().mockImplementation(() => ({
        __esModule: true,
        default: mockDataSource,
    }));
});

jest.mock('@/database', () => {
    return jest.fn().mockImplementation(() => ({ default: {} }));
});

jest.mock('@/services/api', () =>
    jest.fn().mockImplementation(() => ({
        post: mockApiPost,
        delete: mockApiPatch,
        patch: mockApiDelete,
    }))
);

const freightOneAttrs = {
    description: 'Frete 1',
    cargo: FreightCargo.GENERAL,
    status: FreightStatus.NOT_STARTED,
    cargoWeight: 1.75,
    contractor: 'Jefferson',
    agreedPayment: 950.33,
    startDate: '2023-06-05T02:53:26.213Z',
    distance: 1550.0,
    originCountry: 'Brasil',
    originCity: 'Brasília',
    originState: 'DF',
    destinationCountry: 'Brasil',
    destinationCity: 'São Paulo',
    destinationState: 'SP',
};

const freightTwoAttrs = {
    description: 'Frete 2',
    cargo: FreightCargo.CONTAINERIZED,
    status: FreightStatus.NOT_STARTED,
    cargoWeight: 1.75,
    contractor: 'Jefferson',
    agreedPayment: 950.33,
    startDate: '2023-06-05T02:53:26.213Z',
    distance: 1753.45,
    originCountry: 'Brasil',
    originCity: 'Morro do Chapéu',
    originState: 'BA',
    destinationCountry: 'Brasil',
    destinationCity: 'Rio de Janeiro',
    destinationState: 'RJ',
};

const freightThreeAttrs = {
    description: 'Frete 3',
    cargo: FreightCargo.DANGEROUS_GENERAL,
    status: FreightStatus.STARTED,
    cargoWeight: 1.0,
    contractor: 'W.M Fretes',
    agreedPayment: 1450.25,
    startDate: '2023-06-05T02:53:26.213Z',
    distance: 1130.35,
    originCountry: 'Brasil',
    originCity: 'Formosa',
    originState: 'GO',
    destinationCountry: 'Brasil',
    destinationCity: 'São José dos Campos',
    destinationState: 'SP',
};

beforeAll(async () => DatabaseHelper.instance.setupTestDB(mockDataSource));

afterAll(() => DatabaseHelper.instance.teardownTestDB());

describe('freightsStore', () => {
    beforeEach(() => {
        setActivePinia(
            createTestingPinia({
                stubActions: false,
                plugins: [DatabaseCrudPlugin],
                initialState: {
                    application: initialState(),
                },
            })
        );
    });

    it('should find freight and return instance', async () => {
        const { findFreight } = useFreightsStore();

        await Freight.createWithAttrs(freightTwoAttrs);

        const freightOne = await Freight.createWithAttrs(freightOneAttrs);

        const foundFreight = await findFreight(freightOne.id);

        expect(foundFreight?.id).toBeGreaterThanOrEqual(freightOne.id);
    });

    it('should find freight and return as form data', async () => {
        const { findFreight } = useFreightsStore();

        await Freight.createWithAttrs(freightOneAttrs);

        const freightTwo = await Freight.createWithAttrs(freightTwoAttrs);

        const foundFreight = await findFreight(freightTwo.id, true);

        delete foundFreight?.createdAt;
        delete foundFreight?.updatedAt;

        expect(foundFreight).toEqual({
            id: foundFreight?.id,
            description: 'Frete 2',
            cargo: FreightCargo.CONTAINERIZED,
            status: 'Não iniciado',
            cargoWeight: '1.75',
            contractor: 'Jefferson',
            agreedPayment: '950.33',
            startDate: '2023-06-05T02:53:26.213Z',
            distance: '1753.45',
            dueDate: null,
            finishedDate: null,
            originCity: 'Morro do Chapéu',
            originState: 'BA',
            originCountry: 'Brasil',
            originLatitude: null,
            originLongitude: null,
            destinationCity: 'Rio de Janeiro',
            destinationState: 'RJ',
            destinationCountry: 'Brasil',
            destinationLatitude: null,
            destinationLongitude: null,
        });
    });

    it('should load freights paginated returning page results and total count', async () => {
        const { loadPaginated } = useFreightsStore();

        await Freight.createWithAttrs(freightOneAttrs);

        await Freight.createWithAttrs(freightTwoAttrs);

        await Freight.createWithAttrs(freightThreeAttrs);

        const [result, count] = await loadPaginated(2, 1);

        expect(count).toBe(await Freight.count());
        expect(result.length).toBe(2);
    });

    it('should return true when edit freight is found', async () => {
        const { findEditFreight } = useFreightsStore();

        await Freight.createWithAttrs(freightTwoAttrs);

        const freight = await Freight.createWithAttrs(freightOneAttrs);

        expect(await findEditFreight(freight.id)).toBeTruthy();
    });

    it('should return false when edit freight is not found', async () => {
        const { findEditFreight } = useFreightsStore();

        await Freight.createWithAttrs(freightOneAttrs);

        await Freight.createWithAttrs(freightTwoAttrs);

        expect(await findEditFreight(128397189371289)).toBeFalsy();
    });

    it('should assign keys to new item', async () => {
        const freightsStore = useFreightsStore();
        const { setNewFreightAttrs } = freightsStore;

        setNewFreightAttrs({
            cargoWeight: 2.44,
            contractor: 'Shimira e Peixola Fretes',
            agreedPayment: 4234.29,
        });

        expect(freightsStore.newFreight.cargoWeight).toEqual(2.44);
        expect(freightsStore.newFreight.agreedPayment).toEqual(4234.29);
        expect(freightsStore.newFreight.contractor).toEqual(
            'Shimira e Peixola Fretes'
        );
    });

    it('should assign keys to edit item', async () => {
        const freightsStore = useFreightsStore();
        const { setEditFreightAttrs } = freightsStore;

        setEditFreightAttrs({
            cargoWeight: 2.44,
            contractor: 'Shimira e Peixola Fretes',
            agreedPayment: 4234.29,
        });

        expect(freightsStore.editFreight.cargoWeight).toEqual(2.44);
        expect(freightsStore.editFreight.agreedPayment).toEqual(4234.29);
        expect(freightsStore.editFreight.contractor).toEqual(
            'Shimira e Peixola Fretes'
        );
    });

    it('should create freight using new item', async () => {
        const freightsStore = useFreightsStore();
        const { createFreight, setNewFreightAttrs } = freightsStore;

        const freightAttrs = {
            description: 'Created using new item',
            cargo: FreightCargo.LIQUID_BULK,
            status: FreightStatus.WAITING_UNLOAD,
            cargoWeight: '1.0',
            contractor: 'W.M Fretes',
            agreedPayment: '1450.25',
            startDate: '2023-06-05T02:53:26.213Z',
            distance: '1130.35',
            dueDate: null,
            finishedDate: null,
            originCountry: 'Brasil',
            originCity: 'Formosa',
            originState: 'GO',
            originLatitude: null,
            originLongitude: null,
            destinationCountry: 'Brasil',
            destinationCity: 'São José dos Campos',
            destinationState: 'SP',
            destinationLatitude: null,
            destinationLongitude: null,
        };

        setNewFreightAttrs(freightAttrs);

        mockApiPost.mockResolvedValueOnce({
            status: 201,
            headers: {},
            url: 'http://localhost:5000/truck-drivers',
            data: {},
        });

        const beforeCount = await Freight.count();

        await createFreight();

        const freight = await Freight.findOneBy({
            description: freightAttrs.description,
            cargo: freightAttrs.cargo,
            status: freightAttrs.status,
        });

        expect(await Freight.count()).toBe(beforeCount + 1);
        expect(freight?.hasId()).toBeTruthy();

        expect(mockApiPost).toHaveBeenCalledWith({
            url: '/',
            data: {
                description: freightAttrs.description,
                cargo: freightAttrs.cargo,
                status: freightAttrs.status,
                cargo_weight: parseFloat(freightAttrs.cargoWeight),
                contractor: freightAttrs.contractor,
                agreed_payment: parseFloat(freightAttrs.agreedPayment),
                start_date: freightAttrs.startDate,
                distance: parseFloat(freightAttrs.distance),
                origin_country: freightAttrs.originCountry,
                origin_city: freightAttrs.originCity,
                origin_state: freightAttrs.originState,
                destination_country: freightAttrs.destinationCountry,
                destination_city: freightAttrs.destinationCity,
                destination_state: freightAttrs.destinationState,
            },
        });
    });
});
