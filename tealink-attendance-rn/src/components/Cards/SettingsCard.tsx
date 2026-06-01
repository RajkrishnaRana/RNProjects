import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../common/colors';
import GradientButton from '../Buttons/GradientButton';

interface Props {
    children: React.ReactNode;
    icon: React.ReactNode;
    title: string;
    description: string;
    buttonTitle: string;
    buttonFun?: () => void;
    buttonIcon: React.ReactNode;
}

export default function SettingsCard({ children, icon, title, description, buttonTitle, buttonFun, buttonIcon }: Props) {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#00C855', '#00AA84']}
                useAngle={true}
                angle={160}
                angleCenter={{ x: 0.5, y: 0.5 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1.0 }}
                style={styles.header}
            >
                <View style={styles.iconContainer}>{icon}</View>
                <View>
                    <Text style={styles.headerTitle}>{title}</Text>
                    <Text style={styles.headerDescription}>{description}</Text>
                </View>
            </LinearGradient>

            <View style={styles.bodyContainer}>
                {children}

                {buttonFun && <GradientButton title={buttonTitle} onPress={buttonFun} customIcon={buttonIcon} />}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 10,
        margin: 15,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.20)',
    },
    header: {
        padding: 15,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        flexDirection: 'row',
        gap: 10,
    },
    iconContainer: {
        height: 35,
        width: 35,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.transparentWhiteBackground,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.white,
    },
    headerDescription: {
        fontSize: 11,
        color: colors.white,
    },
    bodyContainer: {
        padding: 15,
    },
});
