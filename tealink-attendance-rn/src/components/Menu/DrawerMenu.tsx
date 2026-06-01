import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../common/colors';
import Lucide from '@react-native-vector-icons/lucide';
import { android_ripple_value } from '../../constants/screenOptions';
import { wp } from '../../utils/dimesion';

export default function DrawerMenu({ name, description, handlePress }: { name: string; description: string; handlePress: () => void }) {
    return (
        <Pressable style={styles.container} android_ripple={android_ripple_value} onPress={handlePress}>
            <View>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>

            <Lucide name="chevron-right" size={16} color={colors.black} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
        marginVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderRadius: 10,
        backgroundColor: colors.white,
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
    },
    name: {
        fontSize: 13,
        fontWeight: 'bold',
        color: colors.black,
    },
    description: {
        fontSize: 11,
        color: colors.grey,
        maxWidth: wp(55),
    },
});
