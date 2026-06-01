import {FlatList, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../common/colors';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import SearchResult from '../components/SearchResult';
import {Route, RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../types/routes';
import {getName} from '../utils';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import BackgroundGradient from '../components/BackgroundGradient';

export interface dataProps {
    _id: string;
    name: string;
    type: string;
}

type SearchScreenProps = RouteProp<RootStackParamList, 'Search'>;

export default function SearchScreen() {
    const {appointment} = useRoute<SearchScreenProps>().params;

    // LOCAL STATES --------------------------------------_>
    const [searchText, setSearchText] = useState('');
    const [searchData, setSearchData] = useState(appointment);
    const [recentSearches, setRecentSearches] = useState<AppointmentData[]>([]);

    // LOCAL FUNCTIONS ------------------------------------->
    const renderItem = ({item}: {item: AppointmentData}) => {
        return <SearchResult item={item} />;
    };

    const handleOnChangeText = (text: string) => {
        setSearchText(text);

        if (text.trim() === '') {
            // Display recent searches if input is empty
            setSearchData(recentSearches);
            return;
        }

        const updatedFilteredData = appointment.reduce(
            (acc: AppointmentData[], item) => {
                const bookingId = item?.appointmentDetails?.bookingId;
                const patientName = getName(
                    item.patientDetails?.firstName || '',
                    item.patientDetails?.middleName || '',
                    item.patientDetails?.lastName || '',
                );

                // Check if the current item matches the search text
                if (
                    bookingId?.toLowerCase().includes(text.toLowerCase()) ||
                    patientName
                        ?.toLocaleLowerCase()
                        .includes(text.toLocaleLowerCase())
                ) {
                    // Add the matched item with the 'displayField' property
                    acc.push({
                        ...item,
                        displayField: patientName
                            .toLowerCase()
                            .includes(text.toLowerCase())
                            ? patientName
                            : bookingId,
                    });
                }
                return acc;
            },
            [],
        );

        setSearchData(updatedFilteredData);

        // Update recent searches with unique items
        if (text.length > 0) {
            setRecentSearches(prev => {
                const newRecent = [...updatedFilteredData, ...prev];

                // Create unique items based on a key (e.g., `bookingId` or `displayField`)
                const uniqueRecent = Array.from(
                    new Map(
                        newRecent.map(item => [
                            item?.appointmentDetails?.bookingId,
                            item,
                        ]),
                    ).values(),
                );

                return uniqueRecent.slice(0, 6); // Keep only the top 6 unique items
            });
        }
    };

    return (
        <BackgroundGradient>
            <View style={styles.container}>
                <View style={styles.searchBoxContainer}>
                    <AntDesignIcons
                        size={wp(5)}
                        name="search1"
                        style={{width: wp(5), color: colors.primary}}
                    />
                    <TextInput
                        placeholder="Search by Order No / Customer Name ..."
                        placeholderTextColor={colors.darkGrey}
                        autoFocus
                        style={styles.textInput}
                        value={searchText}
                        onChangeText={handleOnChangeText}
                    />
                    <EntypoIcons
                        name="cross"
                        size={wp(7)}
                        style={{
                            color: colors.primary,
                            // backgroundColor: 'blue',
                        }}
                        onPress={() => {
                            setSearchText(''), handleOnChangeText('');
                        }}
                    />
                </View>

                {appointment.length > 0 ? (
                    <FlatList
                        data={searchData}
                        renderItem={renderItem}
                        keyboardShouldPersistTaps="always"
                    />
                ) : (
                    <Text>No Search Data Available</Text>
                )}
            </View>
        </BackgroundGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp(3),
        marginTop: hp(1),
    },
    searchBoxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: colors.primary,
        backgroundColor: colors.white,
        borderRadius: wp(5),
        paddingVertical: hp(0.5),
        paddingHorizontal: wp(3),
    },
    textInput: {
        flex: 1,
        marginLeft: wp(2),
        fontSize: wp(3.5),
    },
});
