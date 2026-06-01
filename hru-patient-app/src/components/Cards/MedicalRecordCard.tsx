import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {colors} from '../../common/colors';
import BigButton from '../BigButton';

interface Props {
    header: string;
    details: string | any[];
    isList?: boolean;
    orderButtonFunc?: () => void;
}

export default function MedicalRecordCard({header, details, isList = false, orderButtonFunc}: Props) {
    const [loading, setLoading] = useState(false);

    const handlePress = async () => {
        setLoading(true);
        orderButtonFunc?.();
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{header} : </Text>
            <View style={{gap: hp(0.5), marginLeft: wp(3)}}>
                {isList && Array.isArray(details) ? (
                    <>
                        {details?.map((item: string, index: number) => (
                            <Text key={index} style={styles.details}>
                                {index + 1}. {item}
                            </Text>
                        ))}
                    </>
                ) : (
                    <Text style={styles.details}>{details || `No ${header.split(' ')[1]} recorded`}</Text>
                )}
            </View>

            {orderButtonFunc && (
                <BigButton
                    title="Add to Cart"
                    onPress={handlePress}
                    loading={loading}
                    customStyle={{marginTop: hp(1), width: wp(30), alignSelf: 'flex-end', paddingVertical: hp(1)}}
                    customTextStyle={{fontSize: wp(3)}}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: hp(1),
        paddingHorizontal: wp(3),
        backgroundColor: colors.white,
        elevation: 2,
        marginHorizontal: wp(3),
        borderRadius: wp(3),
        gap: hp(1),
    },
    header: {
        fontSize: wp(4),
        color: colors.black,
        fontWeight: 'bold',
    },
    details: {
        fontSize: wp(3.2),
        color: colors.darkGrey,
    },
});
