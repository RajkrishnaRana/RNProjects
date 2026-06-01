import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import BigButton from '../BigButton';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import { colors } from '../../common/colors';
import TextField from '../TextField';
import { DocumentPickerResponse, pick } from '@react-native-documents/picker';
import Toast from 'react-native-simple-toast';
import FileViewCard from '../Cards/FileViewCard';
import { BASE_URL } from '../../config';
import { getName } from '../../utils';
import { useAuthStore } from '../../store/authStore';
import { postData } from '../../api';
import { queryClient } from '../../../App';
import { isTab } from '../../utils/isTab';

export default function RaiseDisputeModal({ data, id }: { data: any; id: string }) {
    console.log({ data, id });

    // GLOBAL STATES ---------------------------------->
    const { token } = useAuthStore();

    // LOCAL STATES ----------------------------------->
    const [isVisible, setIsVisible] = useState(false);
    const [description, setDescription] = useState<string | undefined>();
    const [doc, setDoc] = useState<DocumentPickerResponse[]>([]);
    const [loading, setLoading] = useState(false);

    // LOCAL FUNCTIONS ------------------------------>
    async function fileUpload() {
        try {
            const doc = await pick({});
            setDoc(doc);
        } catch (error) {
            Toast.show('No Documents Selected', Toast.SHORT);
            console.log(error);
        }
    }

    const handlePress = async () => {
        try {
            setLoading(true);
            const url = `${BASE_URL}/hru/Patientappapi/raisedispute`;
            const payload = {
                appointmentId: id,
                complainAgainst: 'HRU',
                disputeDescription: description,
                disputeRaisedBy: getName(
                    data?.patientDetails?.firstName,
                    data?.patientDetails?.middleName,
                    data?.patientDetails?.lastName,
                    data?.patientDetails?.prefix,
                ),
            };

            const formData = new FormData();
            formData.append('formData', JSON.stringify(payload));
            formData.append('token', token);

            for (let i = 0; i < doc?.length; i++) {
                formData.append('disputeFile', {
                    uri: doc[i].uri,
                    type: doc[i].type,
                    name: doc[i].name,
                });
            }

            formData.append('uploadCount', doc?.length);

            const res = await postData(url, formData, true);
            if (!res.status) {
                Toast.show('Failed to raise dispute', Toast.SHORT);
                return;
            }

            console.log('RaiseDispute ------------->', res);
            // Toast.show('Patient Dispute Raised', Toast.SHORT);

            queryClient.invalidateQueries({
                queryKey: ['disputeList'],
            });
            queryClient.invalidateQueries({
                queryKey: ['appointMentDetailsData' + id],
            });

            // setIsVisible(false);
            Toast.show('Dispute raised successfully', Toast.SHORT);
        } catch (error) {
            Toast.show('Failed to raise dispute', Toast.SHORT);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <BigButton
                title="Raise Dispute"
                onPress={() => setIsVisible(true)}
                customStyle={{
                    width: wp(40),
                    marginTop: hp(1),
                }}
                customTextStyle={{ fontSize: isTab ? wp(2.5) : wp(4) }}
            />

            <Modal
                isVisible={isVisible}
                animationIn={'fadeInUp'}
                animationOut={'fadeOutDown'}
                onBackdropPress={() => setIsVisible(false)}
                style={styles.modal}
            >
                <View style={styles.container}>
                    <View style={{ gap: isTab ? hp(0.5) : hp(1) }}>
                        <Image
                            source={require('../../assets/icons/resolution.png')}
                            style={{
                                height: isTab ? wp(9) : wp(15),
                                width: isTab ? wp(9) : wp(15),
                                alignSelf: 'center',
                                marginBottom: hp(1),
                            }}
                        />
                        <Text style={{ color: colors.black, fontWeight: 'bold', fontSize: isTab ? wp(2.5) : wp(4.2), textAlign: 'center' }}>
                            Raise Dispute
                        </Text>
                        <Text
                            style={{
                                fontSize: isTab ? wp(2) : wp(3.2),
                                color: colors.darkGrey,
                                marginBottom: isTab ? hp(2) : hp(3),
                                textAlign: 'center',
                            }}
                        >
                            Let us know your concerns.
                        </Text>
                    </View>

                    <TextField
                        label="Dispute Reason : "
                        placeholder="Enter Dispute Reason"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLine={4}
                        customTextInputContainerStyle={{ height: hp(10) }}
                    />

                    {doc?.length > 0 && (
                        <View
                            style={{
                                marginTop: hp(2),
                                gap: hp(0.5),
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: wp(3.5),
                                    fontWeight: 'bold',
                                    color: colors.darkBlue,
                                }}
                            >
                                Attached File :{' '}
                            </Text>
                            <FileViewCard
                                item={doc[0]}
                                onPress={() => {
                                    setDoc([]);
                                }}
                            />
                        </View>
                    )}

                    <View style={styles.buttonContainer}>
                        <BigButton
                            title="Attach File"
                            onPress={fileUpload}
                            customStyle={styles.button}
                            customTextStyle={{ fontSize: isTab ? wp(2.5) : wp(3.5) }}
                        />
                        <BigButton
                            title="Submit"
                            onPress={handlePress}
                            customStyle={styles.button}
                            customTextStyle={{ fontSize: isTab ? wp(2.5) : wp(3.5) }}
                            loading={loading}
                        />
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    modal: {},
    container: {
        backgroundColor: colors.white,
        borderRadius: wp(3),
        paddingVertical: hp(2),
        paddingHorizontal: wp(4),
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: hp(1),
    },
    button: {
        width: wp(30),
        paddingVertical: hp(1),
        marginTop: hp(1.5),
    },
});
