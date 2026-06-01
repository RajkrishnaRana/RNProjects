import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { wp } from '../../utils/dimesion';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../common/colors';
import WorkerMaster from '../../model/workerMaster';

interface Props {
    worker: WorkerMaster | undefined;
    pluckingCount: number;
}

export default function BluetoothWorkerProfileCard({ worker, pluckingCount }: Props) {
    return (
        <LinearGradient style={styles.container} colors={['#00C855', '#00AA84']} useAngle={true} angle={160}>
            <View style={styles.bodyContainer}>
                <View style={[styles.imgCover, worker?.workerImagePath && { padding: wp(0) }]}>
                    <Image
                        source={worker?.workerImagePath ? { uri: worker.workerImagePath } : require('../../assets/images/profile-picture.png')}
                        style={[styles.img, worker?.workerImagePath && { height: wp(15), width: wp(15) }]}
                    />
                </View>

                <View>
                    <Text style={styles.workerName}>{worker ? worker.workerName : 'Worker Name'}</Text>
                    <Text style={styles.workerDesc}>
                        {worker ? worker.workerBookEmpNo : 'Touch your nfc card to get the data or manually entry worker code'}
                    </Text>
                </View>
            </View>

            <View style={styles.countContainer}>
                <Text style={styles.countText}>{pluckingCount}</Text>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: wp(5),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: wp(3),
        borderRadius: 20,
    },
    bodyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(3),
    },
    imgCover: {
        padding: wp(2),
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderWidth: 0.2,
        borderColor: colors.white,
        boxShadow: '0px 2px 5px rgba(255, 255, 255, 0.5)',
    },
    img: {
        height: wp(12),
        width: wp(12),
        borderRadius: 50,
    },
    workerName: {
        fontSize: wp(4.5),
        fontWeight: 'bold',
        color: colors.white,
        maxWidth: wp(50),
    },
    workerDesc: {
        fontSize: wp(3),
        color: colors.white,
        maxWidth: wp(60),
        lineHeight: wp(4),
        fontWeight: '300',
    },
    countContainer: {
        backgroundColor: colors.white,
        borderRadius: 10,
        height: wp(10),
        width: wp(10),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: wp(-8),
    },
    countText: {
        fontSize: wp(4.5),
        fontWeight: 'bold',
        color: colors.green,
    },
});
