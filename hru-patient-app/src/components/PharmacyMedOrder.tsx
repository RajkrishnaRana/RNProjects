import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import React from 'react';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { isTab } from '../utils/isTab';
import DashboardSearchBar from './DashboardSearchBar';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { BASE_URL } from '../config';
import { postData } from '../api';
import { FlashList } from '@shopify/flash-list';
import SpecialitiesCard from './Cards/SpecialitiesCard';
import { colors } from '../common/colors';
import { useCurrentLocationStore } from '../store/currentLocationStore';
import DefaultMedCard from './Cards/DefaultMedCard';

const PharmacyMedOrder = () => {
  //GLOBAL STATE -------------------------------->
  const { token, logout, isAuthenticated } = useAuthStore();
  const nearestLocation = useCurrentLocationStore(s => s.nearestLocation);

  // GET PAGE DATA -------------------------------->
  const url = isAuthenticated ? `${BASE_URL}/hru/Patientappapi/medicine-home` : ``;
    const payload = {
    token: isAuthenticated ? token : null,
    latitude: nearestLocation?.location?.coordinates[1],
    longitude: nearestLocation?.location?.coordinates[0],
    searchLocationId: nearestLocation?._id,
  };
  
  const { isPending, error, data } = useQuery({
    queryKey: [isAuthenticated ? 'medicineDashboard' : 'medicineDashboardwol'],
    queryFn: () => postData(url, payload),
    select: data => {
      // if (data?.tokenExpired) {
      //     // tokenExpiredMsg(logout);
      //     throw new Error('Token has expired. Please log in again.');
      // }
      console.log('Ordered medicine1', data?.doc);
      return data?.doc;
    },
  });


  return (
    <View style={styles.pharmacyContainer}>
      <Text style={styles.needMedText}>Need Medicine ?</Text>
      <DashboardSearchBar
        placeholder={'Search by name, composition ...'}
        data={data?.searchMedicines}
        payload={payload}
      />

      {isPending ? (
        <ActivityIndicator color={colors.black} size={isTab ? wp(2) : wp(3)} />
      ) : (
        <>
          {data?.mostSearchedMedicines && (
            <FlashList
              data={data?.mostSearchedMedicines}
              renderItem={({ item }: { item: MostSearchedSpeciality }) =>
                // <SpecialitiesCard item={item} payload={payload} />
                <DefaultMedCard item={item} payload={payload} />
              }
              numColumns={isTab ? 6 : 3}
              showsHorizontalScrollIndicator={false}
            />
          )}
        </>
      )}
    </View>
  );
};

export default PharmacyMedOrder;

const styles = StyleSheet.create({
  pharmacyContainer: {
    marginTop: isTab ? hp(1) : hp(2),
  },
  needMedText: {
    fontSize: wp(5),
    fontWeight: '600',
  },
});
