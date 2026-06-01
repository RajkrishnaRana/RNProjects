interface Location {
    latitude: number;
    longitude: number;
    accuracy?: number;
}

type FormFields = {
    name: string;
    type: string;
    display: string;
    required: boolean;
    visible: boolean;
    auto: boolean;
    options?: string;
    min?: number;
    max?: number;
};

type Screen = {
    formFields: FormFields[];
    name: string;
    postSubmit: string;
    version: number;
    formId: string;
};
