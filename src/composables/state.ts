import { readonly, ref, UnwrapRef } from 'vue';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useState<T>(initialState: T): [T, (newState: T) => void] {
    const state = ref<T>(initialState);

    const setState = (newState: T) => {
        state.value = newState as UnwrapRef<T>;
    };

    return [readonly(state) as T, setState];
}
