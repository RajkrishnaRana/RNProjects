import {Image, StyleSheet, Text, View, Modal} from 'react-native';
import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../../common/colors';
// import Modal from 'react-native-modal';
import BigButton from '../BigButton';

interface availablityProps {
  title: string;
  isSelected: boolean;
}

const avialablityData: availablityProps[] = [
  {
    title: 'Today',
    isSelected: false,
  },
  {
    title: 'Sun',
    isSelected: false,
  },
  {
    title: 'Mon',
    isSelected: false,
  },
  {
    title: 'Tue',
    isSelected: false,
  },
  {
    title: 'Wed',
    isSelected: false,
  },
  {
    title: 'Thu',
    isSelected: false,
  },
  {
    title: 'Fri',
    isSelected: false,
  },
  {
    title: 'Sat',
    isSelected: false,
  },
];

const SubHeading = () => (
  <View style={{marginTop: hp(1.5), marginBottom: hp(0.5)}}>
    <Text style={{fontSize: wp(4.2), fontWeight: 'bold', color: colors.black}}>
      Availability :
    </Text>
  </View>
);

const AvailabilitySelectCard = ({item}: {item: availablityProps}) => {
  return (
    <TouchableOpacity
      style={[
        styles.availabilitySelectCardContainer,
        {backgroundColor: item.isSelected ? colors.darkBlue : colors.white},
      ]}>
      <Text>{item.title}</Text>
    </TouchableOpacity>
  );
};

export default function DoctorSorting() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [availablity, setAvailablity] = useState(avialablityData);

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(!isModalVisible)}>
        <Image
          source={require('../../assets/icons/filter.png')}
          style={styles.logo}
        />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        // animationIn={'fadeInUpBig'}
        // animationOut={'fadeOutDown'}
        // backdropColor={'#000'}
        // backdropOpacity={0.5}
        // onBackdropPress={() => {
        //   setModalVisible(!isModalVisible);
        // }}
        style={{margin: 0, justifyContent: 'flex-end'}}>
        <View style={styles.modalContent}>
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Search Filter</Text>
            <BigButton
              onPress={() => {}}
              title={'Apply'}
              customStyle={styles.buttonStyle}
              customTextStyle={{fontSize: wp(4)}}
            />
          </View>

          {/* Line */}
          <View style={styles.headerLine} />

          {/* Availability Section */}
          <SubHeading />

          {/* Price Section */}
          <View style={styles.availabilitySectionContainer}>
            {availablity.map((item, index) => (
              <AvailabilitySelectCard item={item} key={index} />
            ))}
          </View>

          {/* Consultancy Mode Section */}

          {/* Rating Section */}

          {/* Gender Section */}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    height: wp(7),
    width: wp(7),
    tintColor: colors.primary,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: wp(6),
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  headerText: {
    fontSize: wp(5.5),
    color: colors.primary,
    fontWeight: 'bold',
    width: wp(50),
  },
  buttonStyle: {
    paddingVertical: wp(1),
    width: wp(20),
    marginTop: 0,
  },
  headerLine: {
    height: 1.5,
    backgroundColor: colors.primary,
    borderRadius: wp(3),
    marginHorizontal: wp(-4),
  },
  availabilitySectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp(2),
  },
  availabilitySelectCardContainer: {
    width: wp(20),
    paddingVertical: wp(1.5),
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: colors.darkBlue,
    alignItems: 'center',
  },
});
