import { View, StyleSheet, ScrollView, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useGeoFencing } from '../hooks/useGeoFencing';
import BackgroundGradient from '../components/BackgroundGradient';
import { colors } from '../common/colors';
import BigButton from '../components/Buttons/BigButton';
import CustomDropdown from '../components/Dropdown/CustomDropdown';
import Animated from 'react-native-reanimated';
import { useNavigation } from '../hooks/useNavigation';
import StackHeader from '../components/Headers/StackHeader';

// type GeoFencingScreenProps = RouteProp<RootStackParamList, 'GeoFencing'>;

const GeoFencingMode = [
    {
        _id: 5,
        value: 'WALK',
    },
    {
        _id: 3,
        value: 'VEHICLE',
    },
];

const GeoFencingScreen = () => {
    const navigation = useNavigation();

    const {
        fencingMode,
        setFencingMode,
        stopPressed,
        locations,
        recording,
        startRecording,
        stopRecording,
        startButtonLoading,
        pos,
        setStopPressed,
        loading,
        handleNameChange,
        restartProcess,
        fileName,
        handleUpload,
        animatedStyle,
        showGeoDropDown,
        onBackPress,
    } = useGeoFencing(navigation);

    return (
        <BackgroundGradient>
            <StackHeader
                title="Geofencing"
                customBackHandler={() => {
                    if (locations.length === 0) navigation.goBack();
                    else onBackPress();
                }}
            />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flex: 1 }}>
                {/* Geofencing Interval options */}
                <Animated.View style={animatedStyle}>
                    {showGeoDropDown && (
                        <View style={styles.dropDownContainer}>
                            <CustomDropdown
                                label="Geofencing Mode"
                                customPlaceholder="Select Your Mode for Geofencing"
                                data={GeoFencingMode}
                                value={fencingMode}
                                setValue={setFencingMode}
                                exceptFormData
                                isSelectFullObj
                                customLabelStyle={{ fontSize: 15 }}
                            />
                        </View>
                    )}
                </Animated.View>

                {/* BOX STRUCTURE---------------------------------------------------------------------------- */}
                <View style={styles.positionContainer}>
                    {fencingMode && (
                        <Text style={styles.fencingModeText}>
                            <Text style={{ color: colors.black }}>Geofencing Mode :</Text> {fencingMode.value}
                        </Text>
                    )}
                    {!stopPressed && (
                        <>
                            {locations?.length > 0 ? (
                                <BigButton
                                    onPress={recording ? stopRecording : startRecording}
                                    title={recording ? 'PAUSE' : 'RESUME'}
                                    customIcon={
                                        recording ? (
                                            <Ionicons style={{ color: 'white' }} name="pause" size={20} />
                                        ) : (
                                            <Ionicons style={{ color: 'white' }} name="play" size={20} />
                                        )
                                    }
                                    customStyle={{ marginTop: 0, backgroundColor: recording ? colors.yellow : 'green' }}
                                    customTextStyle={{ fontSize: 16 }}
                                />
                            ) : (
                                <BigButton
                                    onPress={startRecording}
                                    title="START"
                                    customStyle={{ marginTop: 0 }}
                                    customTextStyle={{ fontSize: 16 }}
                                    loading={startButtonLoading}
                                />
                            )}
                        </>
                    )}

                    <Text style={{ marginTop: '3%' }}>
                        {' '}
                        Positions Marked : <Text style={{ fontWeight: 'bold' }}> {locations?.length} </Text>
                    </Text>
                    <View style={{ paddingTop: 25 }}>
                        {pos ? (
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Latitude: {pos.latitude}</Text>
                        ) : (
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                                Latitude: <Text style={{ color: 'brown' }}> - - </Text>
                            </Text>
                        )}
                        {pos ? (
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Longitude: {pos.longitude}</Text>
                        ) : (
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                                Longitude: <Text style={{ color: 'brown' }}> - - </Text>
                            </Text>
                        )}
                    </View>
                </View>

                {/* STOP BUTTON----------------------------------------------------------------- */}
                {locations?.length > 0 && !stopPressed && (
                    <BigButton
                        title="STOP"
                        onPress={() => {
                            stopRecording();
                            setStopPressed(true);
                        }}
                        customStyle={styles.cancelButton}
                        customTextStyle={styles.cancelButtonText}
                        customIcon={<Ionicons style={{ color: colors.red }} name="stop" size={20} />}
                    />
                )}

                {/* NAME TEXTINPUT------------------------------------------------------------- */}
                {stopPressed && (
                    <CustomDropdown
                        customPlaceholder="Select a section"
                        data={'SECTIONS'}
                        value={fileName}
                        setValue={handleNameChange}
                        searchFeature
                        customDropdownStyle={{ marginHorizontal: wp(5) }}
                        isSelectFullObj
                    />
                )}
            </ScrollView>

            {stopPressed && (
                <View style={styles.cancelUploadButtonContainer}>
                    {/* CANCEL------------------------------------------------------------------- */}
                    <BigButton
                        title="CANCEL"
                        onPress={restartProcess}
                        customStyle={[styles.cancelButton, { width: wp(43), marginTop: hp(1) }]}
                        customTextStyle={styles.cancelButtonText}
                    />

                    {/* UPLOAD--------------------------- */}
                    <BigButton
                        title="UPLOAD"
                        onPress={() => {
                            handleUpload();
                        }}
                        loading={loading}
                        customStyle={{ backgroundColor: colors.green, marginTop: hp(1), width: wp(43) }}
                        customTextStyle={{ fontSize: 16 }}
                    />
                </View>
            )}
        </BackgroundGradient>
    );
};

const styles = StyleSheet.create({
    dropDownContainer: {
        paddingHorizontal: wp(5),
    },
    fencingModeText: {
        fontSize: 15,
        color: colors.green,
        paddingBottom: hp(1),
        fontWeight: '600',
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        borderRadius: 5,
        gap: 5,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    positionContainer: {
        marginVertical: 20,
        padding: 20,
        borderColor: 'gray',
        borderRadius: 10,
        marginHorizontal: wp(5),
        backgroundColor: 'white',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
    },
    inputLocation: {
        height: wp(12),
        borderWidth: 1,
        borderColor: 'gray',
        paddingLeft: 10,
        marginVertical: 5,
        marginHorizontal: wp(5),
        color: 'black', // Color of the input
        fontSize: wp(4.2),
        borderRadius: wp(3),
        backgroundColor: 'white',
    },
    cancelUploadButtonContainer: { flexDirection: 'row', alignItems: 'center', paddingBottom: hp(8) },
    cancelButton: { backgroundColor: colors.white, marginHorizontal: wp(5), borderColor: colors.red, borderWidth: 1 },
    cancelButtonText: { color: colors.red, fontSize: 16 },
});

export default GeoFencingScreen;
