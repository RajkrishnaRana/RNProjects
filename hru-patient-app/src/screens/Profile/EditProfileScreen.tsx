import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { colors } from '../../common/colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '../../hooks/useNavigation';
import BigButton from '../../components/BigButton';
import dayjs from 'dayjs';
import { RootStackParamList } from '../../types/routeTypes';
import { RouteProp, useRoute } from '@react-navigation/native';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ProfileImage from '../../components/ProfileImage';
import TextField from '../../components/TextField';
import DatePickerModal from '../../components/Modal/DatePickerModal';
import GenderRadioButton from '../../components/GenderRadioButton';
import CustomDropdown from '../../components/CustomDropdown';
import { postData } from '../../api';
import { useAuthStore } from '../../store/authStore';
import { queryClient } from '../../../App';
import Toast from 'react-native-simple-toast';
import { BASE_URL } from '../../config';
import { DateType } from 'react-native-ui-datepicker';
import TabBarParent from '../../components/TabBarParent';
import { getName } from '../../utils';
import SignUpPrompt from '../../components/SignUpPrompt';
import { bloodGroup } from '../../common/bloodGroup';
import { isTab } from '../../utils/isTab';

type EditProfileScreenRouteProp = RouteProp<RootStackParamList, 'EditProfile'>;

// ZOD VALIDATION SCHEMA ----------------->
const editProfileSchema = z.object({
    firstName: z.string().nonempty('Name is required'),
    middleName: z.string().optional(),
    lastName: z.string().nonempty('Name is required'),
    email: z.string().email('Please enter a valid email').or(z.literal('')).optional(),
    bloodGroup: z.string().optional(),
    phoneNo: z
        .string()
        .length(10, 'Phone No. must be 10 digits')
        .regex(/^\d{10}$/, { message: 'Phone number must be numeric' })
        .optional(),
});
export type EditProfileDataType = z.infer<typeof editProfileSchema>;

