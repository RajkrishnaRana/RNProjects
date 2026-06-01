import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../common/colors';
import {useQuery} from '@tanstack/react-query';
import {postData} from '../api';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../types/routes';
import PageLoading from '../components/LottieComponenents/PageLoading';
import BackgroundGradient from '../components/BackgroundGradient';
import BASE_URL from '../config';

type LabDetailsScreenProps = RouteProp<RootStackParamList, 'LabDetails'>;

const SmaillDetailContainer = ({
    header,
    body,
}: {
    header: string;
    body: string;
}) => {
    return (
        <View style={{marginBottom: hp(1)}}>
            <Text style={{fontSize: wp(3.2), color: colors.darkGrey}}>
                {header}
            </Text>
            <Text
                style={{
                    fontSize: wp(3.5),
                    textAlign: 'left',
                    color: colors.black,
                    fontWeight: 'bold',
                }}>
                {body}
            </Text>
        </View>
    );
};

export default function TestDetailsScreen() {
    const {test} = useRoute<LabDetailsScreenProps>().params;

    // LOCAL STATES ------------------------------->
    const [active, setActive] = useState(0);

    // DATA FETCHING -------------------------------->
    const url = `${BASE_URL}/hru/Labstaffappapi/getlabdetails`;
    const {isPending, error, data} = useQuery({
        queryKey: [`${test.testId}`],
        queryFn: () => postData(url, {labTestId: test.testId}),
        select: data => {
            // console.log(data);
            return data?.doc;
        },
    });

    // LOCAL FUNCTIONS ------------------------------------->
    const onScrollChange = ({nativeEvent}: any) => {
        const slide = Math.round(
            nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
        );
        if (slide !== active) {
            setActive(slide);
        }
    };

    // SIDE EFFECTS ----------------------------------->

    return (
        <BackgroundGradient>
            <View style={{flex: 1, paddingTop: hp(2)}}>
                {isPending ? (
                    <PageLoading />
                ) : error ? (
                    <Text>Something Went wrong</Text>
                ) : (
                    <View style={styles.bodyContainer}>
                        {/* For the images of tests */}
                        {data?.labImg && (
                            <View style={{marginBottom: hp(3)}}>
                                <FlatList
                                    data={data?.labImg}
                                    renderItem={({item}) => (
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
                                    {data?.labImg?.map((i: any, k: number) => (
                                        <Text
                                            key={k}
                                            style={
                                                k == active
                                                    ? styles.activeDot
                                                    : styles.dot
                                            }>
                                            •
                                        </Text>
                                    ))}
                                </View>
                            </View>
                        )}

                        <View style={styles.testListsContainer}>
                            <Text style={styles.headingText}>
                                {test.testName} :{' '}
                            </Text>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    gap: wp(20),
                                    paddingHorizontal: wp(1),
                                }}>
                                <Text style={styles.subHeadingText}>
                                    Test Code -{' '}
                                    <Text
                                        style={{
                                            fontWeight: 'bold',
                                            color: colors.darkBlue,
                                        }}>
                                        {data?.code}
                                    </Text>
                                </Text>
                                <Text style={styles.subHeadingText}>
                                    Price -{' '}
                                    <Text
                                        style={{
                                            fontWeight: 'bold',
                                            color: colors.darkBlue,
                                        }}>
                                        ₹{data?.price}
                                    </Text>
                                </Text>
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
                                    paddingHorizontal: wp(4),
                                    // paddingVertical: hp(0.5),
                                    borderRadius: wp(5),
                                    marginHorizontal: wp(-2),
                                    gap: wp(2),
                                }}>
                                <SmaillDetailContainer
                                    header="SKU"
                                    body={data?.sku}
                                />
                                <SmaillDetailContainer
                                    header="HSN Code"
                                    body={data?.hsnCode}
                                />
                                <SmaillDetailContainer
                                    header="Rx Required"
                                    body={data?.rxRequire}
                                />
                                <SmaillDetailContainer
                                    header="No. of Tests"
                                    body={data?.testNo}
                                />
                                <SmaillDetailContainer
                                    header="Home Collection Availability"
                                    body={data?.homeCollection}
                                />
                                <SmaillDetailContainer
                                    header="Sample Required For"
                                    body={data?.sample}
                                />
                            </View>

                            <View style={styles.divider} />

                            <View>
                                <Text
                                    style={{
                                        fontWeight: 'bold',
                                        color: colors.darkBlue,
                                        fontSize: wp(3.7),
                                    }}>
                                    Test Preparation :
                                </Text>
                                <Text
                                    style={{
                                        color: colors.black,
                                        fontSize: wp(3.5),
                                    }}>
                                    {data?.preparation}
                                </Text>
                            </View>

                            <View style={styles.divider} />

                            <Text style={styles.descriptionText}>
                                Description :{' '}
                                <Text style={styles.descriptionBody}>
                                    {data?.description}
                                </Text>
                            </Text>

                            <Text style={styles.descriptionText}>
                                Short Description :{' '}
                                <Text style={styles.descriptionBody}>
                                    {data?.shortDescription}
                                </Text>
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        </BackgroundGradient>
    );
}

const styles = StyleSheet.create({
    bodyContainer: {},
    testListsContainer: {
        marginHorizontal: wp(3),
        backgroundColor: colors.white,
        boxShadow: colors.primaryShadowColor2,
        paddingHorizontal: wp(5),
        paddingVertical: hp(2),
        borderRadius: wp(5),
        marginVertical: hp(0.8),
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
        color: colors.primary,
        fontWeight: 'bold',
        marginBottom: hp(0.5),
        // marginLeft: wp(1),
    },
    detailHeader: {
        width: wp(35),
        fontWeight: 'bold',
        fontSize: wp(3.5),
        color: colors.black,
    },
    subHeadingText: {
        fontSize: wp(4),
        color: colors.darkGrey,
    },
    descriptionText: {
        fontSize: wp(3.5),
        fontWeight: 'bold',
        color: colors.black,
        marginBottom: hp(0.5),
    },
    descriptionBody: {
        fontWeight: 'normal',
        color: colors.darkGrey,
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: colors.grey,
        borderStyle: 'dashed',
        marginHorizontal: wp(10),
        marginVertical: hp(2),
    },
});
