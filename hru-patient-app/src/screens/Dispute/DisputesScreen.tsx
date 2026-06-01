import React, { useEffect } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors } from '../../common/colors';
import { BASE_URL } from '../../config';
import { useQuery } from '@tanstack/react-query';
import { postData } from '../../api';
import { tokenExpiredMsg } from '../../utils';
import { useAuthStore } from '../../store/authStore';
import PageLoading from '../../components/LottieComponent/PageLoading';
import DisputeCard from '../../components/Cards/DisputeCard';
import BackgroundGradient from '../../components/BackgroundGradient';
import TabBarParent from '../../components/TabBarParent';
import { isTab } from '../../utils/isTab';
import { LegendList } from '@legendapp/list';

export default function DisputesScreen() {
    // GLOBAL STATES ----------------------------------->
    const { logout, token } = useAuthStore();

    // LOCAL STATES ----------------------------------->
    const [searchQuery, setSearchQuery] = React.useState('');
    const [filteredData, setFilteredData] = React.useState([]);

    // DATA FETCHING -------------------------------->
    const url = `${BASE_URL}/hru/Patientappapi/patientdisputelist`;
    const { isPending, error, data } = useQuery({
        queryKey: ['disputeList'],
        queryFn: () => postData(url, { token: token }),
        select: d => {
            if (d?.tokenExpired) tokenExpiredMsg(logout);
            console.log(d);
            return d?.docs;
        },
    });

    // Render Item for FlatList
    const renderItem = ({ item }: { item: DisputeObj }) => <DisputeCard item={item} />;

    // LOCAL FUNCTIONS ------------------------------>
    const handleOnChangeText = (text: string) => {
        setSearchQuery(text);

        if (text === '') {
            setFilteredData(data);
        } else {
            const filtered = data.filter((item: DisputeObj) => item?.dispute?.disputeId?.toLowerCase().includes(text.toLowerCase()));
            setFilteredData(filtered);
        }
    };

    // SIDE EFFECTS ---------------------------------->
    useEffect(() => {
        setFilteredData(data);
    }, [data]);
    ``;

    return (
        <TabBarParent>
            <BackgroundGradient>
                <View style={styles.container}>
                    {isPending ? (
                        <PageLoading />
                    ) : error ? (
                        <Text>Something is wrong</Text>
                    ) : (
                        <>
                            <TextInput
                                placeholder="Search by Disputes id ..."
                                placeholderTextColor={colors.darkGrey}
                                style={styles.searchInput}
                                value={searchQuery}
                                keyboardType="numeric"
                                onChangeText={handleOnChangeText}
                            />

                            <LegendList
                                data={filteredData}
                                renderItem={renderItem}
                                keyExtractor={item => item._id}
                                contentContainerStyle={styles.listContent}
                                recycleItems
                            />
                        </>
                    )}
                </View>
            </BackgroundGradient>
        </TabBarParent>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingHorizontal: wp(3),
        // backgroundColor: colors.backgroundColor,
    },
    listContent: {
        paddingBottom: hp(2),
    },
    searchInput: {
        backgroundColor: colors.white,
        borderRadius: wp(3),
        paddingVertical: isTab ? wp(1.5) : wp(2),
        paddingHorizontal: wp(3),
        borderWidth: wp(0.01),
        // borderColor: colors.darkBlue,
        marginBottom: isTab ? hp(1) : hp(1.5),
        color: colors.darkBlue,
        fontWeight: 'bold',
        marginTop: isTab ? hp(1) : hp(2),
        elevation: 2,
        marginHorizontal: wp(3),
        fontSize: isTab ? wp(2) : wp(3.5),

        //Shadow for IOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
    },
});
