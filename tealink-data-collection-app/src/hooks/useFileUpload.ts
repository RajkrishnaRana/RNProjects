import { DocumentPickerResponse, pick } from '@react-native-documents/picker';

export const useFileUpload = (setValue: (value: DocumentPickerResponse) => void) => {
    const handleFileUpload = async () => {
        const doc = await pick();
        if (!doc) return;
        setValue(doc[0]);
    };

    return { handleFileUpload };
};
