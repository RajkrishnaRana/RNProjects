import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { FlashList } from '@shopify/flash-list';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/routeTypes';
import { colors } from '../common/colors';
import { getName, imageSelector } from '../utils';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CustomRating from '../components/BookAppointmentComponents/CustomRating';
import IconText from '../components/IconText';
import moment from 'moment';
import TabBarParent from '../components/TabBarParent';
import BackgroundGradient from '../components/BackgroundGradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type PatientFeedbackScreenProps = RouteProp<RootStackParamList, 'PatientFeedback'>;

export default function PatientFeedbackScreen() {
    const { data } = useRoute<PatientFeedbackScreenProps>().params;
    console.log('patientFeedback ===', data);

    const renderItem = ({ item }: { item: PatientRatingDetails }) => (
        <View style={styles.cardContainer}>
            <View
                style={{
                    padding: wp(2),
                    borderRadius: wp(7),
                    backgroundColor: colors.blueWhite,
                }}
            >
                <Image source={imageSelector(item?.patientDetails?.profileImgPath, 'MALE')} style={styles.image} />
            </View>

            <View style={{ gap: hp(0.5) }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: wp(1) }}>
                    <Text
                        style={{
                            fontSize: wp(4),
                            color: colors.black,
                            fontWeight: 'bold',
                        }}
                    >
                        {getName(
                            item?.patientDetails?.firstName,
                            item?.patientDetails?.middleName,
                            item?.patientDetails?.lastName,
                            item?.patientDetails?.prefix,
                        )}
                    </Text>
                    <Image source={require('../assets/icons/verify.png')} style={{ height: wp(3), width: wp(3), tintColor: colors.primary }} />
                </View>

                <CustomRating prevRating={item?.patientRatingToDoctor} customStartSize={wp(4)} customColor={colors.darkBlue} />

                {item?.remarks && <IconText text={item?.remarks} index={11} />}

                <View style={{ flexDirection: 'row' }}>
                    <IconText text={item?.doctorDetails?.clinicName} index={3} customStyles={{ width: wp(40) }} />
                    <IconText text={moment(item?.startTime).format('Do MMM, YYYY')} index={1} />
                </View>
            </View>
        </View>
    );

    return (
        <TabBarParent>
            <BackgroundGradient customStyle={{ flex: 1, backgroundColor: colors.backgroundColor }}>
                <FlashList
                    data={data || []}
                    renderItem={renderItem}
                    estimatedItemSize={50}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={() => (
                        <Text
                            style={{
                                textAlign: 'center',
                                fontSize: wp(4),
                                color: 'grey',
                            }}
                        >
                            No feedbacks are present
                        </Text>
                    )}
                    contentContainerStyle={{ paddingTop: hp(1) }}
                />
            </BackgroundGradient>
        </TabBarParent>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        gap: wp(3),
        backgroundColor: colors.white,
        padding: 10,
        marginBottom: hp(1.5),
        marginHorizontal: wp(3),
        borderRadius: 10,
        elevation: 2,
        alignItems: 'center',
    },
    image: {
        height: wp(12),
        width: wp(12),
        borderRadius: wp(7),
    },
});
