import React, {useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    TextStyle,
    StyleProp,
    Image,
    ActivityIndicator,
} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors} from '../../common/colors';
import Feather from 'react-native-vector-icons/Feather';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../types/routeTypes';
import moment from 'moment';
import {DocumentPickerResponse, pick} from '@react-native-documents/picker';
import Toast from 'react-native-simple-toast';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FileViewCard from '../../components/Cards/FileViewCard';
import {downloadFile, viewFile} from '../../utils/fileHelper';
import {useNavigation} from '../../hooks/useNavigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {set} from 'zod';
import BackgroundGradient from '../../components/BackgroundGradient';
import {isTab} from '../../utils/isTab';

type EditDisputeRouteProp = RouteProp<RootStackParamList, 'EditDispute'>;

const DisputeDetail = ({header, detail, customStyle}: {header: string; detail: string; customStyle?: StyleProp<TextStyle>}) => {
    return (
        <View style={styles.infoRow}>
            <Text style={styles.label}>{header} : </Text>
            <Text style={[styles.value, customStyle]}>{detail}</Text>
        </View>
    );
};

export default function EditDispute() {
    const navigation = useNavigation();
    const {item} = useRoute<EditDisputeRouteProp>().params;

    // LOCAL STATES ----------------------->
    const [message, setMessage] = useState('');
    const [doc, setDoc] = useState<DocumentPickerResponse[] | null>(null);
    const [loading, setLoading] = useState(false);

    // LOCAL FUNCTIONS ------------------------------>
    async function fileUpload() {
        try {
            const doc = await pick({
                type: ['image/*'],
            });
            setDoc(doc);
        } catch (error) {
            Toast.show('No Documents Selected', Toast.SHORT);
            console.log(error);
        }
    }

    return (
        <BackgroundGradient>
            <View style={{flex: 1}}>
                <View style={styles.container}>
                    <View style={styles.scrollContainer}>
                        {/* Dispute Information */}
                        <View style={styles.infoContainer}>
                            <DisputeDetail header="Dispute Id" detail={item.dispute.disputeId} />
                            <DisputeDetail header="Transaction Id" detail={item?.bookingId} />
                            <DisputeDetail header="Dispute Against" detail={item?.dispute?.complainAgainst} />
                            <DisputeDetail
                                header="Status"
                                detail={item?.dispute?.status}
                                customStyle={{
                                    color: item?.dispute?.status == 'Close' ? colors.green : colors.red,
                                    fontWeight: 'bold',
                                }}
                            />
                            <DisputeDetail header="Description" detail={item?.dispute?.disputeDescription} />

                            {item?.dispute?.disputeFile && (
                                <TouchableOpacity
                                    style={styles.fileContainer}
                                    onPress={async () => {
                                        setLoading(true);
                                        await downloadFile(item?.dispute?.disputeImgPath, item?.dispute?.disputeFile?.name);
                                        setLoading(false);
                                    }}>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            gap: wp(3),
                                            alignItems: 'center',
                                        }}>
                                        <MaterialIcons name="insert-drive-file" size={isTab ? wp(3) : wp(5)} color={colors.darkBlue} />
                                        <Text style={styles.fileNames}>{item?.dispute?.disputeFile?.name}</Text>
                                    </View>
                                    {loading ? (
                                        <ActivityIndicator size={isTab ? wp(4) : wp(5.5)} color={colors.darkBlue} />
                                    ) : (
                                        <MaterialCommunityIcons name="download" size={isTab ? wp(3) : wp(5.5)} color={colors.darkBlue} />
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    <Text style={styles.commentHeading}>All Comments : </Text>

                    {item?.dispute?.comments ? (
                        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                            {item.dispute.comments.map((comment, index) => {
                                return (
                                    <View key={index} style={styles.commentBox}>
                                        <Text style={styles.commentName}>{comment?.commentBy}</Text>
                                        <Text style={styles.commentBody}>{comment?.commentDescription}</Text>
                                        {comment?.commentImgPath && (
                                            <Image
                                                source={{
                                                    uri: comment?.commentImgPath,
                                                }}
                                                style={styles.image}
                                                resizeMode="contain"
                                            />
                                        )}
                                        <Text style={styles.commentDate}>{moment(comment?.commentDate).format('Do MMM, YYYY,  hh:mm A')}</Text>
                                    </View>
                                );
                            })}
                        </ScrollView>
                    ) : (
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Text style={{color: colors.darkGrey}}>No comments found</Text>
                        </View>
                    )}

                    {doc && (
                        <FileViewCard
                            item={doc[0]}
                            onPress={() => {
                                setDoc(null);
                            }}
                        />
                    )}

                    {/* Input and Send Button */}
                    {/* <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.inputContainer}>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity
                            style={styles.buttons}
                            onPress={fileUpload}>
                            <Feather
                                name="paperclip"
                                size={wp(5)}
                                color="white"
                            />
                        </TouchableOpacity>
                        <TextInput
                            value={message}
                            onChangeText={text => setMessage(text)}
                            placeholder="Type a comment..."
                            style={styles.textInput}
                            placeholderTextColor="#aaa"
                        />
                        <TouchableOpacity style={styles.buttons}>
                            <Feather name="send" size={wp(5)} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.buttons, {marginLeft: wp(2)}]}>
                            <MaterialIcons
                                name="delete"
                                size={wp(5)}
                                color="white"
                            />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView> */}
                </View>
            </View>
        </BackgroundGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingHorizontal: wp(3),
    },
    scrollContainer: {
        marginBottom: hp(2),
        marginTop: hp(1),
    },
    infoContainer: {
        backgroundColor: colors.white,
        borderRadius: wp(5),
        padding: isTab ? wp(3) : wp(4),
        // borderColor: colors.primary,
        borderWidth: wp(0.01),
        elevation: 2,
        marginHorizontal: wp(3),
    },
    infoRow: {
        flexDirection: 'row',
        marginVertical: hp(0.5),
    },
    label: {
        color: colors.black,
        fontSize: isTab ? wp(2.2) : wp(3.7),
        // fontWeight: 'bold',
        width: isTab ? wp(30) : wp(40),
    },
    value: {
        fontSize: isTab ? wp(2.2) : wp(3.5),
        flex: 1,
        color: colors.darkGrey,
    },
    commentHeading: {
        fontSize: isTab ? wp(2.5) : wp(4),
        fontWeight: 'bold',
        marginBottom: hp(1),
        color: colors.darkBlue,
        marginHorizontal: wp(3),
    },
    commentBox: {
        borderWidth: wp(0.01),
        borderColor: colors.grey,
        borderRadius: wp(4),
        paddingVertical: hp(1),
        paddingHorizontal: wp(3),
        marginBottom: hp(1),
        backgroundColor: colors.white,
        elevation: 2,
        marginHorizontal: wp(3),
    },
    commentName: {
        fontSize: isTab ? wp(2.2) : wp(3.5),
        // fontWeight: 'bold',
        color: colors.black,
    },
    commentDate: {
        color: colors.grey,
        fontSize: isTab ? wp(2) : wp(3),
        textAlign: 'right',
    },
    commentBody: {
        color: colors.darkGrey,
        fontSize: isTab ? wp(2.2) : wp(3.5),
    },
    image: {
        alignSelf: 'center',
        height: isTab ? wp(20) : wp(30),
        width: isTab ? wp(20) : wp(30),
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: wp(2),
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f9f9f9',
        // backgroundColor: colors.white,
        marginHorizontal: wp(-3),
    },
    textInput: {
        flex: 1,
        paddingHorizontal: wp(2),
        paddingVertical: hp(1),
        backgroundColor: '#fff',
        borderRadius: 20,
        borderColor: '#ddd',
        borderWidth: 1,
        marginHorizontal: wp(2),
        elevation: 1,
        shadowColor: '#000', // Shadow color
        shadowOffset: {width: 0, height: 2}, // Offset for the shadow
        shadowOpacity: 0.25, // Opacity of the shadow
        shadowRadius: 3.5, // Blur radius of the shadow
    },
    buttons: {
        backgroundColor: colors.primary,
        height: wp(11),
        width: wp(11),
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fileContainer: {
        borderWidth: wp(0.2),
        borderColor: colors.darkBlue,
        borderRadius: wp(3),
        paddingVertical: isTab ? hp(0.5) : hp(1),
        paddingHorizontal: wp(3),
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp(1),
    },
    fileNames: {
        fontWeight: 'bold',
        fontSize: isTab ? wp(2.2) : wp(3.5),
        color: colors.darkBlue,
    },
});
