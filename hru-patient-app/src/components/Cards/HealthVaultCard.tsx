import { StyleSheet, Text, View, ActivityIndicator, Pressable } from 'react-native';
import React, { memo, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors } from '../../common/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { PatientPrescriptionsProps } from '../../screens/HealthVault/PrescriptionScreen';
import DeleteModal from '../Modal/DeleteModal';
import { getName } from '../../utils';
import moment from 'moment';
import ShareModal from '../Modal/ShareModal';
import { isTab } from '../../utils/isTab';
import Animated, { LinearTransition } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function TextIconButton({
    iconName,
    buttonName,
    iconColor,
    onPress,
    loading,
}: {
    iconName: string;
    buttonName: string;
    bgColor: string;
    iconColor: string;
    onPress?: () => void;
    loading?: boolean;
}) {
    return (
        <AnimatedPressable
            style={[
                styles.button,
                {
                    backgroundColor: colors.white,
                    borderColor: colors.darkGrey,
                },
            ]}
            onPress={onPress}
            android_ripple={{ color: colors.rippleBlack, borderless: false, radius: 35, foreground: true }}
            layout={LinearTransition}
        >
            {loading ? (
                <ActivityIndicator color={colors.primary} size={isTab ? wp(2) : wp(4)} />
            ) : (
                <>
                    <MaterialCommunityIcons name={iconName} size={isTab ? wp(2.5) : wp(4)} color={iconColor} />
                    <Text style={[styles.buttonText, { color: iconColor }]}>{buttonName}</Text>
                </>
            )}
        </AnimatedPressable>
    );
}

type HealthVaultComponentType = 'Prescription' | 'Report' | 'Invoice';

