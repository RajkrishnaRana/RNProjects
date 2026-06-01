import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableWithoutFeedback} from 'react-native';
import CustomTabHeader from '../components/CustomTabHeader';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Colors} from '../common/colors';
import {useAuthStore} from '../store/authStore';
import {postData} from '../utils/apiHelper';
import Animated, {useSharedValue, useAnimatedStyle, withSpring} from 'react-native-reanimated';
import EventCardSmallAnimation from '../components/lottieComponent/EventCardSmallAnimation';
import {useQuery} from '@tanstack/react-query';
import {SkaletonView} from 'react-native-skaleton-kit';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const AnnouncementScreen = () => {
    const {bottom} = useSafeAreaInsets();

    // ZUSTAND STATES ------------------------------------------------
    const {token, deviceId, logout} = useAuthStore();

    // LOCAL STATES ------------------------------------------------
    const [revealed, setRevealed] = useState(false);

    // FETCH API HANDLING ------------------------------->
    async function fetchData() {
        try {
            const initialPostData = {
                token: token,
                deviceId: deviceId,
            };
            console.log(initialPostData);

            const url = 'https://illimitable.in/app/mobile/events-plus.json';
            const res = await postData(url, initialPostData, logout);
            console.log(res.doc);
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    const {isLoading, error, data} = useQuery({
        queryKey: ['announceMents'],
        queryFn: fetchData,
    });

    const scale = useSharedValue(1);

    const toggleJoke = () => {
        scale.value = withSpring(1.1, {damping: 5}, () => {
            scale.value = withSpring(1);
        });
        setRevealed(!revealed);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{scale: scale.value}],
    }));

    return (
        <View style={styles.container}>
            <CustomTabHeader title="Announcements" />

            <View style={styles.innerContainer}>
                {/* Quote Section -------------------------------------------------- */}
                {isLoading ? (
                    <SkaletonView viewHeight={hp(15)} viewWidth={'auto'} style={{borderRadius: wp(4), marginBottom: hp(2)}} />
                ) : (
                    <View style={styles.card1}>
                        <Text style={styles.sectionTitle}>Daily Quote</Text>
                        <View style={styles.quoteContainer}>
                            <Text style={styles.quoteText}>"{data?.doc?.quote.message}"</Text>
                        </View>
                    </View>
                )}

                {data?.doc?.events?.length > 0 && (
                    <>
                        <Text style={styles.sectionTitleEvent}>Upcoming Events</Text>

                        {isLoading ? (
                            <SkaletonView viewHeight={'auto'} viewWidth={'auto'} style={{borderRadius: wp(4), marginBottom: hp(1), flex: 1}} />
                        ) : (
                            <View
                                style={{
                                    flex: 1,
                                    borderRadius: wp(3),
                                    borderWidth: wp(0.2),
                                    borderStyle: 'dashed',
                                    borderColor: Colors.LIGHT_BLUE,
                                    padding: wp(1),
                                }}>
                                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.card2}>
                                    {data?.doc?.events.map((event: any, index: number) => (
                                        <View key={index} style={styles.eventItem}>
                                            <View
                                                style={{
                                                    // flexDirection: 'row',
                                                    // backgroundColor: 'yellow',
                                                    width: wp(60),
                                                }}>
                                                <View style={styles.dateContainer}>
                                                    <Text style={styles.dateText}>{event.date}</Text>
                                                    {event.holiday && (
                                                        <View style={styles.holidayBadge}>
                                                            <Text style={styles.holidayText}>Holiday</Text>
                                                        </View>
                                                    )}
                                                </View>
                                                <Text style={styles.eventName}>{event.name}</Text>
                                            </View>

                                            <EventCardSmallAnimation data={event} />
                                        </View>
                                    ))}
                                    {/* <View style={{height: hp(20)}} /> */}
                                </ScrollView>
                            </View>
                        )}
                    </>
                )}

                {/* Joke Section --------------------------------------------------*/}
                {isLoading ? (
                    <SkaletonView viewHeight={hp(16)} viewWidth={'auto'} style={{borderRadius: wp(3), marginBottom: hp(8), marginTop: hp(2)}} />
                ) : (
                    <TouchableWithoutFeedback onPress={toggleJoke}>
                        <Animated.View style={[styles.card3, animatedStyle, {marginBottom: hp(8) + bottom}]}>
                            <Text style={styles.sectionTitle}>Joke of the Day</Text>
                            <View style={styles.jokeContainer}>
                                <Text style={styles.jokeSetup}>{data?.doc?.joke.setup}</Text>
                                {revealed && <Text style={styles.jokePunchline}>{data?.doc?.joke.punchline}</Text>}
                            </View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE,
    },
    innerContainer: {
        flex: 1,
        padding: wp(4),
    },
    card1: {
        justifyContent: 'flex-start',
        backgroundColor: '#ffffff',
        borderRadius: wp(4),
        padding: wp(4),
        marginBottom: hp(2),
        elevation: 10,
    },
    // scrollView card-------------------------
    card2: {
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderRadius: wp(4),
        padding: wp(4),
    },
    sectionTitle: {
        fontSize: wp(4),
        fontWeight: '600',
        color: '#333',
        marginBottom: hp(1.8),
    },
    sectionTitleEvent: {
        paddingLeft: wp(4),
        fontSize: wp(5),
        fontWeight: '600',
        color: '#333',
        marginBottom: hp(1.8),
    },
    quoteContainer: {
        padding: wp(3.5),
        backgroundColor: '#f0f4ff',
        borderRadius: wp(2),
        borderLeftWidth: wp(1.2),
        borderLeftColor: '#4a6fff',
    },
    quoteText: {
        fontSize: wp(3.5),
        fontStyle: 'italic',
        color: '#333',
    },
    eventItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: wp(0.3),
        borderColor: Colors.LIGHT_BLUE,
        marginBottom: hp(1.5),
        padding: wp(2.5),
        backgroundColor: '#f9f9f9',
        borderRadius: wp(3),
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    dateText: {
        fontSize: wp(4),
        color: '#666',
        marginRight: 8,
    },
    holidayBadge: {
        backgroundColor: '#ff6b6b',
        paddingHorizontal: wp(2.5),
        paddingVertical: hp(0.2),
        borderRadius: wp(3.5),
    },
    holidayText: {
        color: 'white',
        fontSize: wp(3.5),
        fontWeight: '500',
    },

    // JOKE ------------------------------>
    card3: {
        justifyContent: 'flex-end',
        backgroundColor: '#ffffff',
        borderRadius: wp(3),
        padding: wp(4),
        marginTop: hp(2),
        boxShadow: '0px 0px 5px #cececeff',
    },
    jokeContainer: {
        padding: wp(4.5),
        backgroundColor: '#fffbf0',
        borderRadius: wp(2.5),
        borderLeftWidth: wp(1.5),
        borderLeftColor: '#ffc107',
    },
    jokeSetup: {
        fontSize: wp(3.5),
        color: '#333',
        marginBottom: hp(1.8),
    },
    jokePunchline: {
        fontSize: wp(3.5),
        fontWeight: '600',
        color: '#333',
    },
    // Events Styles
    eventName: {
        fontSize: wp(4),
        fontWeight: '600',
        color: '#333',
    },
});

export default AnnouncementScreen;
