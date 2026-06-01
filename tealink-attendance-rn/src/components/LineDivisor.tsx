/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { wp } from '../utils/dimesion';
import { colors } from '../common/colors';

interface Props {
    totalValue: number; // now optional — unused for width scaling (but kept for props)
    division1: number;
    division2?: number;
    division3?: number;
    division4?: number;
}

const TOTAL_WIDTH = wp(85);
const GAP = 1.5;

const LineDivisor = ({
    // totalValue, // can be kept for external logic, but not used for width calc
    division1,
    division2,
    division3,
    division4,
}: Props) => {
    // ✅ Collect only valid, positive divisions
    const rawDivisions = [division1, division2, division3, division4].filter((val): val is number => typeof val === 'number' && val > 0);

    const divisionCount = rawDivisions.length;

    // 🔑 NEW: Normalize to 100% → effective total = sum of given parts
    const effectiveTotal = rawDivisions.reduce((sum, val) => sum + val, 0);

    // Total width taken by gaps between segments
    const totalGapWidth = (divisionCount - 1) * GAP;
    const availableWidth = TOTAL_WIDTH - totalGapWidth;

    // ✅ Proportional widths (now sum to availableWidth → bar fills TOTAL_WIDTH)
    const segmentWidths = rawDivisions.map(val => (val / effectiveTotal) * availableWidth);

    return (
        <View style={styles.container}>
            {divisionCount > 0 ? (
                <>
                    {/* BAR */}
                    <View style={[styles.lineContainer, { width: TOTAL_WIDTH }]}>
                        {segmentWidths.map((width, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.segment,
                                    {
                                        width,
                                        // Rounded ends only on first/last
                                        borderTopLeftRadius: index === 0 ? 5 : 0,
                                        borderBottomLeftRadius: index === 0 ? 5 : 0,
                                        borderTopRightRadius: index === divisionCount - 1 ? 5 : 0,
                                        borderBottomRightRadius: index === divisionCount - 1 ? 5 : 0,
                                    },
                                ]}
                            />
                        ))}
                    </View>

                    {/* LABELS: align centered above each segment */}
                    <View style={[styles.textContainer, { width: TOTAL_WIDTH }]}>
                        {rawDivisions.map((value, index) => (
                            <View
                                key={`label-${index}`}
                                style={{
                                    width: segmentWidths[index],
                                    // Add half-gap offset on inner items to center text over segment
                                    marginLeft: index === 0 ? 0 : GAP / 2,
                                    marginRight: index === divisionCount - 1 ? 0 : GAP / 2,
                                }}
                            >
                                <Text style={styles.division}>{value}</Text>
                            </View>
                        ))}
                    </View>
                </>
            ) : (
                <View style={[styles.lineContainer, { width: TOTAL_WIDTH, backgroundColor: colors.grey, borderRadius: 10 }]} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    lineContainer: {
        flexDirection: 'row',
        gap: GAP,
        height: 5,
    },
    segment: {
        height: '100%',
        backgroundColor: colors.black,
    },
    textContainer: {
        flexDirection: 'row',
        marginTop: 2,
        // No justifyContent — we control widths manually for perfect alignment
    },
    division: {
        color: colors.black,
        fontSize: wp(2.5),
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default LineDivisor;
