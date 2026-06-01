import {ActivityIndicator, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import BigButton from '../BigButton';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import {colors} from '../../common/colors';
import TextField from '../TextField';
import CustomRating from '../BookAppointmentComponents/CustomRating';
import {BASE_URL} from '../../config';
import {postData} from '../../api';
import {queryClient} from '../../../App';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import {isTab} from '../../utils/isTab';
import {RFC_2822} from 'moment';

interface Props {
    id: string;
    data: any;
    isModalVisible?: boolean;
    setIsModalVisible?: (value: boolean) => void;
    modalLoading?: boolean;
}

export default function ProviderRatingModal({id, data, isModalVisible, setIsModalVisible, modalLoading}: Props) {
    const navigation = useNavigation();

    const [isVisible, setIsVisible] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [description, setDescription] = React.useState<string | undefined>(data?.remarks);
    const [rating, setRating] = React.useState<number | undefined>();

    const resetStates = () => {
        setDescription('');
        setRating(undefined);
    };

    const handleSubmitPress = async (data: any) => {
        try {
            setLoading(true);
            const payload = {
                appointmentId: data._id,
                patientRatingToDoctor: rating,
                remarks: description,
                isPatientRated: true,
            };

            console.log('payload-----', payload);

            // Fetch the query if no cached data is found
            const url = `${BASE_URL}/hru/Patientappapi/patientratingdoctor`;
            const res = await postData(url, payload);

            console.log('response from api ---------', res);

            if (res.status) {
                // console.log('Data deleted successfully---------');
                // queryClient.invalidateQueries({
                //     queryKey: ['appointmentData'],
                // });
                Toast.show('Thanks for your feedback', Toast.LONG);
                setIsVisible(false);
                resetStates();
                queryClient.invalidateQueries({
                    queryKey: ['appointMentDetailsData' + id],
                });
                // navigation.goBack();
            }
        } catch (error) {
            console.error('Error while rating:', error);
            Toast.show('Failed to rate the doctor !', Toast.SHORT); // Show error message to the user
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setDescription(data?.remarks);
    }, [data]);

    return (
        <>
            {isModalVisible === undefined && (
                <BigButton
                    // customIcon={
                    //     <Image
                    //         source={require('../../assets/icons/rating.png')}
                    //         style={styles.buttonImg}
                    //     />
                    // }
                    title={data?.patientRatingToDoctor ? 'View Rating' : 'Rate Provider'}
                    onPress={() => setIsVisible(true)}
                    customStyle={{
                        width: wp(40),
                        marginTop: hp(1),
                    }}
                    customTextStyle={{fontSize: isTab ? wp(2.5) : wp(4)}}
                />
            )}

            <Modal
                useNativeDriver
                isVisible={isVisible || isModalVisible}
                animationIn={'fadeInUp'}
                animationOut={'fadeOutDown'}
                onBackdropPress={() => {
                    setIsVisible(false);
                    setIsModalVisible && setIsModalVisible(false);
                }}
                style={styles.modal}>
                <View style={styles.container}>
                    <Image
                        source={require('../../assets/images/rating.png')}
                        style={{height: isTab ? wp(9) : wp(15), width: isTab ? wp(9) : wp(15), alignSelf: 'center', marginBottom: hp(1)}}
                    />
                    <Text style={{color: colors.black, fontWeight: 'bold', fontSize: isTab ? wp(2.5) : wp(4.2), textAlign: 'center'}}>
                        Rate Your Experience
                    </Text>
                    <Text
                        style={{
                            fontSize: isTab ? wp(2) : wp(3.2),
                            color: colors.darkGrey,
                            marginBottom: isTab ? hp(1.5) : hp(3),
                            textAlign: 'center',
                        }}>
                        Share your thoughts with other people.{' '}
                    </Text>
                    <View style={styles.rateContainer}>
                        <Text style={styles.ratingHeader}>Your Ratings : </Text>
                        <CustomRating prevRating={data?.patientRatingToDoctor} onRatingChange={setRating} />
                    </View>

                    <TextField
                        label="Review : "
                        placeholder="Write your review"
                        value={description}
                        onChangeText={setDescription}
                        editable={!data?.isPatientRated}
                        multiline
                        numberOfLine={4}
                        customTextInputContainerStyle={{height: hp(10)}}
                    />

                    {!data?.isPatientRated && (
                        <BigButton
                            title="Submit"
                            onPress={() => {
                                if (!rating) {
                                    Toast.show('Please give rating', Toast.SHORT);
                                } else {
                                    handleSubmitPress(data);
                                }
                            }}
                            customStyle={styles.button}
                            customTextStyle={{fontSize: isTab ? wp(2.5) : wp(3.5)}}
                            loading={loading}
                        />
                    )}

                    {data?.patientRatingToDoctor && (
                        <Text style={{color: colors.darkGrey, fontSize: wp(3), textAlign: 'center', marginTop: hp(1)}}>
                            <Text style={{color: colors.red}}>**</Text> You have already rated this provider
                        </Text>
                    )}
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    buttonImg: {
        width: wp(6),
        height: wp(6),
        tintColor: colors.white,
    },
    button: {
        width: wp(30),
        paddingVertical: hp(1),
        marginTop: hp(1.5),
        alignSelf: 'center',
    },
    modal: {},
    container: {
        backgroundColor: colors.white,
        borderRadius: wp(3),
        paddingVertical: hp(2),
        paddingHorizontal: wp(4),
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    rateContainer: {
        flexDirection: 'row',
        gap: wp(3),
        alignItems: 'center',
        marginVertical: hp(1),
    },
    ratingHeader: {
        fontSize: isTab ? wp(2) : wp(4),
        color: colors.darkGrey,
        fontWeight: '500',
        marginLeft: wp(2),
    },
});