function HealthVaultCard({
    item,
    iconName,
    componentType,
    loading,
    downloadLoading,
    profileId,
    downloadFunction,
    fileViewFunction,
    deleteFunction,
    shareFunction,
}: {
    item: PatientPrescriptionsProps;
    iconName: string;
    componentType: HealthVaultComponentType;
    profileId?: string;
    loading?: boolean;
    downloadLoading?: boolean;
    downloadFunction: () => void;
    fileViewFunction: () => void;
    deleteFunction?: () => void;
    shareFunction?: () => void;
}) {
    // LOCAL STATES -------------------------------------->
    const [isModalVisible, setModalVisible] = useState(false);
    const [isShareModalVisible, setIsShareModalVisible] = useState(false);

    // LOCAL FUNCTIONS ------------------------------------>
    const handleDelete = () => setModalVisible(true);
    const handleShare = () => setIsShareModalVisible(true);

    return (
        <View style={styles.container}>
            <View style={styles.itemContainer}>
                <View style={styles.iconContainer}>
                    <FontAwesome name={iconName} size={isTab ? wp(3) : wp(5)} color={colors.primary} style={styles.icon} />
                </View>
                <View style={[isTab && { gap: hp(0.5) }]}>
                    {item?.type !== 'Uploaded' ||
                        (componentType === 'Invoice' && (
                            <Text style={styles.title}>
                                {item.type} {componentType}
                            </Text>
                        ))}
                    {item?.type === 'Uploaded' ? (
                        <Text style={styles.detailHeader}>
                            {/* File Name :&nbsp; */}
                            {item?.[`uploaded${componentType}`]?.fileName ? (
                                <Text style={styles.fileName}>
                                    {item?.[`uploaded${componentType}`]?.fileName}.{item?.[`uploaded${componentType}`]?.ext}
                                </Text>
                            ) : (
                                <Text style={styles.noFileName}>No file name</Text>
                            )}
                        </Text>
                    ) : (
                        <>
                            {item?.type !== 'Lab Uploaded' ? (
                                <Text style={styles.detailHeader}>
                                    Doctor Name :&nbsp;
                                    {item?.doctorDetails && (
                                        <Text style={styles.doctorName}>
                                            {getName(item?.doctorDetails?.firstName, item?.doctorDetails?.middleName, item?.doctorDetails?.lastName)}
                                        </Text>
                                    )}
                                </Text>
                            ) : (
                                <Text style={styles.detailHeader}>
                                    Lab Name :&nbsp;
                                    {item?.labDetails && <Text style={styles.doctorName}>{item?.labDetails?.labName}</Text>}
                                </Text>
                            )}

                            {(item?.uploadedReport?.reportType || item?.labTests) && (
                                <Text style={styles.detailHeader}>
                                    Test Report Name :&nbsp;
                                    {(item?.doctorDetails || item?.labTests?.testName) && (
                                        <Text style={styles.doctorName}>{item?.uploadedReport?.reportType || item?.labTests?.testName}</Text>
                                    )}
                                </Text>
                            )}

                            <Text style={styles.detailHeader}>
                                Transaction Id :&nbsp;
                                {item.bookingId && <Text style={styles.doctorName}>{item.bookingId}</Text>}
                            </Text>
                            {item?.prescriptionDate && (
                                <Text style={styles.detailHeader}>
                                    Prescribed On :&nbsp;
                                    {item?.prescriptionDate && (
                                        <Text style={styles.doctorName}>{moment(item?.prescriptionDate).format('Do MMM, YYYY')}</Text>
                                    )}
                                </Text>
                            )}
                            {item?.invoiceDate && (
                                <Text style={styles.detailHeader}>
                                    Dated On :&nbsp;
                                    {item?.invoiceDate && <Text style={styles.doctorName}>{moment(item?.invoiceDate).format('Do MMM, YYYY')}</Text>}
                                </Text>
                            )}
                        </>
                    )}
                </View>
            </View>
            <View style={styles.buttonContainer}>
                {item?.type === 'Uploaded' && (
                    <TextIconButton
                        iconName="delete"
                        buttonName="Delete"
                        iconColor={colors.red}
                        bgColor="rgba(245, 29, 10, .15)"
                        onPress={handleDelete}
                    />
                )}
                <TextIconButton
                    iconName="eye"
                    buttonName="View"
                    iconColor={colors.darkBlue}
                    bgColor="rgba(18, 93, 136, .15)"
                    onPress={fileViewFunction}
                    loading={loading}
                />
                <TextIconButton
                    iconName="file-download"
                    buttonName="Download"
                    iconColor={colors.primary}
                    bgColor="rgba(29, 186, 181, 0.15)"
                    onPress={downloadFunction}
                    loading={downloadLoading}
                />
                {componentType === 'Report' && (
                    <TextIconButton
                        iconName="share-circle"
                        buttonName="Share"
                        iconColor={colors.darkBlue}
                        bgColor="rgba(18, 93, 136, .15)"
                        onPress={handleShare}
                    />
                )}
            </View>

            {deleteFunction && <DeleteModal isModalVisible={isModalVisible} setModalVisible={setModalVisible} deleteFunction={deleteFunction} />}

            {shareFunction && (
                <ShareModal
                    isModalVisible={isShareModalVisible}
                    setModalVisible={setIsShareModalVisible}
                    profileId={profileId || ''}
                    item={item}
                    type={item.type}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: isTab ? wp(2) : wp(3),
        borderWidth: wp(0.01),
        // borderColor: colors.grey,
        borderRadius: wp(3),
        marginBottom: isTab ? hp(1) : hp(1.5),
        elevation: 2,
        backgroundColor: colors.white,
        marginHorizontal: wp(3),

        // Shadow for IOS
        shadowColor: 'blue',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    itemContainer: {
        flexDirection: 'row',
        gap: isTab ? wp(2) : wp(3),
        alignItems: 'center',
    },
    iconContainer: {
        // borderWidth: 1.5,
        borderColor: colors.primary,
        height: isTab ? wp(5) : wp(10),
        width: isTab ? wp(5) : wp(10),
        borderRadius: wp(5),
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: { alignSelf: 'center' },
    detailHeader: {
        fontSize: isTab ? wp(2) : wp(3.5),
        fontWeight: '600',
        color: colors.black,
        width: wp(75),
        // backgroundColor: colors.transparentBlue,
    },
    fileName: {
        fontWeight: 'bold',
        color: colors.lightBlack,
        fontSize: isTab ? wp(2) : wp(3.5),
    },
    noFileName: {
        fontWeight: 'normal',
        color: colors.darkGrey,
        fontSize: isTab ? wp(2) : wp(3.5),
        fontStyle: 'italic',
    },
    title: {
        fontSize: isTab ? wp(2.3) : wp(3.9),
        fontWeight: '500',
        color: colors.black,
    },
    doctorName: {
        fontWeight: 'normal',
        color: colors.darkGrey,
    },
    buttonContainer: {
        flexDirection: 'row-reverse',
        gap: isTab ? wp(2) : wp(3),
        marginTop: isTab ? hp(1) : hp(2),
        alignItems: 'flex-start',
    },
    button: {
        flexDirection: 'row',
        gap: wp(1),
        alignItems: 'center',
        borderRadius: wp(5),
        paddingHorizontal: wp(1.7),
        paddingVertical: wp(0.5),
        borderWidth: isTab ? 0.4 : 0.7,
    },
    buttonText: {
        fontSize: isTab ? wp(1.8) : wp(2.7),
        fontWeight: '500',
    },
});

export default memo(HealthVaultCard);
