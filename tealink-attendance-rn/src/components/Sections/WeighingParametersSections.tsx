import { StyleSheet, View } from 'react-native';
import React from 'react';
import TextField from '../TextField';
import { colors } from '../../common/colors';
import { wp } from '../../utils/dimesion';
import { useDispatch } from 'react-redux';
import { setWeighingParamentes } from '../../store/slices/settingSlice';
import { useAppSelector } from '../../hooks/typedReduxHooks';

export default function WeighingParametersSections() {
    const dispatch = useDispatch();
    const { moistureDeduction, standardDeduction, tareWeight } = useAppSelector(state => state.setting);

    return (
        <View style={styles.container}>
            <TextField
                label="Moisture in %"
                placeholder="0.0"
                value={moistureDeduction}
                onChangeText={text => dispatch(setWeighingParamentes({ moistureDeduction: text }))}
                keyboardTypes='numeric'
                customLabelStyle={styles.label}
                customTextInputContainerStyle={styles.textField}
            />

            <TextField
                label="Standard Deduction in %"
                placeholder="0.0"
                value={standardDeduction}
                onChangeText={text => dispatch(setWeighingParamentes({ standardDeduction: text }))}
                keyboardTypes='numeric'
                customLabelStyle={styles.label}
                customTextInputContainerStyle={styles.textField}
            />

            <TextField
                label="Tare Weight in kg"
                placeholder="0.0"
                value={tareWeight}
                onChangeText={text => dispatch(setWeighingParamentes({ tareWeight: text }))}
                keyboardTypes='numeric'
                customLabelStyle={styles.label}
                customTextInputContainerStyle={styles.textField}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { gap: 10 },
    label: { color: colors.lightBlack, fontSize: wp(3) },
    textField: { borderRadius: 10, borderWidth: 0.5, borderColor: colors.lightGreen },
});
