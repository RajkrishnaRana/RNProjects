import { Alert, StyleSheet, View } from 'react-native';
import React from 'react';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RootStackParamList } from '../types/routeTypes';
import { RouteProp, useRoute } from '@react-navigation/native';
import Pdf from 'react-native-pdf';
import BigButton from '../components/BigButton';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import UnderConstructionModal from '../components/Modal/UnderConstructionModal';
import { postData } from '../api';
import { useAuthStore } from '../store/authStore';
import { BASE_URL } from '../config';
import { useNavigation } from '../hooks/useNavigation';
import Toast from 'react-native-simple-toast';

type PdfViewScreenRouteProp = RouteProp<RootStackParamList, 'PDFView'>;

export default function PdfViewScreen() {
    const { fileUrl, type, _id } = useRoute<PdfViewScreenRouteProp>().params;
    const { token } = useAuthStore();
    const navigation = useNavigation();

    // LOCAL STATES ----------------------->
    const [isVisible, setIsVisible] = React.useState(false);
    const [labLoading, setLabLoading] = React.useState(false);

    const experimentToast = () => {
        setIsVisible(true);
    };

    const handleOrderLab = async () => {
        const url = `${BASE_URL}/hru/Patientappapi/digitalprescriptiondetails?id=${_id}`;

        try {
            setLabLoading(true);
            const res = await postData(url, { token });

            if (res.status === false) {
                Toast.show(res.msg, Toast.LONG);
                throw new Error(res.msg);
            }

            navigation.push('OrderLabFromPrescription', { data: res.doc });
        } catch (error) {
            console.error(error);
        } finally {
            setLabLoading(false);
        }
    };

    return (
        <>
            <View style={styles.bodyContainer}>
                <Pdf
                    source={{ uri: fileUrl }}
                    onError={error => {
                        Alert.alert('Error', 'Failed to load PDF', [
                            {
                                text: 'OK',
                                onPress: () => navigation.goBack(),
                            },
                        ]);
                        console.log(error);
                    }}
                    style={styles.pdf}
                />
            </View>

            {type === 'DigitalPrescription' && (
                <View style={styles.buttonContainer}>
                    <BigButton title="Order Medicine" onPress={experimentToast} customStyle={styles.customButtonStyle} />
                    <BigButton title="Order Lab" onPress={handleOrderLab} customStyle={styles.customButtonStyle} loading={labLoading} />
                </View>
            )}

            <UnderConstructionModal isVisible={isVisible} setIsVisible={setIsVisible} />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bodyContainer: {
        marginTop: hp(1),
        flex: 1,
    },
    pdf: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: hp(2),
    },
    customButtonStyle: { width: wp(40), marginTop: 0 },
});
