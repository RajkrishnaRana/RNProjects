import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../types/routeTypes';
import BackgroundGradient from '../components/BackgroundGradient';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import moment from 'moment-timezone';
import DoctorOrPatientCard from '../components/Cards/DoctorOrPatientCard';
import MedicalRecordCard from '../components/Cards/MedicalRecordCard';
import {useOrderLabFromPrescription} from '../hooks/useOrderLabFromPrescription';

type OrderLabFromPrescriptionScreenRouteProp = RouteProp<RootStackParamList, 'OrderLabFromPrescriptionScreen'>;

export default function OrderLabFromPrescriptionScreen() {
    const {data} = useRoute<OrderLabFromPrescriptionScreenRouteProp>().params;
    console.log(data);

    const {handleOrderLab} = useOrderLabFromPrescription(data);

    return (
        <BackgroundGradient>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                {/* Header Section */}
                <LinearGradient colors={[colors.darkBlue, '#0a7fc3ff']} style={styles.header}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={styles.headerDetailText}>
                            P No: <Text style={{fontWeight: 'bold'}}>{data.prescriptionNo}</Text>
                        </Text>
                        <Text style={styles.headerDetailText}>{moment.tz(data.prescriptionDate, 'Asia/Kolkata').format('Do MMM, YYYY hh:mm A')}</Text>
                    </View>
                </LinearGradient>

                <View style={styles.doctorPatientCard}>
                    <DoctorOrPatientCard data={data.patientDetails} type="patient" />
                    <View style={styles.breakLine} />
                    <DoctorOrPatientCard data={data.doctorDetails} type="doctor" />
                </View>

                {/* Details Section */}
                <View style={{gap: hp(1)}}>
                    {data?.complaint && <MedicalRecordCard header="📄 Complaints" details={data?.complaint} />}
                    {data?.diagnosis && <MedicalRecordCard header="🔬 Diagnosis" details={data?.diagnosis} />}

                    {data?.procedures && <MedicalRecordCard header="⚕️ Procedures" details={data?.procedures} />}
                    {data?.specialist && <MedicalRecordCard header="🧑‍⚕️ Refer to Specialist" details={data?.specialist} />}
                    {data?.meds && <MedicalRecordCard header="💊 Medicine list" details={data?.medicines?.map((meds: any) => meds.drug)} isList />}
                    {data?.labs && (
                        <MedicalRecordCard
                            header="🧪 Lab Test"
                            details={data?.labs?.map((lab: any) => lab.testLabName)}
                            isList
                            orderButtonFunc={handleOrderLab}
                        />
                    )}
                    {data?.advice && <MedicalRecordCard header="📝 Advice" details={data?.advice} />}
                </View>
            </ScrollView>
        </BackgroundGradient>
    );
}

const styles = StyleSheet.create({
    header: {
        borderTopLeftRadius: wp(3),
        borderTopRightRadius: wp(3),
        paddingHorizontal: wp(3),
        paddingVertical: hp(2),
        marginHorizontal: wp(3),
        marginTop: hp(0.5),
    },
    headerDetailText: {
        color: colors.white,
        fontSize: wp(3.5),
    },
    headerText: {
        color: colors.white,
        fontSize: wp(4.5),
        fontWeight: 'bold',
        textAlign: 'center',
    },
    doctorPatientCard: {
        backgroundColor: colors.white,
        borderBottomLeftRadius: wp(3),
        borderBottomRightRadius: wp(3),
        paddingHorizontal: wp(3),
        paddingVertical: hp(1.5),
        marginHorizontal: wp(3),
        marginTop: hp(-0.2),
        marginBottom: hp(2),
        elevation: 2,
        gap: hp(1),
    },
    breakLine: {
        height: 1,
        backgroundColor: colors.grey,
        marginVertical: hp(1),
    },
});
