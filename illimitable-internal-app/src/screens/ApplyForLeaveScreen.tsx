import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, View, Keyboard, ScrollView, Image, KeyboardAvoidingView} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {trigger} from 'react-native-haptic-feedback';
import {useQueryClient} from '@tanstack/react-query';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../common/colors';
import {useAuthStore} from '../store/authStore';
import BigButton from '../components/buttons/BigButton';
import CustomTabHeader from '../components/CustomTabHeader';
import CustomDropdown from '../components/CustomDropdown';
import HalfDayToggle from '../components/HalfDayToggle';
import {postData} from '../utils/apiHelper';
import Toast from 'react-native-toast-message';
import DatePicker from '../components/DatePicker';
import {useGemini} from '../hooks/useGemini';
import Animated, {FadeInLeft} from 'react-native-reanimated';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const options = {
    enableVibrateFallback: true,
};

export default function ApplyForLeaveScreen() {
    const navigation = useNavigation();
    const queryClient = useQueryClient();

    // ZUSTAND STATES ------------------------------->
    const {userData, token, deviceId, logout} = useAuthStore();

    //  CURRENT DATE TO FETCH API ---------------------------------------------------------
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // const currentDateInMS = new Date().getTime();

    // LOCAL STATES ------------------------------->
    const [date, setDate] = useState(currentDate);
    const [closeDate, setCloseDate] = useState(currentDate);
    // const [isVisible, setIsVisible] = useState(false);
    // const [isVisible2, setIsVisible2] = useState(false);
    const [leaveType, setLeaveType] = useState<{_id: string; name: string}>();
    const [isHalfDay, setIsHalfDay] = useState(false);
    const [loading, setLoading] = useState(false);

    // GEMINI STATES ------------------------------->
    const {prompt, generateResponse, setPrompt, mailBody, setMailBody, generating, isAiMode} = useGemini(
        date,
        closeDate,
        leaveType?.name as 'Sick Leave' | 'Casual Leave',
    );

    // const [remarks, setRemarks] = useState('');

    // const [isEditable, setIsEditable] = useState(true);

    // const resetState = () => {
    //     setCloseDate(date);
    //     // setRemarks();
    // };

    //  HANDLE LEAVE APPLICATION ---------------------------------------------------------
    const url = 'https://illimitable.in/app/mobile/submit-leave-application.json';
    const handleSave = async () => {
        trigger('impactLight', options);
        Keyboard.dismiss();
        //  ERROR CHECKS---------------------------------------------------------
        if (!leaveType) {
            Toast.show({
                type: 'warning',
                text1: 'Please select leave type',
                visibilityTime: 5000,
            });
            return;
        }

        if (!mailBody) {
            Toast.show({
                type: 'warning',
                text1: 'Please enter mail body',
                visibilityTime: 5000,
            });
            return;
        }

        const updatedPostData = {
            token: token,
            // deviceId: 'f4f81fbde6fd0559',
            deviceId: deviceId,
            dateFrom: date.getTime(),
            dateTo: closeDate.getTime(),
            halfday: isHalfDay,
            leaveType: leaveType?._id,
            mailBody: mailBody.replace(/[\r\n]/g, ' ').trim(),
        };
        console.log(updatedPostData);

        try {
            setLoading(true);
            const res = await postData(url, updatedPostData, logout);
            console.log('result after submit', res);

            if (!res.status) {
                Toast.show({
                    type: 'error',
                    text1: res?.msg,
                    visibilityTime: 5000,
                });
                return;
            }

            await Promise.all([
                queryClient.refetchQueries({queryKey: ['myLeaveBalance']}),
                queryClient.refetchQueries({queryKey: ['leaveHistory']}),
                queryClient.refetchQueries({queryKey: ['leaveApprovals']}),
                queryClient.refetchQueries({queryKey: ['my-attendance-today']}),
            ]);
            Toast.show({
                type: 'success',
                text1: 'Leave applied Successfully',
                visibilityTime: 4000,
            });
            navigation.goBack();
        } catch (error) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: 'Error applying leave',
                visibilityTime: 4000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <CustomTabHeader title="Apply For Leave" />
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <ScrollView contentContainerStyle={styles.innerContainer} keyboardShouldPersistTaps="handled">
                    {/* Date Group ---------------------------------------------------------------------> */}
                    <View style={styles.rowHalf}>
                        <View style={styles.inputGroupHalf}>
                            <Text style={styles.label}>
                                From Date <Text style={{color: Colors.RED}}>*</Text>
                            </Text>
                            <DatePicker date={date} setDate={setDate} minDate={currentDate} />
                        </View>

                        <View style={styles.inputGroupHalf}>
                            <Text style={styles.label}>
                                To Date <Text style={{color: Colors.RED}}>*</Text>
                            </Text>
                            <DatePicker date={closeDate} setDate={setCloseDate} />
                        </View>
                    </View>

                    {/* SELECT PARTY DROPDOWN ------------------------------------------------------------> */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Select Leave Type <Text style={{color: Colors.RED}}>*</Text>
                        </Text>
                        <CustomDropdown
                            data={userData?.leaveTypes}
                            value={leaveType}
                            setValue={setLeaveType}
                            customDropdownStyle={styles.dropdown}
                            customLabelField="name"
                            customValueField="_id"
                        />
                    </View>

                    {/* Half Day Toggle ----------------------------------------------------------------> */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Do you want a half day?
                            {/* <Text style={{color: Colors.RED}}>*</Text> */}
                        </Text>
                        <HalfDayToggle value={isHalfDay} onToggle={setIsHalfDay} />
                    </View>

                    {/* Mail Body */}
                    {leaveType && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>
                                Leave Reason <Text style={{color: Colors.RED}}>*</Text>
                            </Text>
                            <TextInput
                                style={styles.textInput}
                                value={mailBody}
                                placeholder={generating ? 'Generating your mail body...' : 'Enter Your leave reason ...'}
                                placeholderTextColor={Colors.GREY}
                                onChangeText={setMailBody}
                                multiline
                                numberOfLines={4}
                            />

                            <View style={styles.aiContainer}>
                                {isAiMode ? (
                                    <AnimatedTextInput
                                        entering={FadeInLeft}
                                        style={[styles.textInput, {minHeight: hp(5), maxHeight: hp(6), width: wp(75)}]}
                                        value={prompt}
                                        placeholder={'Enter Your Prompt ...'}
                                        placeholderTextColor={Colors.GREY}
                                        onChangeText={setPrompt}
                                    />
                                ) : (
                                    <View />
                                )}
                                <BigButton
                                    children={<Image source={require('../assets/icons/ai.png')} style={styles.aiIcon} />}
                                    customStyle={styles.aiButton}
                                    customMarginTop={{marginTop: 0}}
                                    loading={generating}
                                    onPress={generateResponse}
                                    disabled={isAiMode && prompt.length === 0}
                                />
                            </View>
                        </View>
                    )}

                    <BigButton
                        title="Apply"
                        loading={loading}
                        onPress={() => {
                            handleSave();
                        }}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: wp(5),
        paddingBottom: hp(4),
    },
    innerContainer: {
        flexGrow: 1,
        padding: wp(4),
    },
    inputGroup: {
        marginBottom: hp(2.5),
    },
    inputGroupHalf: {
        flex: 1,
        marginBottom: hp(2.5),
    },
    row: {
        flexDirection: 'row',
    },
    rowHalf: {
        flexDirection: 'row',
        gap: wp(5),
    },
    label: {
        fontWeight: 'bold',
        fontSize: wp(4.2),
        color: '#6B6B6B',
        marginBottom: hp(1),
        marginLeft: wp(3),
    },
    input: {
        borderWidth: wp(0.5),
        borderColor: Colors.PRIMARY,
        borderRadius: wp(2.5),
        padding: wp(2.8),
        backgroundColor: '#FFF',
        fontSize: wp(4),
        fontWeight: 'bold',
        color: Colors.PRIMARY,
    },
    inputNonEditable: {
        borderWidth: wp(0.5),
        borderColor: Colors.PRIMARY,
        borderRadius: wp(2),
        padding: wp(2.8),
        backgroundColor: '#FFF',
        fontSize: wp(4.2),
        color: Colors.PRIMARY,
        fontWeight: 'bold',
        opacity: 0.6,
    },
    dropdown: {
        // width: wp(40),
        flex: 1,
        borderColor: Colors.LIGHT_BLUE,
        borderWidth: wp(0.5),
        borderRadius: wp(10),
        paddingHorizontal: wp(2.6),
        height: hp(5.8),
    },
    textInput: {
        borderWidth: wp(0.5),
        borderColor: Colors.LIGHT_BLUE,
        borderRadius: wp(4),
        padding: wp(2.8),
        backgroundColor: '#FFF',
        fontSize: wp(4.2),
        color: Colors.PRIMARY,
        fontWeight: 'bold',
        minHeight: wp(4.2) * 1.4 * 4,
    },
    aiIcon: {
        height: wp(6),
        width: wp(6),
        tintColor: Colors.WHITE,
    },
    aiContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp(2),
        alignItems: 'center',
    },
    aiButton: {width: wp(12), borderRadius: 10, height: hp(6)},
});
