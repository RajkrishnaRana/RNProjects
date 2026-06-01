/* eslint-disable react-native/no-inline-styles */
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useQuery } from '@tanstack/react-query';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types/routeTypes';
import { colors } from '../../common/colors';
import { BASE_URL } from '../../config';
import { postData } from '../../api';
import PageLoading from '../../components/LottieComponent/PageLoading';
import BackgroundGradient from '../../components/BackgroundGradient';
import { useNavigation } from '../../hooks/useNavigation';

type TestDetailsScreenProps = RouteProp<RootStackParamList, 'TestDetails'>;

const SmaillDetailContainer = ({ header, body }: { header: string; body: string }) => {
    return (
        <View style={{ marginBottom: hp(1), width: '48%' }}>
            <Text numberOfLines={1} style={{ fontSize: wp(3.2), color: colors.darkGrey }}>
                {header}
            </Text>
            <Text
                style={{
                    fontSize: wp(3.5),
                    textAlign: 'left',
                    color: colors.black,
                    fontWeight: 'bold',
                }}
            >
                {body ? body : '_'}
            </Text>
        </View>
    );
};

export default function TestDetailsScreen() {
    const navigation = useNavigation();
    const { test } = useRoute<TestDetailsScreenProps>().params;

    // LOCAL STATES ------------------------------->
    const [active, setActive] = useState(0);

    // LOCAL FUNCTIONS ------------------------------------->
    const onScrollChange = ({ nativeEvent }: any) => {
        const slide = Math.round(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
        if (slide !== active) {
            setActive(slide);
        }
    };

    // SIDE EFFECTS ----------------------------------->

    return (
        <BackgroundGradient>
            <View style={{ flex: 1, justifyContent: 'space-between', paddingBottom: hp(2.5) }}>
                {/* For the images of tests */}
                {test?.labImg && (
                    <View style={{ marginBottom: hp(3) }}>
                        <FlatList
                            data={test?.labImg}
                            renderItem={({ item }) => (
                                <Image
                                    source={{
                                        uri: item?.labImgPath,
                                    }}
                                    // source={item.path}
                                    style={styles.image}
                                    resizeMode="contain"
                                />
                            )}
                            pagingEnabled
                            horizontal
                            snapToAlignment="center"
                            onScroll={onScrollChange}
                            showsHorizontalScrollIndicator={false}
                            initialScrollIndex={0}
                        />
                        <View style={styles.pagination}>
                            {test?.labImg?.map((i: any, k: number) => (
                                <Text key={k} style={k == active ? styles.activeDot : styles.dot}>
                                    •
                                </Text>
                            ))}
                        </View>
                    </View>
                )}

                <View style={styles.testListsContainer}>
                    <Text style={styles.headingText}>{test.name}</Text>

                    <View
                        style={{
                            flexDirection: 'row',
                            gap: wp(20),
                            paddingHorizontal: wp(3),
                            justifyContent: 'space-between',
                        }}
                    >
                        <View style={styles.subHeadingText}>
                            <Text style={styles.subHeadingHeader}>Test Code</Text>
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    // color: colors.darkBlue,
                                    color: 'rgb(115, 130, 129)',
                                    fontSize: wp(5),
                                }}
                            >
                                {test?.code ? test?.code : '_'}
                            </Text>
                        </View>
                        <View style={styles.subHeadingText}>
                            <Text style={styles.subHeadingHeader}>Price</Text>
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    // color: colors.darkBlue,
                                    color: '#13A89E',
                                    fontSize: wp(5),
                                }}
                            >
                                ₹{test?.price}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View
                        style={{
                            // marginTop: hp(1),
                            // marginBottom: hp(2),
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            // boxShadow: colors.shadowColor,
                            paddingHorizontal: wp(2),
                            // paddingVertical: hp(0.5),
                            borderRadius: wp(5),
                            marginHorizontal: wp(-2),
                            gap: wp(2),
                        }}
                    >
                        {/* <SmaillDetailContainer header="SKU" body={test?.sku} /> */}
                        {/* <SmaillDetailContainer header="HSN Code" body={test?.hsnCode} /> */}
                        <SmaillDetailContainer header="Rx Required" body={test?.rxRequire} />
                        {/* <SmaillDetailContainer header="No. of Tests" body={test?.testNo} /> */}
                        <SmaillDetailContainer header="Home Collection Availability" body={test?.homeCollection} />
                        <SmaillDetailContainer header="Sample Required For" body={test?.sample} />
                    </View>

                    <View style={styles.divider} />

                    <View>
                        <Text
                            style={{
                                fontWeight: 'bold',
                                color: colors.darkBlue,
                                fontSize: wp(3.7),
                            }}
                        >
                            Test Preparation :
                        </Text>
                        <Text
                            style={
                                test?.preparation
                                    ? {
                                          color: colors.black,
                                          fontSize: wp(3.5),
                                          paddingLeft: wp(5),
                                          marginTop: hp(1),
                                      }
                                    : {
                                          color: 'rgb(175, 175, 175)',
                                          fontSize: wp(3.5),
                                          paddingLeft: wp(5),
                                          marginTop: hp(1),
                                          // textAlign: 'center'
                                      }
                            }
                        >
                            {test?.preparation ? test?.preparation : '*** No preparation required ***'}
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.descriptionWrapper}>
                        <Text style={styles.descriptionText}>Description : </Text>
                        <Text style={styles.descriptionBody}>{test?.description}</Text>
                    </View>

                    <View style={styles.descriptionWrapper}>
                        <Text style={styles.descriptionText}>Short Description : </Text>
                        <Text style={styles.descriptionBody}>{test?.shortDescription}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.bookTest} onPress={() => navigation.goBack()}>
                    <Text style={styles.bookText}>Book Test Now</Text>
                </TouchableOpacity>
            </View>
        </BackgroundGradient>
    );
}

