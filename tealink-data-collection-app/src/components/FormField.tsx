import React from 'react';
import TextField from './TextField';
import ToggleSwitch from './ToggleSwitch';
import CameraModule from './CameraModule';
import DatePicker from './DatePicker';
import CustomDropdown from './Dropdown/CustomDropdown';
import CustomMultiselect from './Dropdown/CustomMultiselect';
import LocationView from './LocationView';
import FileModule from './FileModule';
import MultipleSelectList from './Dropdown/MultipleSelectList';

export const FormField = {
    TEXT_DESCRIPTION: ({ label, data, state, setState }: any) => (
        <TextField
            label={label}
            value={state}
            isNecessary={data?.required}
            onChangeText={setState}
            placeholder={`Enter ${data?.name}`}
            numberOfLines={3}
            maxLen={data?.max}
        />
    ),
    TOGGLE: ({ label, data, state, setState }: any) => <ToggleSwitch label={label} state={state} setState={setState} isNecessary={data?.required} />,
    SELECT: ({ label, data, state, setState }: any) => (
        <CustomDropdown label={label} data={data?.options} value={state} setValue={setState} isNecessary={data?.required} />
    ),
    MULTI_SELECT: ({ label, data, state, setState }: any) => (
        <MultipleSelectList label={label} data={data?.options} value={state} setSelected={setState} isNecessary={data?.required} maxHeight={200} />
    ),
    LOCATION: ({ label, data, state, setState }: any) => (
        <LocationView label={label} value={state} setValue={setState} isNecessary={data?.required} />
    ),
    CAMERA_IMAGE: ({ label, data, state, setState }: any) => {
        return <CameraModule label={label} image={state} isNecessary={data?.required} setImage={setState} />;
    },
    IMAGE: ({ label, data, state, setState }: any) => {
        return <CameraModule label={label} image={state} isNecessary={data?.required} setImage={setState} />;
    },
    TEXT: ({ label, data, state, setState }: any) => (
        <TextField
            label={label}
            value={state}
            isNecessary={data?.required}
            onChangeText={setState}
            placeholder={`Enter ${data?.name}`}
            maxLen={data?.max}
        />
    ),
    DATE: ({ label, data, state, setState }: any) => (
        <DatePicker
            label={label}
            date={state}
            setDate={setState}
            isNecessary={data?.required}
            minDate={data?.min && new Date(data?.min)}
            maxDate={data?.max && new Date(data?.max)}
        />
    ),
    NUMBER: ({ label, data, state, setState }: any) => (
        <TextField
            label={label}
            value={state}
            isNecessary={data?.required}
            onChangeText={setState}
            placeholder={`Enter ${data?.name}`}
            keyboardTypes="numeric"
        />
    ),
    FILE: ({ label, data, state, setState }: any) => <FileModule label={label} file={state} isNecessary={data?.required} setFile={setState} />,
};
