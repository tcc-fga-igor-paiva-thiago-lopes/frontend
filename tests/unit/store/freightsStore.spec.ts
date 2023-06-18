import { setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import { EntityNotFoundError, TypeORMError } from 'typeorm';

const mockApiPost = jest.fn();
const mockApiPatch = jest.fn();
const mockApiDelete = jest.fn();

import { presentToast } from '@/utils/toast';
import { DatabaseHelper } from '../../databaseHelper';
import DatabaseCrudPlugin from '@/store/plugins/databaseCrud';
import { initialState as appInitialState } from '@/store/freights';
import {
    initialState as freightsInitialState,
    useFreightsStore,
} from '@/store/freights';

import { Freight, FreightCargo, FreightStatus } from '@/models/freight';

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

jest.mock('@/utils/toast');

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

const presentToastMock = presentToast as jest.Mock<any, any>;

beforeAll(async () => DatabaseHelper.instance.setupTestDB(mockDataSource));

afterAll(() => DatabaseHelper.instance.teardownTestDB());

describe('freightsStore', () => {
    beforeEach(() => {
        setActivePinia(
            createTestingPinia({
                stubActions: false,
                plugins: [DatabaseCrudPlugin],
                initialState: {
                    application: appInitialState(),
                    freights: freightsInitialState(),
                },
            })
        );

        presentToastMock.mockClear();
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

        expect(presentToastMock).toHaveBeenCalledTimes(1);
        expect(presentToastMock).toHaveBeenCalledWith(
            'Frete criado com sucesso!',
            'success'
        );

        expect(freightsStore.newFreight).toStrictEqual(
            freightsInitialState()._newItem
        );
    });

    it('should throw error in create freight when database insertion fails', async () => {
        const freightsStore = useFreightsStore();
        const { createFreight, setNewFreightAttrs } = freightsStore;

        const freightAttrs = {
            description: 'Created using new item',
            cargo: 'INVALID cargo',
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

        expect(() => createFreight()).rejects.toThrow(TypeORMError);
        expect(() => createFreight()).rejects.toThrow(
            'CHECK constraint failed: cargo'
        );
    });

    it('should remove freight using ID', async () => {
        const { removeFreight } = useFreightsStore();

        await Freight.createWithAttrs(freightTwoAttrs);

        const freight = await Freight.createWithAttrs(freightOneAttrs);

        // mockApiDelete.mockResolvedValueOnce({
        //     status: 200,
        //     headers: {},
        //     url: `http://localhost:5000/truck-drivers/${freight.id}`,
        //     data: {},
        // });

        await removeFreight(freight.id);

        expect(() => freight.reload()).rejects.toThrow(EntityNotFoundError);

        expect(presentToastMock).toHaveBeenCalledTimes(1);
        expect(presentToastMock).toHaveBeenCalledWith(
            'Frete removido com sucesso!',
            'success'
        );

        // expect(mockApiDelete).toHaveBeenCalledWith({ url: `/${freight.id}` });
    });

    it('should show error message when freight is not found', async () => {
        const { removeFreight } = useFreightsStore();

        await Freight.createWithAttrs(freightTwoAttrs);

        const freight = await Freight.createWithAttrs(freightOneAttrs);

        expect(() => removeFreight(128397189371289)).rejects.toThrow(
            'Not found'
        );

        expect(await Freight.findOneBy({ id: freight.id })).toBeTruthy();
    });

    // TODO: add test case to update

    it('should update freight using edit item', async () => {
        const freightsStore = useFreightsStore();
        const { updateFreight, findEditFreight, setEditFreightAttrs } =
            freightsStore;

        const freight = await Freight.createWithAttrs(freightOneAttrs);

        const newAttributes = {
            description: 'Mudando a descrição',
            contractor: 'Mudando contratante',
            cargoWeight: '788.33',
        };

        expect(await findEditFreight(freight.id)).toBeTruthy();

        setEditFreightAttrs(newAttributes);

        // mockApiPost.mockResolvedValueOnce({
        //     status: 200,
        //     headers: {},
        //     url: `http://localhost:5000/truck-drivers/${freight.id}`,
        //     data: {
        //         description: 'Mudando a descrição',
        //         contractor: 'Mudando contratante',
        //         cargo_weight: 788.33,
        //     },
        // });

        await updateFreight(freight.id);

        await freight.reload();

        expect(freight.description).toBe(newAttributes.description);
        expect(freight.contractor).toBe(newAttributes.contractor);
        expect(freight.cargoWeight).toBe(parseFloat(newAttributes.cargoWeight));

        // expect(mockApiPatch).toHaveBeenCalledWith({
        //     url: `/${freight.id}`,
        //     data: {
        //         description: 'Mudando a descrição',
        //         contractor: 'Mudando contratante',
        //         cargo_weight: 788.33,
        //     },
        // });

        expect(presentToastMock).toHaveBeenCalledTimes(1);
        expect(presentToastMock).toHaveBeenCalledWith(
            'Frete editado com sucesso!',
            'success'
        );

        expect(freightsStore.editFreight).toStrictEqual(
            freightsInitialState()._editItem
        );
    });

    // FIXME: for some reason this test fails with:
    // QueryFailedError: TypeError: The database connection is not open

    // it('should throw error in update freight when cargo is invalid', async () => {
    //     const freightsStore = useFreightsStore();
    //     const { updateFreight, findEditFreight, setEditFreightAttrs } =
    //         freightsStore;

    //     const freight = await Freight.createWithAttrs(freightOneAttrs);

    //     const newAttributes = {
    //         description: 'Mudando a descrição',
    //         contractor: 'Mudando contratante',
    //         cargoWeight: '788.33',
    //         cargo: 'não existe no enum',
    //     };

    //     expect(await findEditFreight(freight.id)).toBeTruthy();

    //     setEditFreightAttrs(newAttributes);

    //     expect(() => updateFreight(freight.id)).rejects.toThrow(TypeORMError);
    //     expect(() => updateFreight(freight.id)).rejects.toThrow(
    //         'CHECK constraint failed: cargo'
    //     );
    // });
});
