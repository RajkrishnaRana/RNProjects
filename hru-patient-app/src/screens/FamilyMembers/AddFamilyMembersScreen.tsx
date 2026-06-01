import React, {useState} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors} from '../../common/colors';
import {useNavigation} from '../../hooks/useNavigation';
import BigButton from '../../components/BigButton';
import dayjs from 'dayjs';
import ProfileImage from '../../components/ProfileImage';
import DatePickerModal from '../../components/Modal/DatePickerModal';
import {z} from 'zod';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import TextField from '../../components/TextField';
import GenderRadioButton from '../../components/GenderRadioButton';
import CustomDropdown from '../../components/CustomDropdown';
import {HealthSchemesData, RelationShipsData} from '../../constants';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../types/routeTypes';
import Toast from 'react-native-simple-toast';
import {useAuthStore} from '../../store/authStore';
import {postData} from '../../api';
import {queryClient} from '../../../App';
import {BASE_URL} from '../../config';
import {DateType} from 'react-native-ui-datepicker';
import {bloodGroup} from '../../common/bloodGroup';

type AddFamilyMemberScreenRouteProp = RouteProp<RootStackParamList, 'AddMembers'>;

// ZOD VALIDATION SCHEMA ----------------->
const familyMemberSchema = z.object({
    firstName: z.string().nonempty('Name is required'),
    middleName: z.string().optional(),
    lastName: z.string().nonempty('Name is required'),
    bloodGroup: z.string().optional(),
    phoneNo: z
        .string()
        .length(10, 'Phone No. must be 10 digits')
        .regex(/^\d{10}$/, {message: 'Phone number must be numeric'})
        .or(z.literal(''))
        .optional(),
});
export type FamilyMemberDataType = z.infer<typeof familyMemberSchema>;
type HealthSchemeDataType = {
    value: string;
    label: string;
};

