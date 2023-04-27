import { Ref } from 'vue';

export type ValidationErrors = Record<string, string[]>;

export interface ErrorResponseData {
    message: string;
    errors?: ValidationErrors;
}

export type FieldData = {
    value: any;
    field: string;
    fieldRef: Ref<any>;
};

type AddErrorArgument = {
    validationErrors: ValidationErrors;
    field: string;
    errorMessages: string[];
    fieldRef: Ref<any>;
    overwriteErrors?: boolean;
};

type AddErrorsArgument = {
    validationErrors: ValidationErrors;
    errorMessages: Record<string, string[]>;
    fieldRefs: Record<string, Ref<any>>;
    overwriteErrors?: boolean;
};

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

export const assignValidationErrorsFromResponse = (
    validationErrors: ValidationErrors,
    errorResponse: ErrorResponseData,
    fieldRefs: Record<string, Ref<any>>
) => {
    Object.assign(validationErrors, getValidationErrors(errorResponse));

    addErrorClassToFields(validationErrors, fieldRefs);
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

export const removeValidationClasses = (fieldRef: Ref<any>) => {
    fieldRef.value.$el.classList.remove('ion-valid');
    fieldRef.value.$el.classList.remove('ion-invalid');
};

export const addErrorClassToField = (fieldRef: Ref<any>) => {
    removeValidationClasses(fieldRef);

    fieldRef.value.$el.classList.add('ion-invalid');
};

export const addValidClassToField = (fieldRef: Ref<any>) => {
    removeValidationClasses(fieldRef);

    fieldRef.value.$el.classList.add('ion-valid');
};

export const clearFieldErrors = (
    fieldRef: Ref<any>,
    field?: string,
    validationErrors?: ValidationErrors
) => {
    addValidClassToField(fieldRef);

    if (validationErrors && field) validationErrors[field] = [];
};

export const clearFieldsErrors = (
    fieldRefs: Record<string, Ref<any>>,
    validationErrors?: ValidationErrors
) => {
    Object.values(fieldRefs).forEach((fieldRef) => {
        addValidClassToField(fieldRef);
    });

    if (validationErrors) validationErrors = {};
};

export const createOrPushError = (
    validationErrors: ValidationErrors,
    field: string,
    errorMsg: string[]
) => {
    if (validationErrors[field]) {
        validationErrors[field] = [...validationErrors[field], ...errorMsg];
    } else {
        validationErrors[field] = [...errorMsg];
    }
};

export const validateRequiredFields = (
    validationErrors: ValidationErrors,
    fields: Record<string, any>,
    fieldRefs: Record<string, Ref<any>>
) => {
    let hasError = false;

    Object.entries(fields).forEach(([field, value]) => {
        if (!value) {
            addErrorToField({
                validationErrors,
                field,
                errorMessages: ['Campo obrigatório'],
                fieldRef: fieldRefs[field],
            });

            hasError = true;
        }
    });

    return !hasError;
};

export const addErrorToFields = ({
    validationErrors,
    errorMessages,
    fieldRefs,
    overwriteErrors = false,
}: AddErrorsArgument) => {
    Object.entries(errorMessages).forEach(([field, messages]) => {
        addErrorToField({
            validationErrors,
            field,
            errorMessages: messages,
            fieldRef: fieldRefs[field],
            overwriteErrors,
        });
    });
};

export const addErrorToField = ({
    validationErrors,
    field,
    errorMessages,
    fieldRef,
    overwriteErrors = false,
}: AddErrorArgument) => {
    if (overwriteErrors) validationErrors[field] = errorMessages;
    else createOrPushError(validationErrors, field, errorMessages);

    addErrorClassToField(fieldRef);
};

export const validateField = (
    fieldData: FieldData,
    validationFunc: (value: any) => string[],
    validationErrors?: ValidationErrors
) => {
    const { value, field, fieldRef } = fieldData;

    if (validationErrors) validationErrors[field] = [];

    const errorMessages = validationFunc(value);

    errorMessages.length
        ? addErrorToField({
              validationErrors: validationErrors || {},
              field,
              errorMessages,
              fieldRef,
          })
        : clearFieldErrors(fieldRef, field, validationErrors);

    return !errorMessages.length;
};
