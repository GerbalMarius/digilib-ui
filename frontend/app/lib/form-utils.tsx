

export interface RegisterFormValues  {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  adminCode?: string;
};

export interface LoginFormValues {
    email : string;
    password : string;
}

export type FieldDescriptor<T> = {
    key?: string;

    parse?: (value: string) => T;

    optional?: boolean;
};


export function parseFormData<T extends Record<string, any>>(

    formData: FormData,

    schema: { [K in keyof T]: FieldDescriptor<T[K]> }
) {

    const result: any = {}

    for (const prop in schema) {

        const config = schema[prop];
        const formKey = config.key ?? prop;
        const raw = formData.get(formKey);

        if (raw == null || raw === "") {
            if (config.optional) {
                result[prop] = undefined;
                continue;
            }
            throw new Error(`Missing required form field "${formKey}"`);
        }

        const valueStr = String(raw);

        result[prop] = config.parse ? config.parse(valueStr) : valueStr;
    }
    return result as T
}