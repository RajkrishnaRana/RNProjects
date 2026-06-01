import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { getName, imageSelector } from '../../utils';
import { BASE_URL } from '../../config';
import { colors } from '../../common/colors';
import IconText from '../IconText';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { isTab } from '../../utils/isTab';

interface Registration {
    regAuthority: string;
    regNo: string;
    registrationImg: string;
    regCertificate: string;
    status: number;
    acceptOrRejectRef: string;
    ip: string;
    verifiedAt: string; // ISO-8601 date string
    verifiedBy: string; // ObjectId as string
}

interface Props {
    data: {
        _id: string;
        firstName: string;
        middleName: string;
        lastName: string;
        doctorType: string;
        clinicName: string;
        registrations: Registration[];
        mobileNumber: string;
        hruId: string;
        addressLineOne: string;
        addressCity: string;
        addressState: string;
        addressPin: number;
        profileImg: { name: string; path: string };
        imgUrl: { name: string; path: string };
        email: string;
        dob: string;
    };
    type: 'doctor' | 'patient';
}

export default function DoctorOrPatientCard({ data, type }: Props) {
    return (
        <View style={styles.container}>
            <Image
                source={imageSelector(
                    `${BASE_URL}/show-uploaded.image?path=${type === 'doctor' ? data?.profileImg?.path : data?.imgUrl?.path}`,
                    'MALE',
                )}
                style={{ height: wp(12), width: wp(12), borderRadius: wp(10) }}
            />

            <View>
                <Text style={styles.name}>{getName(data?.firstName, data?.middleName, data?.lastName, data?.doctorType)}</Text>
                {type === 'doctor' ? (
                    <>
                        <View style={{ flexDirection: 'row', gap: wp(5) }}>
                            <IconText index={4} text={data?.mobileNumber} />
                            <IconText index={2} text={data?.hruId} />
                            <IconText index={2} text={data?.registrations[0]?.regNo} />
                        </View>
                        <IconText
                            index={3}
                            text={data?.addressLineOne?.length > 40 ? data?.addressLineOne?.slice(0, 40) + '...' : data?.addressLineOne || '. . .'}
                            customTextStyles={{ width: wp(60) }}
                        />
                    </>
                ) : (
                    <>
                        <View style={{ flexDirection: 'row', gap: wp(5) }}>
                            <IconText index={4} text={data?.mobileNumber} />
                            <IconText index={2} text={data?.hruId} />
                            <IconText
                                customLogo={
                                    <FontAwesome5Icon
                                        name="birthday-cake"
                                        size={isTab ? wp(3) : wp(4)}
                                        style={{ marginHorizontal: wp(0.5) }}
                                        color={colors.primary}
                                    />
                                }
                                text={data?.dob}
                                customStyles={{ width: isTab ? wp(10) : wp(15) }}
                            />
                        </View>
                        <IconText index={13} text={data?.email} />
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(3),
    },
    name: {
        fontSize: wp(4),
        fontWeight: 'bold',
        color: colors.black,
    },
});
