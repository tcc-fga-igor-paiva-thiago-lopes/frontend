import { TypeORMError } from 'typeorm';

import { presentToast } from '@/utils/toast';

export type InMemberOperationParams<Clazz, IAttrs> = {
    findAttrs: IAttrs;
    successMsg: string;
    errorMsg: string;
    findFunc: (attrs: IAttrs) => Promise<Clazz | null>;
    actionFunc: (instance: Clazz) => Promise<any>;
};

export type GeneralOperationParams = {
    successMsg: string;
    errorMsg: string;
    actionFunc: () => Promise<any>;
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

        const ret = await actionFunc(instance);

        presentToast(successMsg, 'success');

        return ret;
    } catch (error) {
        console.error(error);

        if ((error as { message: string }).message === 'Not found') throw error;

        if (error instanceof TypeORMError) throw error;

        presentToast(errorMsg, 'danger');
    }

    return null;
};

export const generalOperation = async ({
    successMsg,
    errorMsg,
    actionFunc,
}: GeneralOperationParams) => {
    try {
        const ret = await actionFunc();

        presentToast(successMsg, 'success');

        return ret;
    } catch (error) {
        console.error(error);

        if (error instanceof TypeORMError) throw error;

        presentToast(errorMsg, 'danger');
    }

    return null;
};
