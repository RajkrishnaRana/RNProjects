import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/routeTypes';
import StackHeader from '../components/Headers/StackHeader';
import WorkerIcon from '../components/Texts/WorkerIcon';
import IconText from '../components/Texts/IconText';
import Lucide from '@react-native-vector-icons/lucide';
import { colors } from '../common/colors';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { getGenderIconName } from '../utils/textHelper';
import { wp } from '../utils/dimesion';
import useWorkerIcon from '../hooks/componentHooks/useWorkerIcon';
import { android_ripple_value } from '../constants/screenOptions';

type WorkerDetailsScreenProps = RouteProp<RootStackParamList, 'Worker Profile'>;

function LabelText({ value, title }: { value: string | number; title: string }) {
    return (
        <View>
            <Text style={styles.labelTextTitle}>{title}</Text>
            <Text style={styles.labelTextValue}>{value}</Text>
        </View>
    );
}

export default function WorkerDetailsScreen() {
    const { item } = useRoute<WorkerDetailsScreenProps>().params;
    const { profileImage, openCamera } = useWorkerIcon(item);

    return (
        <>
            <StackHeader title="Workers Profile" description={`${item.workerName}'s Profile details`} />

            <View style={styles.container}>
                <View style={styles.body}>
                    <Pressable android_ripple={android_ripple_value} onPress={openCamera}>
                        <WorkerIcon
                            title={item.workerName}
                            img={item.workerImagePath}
                            customStyle={styles.workerIcon}
                            customTextStyle={{ fontSize: wp(5.5) }}
                            profileImage={profileImage}
                        />
                    </Pressable>
                    <View style={{ gap: wp(1.2) }}>
                        <Text style={styles.workerName}>{item.workerName}</Text>
                        <Text style={styles.workerEmpNo}>{item.workerBookEmpNo}</Text>
                        <View style={styles.iconContainer}>
                            <IconText title={item.workerTypeName} icon={<Lucide name="user-round" size={wp(5)} color={colors.lightBlack} />} />
                            <IconText
                                title={item.workerGender?.toUpperCase()}
                                icon={<MaterialDesignIcons name={getGenderIconName(item.workerGender)} size={wp(5.5)} color={colors.lightBlack} />}
                            />
                        </View>
                    </View>
                </View>
            </View>

            <View style={[styles.container, { gap: wp(2.5) }]}>
                <IconText icon={<MaterialDesignIcons name="file-document-outline" size={20} color={colors.green} />} title="Worker Details" />

                <View style={styles.workerDetailsContainer}>
                    <View style={[styles.column, styles.lableTextContainer]}>
                        <LabelText title="Worker Type" value={item.workerTypeName} />
                        <LabelText title="Book" value={item?.workerBookName} />
                    </View>
                    <View style={styles.column}>
                        <LabelText title="Sub Type" value={item?.workerSubTypeName} />
                        <LabelText title="Worker Code" value={item.workerCode} />
                    </View>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.20)',
        borderRadius: 10,
        padding: 15,
        marginHorizontal: 10,
        marginVertical: 15,
    },
    body: { alignItems: 'center', gap: wp(3), flexDirection: 'row' },
    workerIcon: {
        height: wp(20),
        width: wp(20),
        borderRadius: 50,
    },
    workerName: {
        fontSize: wp(4.5),
        fontWeight: 'bold',
        color: colors.black,
    },
    workerEmpNo: {
        fontSize: wp(3),
        color: colors.darkGrey,
    },
    workerEmpNoTitle: { fontWeight: 'bold', color: colors.black },
    iconContainer: { flexDirection: 'row', alignItems: 'center', gap: wp(5) },
    workerDetailsContainer: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
        marginHorizontal: 5,
    },
    column: {
        flex: 1,
        gap: 10,
    },
    lableTextContainer: { flex: 1.5 },
    labelTextTitle: { color: colors.darkGrey, fontSize: wp(3.2) },
    labelTextValue: { color: colors.black, fontWeight: 'bold', fontSize: wp(3.8) },
});
