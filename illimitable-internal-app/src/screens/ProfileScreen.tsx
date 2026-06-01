import {ScrollView, StyleProp, StyleSheet, Text, TextStyle, View} from 'react-native';
import React from 'react';
import CustomTabHeader from '../components/CustomTabHeader';
import {useAuthStore} from '../store/authStore';
import {Colors} from '../common/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useProfileScreen} from '../hooks/useProfileScreen';
import {SkaletonView} from 'react-native-skaleton-kit';
import CustomDropdown from '../components/CustomDropdown';
import BigButton from '../components/buttons/BigButton';
import DeviceInfo from 'react-native-device-info';
import LogOutModal from '../components/modal/LeaveTransferConfirmationModal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const IconText = ({icon, text, customTextStyle}: {icon: React.ReactNode; text: string; customTextStyle?: StyleProp<TextStyle>}) => (
    <View style={styles.iconContainer}>
        {icon}
        <Text style={[styles.iconText, customTextStyle]}>{text}</Text>
    </View>
);

const Details = ({title, value}: {title: string; value: string}) => (
    <>
        <View style={styles.detailContainer}>
            <Text style={styles.detailTitle}>{title}</Text>
            <Text style={styles.detailValue}>{value}</Text>
        </View>
    </>
);

const HolidayBox = ({title, value}: {title: string; value: number | undefined}) => (
    <View style={[styles.elevatedContainer, styles.holidayBox]}>
        <Text style={styles.holidayValue}>{value}</Text>
        <Text style={{color: Colors.GREY}}>{title}</Text>
    </View>
);

const Counter = ({maxCount, count, increment, decrement}: {maxCount: number; count: number; increment: () => void; decrement: () => void}) => {
    return (
        <View style={styles.counterContainer}>
            <BigButton customMarginTop={{marginTop: 0}} customStyle={styles.button} onPress={decrement} title="-" disabled={count <= 0} />
            <Text style={styles.counterValue}>{count}</Text>
            <BigButton
                customMarginTop={{marginTop: 0}}
                customStyle={styles.button}
                onPress={increment}
                title="+"
                disabled={count === Math.floor(maxCount)}
            />
        </View>
    );
};

export default function ProfileScreen() {
    const {name, email, userData} = useAuthStore();
    const {bottom} = useSafeAreaInsets();
    const {
        superVisorDataLoading,
        superVisorData,
        isLoading,
        leaveBalance,
        employeeList,
        employeeListError,
        employeeListLoading,
        selectedEmployee,
        setSelectedEmployee,
        transferLoading,
        leaveTransfer,
        count,
        increment,
        decrement,
        toggleModal,
        isVisible,
    } = useProfileScreen();
    const profileIcon = name && name.split(' ')[0].charAt(0) + name.split(' ')[1].charAt(0).toLowerCase();
    // console.log('userData', userData);
    console.log('superVisorData', superVisorData);

    return (
        <View style={styles.container}>
            <CustomTabHeader title="Your Profile" />

            <ScrollView contentContainerStyle={[styles.scrollContainer, {paddingBottom: hp(10) + bottom}]}>
                {/* Profile Details */}
                <View style={styles.headerContainer}>
                    <LinearGradient colors={[Colors.LIGHT_BLUE, Colors.PRIMARY]} style={styles.profileImg} useAngle angle={135}>
                        <Text style={styles.imgText}>{profileIcon || 'Il'}</Text>
                    </LinearGradient>

                    <View style={{gap: hp(0.5)}}>
                        <Text style={[styles.iconText, styles.nameText]}>{name}</Text>
                        <IconText icon={<Ionicons name="id-card-outline" size={wp(5)} color={Colors.PRIMARY} />} text={userData?.code || '- -'} />
                        <IconText icon={<MaterialIcons name="email" size={wp(5)} color={Colors.PRIMARY} />} text={email || '- -'} />
                    </View>
                </View>

                {/* Supervisor Details */}
                {superVisorDataLoading ? (
                    <SkaletonView viewHeight={hp(15)} viewWidth={'auto'} style={styles.supervisorContainer} />
                ) : (
                    <>
                        {superVisorData?.[0]?.supervisor && (
                            <View style={styles.elevatedContainer}>
                                <IconText
                                    icon={<Fontisto name="user-secret" size={wp(5)} color={Colors.PRIMARY} />}
                                    text={'Supervisor Details'}
                                    customTextStyle={styles.supervisorTitle}
                                />

                                <View style={styles.divider} />

                                <View style={{paddingHorizontal: wp(2), marginTop: hp(1), gap: hp(1)}}>
                                    <Details title="Name" value={superVisorData?.[0]?.supervisor || '- -'} />
                                    <Details title="Id" value={superVisorData?.[0]?.supervisorCode || '- -'} />
                                    <Details title="Email" value={superVisorData?.[0]?.supervisorEmail || '- -'} />
                                </View>
                            </View>
                        )}
                    </>
                )}

                {/* Leave Status */}
                <View style={[styles.elevatedContainer, {marginTop: hp(2)}]}>
                    <IconText
                        icon={<Fontisto name="holiday-village" size={wp(5)} color={Colors.PRIMARY} />}
                        text={'Leave Status'}
                        customTextStyle={styles.supervisorTitle}
                    />

                    <View style={styles.divider} />

                    <View style={styles.leaveStatusContainer}>
                        {isLoading ? (
                            <>
                                <SkaletonView viewHeight={hp(10)} viewWidth={wp(35)} style={styles.skaletonStyle} />
                                <SkaletonView viewHeight={hp(10)} viewWidth={wp(35)} style={styles.skaletonStyle} />
                            </>
                        ) : (
                            <>
                                <HolidayBox title={'Casual Leave'} value={leaveBalance?.['Casual Leave']} />
                                <HolidayBox title={'Sick Leave'} value={leaveBalance?.['Sick Leave']} />
                            </>
                        )}
                    </View>

                    {employeeListLoading ? (
                        <SkaletonView viewHeight={hp(23)} viewWidth={'auto'} style={{...styles.skaletonStyle, marginTop: hp(1)}} />
                    ) : employeeListError ? (
                        <>
                            <Text style={styles.errorText}>Something went wrong</Text>
                        </>
                    ) : (
                        <View style={[styles.elevatedContainer, styles.transferContainer]}>
                            <Text style={styles.transferTitle}>Transfer Leaves : </Text>

                            <View style={styles.dropdownContainer}>
                                <Text style={styles.transferToText}>To : </Text>
                                <CustomDropdown
                                    value={selectedEmployee}
                                    setValue={setSelectedEmployee}
                                    data={employeeList}
                                    customLabelField="name"
                                    customValueField="_id"
                                    modal
                                    customPlaceholder="Select Employee"
                                    customDropdownStyle={styles.dropdown}
                                    customSelectedTextStyle={styles.transferSelectedText}
                                />
                            </View>

                            <View style={styles.dropdownContainer}>
                                <Text style={styles.transferToText}>Count : </Text>
                                <Counter maxCount={leaveBalance?.['Casual Leave'] || 0} count={count} increment={increment} decrement={decrement} />
                            </View>

                            <BigButton
                                customMarginTop={{marginTop: hp(3)}}
                                customStyle={styles.transferButton}
                                onPress={toggleModal}
                                title="Transfer"
                                customTextStyle={{fontSize: wp(4)}}
                                disabled={count === 0}
                            />
                        </View>
                    )}
                </View>
            </ScrollView>

            <LinearGradient colors={['transparent', 'white', 'white']} style={[styles.footer, {height: hp(10) + bottom, bottom: bottom + hp(1)}]}>
                <Text style={styles.versionText}>App Version : {DeviceInfo.getVersion()}</Text>
                <Text style={styles.versionText}>Made with ❤️ – bugs included free</Text>
            </LinearGradient>

            <LogOutModal isVisible={isVisible} toggleModal={toggleModal} handlePress={leaveTransfer} loading={transferLoading} count={count} />
        </View>
    );
}

