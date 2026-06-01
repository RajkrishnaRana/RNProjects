import { useEffect, useState } from 'react';
import { useAppSelector } from './typedReduxHooks';
import { postData } from '../services/apiServices';
import { ToastAndroid, Vibration } from 'react-native';
import { locationServices } from '../services/locationServices';
import { mmkv } from '../store/mmkvStorage';
import NetInfo from '@react-native-community/netinfo';

export const useDynamicForm = (data: Screen, navigation: any) => {
    // Services ----------------------------->
    const { captureLocation } = locationServices;

    // GLOBAL STATES --------------------------->
    const { userData, baseURL } = useAppSelector(state => state.auth);

    // LOCAL STATES ---------------------------->
    const [formState, setFormState] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('token', userData?.token);
        formData.append('formId', data.formId);
        formData.append('version', data.version);

        try {
            setLoading(true);

            for (let i = 0; i < data.formFields.length; i++) {
                const field = data.formFields[i];

                if (!formState[field.name] && field.required && field.visible) {
                    ToastAndroid.show(`Please give value for ${field.name}`, ToastAndroid.SHORT);
                    return;
                } else if (!formState[field.name] && field.auto) {
                    if (field.type === 'LOCATION') {
                        const { location } = await captureLocation();
                        formData.append(field.name, JSON.stringify(location));
                    }
                } else if (formState[field.name]) {
                    if (field.type === 'DATE') {
                        formData.append(field.name, formState[field.name].getTime().toString());
                    } else if (field.type === 'TEXT' || field.type === 'TEXT_DESCRIPTION') {
                        if (formState[field.name].length >= (field.min || 0) && formState[field.name].length <= (field.max || 2000)) {
                            formData.append(field.name, formState[field.name]);
                        } else {
                            ToastAndroid.show(
                                `Please give minimum of ${field.min} and maximum of ${field.max} characters for ${field.name}`,
                                ToastAndroid.SHORT,
                            );
                            return;
                        }
                    } else if (field.type === 'NUMBER') {
                        if (formState[field.name] < (field.min || 0) || formState[field.name] > (field.max || 10000000000)) {
                            ToastAndroid.show(`Please give ${field.name} value between ${field.min} and ${field.max}`, ToastAndroid.SHORT);
                            return;
                        } else {
                            formData.append(field.name, formState[field.name]);
                        }
                    } else if (field.type === 'CAMERA_IMAGE' || field.type === 'IMAGE') {
                        formData.append(field.name, {
                            uri: formState[field.name],
                            type: 'image/jpeg',
                            name: 'sample.jpg',
                        });
                    } else if (field.type === 'FILE') {
                        formData.append(field.name, {
                            uri: formState[field.name].uri,
                            type: formState[field.name].type,
                            name: formState[field.name].name,
                        });
                    } else if (field.type === 'MULTI_SELECT') {
                        const arr = formState[field.name].join(',');
                        formData.append(field.name, arr);
                    } else {
                        typeof formState[field.name] === 'string'
                            ? formData.append(field.name, formState[field.name])
                            : formData.append(field.name, JSON.stringify(formState[field.name]));
                    }
                }
            }

            console.log({ formState, formData, data });

            const url = `${baseURL}/submit-user-forms.json`;

            const state = await NetInfo.fetch();
            if (!state.isConnected) {
                const data = mmkv.getString('backgroundFormData');
                let backgroundFormData = data ? JSON.parse(data) : [];

                backgroundFormData.push(formData);
                mmkv.set('backgroundFormData', JSON.stringify(backgroundFormData));

                ToastAndroid.show('Form Successfully saved locally', ToastAndroid.SHORT);
            } else {
                const res = await postData(url, formData, true);
                if (!res.status) {
                    ToastAndroid.show(`${res.msg || 'Something went wrong'}`, ToastAndroid.SHORT);
                    throw new Error(res);
                }

                ToastAndroid.show('Form Successfully submitted', ToastAndroid.SHORT);
            }

            switch (data.postSubmit) {
                case 'RESET':
                    setFormState({});
                    break;

                case 'BACK':
                    setFormState({});
                    navigation.goBack();
                    break;

                default:
                    setFormState({});
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return {
        formState,
        setFormState,
        handleSubmit,
        loading,
    };
};
