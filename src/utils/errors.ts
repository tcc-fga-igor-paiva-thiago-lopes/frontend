import { Ref } from 'vue';

export type ValidationErrors = Record<string, string[]>;

export interface ErrorResponseData {
    message: string;
    errors?: ValidationErrors;
}

const isObjectEmpty = (errors?: ValidationErrors) =>
    Object.keys(errors || {}).length === 0;

const toCamelCase = (str: string) =>
    str.replace(/(_\w)/g, (k) => k[1].toUpperCase());

const objectKeysToCamelCase = (responseErrors: ValidationErrors) => {
    const newObj: ValidationErrors = {};

    Object.keys(responseErrors).forEach((key) => {
        newObj[key.replace(/(_\w)/g, (k) => k[1].toUpperCase())] =
            responseErrors[key];
    });

    return newObj;
};

export const getValidationErrors = (errorResponse: ErrorResponseData) => {
    if (isObjectEmpty(errorResponse.errors)) return {};

    return objectKeysToCamelCase(errorResponse.errors || {});
};

export const displayValidationErrors = (
    validationErrors: ValidationErrors,
    key: string,
    defaultMsg: string
) => (validationErrors[key] || [defaultMsg]).join('\n');

export const addErrorClassToFields = (
    validationErrors: ValidationErrors,
    fieldRefs: Record<string, Ref<any>>
) => {
    Object.keys(validationErrors).forEach((key) => {
        const fieldKey = toCamelCase(key);

        fieldRefs[fieldKey].value.$el.classList.remove('ion-valid');
        fieldRefs[fieldKey].value.$el.classList.remove('ion-invalid');

        if (validationErrors[fieldKey]?.length) {
            fieldRefs[fieldKey].value.$el.classList.add('ion-invalid');
        }
    });
};

export const addErrorClassToField = (fieldRef: Ref<any>) => {
    fieldRef.value.$el.classList.remove('ion-valid');
    fieldRef.value.$el.classList.remove('ion-invalid');

    fieldRef.value.$el.classList.add('ion-invalid');
};

export const addValidClassToField = (fieldRef: Ref<any>) => {
    fieldRef.value.$el.classList.remove('ion-valid');
    fieldRef.value.$el.classList.remove('ion-invalid');

    fieldRef.value.$el.classList.add('ion-valid');
};

export const clearFieldErrors = (
    fieldRef: Ref<any>,
    field?: string,
    validationErrors?: ValidationErrors
) => {
    fieldRef.value.$el.classList.remove('ion-valid');
    fieldRef.value.$el.classList.remove('ion-invalid');

    if (validationErrors && field) validationErrors[field] = [];
};

export const clearFieldsErrors = (
    fieldRefs: Record<string, Ref<any>>,
    validationErrors?: ValidationErrors
) => {
    Object.values(fieldRefs).forEach((fieldRef) => {
        fieldRef.value.$el.classList.remove('ion-valid');
        fieldRef.value.$el.classList.remove('ion-invalid');
    });

    if (validationErrors) validationErrors = {};
};

export const createOrPushError = (
    validationErrors: ValidationErrors,
    field: string,
    errorMsg: string
) => {
    if (validationErrors[field]) {
        validationErrors[field].push(errorMsg);
    } else {
        validationErrors[field] = [errorMsg];
    }
};

export const validateRequiredFields = (
    validationErrors: ValidationErrors,
    fields: Record<string, any>,
    fieldRefs?: Record<string, Ref<any>>
) => {
    let hasError = false;

    Object.entries(fields).forEach(([field, value]) => {
        if (!value) {
            createOrPushError(validationErrors, field, 'Campo obrigatório');

            if (fieldRefs) addErrorClassToField(fieldRefs[field]);

            hasError = true;
        }
    });

    return !hasError;
};

export const addErrorToFields = (
    validationErrors: ValidationErrors,
    fields: string[],
    errorMessages: string | Record<string, string>,
    fieldRefs: Record<string, Ref<any>>
) => {
    fields.forEach((field) => {
        const errorMessage =
            typeof errorMessages === 'string'
                ? errorMessages
                : errorMessages[field];

        addErrorToField(
            validationErrors,
            field,
            errorMessage,
            fieldRefs[field]
        );
    });
};

export const addErrorToField = (
    validationErrors: ValidationErrors,
    field: string,
    errorMsg: string,
    fieldRef: Ref<any>
) => {
    createOrPushError(validationErrors, field, errorMsg);

    addErrorClassToField(fieldRef);
};
