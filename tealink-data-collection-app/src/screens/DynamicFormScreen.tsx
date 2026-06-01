import { FlatList, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/routeTypes';
import { useDynamicForm } from '../hooks/useDynamicForm';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import BigButton from '../components/Buttons/BigButton';
import { colors } from '../common/colors';
import StackHeader from '../components/Headers/StackHeader';
import { FormField } from '../components/FormField';
import { useNavigation } from '../hooks/useNavigation';
import BackgroundGradient from '../components/BackgroundGradient';
import { sliceText } from '../utils/textHelper';

type DynamicFormRoute = RouteProp<RootStackParamList, 'Form'>;

export default function DynamicForm() {
    const { screen } = useRoute<DynamicFormRoute>().params;
    const navigation = useNavigation();

    // HOOKS ------------------------>
    const { formState, setFormState, handleSubmit, loading } = useDynamicForm(screen, navigation);

    return (
        <BackgroundGradient>
            <StackHeader title={screen.name} />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <FlatList
                    contentContainerStyle={styles.container}
                    data={screen.formFields.filter((field: FormFields) => field.visible !== false)} // filter out invisible fields
                    keyExtractor={(_, index) => index.toString()}
                    // estimatedItemSize={80} // adjust based on your typical field height
                    keyboardShouldPersistTaps="always"
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
                    renderItem={({ item: field }) => {
                        const FieldComp = FormField[field.type as keyof typeof FormField];
                        if (!FieldComp) return null;

                        return (
                            <FieldComp
                                label={sliceText(field.display, 30)}
                                data={field}
                                state={formState[field.name]}
                                setState={(value: any) => setFormState((prev: any) => ({ ...prev, [field.name]: value }))}
                            />
                        );
                    }}
                    ListFooterComponent={<BigButton title="Submit" onPress={handleSubmit} loading={loading} customStyle={styles.buttonStyle} />}
                />
            </KeyboardAvoidingView>
        </BackgroundGradient>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, gap: hp(1.5), paddingHorizontal: wp(5), paddingBottom: hp(15) },
    customTextInput: { marginHorizontal: wp(5) },
    buttonStyle: {
        marginHorizontal: wp(5),
    },
    dropdown: {
        height: hp(5),
        borderWidth: 1,
        borderRadius: wp(3),
        backgroundColor: colors.white,
        borderColor: 'transparent',
        elevation: 1,
    },
    dropDownSelectedText: {
        fontSize: wp(4),
        paddingLeft: wp(2),
    },
    customLabelStyle: {
        fontSize: wp(3.5),
        color: colors.green,
        fontWeight: 'bold',
    },
});