const styles = StyleSheet.create({
    testListsContainer: {
        marginHorizontal: wp(3),
        // backgroundColor: colors.white,
        experimental_backgroundImage: 'linear-gradient(to bottom, white 70%, transparent)',
        // boxShadow: colors.primaryShadowColor2,
        paddingHorizontal: wp(5),
        paddingVertical: hp(2),
        borderRadius: wp(5),
        marginVertical: hp(0.8),
        borderWidth: wp(0.001),
        // elevation: 1,
    },
    image: {
        height: hp(20),
        width: wp(100),
        alignItems: 'center',
    },
    pagination: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: hp(-4),
        alignSelf: 'center',
    },
    dot: {
        color: colors.transparentPrimary,
        fontSize: wp(10),
    },
    activeDot: {
        color: colors.primary,
        fontSize: wp(10),
    },
    headingText: {
        fontSize: wp(4.5),
        color: colors.black,
        fontWeight: 'bold',
        marginBottom: hp(1.5),
        // marginLeft: wp(1),
    },
    subHeadingHeader: {
        color: ' rgb(168, 168, 168)',
        fontSize: wp(3.5),
    },
    detailHeader: {
        width: wp(35),
        fontWeight: 'bold',
        fontSize: wp(3.5),
        color: colors.black,
    },
    subHeadingText: {
        // fontSize: wp(4),
        // color: colors.darkGrey,
        // alignItems: 'flex-end'
    },
    descriptionText: {
        fontSize: wp(3.5),
        fontWeight: 'bold',
        color: colors.black,
        marginBottom: hp(0.5),
    },
    descriptionWrapper: {
        flexDirection: 'column',
        marginVertical: hp(1),
    },
    descriptionBody: {
        fontWeight: 'normal',
        color: colors.darkGrey,
        paddingLeft: wp(5),
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: colors.grey,
        borderStyle: 'dashed',
        marginHorizontal: wp(2),
        marginVertical: hp(2),
    },
    bookTest: {
        marginHorizontal: wp(3),
        backgroundColor: '#007A8A',
        paddingVertical: hp(2),
        borderRadius: wp(7),
        alignItems: 'center',
    },
    bookText: {
        fontSize: wp(4),
        color: '#fff',
        fontWeight: '600',
    },
});
