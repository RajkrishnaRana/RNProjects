import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors } from '../../common/colors';
import { useNavigation } from '../../hooks/useNavigation';
import BigButton from '../../components/BigButton';
import CheckBox from '../../components/CheckBox';
import TextField from '../../components/TextField';
import CustomDropdown from '../../components/CustomDropdown';
import { z } from 'zod';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types/routeTypes';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGoogleAddressStore } from '../../store/googleAddressStore';
import { BASE_URL } from '../../config';
import { postData } from '../../api';
import Toast from 'react-native-simple-toast';
import { useAuthStore } from '../../store/authStore';
import { queryClient } from '../../../App';
import { isTab } from '../../utils/isTab';

type AddAddreeScreenRouteProps = RouteProp<RootStackParamList, 'AddAddress'>;

type Payload = {
    token: string;
    addressId?: string;
    state: string;
    mapLocation: {
        latitude: number;
        longitude: number;
    };
    addressLineOne: string;
    pinCode: string;
    firstName: string;
    lastName: string;
    mobileNumber: string;
    addressLineTwo?: string | undefined;
    city?: string | undefined;
    isPrimaryAdd?: boolean;
    isBillingAdd?: boolean;
    isShippingAdd?: boolean;
    companyName?: string | undefined;
};

// ZOD VALIDATION SCHEMA ----------------->
const addNewAddressSchema = z.object({
    firstName: z.string().nonempty('Name is required'),
    middleName: z.string().optional(),
    lastName: z.string().nonempty('Name is required'),
    mobileNumber: z
        .string()
        .length(10, 'Phone No. must be 10 digits')
        .regex(/^\d{10}$/, { message: 'Phone number must be numeric' }),
    companyName: z.string().or(z.literal('')).optional(),
    addressLineOne: z.string().nonempty('Address is required'),
    addressLineTwo: z.string().optional(),
    city: z.string().optional(),
    pinCode: z.string().length(6, 'Pin Code must be 6 digits'),
});
export type AddNewAddressDataType = z.infer<typeof addNewAddressSchema>;

