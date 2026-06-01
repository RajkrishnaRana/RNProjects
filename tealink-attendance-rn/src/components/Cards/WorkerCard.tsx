import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors } from '../../common/colors';
import IconText from '../Texts/IconText';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import Lucide from '@react-native-vector-icons/lucide';
import { wp } from '../../utils/dimesion';
import { useNavigation } from '../../hooks/useNavigation';
import WorkerIcon from '../Texts/WorkerIcon';
import WorkerMaster from '../../model/workerMaster';
import { android_ripple_value } from '../../constants/screenOptions';

interface Props {
    item: WorkerMaster;
    forModal?: boolean;
    handlePress?: () => void;
}

export default function WorkerCard({ item, forModal, handlePress }: Props) {
    const navigation = useNavigation();

    return (
        <Pressable
            style={styles.container}
            onPress={() => {
                handlePress ? handlePress() : navigation.push('Worker Profile', { item });
            }}
            android_ripple={android_ripple_value}
        >
            {/* Worker Icon */}
            <WorkerIcon title={item.workerName} img={item.workerImagePath} />

            <View style={styles.bodyContainer}>
                <Text style={styles.workerName}>{item.workerName}</Text>
                <View style={styles.infoContainer}>
                    <IconText
                        icon={require('../../assets/icons/id-card.png')}
                        title={item.workerCode?.length > 8 ? item.workerCode?.slice(0, 8) + '...' : item.workerCode}
                        image
                        customStyle={{ width: wp(18) }}
                    />
                    <IconText
                        icon={<FontAwesome name="address-book-o" size={15} color={colors.grey} />}
                        customStyle={{ width: wp(25) }}
                        title={item.workerBookName?.length > 9 ? item.workerBookName?.slice(0, 9) + '...' : item.workerBookName}
                    />
                    {!forModal && (
                        <IconText
                            icon={<Lucide name="user-round" size={15} color={colors.grey} />}
                            title={item.workerTypeName}
                            customStyle={{ width: wp(25) }}
                        />
                    )}
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#f2fbf9ff',
        boxShadow: '0px 4px 3px rgba(0, 0, 0, 0.15)',
        borderRadius: 10,
        marginHorizontal: 10,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    bodyContainer: { gap: 5 },
    infoContainer: { flexDirection: 'row' },
    workerName: {
        fontSize: wp(4),
        fontWeight: 'bold',
        color: colors.black,
    },
});
