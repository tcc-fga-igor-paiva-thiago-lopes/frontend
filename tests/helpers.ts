import { DOMWrapper } from '@vue/test-utils';

export const getCSSProperty = (elWrapper: DOMWrapper<Element>, prop: string) =>
    getComputedStyle(elWrapper.element).getPropertyValue(prop);

export const environmentVariablesWrapper = async (
    variables: Record<string, any>,
    callback: () => any
) => {
    const prevEnv = { ...process.env };

    process.env = { ...process.env, ...variables };

    await callback();

    process.env = prevEnv;
};
