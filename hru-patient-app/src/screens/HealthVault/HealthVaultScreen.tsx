import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, RefreshControl } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors } from '../../common/colors';
import { useNavigation } from '../../hooks/useNavigation';
import { useAuthStore } from '../../store/authStore';
import { useQuery } from '@tanstack/react-query';
import { postData } from '../../api';
import PageLoading from '../../components/LottieComponent/PageLoading';
import { getName, imageSelector, tokenExpiredMsg } from '../../utils';
import { BASE_URL } from '../../config';
import moment from 'moment';
import TabBarParent from '../../components/TabBarParent';
import BackgroundGradient from '../../components/BackgroundGradient';
import { useState } from 'react';
import { set } from 'zod';
import { queryClient } from '../../../App';
import { isTab } from '../../utils/isTab';

type ItemProps = {
    label: string;
    value: string;
    hruId: string;
    profileImgPath: string;
    relationship: string;
    profileId: string;
    dob: string;
};

function RenderOption({ item }: { item: ItemProps }) {
    const navigation = useNavigation();
    // console.log(profileId);

    const handlePress = () => {
        // console.log(item);
        navigation.push('PatientVaultDetails', { item: item });
    };

    return (
        <TouchableOpacity style={styles.optionItem} onPress={handlePress}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={imageSelector(item?.profileImgPath, 'MALE')} style={styles.profileImage} />
                <View style={{ gap: hp(0.5) }}>
                    <Text style={styles.name}>{item?.label}</Text>
                    <View style={{ flexDirection: isTab ? 'row' : 'column', gap: isTab ? wp(3) : hp(0.4) }}>
                        <Text style={[styles.detailHeader]}>
                            HRU ID :&nbsp;
                            <Text style={styles.detailText}>{item?.hruId}</Text>
                        </Text>
                        <Text style={[styles.detailHeader]}>
                            Relation :&nbsp;
                            <Text style={styles.detailText}>{item?.relationship}</Text>
                        </Text>
                        <Text style={styles.detailHeader}>
                            Age :&nbsp;
                            <Text style={styles.detailText}>{moment().diff(item?.dob, 'years')}</Text>
                        </Text>
                    </View>
                </View>
            </View>
            <MaterialIcons name="keyboard-arrow-right" size={isTab ? wp(4) : wp(6)} color="gray" />
        </TouchableOpacity>
    );
}

export default function HealthVaultScreen() {
    // GLOBAL STATES ------------------------------>
    const { token, logout } = useAuthStore();

    // LOCAL STATES ------------------------------>
    const [refresh, setRefresh] = useState(false);

    // DATA FETCHING -------------------------------->
    const url = `${BASE_URL}/hru/Patientappapi/patientlistforhealthvault`;
    const { isPending, error, data } = useQuery({
        queryKey: ['healthVault'],
        queryFn: () => postData(url, { token: token }),
        select: data => {
            console.log('HealthVault Data', data);
            if (data?.tokenExpired) {
                tokenExpiredMsg(logout);
                throw new Error('Session Expired');
            }

            const actualData = data?.docs;
            // console.log(actualData);
            const formattedData = actualData?.map((item: any, index: number) => ({
                label: getName(item?.firstName, item?.middleName, item?.lastName, item?.prefix),
                value: index,
                hruId: item?.hruId,
                profileImgPath: item?.profileImgPath,
                relationship: item?.relationship,
                dob: item?.dob,
                profileId: item?.profileId,
            }));

            return formattedData;
        },
    });

    // LOCAL FUNCTIONS ------------------------------>
    const onRefresh = async () => {
        setRefresh(true);
        await queryClient.invalidateQueries({
            queryKey: ['healthVault'],
        });
        setRefresh(false);
    };

    return (
        <TabBarParent>
            <BackgroundGradient>
                <View style={styles.container}>
                    {isPending ? (
                        <PageLoading />
                    ) : error ? (
                        <>
                            <Text>Some Error occured</Text>
                        </>
                    ) : (
                        <ScrollView
                            contentContainerStyle={{ flexGrow: 1 }}
                            showsVerticalScrollIndicator={false}
                            refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refresh} />}
                        >
                            {data?.map((item: any, index: number) => {
                                return <RenderOption item={item} key={index} />;
                            })}
                        </ScrollView>
                    )}
                </View>
            </BackgroundGradient>
        </TabBarParent>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: colors.white,
        paddingHorizontal: wp(3),
    },
    optionsList: {
        marginTop: hp(1),
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: isTab ? hp(1.2) : hp(2),
        paddingHorizontal: wp(2),
        margin: hp(0.6),
        borderRadius: hp(2),
        borderColor: '#e0e0e0',
        justifyContent: 'space-between',
        backgroundColor: colors.white,
        borderWidth: wp(0.001),
        elevation: 2,
        // Shadow for iOS
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0.5 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    optionIcon: {
        width: wp(10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionText: {
        flex: 1,
        fontSize: wp(4.5),
        marginLeft: wp(3),
    },
    profileImage: {
        width: isTab ? wp(9) : wp(15),
        height: isTab ? wp(9) : wp(15),
        borderRadius: wp(10),
        marginRight: wp(4),
        borderWidth: wp(0.1),
        borderColor: colors.grey,
    },
    detailHeader: {
        fontSize: isTab ? wp(2) : wp(3.2),
        // fontWeight: 'bold',
        color: colors.darkGrey,
    },
    detailText: {
        fontSize: isTab ? wp(2) : wp(3.5),
        color: colors.lightBlack,
    },
    name: {
        fontSize: isTab ? wp(2.5) : wp(4),
        fontWeight: 'bold',
        color: colors.black,
    },
    headerText: {
        fontSize: wp(4.5),
        fontWeight: 'bold',
        color: colors.darkBlue,
        alignSelf: 'center',
    },
});
