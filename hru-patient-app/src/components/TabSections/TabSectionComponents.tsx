import {FlatList, RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../../common/colors';
import TextField from '../TextField';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import BigButton from '../BigButton';
import InvitationCard from '../Cards/InvitationCard';
import {useReferralStore} from '../../store/referralStore';
import BonusPointCard from '../Cards/BonusPointCard';
import {z} from 'zod';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useAuthStore} from '../../store/authStore';
import {BASE_URL} from '../../config';
import {postData} from '../../api';
import Toast from 'react-native-simple-toast';
import {queryClient} from '../../../App';
import ListEmptyComponent from '../ListEmptyComponent';
import {isTab} from '../../utils/isTab';

// ZOD VALIDATION SCHEMA ----------------->
const referAFriendSchema = z.object({
    firstName: z.string().nonempty('First Name is required'),
    lastName: z.string().nonempty('Last Name is required'),
    contact: z
        .string()
        .nonempty('Contact is required')
        .refine(val => /^\d{10}$/.test(val) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {message: 'Must be a valid email or 10-digit phone number'}),
});

export type ReferAFriendType = z.infer<typeof referAFriendSchema>;

const ReferNow = () => {
    // GLOBAL STATES ------------------->
    const token = useAuthStore(s => s.token);

    // LOCAL STATES ------------------->
    const [loading, setLoading] = useState(false);

    // FORM HOOKS ---------------->
    const {
        control,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<ReferAFriendType>({
        resolver: zodResolver(referAFriendSchema),
    });

    async function onPress(data: ReferAFriendType) {
        try {
            setLoading(true);
            const phoneRegex = /^\d{10}$/;

            const payload = {
                token: token as string,
                firstName: data.firstName,
                lastName: data.lastName,
                addedUsingMobileApp: true,
                ...(phoneRegex.test(data.contact) ? {phoneNumber: data.contact} : {email: data.contact}),
                type: phoneRegex.test(data.contact) ? 'Phone' : 'Email',
            };

            const url = `${BASE_URL}/hru/Patientappapi/sendreferral`;
            const res = await postData(url, payload);

            if (res.status) {
                // console.log(res);
                Toast.show(`${res.msg}`, Toast.SHORT);
                await queryClient.invalidateQueries({
                    queryKey: ['referAFriend'],
                });
                reset();
            } else {
                console.log(res);
                Toast.show('Failed to send invitation', Toast.SHORT);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1, paddingVertical: hp(1.5)}} showsVerticalScrollIndicator={false}>
            <View style={{gap: isTab ? hp(1) : hp(2), marginBottom: hp(2), marginTop: hp(1)}}>
                <Controller
                    control={control}
                    name="firstName"
                    render={({field: {onChange, onBlur, value}}) => (
                        <TextField
                            label="First Name"
                            placeholder="First Name"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            isNecessary={true}
                            // customStyle={styles.nameInputStyle}
                            // customTextInputContainerStyle={
                            //     styles.nameContainerInputStyle
                            // }
                            errorValue={errors.firstName?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="lastName"
                    render={({field: {onChange, onBlur, value}}) => (
                        <TextField
                            label="Last Name"
                            placeholder="Last Name"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            isNecessary={true}
                            // customStyle={styles.nameInputStyle}
                            // customTextInputContainerStyle={
                            //     styles.nameContainerInputStyle
                            // }
                            errorValue={errors.lastName?.message}
                        />
                    )}
                />
            </View>

            <Controller
                control={control}
                name="contact"
                render={({field: {onChange, onBlur, value}}) => (
                    <TextField
                        label="Email ID / Phone No."
                        placeholder="Email or Phone No."
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        isNecessary={true}
                        // customTextInputContainerStyle={
                        //     styles.nameContainerInputStyle
                        // }
                        errorValue={errors.contact?.message}
                    />
                )}
            />

            <BigButton title="Refer" onPress={handleSubmit(onPress)} customStyle={styles.button} loading={loading} />
        </ScrollView>
    );
};

const InvitationHistory = () => {
    const referralApiData = useReferralStore(state => state.referralApiData);
    // console.log(referralApiData);

    const [loading, setLoading] = useState(false);

    return (
        <FlatList
            data={referralApiData?.doc?.invitationHistory}
            renderItem={({item}) => <InvitationCard item={item} />}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.history}
            ListEmptyComponent={<ListEmptyComponent customText="No History Found" />}
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    onRefresh={async () => {
                        setLoading(true);
                        await queryClient.invalidateQueries({
                            queryKey: ['referAFriend'],
                        });
                        setLoading(false);
                    }}
                />
            }
        />
    );
};

const BonusPoint = () => {
    // GLOBAL STATES ------------------------->
    const referralApiData = useReferralStore(state => state.referralApiData);
    const bonusPointData = referralApiData?.doc?.referralDetails;
    // console.log('bonusPointData', referralApiData);

    const [loading, setLoading] = useState(false);

    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            {/* Total header Section */}
            <View style={styles.bonusPointTotalHeaderContainer}>
                <Text style={styles.totalText}>Total Credits : {referralApiData?.doc?.totalCreditedPoints}</Text>
                <Text style={styles.totalText}>Total Debits : {referralApiData?.doc?.totalDebitedPoints}</Text>
                <Text style={styles.totalText}>Total Balance : {referralApiData?.doc?.totalBal}</Text>
            </View>

            {/* Bonus Points Details */}
            <FlatList
                data={bonusPointData}
                renderItem={({item}) => <BonusPointCard item={item} />}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.history}
                ListEmptyComponent={<ListEmptyComponent customText="No Data Found" />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        fontSize: wp(5),
        fontWeight: 'bold',
        color: colors.black,
        marginBottom: hp(1),
        marginTop: hp(1),
        textAlign: 'center',
    },
    nameInputStyle: {
        width: wp(40),
    },
    nameContainerInputStyle: {
        height: hp(5),
        borderRadius: wp(3),
    },
    button: {
        marginTop: hp(3),
        paddingVertical: hp(1),
        width: wp(50),
        alignSelf: 'center',
    },
    history: {
        gap: hp(1),
        flexGrow: 1,
        paddingVertical: hp(1.5),
    },
    bonusPointTotalHeaderContainer: {
        backgroundColor: colors.primary,
        elevation: 3,
        marginTop: hp(1),
        paddingVertical: hp(1),
        paddingHorizontal: wp(3),
        borderRadius: wp(3),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    totalText: {
        fontSize: isTab ? wp(2) : wp(3),
        color: colors.white,
        fontWeight: 'bold',
    },
});

export {ReferNow, InvitationHistory, BonusPoint};
