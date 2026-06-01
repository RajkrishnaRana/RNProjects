import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { FamilyMemberItem } from '../../screens/FamilyMembers/FamilyMembersScreen';
import { getName, imageSelector } from '../../utils';
import dayjs from 'dayjs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../common/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '../../hooks/useNavigation';
import DeleteModal from '../Modal/DeleteModal';
import { useAuthStore } from '../../store/authStore';
import { BASE_URL } from '../../config';
import { postData } from '../../api';
import Toast from 'react-native-simple-toast';
import { queryClient } from '../../../App';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import IconText from '../IconText';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { isTab } from '../../utils/isTab';

export default function FamilyMemberCard({ item }: { item: FamilyMemberItem }) {
    const navigation = useNavigation();
    // console.log('family member card', item);

    // GLOBAL STATES ------------------------------>
    const token = useAuthStore(state => state.token);

    // LOCAL STATES ----------------------->
    const [modalVisible, setModalVisible] = useState(false);

    // LOCAL FUNCTIONS -------------------------------->
    const handleEdit = (item: FamilyMemberItem) => {
        navigation.push('AddMembers', { mode: 'edit', item: item });
    };

    const handleDelete = async () => {
        try {
            const dataToPost = {
                token: token,
                profileId: item.profileId,
                imgPath: item?.profileImgPath,
            };

            const url = `${BASE_URL}/hru/Patientappapi/deletefamilymember`;

            const res = await postData(url, dataToPost);

            if (res.status) {
                Toast.show('Family member deleted successfully', Toast.SHORT);
                queryClient.invalidateQueries({
                    queryKey: ['familyMembersData'],
                });
            }

            console.log(res);
        } catch (error) {
            Toast.show('Failed to delete family member', Toast.SHORT);
            console.error(error);
        }
    };

    return (
        <View style={styles.memberRow}>
            <View style={styles.memberLeft}>
                <Image source={imageSelector(item?.profileImgPath, item?.gender)} style={styles.familyMemberImage} />
                <View style={styles.addressText}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <View style={{ gap: isTab ? hp(0) : hp(0.5) }}>
                            <Text style={styles.addressType}>{getName(item?.firstName, item?.middleName, item?.lastName, item?.prefix)}</Text>
                            {/* <View style={styles.relationShipContainer}>
                                <Text
                                    style={{
                                        color: colors.white,
                                        fontWeight: 'bold',
                                        fontSize: wp(3),
                                    }}>
                                    {item?.relationship}
                                </Text>
                            </View> */}
                            <View style={{ flexDirection: 'row', gap: wp(2) }}>
                                <IconText index={2} text={item?.hruId} customStyles={{ width: isTab ? wp(13) : wp(22) }} />
                                <IconText
                                    customLogo={
                                        item?.gender === 'MALE' ? (
                                            <MaterialCommunityIcons name="gender-male" size={wp(4)} color={colors.primary} />
                                        ) : (
                                            <MaterialCommunityIcons name="gender-female" size={wp(4)} color={colors.primary} />
                                        )
                                    }
                                    text={item?.gender}
                                />
                            </View>

                            <View style={{ flexDirection: 'row', gap: wp(2) }}>
                                <IconText index={8} text={dayjs(item?.dob).format('DD/MM/YYYY')} customStyles={{ width: isTab ? wp(13) : wp(22) }} />
                                <IconText
                                    customLogo={
                                        <FontAwesome5Icon
                                            name="birthday-cake"
                                            size={isTab ? wp(3) : wp(4)}
                                            style={{ marginHorizontal: wp(0.5) }}
                                            color={colors.primary}
                                        />
                                    }
                                    text={`${dayjs().diff(dayjs(item?.dob), 'year')} yrs`}
                                    customStyles={{ width: isTab ? wp(10) : wp(15) }}
                                />
                                <IconText
                                    customLogo={<FontAwesome name="user" size={isTab ? wp(3) : wp(4)} color={colors.primary} />}
                                    text={item?.relationship}
                                    customStyles={{ gap: isTab ? wp(1) : wp(2) }}
                                />
                            </View>
                        </View>
                        <View
                            style={{
                                alignItems: 'center',
                                flexDirection: 'row',
                                gap: wp(3),
                                width: wp(20),
                                position: 'absolute',
                                top: isTab ? hp(1.5) : hp(1),
                                right: isTab ? -wp(5) : 0,
                            }}
                        >
                            <MaterialIcons
                                name="edit"
                                size={isTab ? wp(3) : wp(5)}
                                color={colors.darkBlue}
                                style={styles.editIcon}
                                onPress={() => handleEdit(item)}
                            />
                            <MaterialIcons
                                name="delete"
                                size={isTab ? wp(3) : wp(5)}
                                color={colors.red}
                                style={styles.editIcon}
                                onPress={() => setModalVisible(true)}
                            />
                        </View>
                    </View>
                </View>
            </View>

            {/* Delete Confirmation Modal */}
            <DeleteModal isModalVisible={modalVisible} setModalVisible={setModalVisible} deleteFunction={handleDelete} />
        </View>
    );
}

const styles = StyleSheet.create({
    memberRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: isTab ? hp(1) : hp(1.5),
        backgroundColor: colors.white,
        padding: isTab ? wp(2) : wp(3),
        elevation: 1.5,
        borderRadius: wp(5),
        borderWidth: wp(0.15),
        borderColor: colors.white,
        marginHorizontal: wp(5),

        //Shadow for IOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
    },
    memberLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    familyMemberImage: {
        height: isTab ? wp(8) : wp(12),
        width: isTab ? wp(8) : wp(12),
        borderRadius: wp(7),
        borderWidth: 1,
        borderColor: colors.grey,
    },
    addressText: {
        // backgroundColor: 'blue',
        marginLeft: wp(4),
        width: wp(65),
        // marginRight:wp(3)
    },
    addressType: {
        fontSize: isTab ? wp(2.5) : wp(4),
        // fontWeight: 'bold',
        color: colors.black,
        width: wp(40),
    },
    addressDetail: {
        fontSize: isTab ? wp(2) : wp(3.2),
        color: colors.darkGrey,
    },
    editIcon: {
        padding: isTab ? wp(2) : wp(2),
        backgroundColor: colors.white,
        borderRadius: wp(6),
        borderWidth: wp(0.01),
        borderColor: colors.grey,
        elevation: 3,
    },
    deleteIcon: {
        padding: wp(2),
        backgroundColor: colors.red,
        borderRadius: wp(6),
    },
    relationShipContainer: {
        backgroundColor: colors.primary,
        paddingVertical: hp(0.5),
        paddingHorizontal: wp(2),
        borderRadius: wp(2),
        width: wp(20),
        alignItems: 'center',
    },
});