export default function AddAddressScreen() {
    const navigation = useNavigation();
    const { mode, item, stateData } = useRoute<AddAddreeScreenRouteProps>().params;

    // console.log(item);

    // GLOBAL STATES ----------------------->
    const { addressLineOne, addressLineTwo, city, stateName, pinCode, mapLocation, resetAddressStates } = useGoogleAddressStore();
    const token = useAuthStore(s => s.token);

    // FORM HOOKS ---------------->
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<AddNewAddressDataType>({
        resolver: zodResolver(addNewAddressSchema),
        defaultValues: {
            firstName: item?.firstName || '',
            middleName: item?.middleName || '',
            lastName: item?.lastName || '',
            addressLineOne: item?.addressLineOne || '',
            addressLineTwo: item?.addressLineTwo || '',
            city: item?.city || '',
            pinCode: item?.pinCode || '',
            mobileNumber: item?.mobileNumber || '',
            companyName: item?.companyName || '',
        },
    });

    // STATE INITIALIZATION FUNCTION ------------------->
    const initializeDropdown = () => {
        for (const i of stateData) {
            if (i?.stateName === item?.state) return i;
        }
    };

    const addressModeSelector = () => {
        let data = {
            primaryAddress: false,
            defaultBillingAddress: false,
            defaultShippingAddress: false,
        };

        if (item?.isPrimaryAdd === true) data = { ...data, primaryAddress: true };
        if (item?.isBillingAdd === true) data = { ...data, defaultBillingAddress: true };
        if (item?.isShippingAdd === true) data = { ...data, defaultShippingAddress: true };

        return data;
    };

    // LOCAL STATES ----------------------------->
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState(initializeDropdown());
    const [firstRender, setFirstRender] = useState(false);
    const [addressUseCase, setAddressUseCase] = useState(addressModeSelector());

    // LOCAL FUNCTIONS ------------------------------->
    const onSubmit = async (data: AddNewAddressDataType) => {
        try {
            setLoading(true);
            const payload: Payload = {
                ...data,
                state: state?.stateName || '',
                mapLocation:
                    mode === 'add'
                        ? mapLocation
                        : {
                              latitude: item?.location?.coordinates[1] as number,
                              longitude: item?.location?.coordinates[0] as number,
                          },
                ...(mode !== 'add' ? { addressId: item?.id || '' } : {}),
                token: token as string,
            };

            if (addressUseCase.primaryAddress) payload.isPrimaryAdd = true;
            if (addressUseCase.defaultBillingAddress) payload.isBillingAdd = true;
            if (addressUseCase.defaultShippingAddress) payload.isShippingAdd = true;

            console.log(payload);

            const url = mode === 'add' ? `${BASE_URL}/hru/Patientappapi/addnewaddress` : `${BASE_URL}/hru/Patientappapi/editaddress`;
            //   `https://b845-2401-4900-1c01-67b5-7cf7-a631-5ad3-670b.ngrok-free.app/hru/Patientappapi/editaddress`;

            console.log(url);

            const res = await postData(url, payload);

            if (res.status) {
                Toast.show('Address updated successfully', Toast.SHORT);
                queryClient.invalidateQueries({
                    queryKey: ['addressData'],
                });
                queryClient.invalidateQueries({
                    queryKey: ['userProfile'],
                });
                navigation.goBack();
            } else {
                console.log(res);
                Toast.show('Failed to update address', Toast.SHORT);
            }
        } catch (error) {
            Toast.show('Something went wrong', Toast.SHORT);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', () => {
            // Check if the user hasn't saved the address
            // Reset the global states
            resetAddressStates();
            setFirstRender(false);
        });

        if (firstRender) {
            setValue('addressLineOne', addressLineOne);
            setValue('addressLineTwo', addressLineTwo);
            setState(stateName);
            setValue('city', city);
            setValue('pinCode', pinCode);
        }

        setFirstRender(true);

        return unsubscribe;
    }, [addressLineOne, addressLineTwo, city, stateName, pinCode, firstRender, navigation, resetAddressStates, setValue]);

    return (
        <View style={styles.mainContainer}>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {/* Address Input Fields */}
                <View style={styles.form}>
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
                            />
                        )}
                    />

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
                        name="mobileNumber"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextField
                                label="Mobile Number"
                                placeholder="Mobile Number"
                                isNecessary={true}
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                errorValue={errors.mobileNumber?.message}
                            />
                        )}
                    />

                    <View style={{ height: hp(2) }} />

                    <Controller
                        control={control}
                        name="companyName"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextField
                                label="Comapany Name"
                                placeholder="Enter Company Name"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                errorValue={errors.companyName?.message}
                            />
                        )}
                    />

                    <View style={{ height: hp(2) }} />

                    <Controller
                        control={control}
                        name="addressLineOne"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextField
                                label="Street Address 1"
                                placeholder="Enter Street Address"
                                isNecessary={true}
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                errorValue={errors.addressLineOne?.message}
                                isGooglePlacesEnabled
                                navigationProps={{
                                    stateData: stateData,
                                    value: value,
                                }}
                            />
                        )}
                    />

                    <View style={{ height: hp(2) }} />

                    <Controller
                        control={control}
                        name="addressLineTwo"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextField
                                label="Street Address 2"
                                placeholder="Enter Street address 2"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                errorValue={errors.addressLineTwo?.message}
                            />
                        )}
                    />

                    <View style={{ height: hp(2) }} />

                    <View style={styles.row}>
                        <CustomDropdown
                            data={stateData}
                            label="State"
                            value={state?.stateName || ''}
                            setValue={setState}
                            customDropdownStyle={styles.dropdown}
                            customPlaceholder="Select State"
                            customLabelField="stateName"
                            customValueField="stateName"
                            customSelectedTextStyle={styles.dropDownSelectedText}
                        />

                        <Controller
                            control={control}
                            name="city"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextField
                                    label="City"
                                    placeholder="City"
                                    isLabelActive
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    errorValue={errors.city?.message}
                                    customStyle={{ width: wp(35), color: colors.black, fontSize: isTab ? wp(2.5) : wp(3.5) }}
                                />
                            )}
                        />
                    </View>

                    <Controller
                        control={control}
                        name="pinCode"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextField
                                label="Pin Code"
                                placeholder="Pin Code"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                isNumeric={true}
                                isNecessary={true}
                                errorValue={errors.pinCode?.message}
                            />
                        )}
                    />
                    <View style={{ height: hp(2) }} />
                </View>

                <View style={{ gap: wp(2), marginVertical: hp(1.5) }}>
                    <CheckBox
                        rememberMe={addressUseCase.primaryAddress}
                        setRememberMe={() =>
                            setAddressUseCase({
                                ...addressUseCase,
                                primaryAddress: !addressUseCase.primaryAddress,
                            })
                        }
                        title="Set as primary address"
                    />
                    <CheckBox
                        rememberMe={addressUseCase.defaultBillingAddress}
                        setRememberMe={() =>
                            setAddressUseCase({
                                ...addressUseCase,
                                defaultBillingAddress: !addressUseCase.defaultBillingAddress,
                            })
                        }
                        title="Use as my default billing address"
                    />
                    <CheckBox
                        rememberMe={addressUseCase.defaultShippingAddress}
                        setRememberMe={() =>
                            setAddressUseCase({
                                ...addressUseCase,
                                defaultShippingAddress: !addressUseCase.defaultShippingAddress,
                            })
                        }
                        title="Use as my default shipping address"
                    />
                </View>

                {/* Save Location Button */}
                <BigButton
                    customStyle={{
                        marginTop: hp(1.5),
                        marginBottom: hp(1.5),
                        backgroundColor: mode === 'add' ? colors.primary : colors.darkBlue,
                    }}
                    title={mode === 'add' ? 'ADD ADDRESS' : 'UPDATE ADDRESS'}
                    onPress={handleSubmit(onSubmit)}
                    loading={loading}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: colors.backgroundColor },
    container: {
        flexGrow: 1,
        paddingHorizontal: wp(6),
        backgroundColor: colors.white,
        marginVertical: hp(1),
        marginHorizontal: wp(3),
        borderRadius: wp(5),
    },
    form: {
        marginTop: hp(2),
    },
    label: {
        fontSize: wp(4),
        marginBottom: hp(1),
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp(2),
    },
    dropdown: {
        width: wp(35),
        height: isTab ? hp(4) : hp(5),
        borderWidth: 1,
        borderColor: colors.grey,
        borderRadius: 15,
        backgroundColor: colors.white,
    },
    dropDownSelectedText: {
        fontSize: isTab ? wp(3) : wp(4),
        // fontWeight: 'bold',
        paddingLeft: wp(2),
    },
});
