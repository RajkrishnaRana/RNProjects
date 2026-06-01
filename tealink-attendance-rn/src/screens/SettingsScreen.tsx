import { Image, StyleSheet, View } from 'react-native';
import React from 'react';
import StackHeader from '../components/Headers/StackHeader';
import SettingsCard from '../components/Cards/SettingsCard';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { Feather } from '@react-native-vector-icons/feather';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import TextField from '../components/TextField';
import { useAppDispatch, useAppSelector } from '../hooks/typedReduxHooks';
import { setBaseURL } from '../store/slices/authSlice';
import { colors } from '../common/colors';
import WeighingParametersSections from '../components/Sections/WeighingParametersSections';
import SettingToggleOptions from '../components/SettingToggleOptions';
import { hp, wp } from '../utils/dimesion';
import ExportDataBanner from '../components/Banner/ExportDataBanner';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import databaseServices from '../services/databaseServices';
import { setFlashEnabled, setPluckingOneShot, setPrintTimeWise } from '../store/slices/settingSlice';

export default function SettingsScreen() {
    const { baseURL } = useAppSelector(state => state.auth);
    const { flashEnabled, pluckingOneShot, printTimeWise } = useAppSelector(state => state.setting);
    const dispatch = useAppDispatch();
    const { exportDBFile } = databaseServices;

    return (
        <>
            <StackHeader title="Settings" description="Application preferences and configurations" />

            <KeyboardAwareScrollView contentContainerStyle={styles.container} bottomOffset={hp(5)}>
                <SettingsCard
                    icon={<Image source={require('../assets/icons/server.png')} style={styles.img} />}
                    title="Server Configuration"
                    description="Configure the server"
                    buttonTitle="Update Server URL"
                    buttonIcon={<MaterialDesignIcons name="cloud-upload-outline" size={20} color="white" />}
                    children={
                        <TextField
                            label="Base URL"
                            placeholder="Enter Base URL"
                            value={baseURL as string}
                            onChangeText={text => dispatch(setBaseURL(text as string))}
                            customLabelStyle={styles.label}
                            customTextInputContainerStyle={styles.baseURLTextInputContainerStyle}
                        />
                    }
                />

                <SettingsCard
                    icon={<FontAwesome name="balance-scale" size={15} color="white" />}
                    title="Weighing Parameters"
                    description="Configure measurement and calculation settings"
                    buttonTitle="Save Weighing Preferences"
                    buttonIcon={<Feather name="save" size={17} color="white" />}
                    children={<WeighingParametersSections />}
                />

                <SettingsCard
                    icon={<Image source={require('../assets/icons/layers.png')} style={styles.flashImg} />}
                    title="Plucking Configuration"
                    description="Configure the plucking recording settings"
                    buttonTitle="Save Preferences"
                    buttonIcon={<Feather name="save" size={17} color="white" />}
                    children={
                        <SettingToggleOptions
                            title="Record Plukcing One Shot ?"
                            description="Enable single-shot plucking recording"
                            state={pluckingOneShot}
                            setState={() => dispatch(setPluckingOneShot(!pluckingOneShot))}
                        />
                    }
                />

                <SettingsCard
                    icon={<Image source={require('../assets/icons/flash.png')} style={styles.flashImg} />}
                    title="Flash Settings"
                    description="Screen Flash Configurations"
                    buttonTitle="Save Flash Preferences"
                    buttonIcon={<Feather name="save" size={17} color="white" />}
                    children={
                        <View style={{ gap: hp(2) }}>
                            <SettingToggleOptions
                                title="Flash screen on record ?"
                                description="Flash screen when recording data"
                                state={flashEnabled}
                                setState={() => dispatch(setFlashEnabled(!flashEnabled))}
                            />
                            {/* <TextField
                                label="Flash Duration (in seconds)"
                                value={flashDuration}
                                onChangeText={(text: string) => dispatch(setFlashDuration(text))}
                                customLabelStyle={styles.label}
                                disable={!flashEnabled}
                                customTextInputContainerStyle={styles.flashText}
                            /> */}
                        </View>
                    }
                />

                <SettingsCard
                    icon={<Feather name="printer" size={17} color="white" />}
                    title="Print Settings"
                    description="Configure printing preferences"
                    buttonTitle="Save Print Preference"
                    buttonIcon={<Feather name="save" size={17} color="white" />}
                    children={
                        <SettingToggleOptions
                            title="Print Time-wise ?"
                            description="Enable time-based printing layout"
                            state={printTimeWise}
                            setState={() => dispatch(setPrintTimeWise(!printTimeWise))}
                        />
                    }
                />

                <SettingsCard
                    icon={<MaterialDesignIcons name="database-outline" size={17} color="white" />}
                    title="Data Management"
                    description="Export your data as a PDF"
                    buttonTitle="Export Data"
                    buttonFun={exportDBFile}
                    buttonIcon={<Feather name="download" size={17} color="white" />}
                    children={<ExportDataBanner />}
                />

                {/* <SettingsCard
                    icon={<MaterialDesignIcons name="database-outline" size={17} color="white" />}
                    title="Offline Database Management"
                    description="Offline Data Deletion"
                    buttonTitle="Delete Data"
                    buttonFun={clearDatabase}
                    buttonIcon={<Feather name="download" size={17} color="white" />}
                    children={<></>}
                /> */}
            </KeyboardAwareScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, paddingBottom: hp(10) },
    img: {
        height: 15,
        width: 15,
        tintColor: 'white',
    },
    flashImg: {
        height: 20,
        width: 20,
        tintColor: 'white',
    },
    label: { color: colors.lightBlack, fontSize: wp(3) },
    flashText: { borderColor: colors.lightGreen, borderWidth: 0.5 },
    baseURLTextInputContainerStyle: { borderColor: colors.lightGreen, borderWidth: 0.5 },
});
