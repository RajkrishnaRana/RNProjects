import {ImageProps, RefreshControl, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import React from 'react';
import {colors} from '../../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../types/routeTypes';
import {useQuery} from '@tanstack/react-query';
import {postData} from '../../api';
import {BASE_URL} from '../../config';
import {useAuthStore} from '../../store/authStore';
import {tokenExpiredMsg} from '../../utils';
import PageLoading from '../../components/LottieComponent/PageLoading';
import ErrorComponent from '../../components/ErrorComponent';
import {FlashList} from '@shopify/flash-list';
import NoSlotsAvialable from '../../components/LottieComponent/NoSlotsAvialable';
import BackgroundGradient from '../../components/BackgroundGradient';
import TabBarParent from '../../components/TabBarParent';
import SpecialitiesDoctorCard from '../../components/Cards/SpecialitiesDoctorCard';
import {queryClient} from '../../../App';

interface RatingCardProps {
    imgSrc: ImageProps;
    title: string;
    customStyle?: StyleProp<ViewStyle>;
}

type SpecialitiesDoctorListScreenProps = RouteProp<RootStackParamList, 'SpecialitiesBasedDoctors'>;

export default function SpecialitiesDoctorListScreen() {
    const {id, payload} = useRoute<SpecialitiesDoctorListScreenProps>().params;
    console.log({id, payload});

    // GLOBAL STATE -------------------------->
    const {logout} = useAuthStore();

    // LOCAL STATE -------------------------->
    const [loading, setLoading] = React.useState(false);

    //DATA FETCHING -------------------------->
    const url = `${BASE_URL}/hru/Patientappapi/${id}/${payload.searchLocationId}/searchdoctor`;
    // console.log(url);
    const {isPending, error, data} = useQuery({
        queryKey: ['SpecialityDoctorSearch' + id + payload.searchLocationId],
        queryFn: () => postData(url, payload),
        select: data => {
            if (data?.tokenExpired) tokenExpiredMsg(logout);
            console.log('SpecialityDoctorSearch', data);
            return data?.doc;
        },
    });

    const refreshFunc = async () => {
        setLoading(true);
        await queryClient.invalidateQueries({
            queryKey: ['SpecialityDoctorSearch' + id + payload.searchLocationId],
        });
        setLoading(false);
    };

    return (
        <TabBarParent>
            <BackgroundGradient>
                {isPending ? (
                    <PageLoading />
                ) : error ? (
                    <ErrorComponent />
                ) : (
                    <View style={styles.container}>
                        {data?.getSpecialitiesDoctors?.length > 0 ? (
                            <FlashList
                                data={data?.getSpecialitiesDoctors}
                                renderItem={({item}) => <SpecialitiesDoctorCard data={item} specialityScreen />}
                                estimatedItemSize={20}
                                showsVerticalScrollIndicator={false}
                                refreshControl={<RefreshControl refreshing={loading} onRefresh={refreshFunc} />}
                            />
                        ) : (
                            <NoSlotsAvialable customText="No Doctor Available for this Speciality" />
                        )}
                    </View>
                )}
            </BackgroundGradient>
        </TabBarParent>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainContainer: {
        marginTop: hp(1),
        marginBottom: hp(0.5),
        paddingVertical: wp(2),
        paddingHorizontal: wp(3),
        borderRadius: wp(4),
        borderWidth: wp(0.001),
        borderColor: colors.grey,
        backgroundColor: colors.white,
        elevation: 2,

        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 6,

        // Shadow for Android
        // elevation: 1,
    },
    subText: {
        color: colors.darkGrey,
        fontSize: wp(3),
        width: wp(68),
    },
    ratingContainer: {
        flexDirection: 'row',
        gap: wp(1),
        backgroundColor: colors.transparentPrimary,
        borderRadius: wp(4),
        paddingVertical: wp(1),
        paddingHorizontal: wp(2),
    },
    ratingText: {
        fontSize: wp(3),
        color: colors.black,
        // fontWeight: 'bold',
    },
});
