import { StyleSheet, TextInput, TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from '../common/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import SearchResult from '../components/SearchResult';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/routeTypes';
import { FlashList } from '@shopify/flash-list';
import { isTab } from '../utils/isTab';
import { useCurrentTabDashboard } from '../store/dashboardCurrentTab';
import { BASE_URL } from '../config';
import { useAuthStore } from '../store/authStore';
import { postData } from '../api';
import Toast from 'react-native-simple-toast';
import { queryClient } from '../../App';
import BigButton from '../components/BigButton';

export interface dataProps {
    _id: string;
    name: string;
    type?: 'SPECIALITY' | 'DOCTOR' | 'MEDICINE' |string;
}

type SearchScreenRoute = RouteProp<RootStackParamList, 'Search'>;

export default function SearchScreen() {
    const { data, payload, type } = useRoute<SearchScreenRoute>().params;
    

    const { selectedTab } = useCurrentTabDashboard();
    const { token, isAuthenticated } = useAuthStore();

    const [searchText, setSearchText] = useState('');
    const [searchData, setSearchData] = useState(data);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const renderItem = ({ item }: { item: dataProps }) => {
        return <SearchResult item={item} payload={payload} type={type} />;
    };

    const handleOnChangeText = (text: string) => {
        setSearchText(text);

        const filteredData = data.filter(item => item.name.toLowerCase().includes(text.toLowerCase()));

        setSearchData(filteredData);
    };

    const handleManualSearchMed = async ()=> {
        console.log('hitting', searchText);
        
        const url = `${BASE_URL}/hru/Patientappapi/search-medicine?name=${searchText}`
        const searchPayload= {
            token: isAuthenticated ? token : null,
        }
        try {
            
            setLoading(true);
            const res = await postData(url, searchPayload);

            if (!res.status) {
                Toast.show(res.msg, Toast.SHORT);
                throw new Error(res.msg);
            }
            setLoading(false);
            console.log('manual search', res);

            navigation.navigate('MedSearchByType', { data : res?.doc })
            
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <View style={styles.container}>
            <View style={[styles.searchBoxContainer]}>
                <AntDesignIcons size={isTab ? wp(3.5) : wp(5)} name="search1" style={{ width: wp(5) }} color={colors.primary} />
                <TextInput
                    placeholder={selectedTab === 'lab' ? 'Search Lab Name, Test Name ...' : selectedTab === 'doctor' ? 'Search Doctor, Specialities ...' : selectedTab === 'pharmacy' ? 'Search Medicine Names ...' : 'Search Specialities, Doctors, Clinics ...'}
                    placeholderTextColor={colors.darkGrey}
                    autoFocus
                    style={styles.textInput}
                    value={searchText}
                    onChangeText={handleOnChangeText}
                />
                {
                    selectedTab === 'pharmacy' && (
                        // <BigButton loading={loading} title='Search' onPress={handleManualSearchMed} customLoaderColor={colors.white} />

                        <TouchableOpacity style={styles.search} onPress={handleManualSearchMed}>
                          { loading ? <ActivityIndicator size={wp(6)} color={colors.white}/> : <Text style={styles.searchText}>Search</Text>}
                        </TouchableOpacity>
                    )
                }
            </View>

            <FlashList data={searchData} renderItem={renderItem} decelerationRate={0.7} keyboardShouldPersistTaps="handled" />

            {/* <View style={styles.popup}>
                <ActivityIndicator size={wp(10)} color={colors.primary} />
            </View> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: wp(5),
    },
    searchBoxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: isTab ? 10 : 0,
    },
    textInput: {
        flex: 1,
        marginLeft: wp(2),
        fontSize: isTab ? wp(2.5) : wp(3.5),
        color: colors.black,
        paddingVertical: hp(1.5),
        borderBottomWidth: 1,
        borderColor: colors.primary,
    },
    search: {
        backgroundColor: colors.primary,
        paddingHorizontal: wp(4),
        paddingVertical: wp(2.5),
        borderRadius: wp(10),
        marginLeft: wp(3)
    },
    searchText: {
        color: colors.white
    },
    popup: {
        height: hp(100),
        width: wp(100),
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(44, 44, 44, 0.14)',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
