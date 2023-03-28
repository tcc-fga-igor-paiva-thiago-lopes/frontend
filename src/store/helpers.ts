import { presentToast } from '@/utils/toast';

export type InMemberOperationParams<Clazz, IAttrs> = {
    findAttrs: IAttrs;
    successMsg: string;
    errorMsg: string;
    findFunc: (attrs: IAttrs) => Promise<Clazz | null>;
    actionFunc: (instance: Clazz) => Promise<any>;
};

export const inMemberOperation = async <Clazz, IAttrs>({
    findAttrs,
    successMsg,
    errorMsg,
    findFunc,
    actionFunc,
}: InMemberOperationParams<Clazz, IAttrs>) => {
    try {
        const instance = await findFunc(findAttrs);

        if (!instance) throw Error('Not found');

        await actionFunc(instance);

        presentToast(successMsg, 'success');
    } catch (e) {
        if ((e as { message: string }).message === 'Not found') throw e;

        presentToast(errorMsg, 'danger');
    }
};