export default function AddFamilyMembersScreen() {
    const navigation = useNavigation();
    const {mode, item} = useRoute<AddFamilyMemberScreenRouteProp>().params;
    console.log('FamilyMemberItem', item);

    // GLOBAL STATES -------------------------------->
    const token = useAuthStore(s => s.token);

    // FORM HOOKS ---------------->
    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm<FamilyMemberDataType>({
        resolver: zodResolver(familyMemberSchema),
        defaultValues: {
            firstName: item?.firstName || '',
            middleName: item?.middleName || '',
            lastName: item?.lastName || '',
            phoneNo: item?.patientMobileNumber || '',
            bloodGroup: item?.bloodGroup || '',
        },
    });

    // STATE INITIALIZATION FUNCTION ------------------->
    const initializeRelationshipDropdown = (relationship: string | undefined) => {
        if (relationship) {
            for (const item of RelationShipsData) {
                if (item.value === relationship) return item.value;
            }
        }
        return undefined;
    };

    const initializeHealthSchemeDropdown = (healthSchemeData: string | undefined) => {
        if (healthSchemeData) {
            for (const item of HealthSchemesData) {
                if (item.value === healthSchemeData) return item.value;
            }
        }
        return '';
    };

    const initializeDOB = () => (item?.dob ? dayjs(item?.dob) : undefined);
    const initializeChecked = () => (item?.gender ? item?.gender : undefined);

    // LOCAL STATES ------------------------------->
    const [loading, setLoading] = useState(false);
    const [dob, setDob] = useState<DateType>(initializeDOB());
    const [checked, setChecked] = useState(initializeChecked());
    const [relation, setRelation] = useState<HealthSchemeDataType | string | undefined>(initializeRelationshipDropdown(item?.relationship));
    const [healthScheme, setHealthScheme] = useState<HealthSchemeDataType | string>(initializeHealthSchemeDropdown(item?.healthScheme));
    const [profileImage, setProfileImage] = useState<string | undefined>(item?.profileImgPath);
    const [selectedBloodGroup, setSelectedBloodGroup] = useState<any>(() => {
        return item?.bloodGroup ? bloodGroup.find(i => i.label === item?.bloodGroup?.trim()) : undefined;
    });

    // LOCAL FUNCTIONS -------------------------------->
    const onSubmit = async (data: FamilyMemberDataType) => {
        if (relation === undefined) {
            Toast.show('Please select a relation with you family', Toast.LONG);
            return;
        }

        if (dob === undefined) {
            Toast.show('Please select date of birth', Toast.LONG);
            return;
        }

        if (checked === undefined) {
            Toast.show('Please select gender', Toast.LONG);
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();

            const payload = {
                ...data,
                bloodGroup: selectedBloodGroup?.label || selectedBloodGroup,
                addedUsingMobileApp: true,
                dob: dob,
                gender: checked,
                relationship: (relation as HealthSchemeDataType)?.label?.toUpperCase() || relation,
                healthScheme: (healthScheme as HealthSchemeDataType)?.label || healthScheme,
                profileId: mode === 'edit' && item?.profileId,
            };

            console.log('FamilyMemberPayload', payload);

            mode == 'edit' && {...payload, profileId: item?.profileId};

            formData.append('formData', JSON.stringify(payload));
            profileImage &&
                formData.append('MEMBER', {
                    uri: profileImage,
                    type: 'image/jpeg', // Force type if converted
                    name: 'profile.jpg', // Name it explicitly
                });
            profileImage && formData.append('uploadCount', 1);
            formData.append('token', token);

            const url = mode === 'add' ? `${BASE_URL}/hru/Patientappapi/addfamilymember` : `${BASE_URL}/hru/Patientappapi/updatepatientfamilymember`;

            const res = await postData(url, formData, true);

            if (res.status) {
                Toast.show(mode === 'add' ? 'Family member added successfully' : 'Family member updated successfully', Toast.SHORT);
                queryClient.invalidateQueries({
                    queryKey: ['familyMembersData'],
                });

                navigation.goBack();
            } else {
                Toast.show('Something went wrong', Toast.SHORT);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{flex: 1, backgroundColor: colors.backgroundColor}}>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {/* Profile Image */}
                <ProfileImage profileImage={profileImage} setProfileImage={setProfileImage} gender={item?.gender} />

                {/* Address Input Fields */}
                <View style={styles.form}>
                    <Controller
                        control={control}
                        name="firstName"
                        render={({field: {onChange, onBlur, value}}) => (
                            <TextField
                                label="First Name"
                                placeholder="First Name"
                                isNecessary={true}
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                errorValue={errors.firstName?.message}
                            />
                        )}
                    />

                    <View style={{height: hp(2)}} />

                    <Controller
                        control={control}
                        name="middleName"
                        render={({field: {onChange, onBlur, value}}) => (
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

                    <View style={{height: hp(2)}} />

                    <Controller
                        control={control}
                        name="lastName"
                        render={({field: {onChange, onBlur, value}}) => (
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

                    <View style={{height: hp(2)}} />

                    <Controller
                        control={control}
                        name="phoneNo"
                        render={({field: {onChange, onBlur, value}}) => (
                            <TextField
                                label="Phone No."
                                placeholder="Enter Phone No."
                                value={value}
                                isNumeric={true}
                                onChangeText={text => {
                                    if (text.length <= 10) {
                                        onChange(text); // Update only if length <= 10
                                    }
                                }}
                                onBlur={onBlur} // Trigger validation onBlur
                                errorValue={errors.phoneNo?.message}
                            />
                        )}
                    />

                    <View style={{height: hp(2)}} />

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
                        customDropdownStyle={[styles.dropdown, {width: wp(84)}]}
                        customSelectedTextStyle={styles.dropDownSelectedText}
                    />

                    <View style={{height: hp(2)}} />

                    <View style={styles.row}>
                        <CustomDropdown
                            label="RELATION"
                            data={RelationShipsData}
                            value={relation as string}
                            setValue={setRelation}
                            customDropdownStyle={styles.dropdown}
                            customSelectedTextStyle={styles.dropDownSelectedText}
                        />

                        <DatePickerModal date={dob} setDate={setDob} />
                    </View>

                    <View style={{height: hp(2)}} />

                    <View style={styles.genderHealthSchemeRow}>
                        <GenderRadioButton checked={checked} setChecked={setChecked} />

                        <CustomDropdown
                            label="HEALTH SCHEME"
                            data={HealthSchemesData}
                            value={healthScheme as string}
                            setValue={setHealthScheme}
                            customDropdownStyle={styles.dropdown}
                            customSelectedTextStyle={styles.dropDownSelectedText}
                            mode
                        />
                    </View>
                </View>

                {/* Save Location Button */}
                {mode === 'edit' ? (
                    <BigButton
                        title="Update"
                        onPress={handleSubmit(onSubmit)}
                        customStyle={{
                            backgroundColor: colors.darkBlue,
                        }}
                        loading={loading}
                    />
                ) : (
                    <BigButton title="Save" onPress={handleSubmit(onSubmit)} loading={loading} />
                )}
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
    form: {
        marginTop: hp(2),
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdown: {
        width: wp(40),
        height: hp(5),
        borderWidth: 1,
        borderColor: colors.grey,
        borderRadius: wp(3),
        backgroundColor: colors.white,
    },
    dropDownSelectedText: {
        fontSize: wp(4),
        // fontWeight: 'bold',
        paddingLeft: wp(2),
    },
    genderHealthSchemeRow: {
        flexDirection: 'row',
        gap: wp(3),
        alignItems: 'center',
    },
});
