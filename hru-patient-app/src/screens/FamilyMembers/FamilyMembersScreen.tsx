import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, RefreshControl } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../common/colors';
import { useNavigation } from '../../hooks/useNavigation';
import BigButton from '../../components/BigButton';
import { useQuery } from '@tanstack/react-query';
import { postData } from '../../api';
import { useAuthStore } from '../../store/authStore';
import PageLoading from '../../components/LottieComponent/PageLoading';
import dayjs from 'dayjs';
import DeleteModal from '../../components/Modal/DeleteModal';
import { getName, imageSelector } from '../../utils';
import { BASE_URL } from '../../config';
import FamilyMemberCard from '../../components/Cards/FamilyMemberCard';
import TabBarParent from '../../components/TabBarParent';
import BackgroundGradient from '../../components/BackgroundGradient';
import { queryClient } from '../../../App';

// Define the name for the address item
export interface ImageUrl {
    name: string;
    path: string;
}
export interface FamilyMemberItem {
    _id: string;
    profileId: string;
    relationship: string;
    firstName: string;
    middleName: string;
    lastName: string;
    prefix: string;
    dob: string;
    hruId: string;
    gender: string;
    imgUrl?: ImageUrl;
    patientMobileNumber?: string;
    healthScheme: string;
    profileImgPath?: string;
    bloodGroup?: string;
}

export default function FamilyMembersScreen() {
    const navigation = useNavigation();

    // GLOBAL STATES ------------------------------>
    const token = useAuthStore(state => state.token);

    // LOCAL STATES ------------------------------->
    const [refresh, setRefresh] = useState(false);

    // DATA FETCHING -------------------------------->
    const url = `${BASE_URL}/hru/Patientappapi/myfamilymembers`;
    const { isPending, error, data } = useQuery({
        queryKey: ['familyMembersData'],
        queryFn: () => postData(url, { token: token }),
        // refetchInterval: 3000,
    });

    // LOCAL FUNCTIONS -------------------------------->
    console.log('FamilyMemberData', data);

    const handleAddNewMember = () => {
        navigation.push('AddMembers', { mode: 'add' });
    };

    const renderItem = ({ item }: { item: FamilyMemberItem }) => <FamilyMemberCard item={item} />;

    const onRefresh = async () => {
        setRefresh(true);
        await queryClient.invalidateQueries({
            queryKey: ['familyMembersData'],
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
                            <Text style={{ color: colors.black }}>Some Error happened</Text>
                        </>
                    ) : (
                        <>
                            {/* Address List */}
                            <FlatList
                                data={data.familyMembers}
                                renderItem={renderItem}
                                keyExtractor={item => item.profileId}
                                contentContainerStyle={styles.list}
                                showsVerticalScrollIndicator={false}
                                refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
                            />

                            {/* Add New Address Button */}
                            <BigButton
                                customStyle={{
                                    marginBottom: hp(2),
                                    marginTop: hp(1),
                                    marginHorizontal: wp(3),
                                }}
                                title="Add New Member"
                                onPress={handleAddNewMember}
                            />
                        </>
                    )}
                </View>
            </BackgroundGradient>
        </TabBarParent>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: hp(1),
    },
    list: {
        paddingBottom: hp(10),
    },
    memberRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(2),
        backgroundColor: colors.blueWhite,
        padding: wp(3),
        elevation: 3,
        borderRadius: wp(5),
    },
    memberLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    familyMemberImage: {
        height: wp(14),
        width: wp(14),
        borderRadius: wp(7),
        borderWidth: 1,
        borderColor: colors.primary,
    },
    addressText: {
        // backgroundColor: 'blue',
        marginLeft: wp(3),
        width: wp(65),
        // marginRight:wp(3)
    },
    addressType: {
        fontSize: wp(4),
        fontWeight: 'bold',
        color: colors.darkBlue,
    },
    addressDetail: {
        fontSize: wp(3.2),
        color: 'gray',
    },
    editIcon: {
        padding: wp(2),
        backgroundColor: colors.darkBlue,
        borderRadius: wp(6),
    },
    deleteIcon: {
        padding: wp(2),
        backgroundColor: colors.red,
        borderRadius: wp(6),
    },
});