const styles = StyleSheet.create({
    iconContainer: {flexDirection: 'row', alignItems: 'center', gap: wp(2)},
    detailContainer: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
    detailTitle: {width: wp(15), fontSize: wp(4), fontWeight: 'bold', color: Colors.GREY},
    detailValue: {fontSize: wp(4.2), color: Colors.BLACK, fontWeight: '600', textAlign: 'right'},
    container: {flex: 1, backgroundColor: 'white'},
    scrollContainer: {flexGrow: 1},
    headerContainer: {
        marginHorizontal: wp(5),
        marginVertical: hp(2),
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(4),
    },
    profileImg: {
        height: wp(20),
        width: wp(20),
        borderRadius: wp(15),
        backgroundColor: Colors.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imgText: {
        color: 'white',
        fontSize: wp(7),
        fontWeight: 'bold',
    },
    iconText: {
        color: Colors.BLACK,
        fontSize: wp(3.5),
    },
    nameText: {fontSize: wp(5.5), fontWeight: 'bold'},
    supervisorContainer: {marginHorizontal: wp(5), marginVertical: hp(2), borderRadius: 15},
    supervisorTitle: {fontWeight: 'bold', fontSize: wp(4)},
    divider: {borderWidth: hp(0.05), borderStyle: 'dashed', marginVertical: hp(1), borderColor: Colors.GREY},
    leaveStatusContainer: {flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: hp(1.5), marginTop: hp(1)},
    skaletonStyle: {borderRadius: 10},
    errorText: {color: 'red'},
    elevatedContainer: {
        padding: wp(4),
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1), 0px 6px 12px rgba(0, 0, 0, 0.05)',
        borderRadius: wp(2),
        backgroundColor: '#F8F9FA',
        marginHorizontal: wp(5),
    },
    transferContainer: {backgroundColor: 'white', marginHorizontal: 0},
    transferTitle: {color: 'black', fontWeight: '600', fontSize: wp(4)},
    holidayBox: {backgroundColor: Colors.WHITE, alignItems: 'center', marginHorizontal: 0, width: wp(35)},
    holidayValue: {fontSize: wp(6), fontWeight: 'bold', color: Colors.PRIMARY},
    dropdownContainer: {flexDirection: 'row', alignItems: 'center', marginTop: hp(2), gap: wp(3)},
    transferToText: {fontSize: wp(4), fontWeight: 'bold', color: Colors.GREY, width: wp(13)},
    transferSelectedText: {fontSize: wp(4), fontWeight: 'bold'},
    dropdown: {
        width: wp(55),
        height: hp(5),
        borderWidth: 0.5,
        borderColor: Colors.GREY,
        borderRadius: 10,
        paddingLeft: wp(3),
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(3),
    },
    counterValue: {fontSize: wp(4), fontWeight: 'bold', color: Colors.PRIMARY},
    button: {width: wp(10), height: wp(10), borderRadius: 5},
    transferButton: {
        width: wp(70),
        borderRadius: 15,
        height: wp(10),
    },
    footer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
        paddingBottom: hp(1),
    },
    versionText: {
        fontSize: wp(3),
        color: Colors.PRIMARY,
        textAlign: 'center',
    },
});
