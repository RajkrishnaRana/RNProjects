import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image, ScrollView} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors} from '../../common/colors';
import {useNavigation} from '../../hooks/useNavigation';
import {RootStackParamList} from '../../types/routeTypes';
import PatientDetailHeader from '../../components/PatientDetailHeader';
import {useAuthStore} from '../../store/authStore';
import {useQuery} from '@tanstack/react-query';
import {postData} from '../../api';
import PageLoading from '../../components/LottieComponent/PageLoading';
import {getName, tokenExpiredMsg} from '../../utils';
import {BASE_URL} from '../../config';
import UploadSectionCard from '../../components/Cards/UploadSectionCard';
import {RouteProp, useRoute} from '@react-navigation/native';
import TabBarParent from '../../components/TabBarParent';
import {isTab} from '../../utils/isTab';

type PatientVaultDetailsScreenRouteProp = RouteProp<RootStackParamList, 'PatientVaultDetails'>;

function RenderOption({
    title,
    iconName,
    navigateScreen,
    profileId,
}: {
    title: string;
    iconName: string;
    navigateScreen: keyof RootStackParamList;
    profileId: string;
}) {
    const navigation = useNavigation();
    // console.log(profileId);

    const handlePress = () => {
        navigation.push(navigateScreen, {profileId: profileId});
    };

    return (
        <TouchableOpacity style={styles.optionItem} onPress={handlePress}>
            <View style={styles.optionIcon}>
                <FontAwesome name={iconName} size={isTab ? wp(3) : wp(5)} color={colors.primary} />
            </View>
            <Text style={styles.optionText}>{title}</Text>
            <MaterialIcons name="keyboard-arrow-right" size={isTab ? wp(3) : wp(6)} color="gray" />
        </TouchableOpacity>
    );
}

export default function PatientVaultDetailsScreen() {
    const {item} = useRoute<PatientVaultDetailsScreenRouteProp>().params;

    // GLOBAL STATES ------------------------------>
    const {token} = useAuthStore();

    return (
        <TabBarParent>
            <ScrollView style={styles.container}>
                {/* Profile Section */}
                <PatientDetailHeader item={item} />

                {/* Options */}
                <View style={styles.optionsList}>
                    <Text style={styles.heading}>Your Files : </Text>
                    <RenderOption title="Prescriptions" iconName="file-text-o" navigateScreen="Prescriptions" profileId={item?.profileId} />
                    <RenderOption title="Reports" iconName="clipboard" navigateScreen="Reports" profileId={item?.profileId} />
                    <RenderOption title="Invoices" iconName="files-o" navigateScreen="Invoices" profileId={item?.profileId} />

                    {/* Upload Section */}
                    <Text style={[styles.heading, {marginTop: hp(4)}]}>Upload Your Files : </Text>
                    <UploadSectionCard token={token} profileId={item.profileId} />
                </View>
            </ScrollView>
        </TabBarParent>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexGrow: 1,
        backgroundColor: colors.white,
        paddingHorizontal: wp(3),
    },
    optionsList: {
        marginTop: hp(1),
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp(1.2),
        paddingHorizontal: isTab ? wp(2) : wp(4),
        borderBottomWidth: 1,
        borderColor: '#e0e0e0',
    },
    optionIcon: {
        width: isTab ? wp(5) : wp(10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionText: {
        flex: 1,
        fontSize: isTab ? wp(2.5) : wp(4),
        marginLeft: isTab ? wp(2) : wp(3),
        color: colors.black,
    },
    heading: {
        fontSize: isTab ? wp(2.5) : wp(4),
        color: colors.darkBlue,
        fontWeight: 'bold',
    },
});
