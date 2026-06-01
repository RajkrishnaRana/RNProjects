import { StyleSheet, View, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '../hooks/useNavigation';
import BigButton from '../components/BigButton';
import { useGoogleAddressStore } from '../store/googleAddressStore';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/routeTypes';
import { colors } from '../common/colors';
import { isTab } from '../utils/isTab';
import { GooglePlacesAutocompleteDefaultProps } from '../common/GoogleplacesAutoComplete';

type GooglePlacesRouteProps = RouteProp<RootStackParamList, 'GooglePlaces'>;

export default function GooglePlacesAutocompleteScreen() {
    const navigation = useNavigation();
    const { stateData, addressLineTwo, value } = useRoute<GooglePlacesRouteProps>().params;
    console.log(value);

    // GLOBAL STATE ------------------------------------>
    const { setAddressLineOne, setAddressLineTwo, setCity, setStateName, setPinCode, setMapLocation } = useGoogleAddressStore();

    // LOCAL STATE ------------------------------------>
    const [typedAddress, setTypedAddress] = useState(value);

    // LOCAL FUNCTIONS --------------------------------->
    const getAddressComponent = (addressComponents: any, type: string) => {
        const component = addressComponents.find((comp: any) => comp.types.includes(type));
        return component ? component.long_name : null;
    };

    const handleSavePress = () => {
        Keyboard.dismiss();
        if (addressLineTwo) {
            setAddressLineTwo(typedAddress);
        } else {
            setAddressLineOne(typedAddress);
        }

        navigation.goBack();
    };

    // SIDE EFFECTS ------------------------------------>
    useEffect(() => {
        if (value) {
            setTypedAddress(value);
        }
    }, [value]);

    return (
        <View style={styles.container}>
            <GooglePlacesAutocomplete
                {...GooglePlacesAutocompleteDefaultProps} // 👈️ Spread all default props
                placeholder={'Type your address'}
                fetchDetails={true}
                debounce={500}
                enablePoweredByContainer={false}
                onPress={(data, details = null) => {
                    if (details) {
                        if (addressLineTwo) {
                            setAddressLineTwo(data.description);
                        } else {
                            const addressComponents = details.address_components;
                            const pincode = getAddressComponent(addressComponents, 'postal_code');
                            const city = getAddressComponent(addressComponents, 'locality');
                            const state = getAddressComponent(addressComponents, 'administrative_area_level_1');

                            const latLong = {
                                latitude: details.geometry.location.lat,
                                longitude: details.geometry.location.lng,
                            };

                            setMapLocation(latLong);
                            setAddressLineOne(data.description);

                            const selectedState = stateData.find(s => s.stateName === state);
                            setStateName(selectedState);
                            setPinCode(pincode);
                            setCity(city);
                        }

                        navigation.goBack();
                    }
                }}
                query={{
                    key: 'AIzaSyCJbnxIUqkQQE99IB4Ffg90k4cQ6wcf068',
                    language: 'en',
                }}
                textInputProps={{
                    placeholderTextColor: colors.darkGrey,
                    autoFocus: true,
                    value: typedAddress,
                    onChangeText: text => setTypedAddress(text),
                    onSubmitEditing: handleSavePress,
                    style: {
                        color: colors.black,
                        borderBottomColor: colors.primary,
                        borderBottomWidth: 1,
                        flex: 1,
                        fontSize: isTab ? wp(2.2) : wp(3.5),
                        paddingVertical: hp(1.5),
                    },
                }}
                styles={{
                    description: {
                        color: colors.black,
                    },
                }}
                onFail={error => console.warn('Google error:', error)}
            />
            <BigButton title="Save" onPress={handleSavePress} customStyle={styles.saveBtn} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp(3),
        backgroundColor: 'white',
    },
    saveBtn: { marginBottom: 20 },
});
