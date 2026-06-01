import {ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../../../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {BASE_URL} from '../../../config';
import {postData} from '../../../api';
import Toast from 'react-native-simple-toast';
import {useAuthStore} from '../../../store/authStore';
import CustomDropdown from '../../CustomDropdown';
import {queryClient} from '../../../../App';

interface ChangeLabDataType {
    _id: string;
    labName: string;
    distance: string;
}

export default function SelectedLabCard({item, data}: {item: LabBookingType; data: any}) {
    // GLOBAL STATES ---------------------------->
    const {token} = useAuthStore();

    // LOCAL STATES ---------------------------->
    const [changeLabData, setChangeLabData] = useState<ChangeLabDataType[]>();
    const [selectedChangeLab, setSelectedChangeLab] = useState<ChangeLabDataType>();
    const [loading, setLoading] = useState(false);

    // LOCAL FUNCTIONS ----------------------------->
    const handleChangeLab = async () => {
        const url = `${BASE_URL}/hru/Patientappapi/patientfetchlabcorchange`;
        const payload = {
            token: token,
            cartData: data?.cartData,
        };

        try {
            const res = await postData(url, payload);

            if (!res.status) {
                Toast.show(res.msg, Toast.SHORT);
                throw new Error(res.msg);
            }

            console.log('change lab', res);
            const updatedDocs = res?.docs?.map((doc: ChangeLabDataType) => {
                return {
                    ...doc,
                    name: `${doc?.labName} - ${doc?.distance} K.M`,
                };
            });
            setChangeLabData(updatedDocs);
        } catch (error) {
            console.error(error);
        }
    };

    const changleLabSubmit = async () => {
        const url = `${BASE_URL}/hru/Patientappapi/patientchangelab`;
        const payload = {
            token: token,
            cartData: data?.cartData,
            selectedLab: selectedChangeLab?._id,
        };
        console.log('payload for change lab', payload);

        try {
            setLoading(true);
            const res = await postData(url, payload);

            if (!res.status) {
                Toast.show(res.msg, Toast.SHORT);
                throw new Error(res.msg);
            }

            Toast.show(res.msg, Toast.SHORT);

            queryClient.invalidateQueries({
                queryKey: ['CartData'],
            });

            setChangeLabData(undefined);
            setSelectedChangeLab(undefined);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={{fontSize: wp(3.5), color: colors.grey}}>Selected Lab</Text>

            <View style={styles.detailsContainer}>
                <View style={styles.labNameContainer}>
                    {item?.labDetails?.labProfileImgPath ? (
                        <Image style={styles.image} src={item?.labDetails?.labProfileImgPath} />
                    ) : (
                        <LinearGradient colors={['orange', 'orange', 'yellow']} style={[styles.image, styles.placeholder]}>
                            <Text style={styles.labPlaceHolderChar}>{item?.labDetails?.labName?.charAt(0).toUpperCase()}</Text>
                        </LinearGradient>
                    )}
                    <View style={{gap: hp(0.3)}}>
                        <Text style={styles.labName}>{item?.labDetails?.labName}</Text>
                        <Text style={{fontSize: wp(3.5), color: colors.darkGrey}}>Laboratory</Text>
                    </View>
                </View>

                {!changeLabData && (
                    <TouchableOpacity onPress={handleChangeLab}>
                        <Text style={styles.labChangeText}>Change Lab</Text>
                    </TouchableOpacity>
                )}

                {selectedChangeLab && (
                    <TouchableOpacity onPress={changleLabSubmit} style={styles.doneButton}>
                        {loading ? (
                            <ActivityIndicator color={colors.primary} size={wp(4)} />
                        ) : (
                            <Text style={[styles.labChangeText, {color: colors.primary}]}>Done</Text>
                        )}
                    </TouchableOpacity>
                )}
            </View>

            {changeLabData && (
                <View style={{marginTop: hp(2)}}>
                    <CustomDropdown
                        customDropdownStyle={styles.customDropdownStyle}
                        customSelectedTextStyle={styles.customSelectedTextStyle}
                        customPlaceholder="-- Select a Lab -- "
                        data={changeLabData}
                        label={null}
                        mode={true}
                        value={selectedChangeLab?._id}
                        setValue={setSelectedChangeLab}
                        customLabelField="name" // Define the field in data representing the label
                        customValueField="_id" // Define the field in data representing the value
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        elevation: 2,
        borderRadius: wp(3),
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(4),
        marginHorizontal: wp(3),
        // marginBottom: hp(2),

        //Shadow for IOS
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp(1),
    },
    labNameContainer: {
        flexDirection: 'row',
        gap: wp(3),
        alignItems: 'center',
    },
    image: {
        width: wp(15),
        height: wp(15),
        borderRadius: wp(10),
    },
    placeholder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    labPlaceHolderChar: {
        fontSize: wp(6),
        fontWeight: 'bold',
        color: colors.black,
    },
    labName: {
        color: colors.black,
        fontWeight: 'bold',
        fontSize: wp(4.5),
        width: wp(48),
    },
    labChangeText: {
        color: colors.red,
        fontWeight: 'bold',
        fontSize: wp(3.5),
    },
    customDropdownStyle: {
        width: wp(85),
        paddingVertical: hp(1),
        // borderWidth: 1,
        // borderColor: colors.darkBlue,
        backgroundColor: colors.blueWhite,
        borderRadius: wp(5),
        paddingHorizontal: wp(2),
    },
    customSelectedTextStyle: {
        color: colors.darkBlue,
        fontWeight: 'bold',
        fontSize: wp(3.7),
    },
    doneButton: {
        width: wp(20),
        backgroundColor: colors.white,
        borderWidth: wp(0.001),
        elevation: 2,
        alignItems: 'center',
        paddingVertical: hp(0.5),
        borderRadius: wp(2),
    },
});