export default function EditProfileScreen() {
    const navigation = useNavigation();
    const { data } = useRoute<EditProfileScreenRouteProp>().params;

    // GLOBAL STATES -------------------------------->
    const { token, setUpdatedUserData } = useAuthStore();

    // FORM HOOKS ---------------->
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<EditProfileDataType>({
        resolver: zodResolver(editProfileSchema),
        defaultValues: {
            firstName: data?.firstName || '',
            middleName: data?.middleName || '',
            lastName: data?.lastName || '',
            phoneNo: data?.mobileNumber || '',
            email: data?.email || '',
            bloodGroup: data?.bloodGroup || '',
        },
    });

    // STATE INITIALIZER FUNCTION --------------------------------->
    const initializeDOB = () => (data?.dob ? dayjs(data?.dob) : undefined);
    const initializeChecked = () => data?.gender;

    // LOCAL STATES ------------------------------->
    const [profileImage, setProfileImage] = useState<string | undefined>(data?.profileImgPath);
    const [dob, setDob] = useState<DateType>(initializeDOB());
    const [checked, setChecked] = useState(data?.gender);
    const [healthScheme, setHealthScheme] = useState(data?.healthScheme || '');
    const [loading, setLoading] = useState(false);
    const [selectedBloodGroup, setSelectedBloodGroup] = useState<any>(() => {
        return data?.bloodGroup ? bloodGroup.find(item => item.label === data?.bloodGroup.trim()) : undefined;
    });

    // LOCAL FUNCTION ---------------------------------------->
    const onSubmit = async (data: EditProfileDataType) => {
        try {
            setLoading(true);
            const formData = new FormData();

            formData.append(
                'formData',
                JSON.stringify({
                    ...data,
                    addedUsingMobileApp: true,
                    dob: dob,
                    gender: checked,
                    healthScheme: healthScheme?.sName || healthScheme,
                    bloodGroup: selectedBloodGroup?.label || selectedBloodGroup,
                }),
            );
            profileImage &&
                formData.append('PATIENT', {
                    uri: profileImage,
                    type: 'image/jpeg', // Force type if converted
                    name: 'profile.jpg', // Name it explicitly
                });
            profileImage && formData.append('uploadCount', 1);
            formData.append('token', token);

            const url = `${BASE_URL}/hru/Patientappapi/updatepatientprofile`;

            const res = await postData(url, formData, true);

            if (!res.status) {
                Toast.show(`${res.msg}`, Toast.LONG);
                throw new Error(res.msg);
            }

            Toast.show('Profile updated successfully', Toast.LONG);
            console.log('EditProfileApiResponse', res);
            setUpdatedUserData(
                getName(res?.doc?.firstName, res?.doc?.middleName, res?.doc?.lastName),
                `${BASE_URL}/show-uploaded.image?path=${res?.doc?.imgUrl?.path}`,
            );
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            navigation.goBack();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.backgroundColor }}>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {/* Profile Image */}
                <ProfileImage profileImage={profileImage} setProfileImage={setProfileImage} gender={data?.gender} />

                <View style={styles.form}>
                    <View style={styles.firstNameContainer}>
                        <CustomDropdown
                            data={data?.healthSchemes}
                            customLabelField="sName"
                            customValueField="code"
                            customPlaceholder="Prefix"
                            value={healthScheme}
                            setValue={setHealthScheme}
                            customDropdownStyle={[styles.dropdown, { width: wp(20) }]}
                            customSelectedTextStyle={styles.dropDownSelectedText}
                        />

                        <Controller
                            control={control}
                            name="firstName"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextField
                                    label="First Name"
                                    placeholder="First Name"
                                    isNecessary={true}
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    errorValue={errors.firstName?.message}
                                    customContainerStyle={{ width: wp(60) }}
                                />
                            )}
                        />
                    </View>

                    <View style={{ height: hp(2) }} />

                    <Controller
                        control={control}
                        name="middleName"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextField
                                label="Middle Name"
                                placeholder="Middle Name"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                errorValue={errors.middleName?.message}
                            />
                        )}
                    />

                    <View style={{ height: hp(2) }} />

                    <Controller
                        control={control}
                        name="lastName"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextField
                                label="Last Name"
                                placeholder="Last Name"
                                isNecessary={true}
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                errorValue={errors.lastName?.message}
                            />
                        )}
                    />

                    <View style={{ height: hp(2) }} />

                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextField
                                label="Email"
                                placeholder="Email"
                                value={value}
                                isEmail={true}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                errorValue={errors.email?.message}
                            />
                        )}
                    />

                    <View style={{ height: hp(2) }} />

                    {/* <Controller
                        control={control}
                        name="bloodGroup"
                        render={({field: {onChange, onBlur, value}}) => (
                            <TextField
                                placeholder="Enter Blood Group"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur} // Trigger validation onBlur
                                errorValue={errors.bloodGroup?.message}
                            />
                        )}
                    /> */}
                    <CustomDropdown
                        customPlaceholder="Select Blood Group"
                        data={bloodGroup}
                        customLabelField="label"
                        customValueField="id"
                        value={selectedBloodGroup}
                        setValue={setSelectedBloodGroup}
                        customDropdownStyle={[styles.dropdown, { width: wp(84) }]}
                        customSelectedTextStyle={styles.dropDownSelectedText}
                    />

                    <View style={{ height: hp(2) }} />

                    <View style={styles.row}>
                        <Controller
                            control={control}
                            name="phoneNo"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextField
                                    label="Phone No."
                                    placeholder="Phone No."
                                    // isNecessary={true}
                                    editable={false}
                                    value={value}
                                    isNumeric={true}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    errorValue={errors.phoneNo?.message}
                                    customContainerStyle={{
                                        width: wp(40),
                                    }}
                                    isLabelActive
                                />
                            )}
                        />

                        <DatePickerModal date={dob} setDate={setDob} />
                    </View>

                    <View style={{ height: hp(2) }} />

                    <View style={styles.genderHealthSchemeRow}>
                        <GenderRadioButton checked={checked} setChecked={setChecked} />

                        <CustomDropdown
                            mode
                            label="Health Scheme"
                            data={data?.healthSchemes}
                            customLabelField="sName"
                            customValueField="code"
                            value={healthScheme}
                            setValue={setHealthScheme}
                            customDropdownStyle={styles.dropdown}
                            customSelectedTextStyle={styles.dropDownSelectedText}
                        />
                    </View>
                </View>

                <BigButton onPress={handleSubmit(onSubmit)} title="Update" loading={loading} />
                <SignUpPrompt onPress={() => navigation.navigate('ADDRESS BOOK')} primaryText="Want to change your address? " linkText="CLICK HERE" />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: wp(5),
        paddingVertical: hp(2),
        backgroundColor: colors.white,
        marginHorizontal: wp(3),
        marginVertical: hp(2),
        borderRadius: wp(3),
    },
    firstNameContainer: {
        flexDirection: 'row',
        gap: wp(2),
    },
    form: {
        marginTop: hp(2),
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    inputContainer: {
        marginBottom: hp(2.5),
        flex: 1,
    },
    genderHealthSchemeRow: {
        flexDirection: 'row',
        gap: wp(3),
        alignItems: 'center',
    },
    dropdown: {
        width: wp(40),
        height: isTab ? hp(4) : hp(5),
        borderWidth: 1,
        borderColor: colors.grey,
        borderRadius: wp(3),
        backgroundColor: colors.white,
    },
    dropDownSelectedText: {
        fontSize: isTab ? wp(2.5) : wp(4),
        // fontWeight: 'bold',
        paddingLeft: wp(2),
    },
});
