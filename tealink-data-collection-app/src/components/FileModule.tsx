import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors } from '../common/colors';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import { useFileUpload } from '../hooks/useFileUpload';
import { DocumentPickerResponse } from '@react-native-documents/picker';

type Props = {
    label: string;
    isNecessary?: boolean;
    file: DocumentPickerResponse | undefined;
    setFile: (value: DocumentPickerResponse) => void;
};

export default function FileModule({ label, isNecessary, file, setFile }: Props) {
    const { handleFileUpload } = useFileUpload(setFile);

    return (
        <View style={{ gap: hp(0.5) }}>
            {label && (
                <Text style={styles.label}>
                    {label} {isNecessary && <Text style={{ color: 'red' }}>*</Text>}
                </Text>
            )}

            <View style={{ flexDirection: 'row', gap: wp(3), alignItems: 'center' }}>
                {file && (
                    <View style={{ width: wp(70) }}>
                        <Text style={[styles.camContainer, { textAlign: 'center', color: colors.black, fontSize: wp(3.5) }]}>
                            {file.name && file.name.length > 30 ? `${file.name.slice(0, 30)}...` : file.name}
                        </Text>
                    </View>
                )}
                <TouchableOpacity style={styles.camContainer} onPress={handleFileUpload}>
                    {!file && <Text style={{ color: 'grey' }}>Tap to Select File</Text>}
                    <FontAwesome6Icon name="file-circle-plus" size={wp(4.5)} color="grey" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: wp(3.5),
        color: colors.green,
        fontWeight: '600',
    },
    camContainer: {
        backgroundColor: 'white',
        paddingVertical: hp(1),
        borderRadius: wp(3),
        alignItems: 'center',
        elevation: 2,
        flexDirection: 'row',
        gap: wp(2),
        flex: 1,
        justifyContent: 'center',
    },
});
