import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { hp, wp } from '../../utils/dimesion';
import { colors } from '../../common/colors';
import LineDivisor from '../LineDivisor';
import { database } from '../../..';
import PluckedQuantityMaster from '../../model/pluckedQuantityMaster';
import { Q } from '@nozbe/watermelondb';
import { Weighment } from '../../hooks/screenHooks/useRecordPluckingInDetails';
import WorkerMaster from '../../model/workerMaster';
import Animated, { FadeInLeft, FadeOut } from 'react-native-reanimated';

interface Props {
    weighment: Weighment;
    worker: WorkerMaster | undefined;
}

export default function WeighmentCard({ weighment, worker }: Props) {
    const [totalWeight, setTotalWeight] = useState(0.0);
    const [currentWeight, setCurrentWeight] = useState(0.0);
    const [weights, setWeights] = useState<number[]>([]);

    useEffect(() => {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const endOfToday = startOfToday + 24 * 60 * 60 * 1000 - 1;
        const pluckedQuantityCollection = database.collections.get<PluckedQuantityMaster>('plucked_quantity_master');
        const pluckedQuantitySub = pluckedQuantityCollection
            .query(
                Q.where('record_date', Q.gte(String(startOfToday))),
                Q.where('record_date', Q.lt(String(endOfToday))),
                Q.where('worker_id', Q.eq(worker?.workerId)),
            )
            .observe()
            .subscribe({
                next: records => {
                    let totalRecordValue = 0,
                        currentRecordValue = 0,
                        weightsArray = [0, 0, 0, 0];

                    for (let i = 0; i < records.length; i++) {
                        if (records[i].weighmentNumber === weighment?.id) {
                            currentRecordValue = records[i].recordQuantity;
                        }

                        weightsArray[records[i].weighmentNumber - 1] = records[i].recordQuantity;
                    }

                    for (let i = 0; i < weightsArray.length; i++) {
                        totalRecordValue += weightsArray[i];
                    }

                    setTotalWeight(totalRecordValue);
                    setCurrentWeight(currentRecordValue || 0.0);
                    setWeights(weightsArray);
                },
                error: err => {
                    console.error('WatermelonDB pluckedQuantityMaster fetch error:', err);
                },
            });

        return () => pluckedQuantitySub.unsubscribe();
    }, [weighment?.id, worker]);

    return (
        <Animated.View style={styles.container} entering={FadeInLeft.duration(300)} exiting={FadeOut}>
            <View style={styles.weightContainer}>
                <View style={styles.weightBlock}>
                    <Text style={styles.heading}>Collected</Text>
                    <Text style={[styles.weight, { color: colors.green }]}>{currentWeight} KG</Text>
                </View>
                <View style={styles.weightBlock}>
                    <Text style={styles.heading}>Total</Text>
                    <Text style={[styles.weight, { color: colors.black }]}>{totalWeight || 0.0} KG</Text>
                </View>
            </View>

            {/* Weighment Division */}
            <View style={styles.divisionContainer}>
                <View style={styles.weightContainer}>
                    <Text style={styles.divisionHeading}>Weighment Records</Text>
                    <Text style={styles.divisionHeading}>in Kgs</Text>
                </View>
                <LineDivisor
                    totalValue={totalWeight}
                    division1={weights?.[0]}
                    division2={weights?.[1]}
                    division3={weights?.[2]}
                    division4={weights?.[3]}
                />
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: wp(3),
        marginBottom: hp(1.5),
        backgroundColor: colors.white,
        boxShadow: '0px 4px 3px rgba(0, 0, 0, 0.15)',
        borderRadius: 15,
        padding: wp(5),
    },
    weightContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    weightBlock: {
        gap: hp(1),
        alignItems: 'center',
        justifyContent: 'center',
    },
    heading: {
        fontSize: wp(3.5),
        color: colors.darkGrey,
    },
    weight: {
        fontSize: wp(6),
        fontWeight: 'bold',
    },
    divisionContainer: {
        marginTop: hp(2),
    },
    divisionHeading: {
        fontSize: wp(3),
        color: colors.darkGrey,
    },
});
