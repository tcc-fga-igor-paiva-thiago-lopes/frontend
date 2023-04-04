import { readonly, Ref, ref, UnwrapRef } from 'vue';

export function useState<T>(initialState: T): [Ref<T>, (newState: T) => void] {
    const state = ref<T>(initialState);

    const setState = (newState: T) => {
        state.value = newState as UnwrapRef<T>;
    };

    return [readonly(state) as Ref<T>, setState];
}
