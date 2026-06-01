import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from '../common/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
// import SearchResult from '../components/SearchResult';
import SearchMedicineResult from '../components/SearchMedicineResult';
import { getData } from '../api';
import { useNavigation } from '../hooks/useNavigation';
import { useMedicineIntakeStore } from '../store/createMedicineIntakeStore';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { BASE_URL } from '../config';
import { isTab } from '../utils/isTab';

export interface dataProps {
    _id: string;
    name: string;
    type: string;
}

export default function MedicineIntakeSearchScreen() {
    const navigation = useNavigation();

    // ZUSTAND STATES --------------------------------------
    const { setSelectedMedicine } = useMedicineIntakeStore();

    const [searchText, setSearchText] = useState('');
    const [searchData, setSearchData] = useState([]);
    // const [loading, setLoading] = useState<boolean>(false);

    const renderItem = ({ item }: { item: dataProps }) => {
        return <SearchMedicineResult item={item} />;
    };

    useEffect(() => {
        const fetchMedicineData = async () => {
            try {
                const url = `${BASE_URL}/hru/Patientappapi/searchmedicinesfrommaster?q=${searchText}`;
                let response = await getData(url);
                if (response?.status === false) {
                    throw new Error(response?.msg || 'Unknown error occurred');
                } else if (response?.status === true) {
                    setSearchData(response?.docs);
                    console.log('api res data----', response);
                }
                // return response;
            } catch (error) {
                console.log(error);
            } finally {
                // setLoading(false);
            }
        };
        // setLoading(true);
        console.log('running');
        fetchMedicineData();
    }, [searchText]);

    return (
        <View style={styles.container}>
            <View style={styles.searchBoxContainer}>
                <AntDesignIcons size={isTab ? wp(3) : wp(5)} name="search1" style={{ width: wp(5) }} color={colors.primary} />
                <TextInput
                    placeholder="Search Medicine ..."
                    placeholderTextColor={colors.grey}
                    autoFocus
                    style={styles.textInput}
                    value={searchText}
                    onChangeText={(text: string) => setSearchText(text)}
                />
            </View>
            {searchText && (
                <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.searchContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack();
                            setSelectedMedicine({ name: searchText });
                            console.log('add medicine name', searchText);
                        }}
                    >
                        <Text style={styles.searchText}> + Add Medicine</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
            <FlatList data={searchData ? searchData : []} renderItem={renderItem} keyboardShouldPersistTaps="always" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: wp(5),
    },
    searchContainer: {
        marginVertical: hp(1),
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchBoxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: colors.primary,
    },
    searchText: {
        color: colors.white,
        padding: hp(1),
        fontSize: isTab ? wp(2.5) : wp(4),
        fontWeight: 'bold',
    },
    textInput: {
        flex: 1,
        marginLeft: wp(2),
        fontSize: isTab ? wp(2.5) : wp(3.5),
        color: colors.black,
    },
});
