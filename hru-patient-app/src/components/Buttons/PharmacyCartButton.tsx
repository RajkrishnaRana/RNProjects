import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors} from '../../common/colors';
import {useNavigation} from '../../hooks/useNavigation';
import {useCartStore} from '../../store/cartStore';
import {BASE_URL} from '../../config';
import {useQuery} from '@tanstack/react-query';
import {postData} from '../../api';
import {useAuthStore} from '../../store/authStore';

export default function PharmacyCartButton() {
  const navigation = useNavigation();
  
      //GLOBAL VARIABLES ------------------------>
      const {token} = useAuthStore();
      const {cartItemNumber, setCartItemNumber, setSaveForLaterCount} = useCartStore();

      console.log('hitting med cart');
      console.log('token', token);
      
  
      //DATA FETHCHING -------------------------->
      const url = `${BASE_URL}/hru/Patientappapi/medicine-cart-list`;
      const {isPending, error, data, refetch} = useQuery({
          queryKey: ['PharmacyCartData'],
          queryFn: () => postData(url, {token}),
          select: data => {
              console.log('CartData med', data);
              return data?.doc;
          },
      });
  
      //LOCAL FUNCTIONS -------------------------->
      const handleCartButtonPress = () => {
          navigation.push('MedCart');
      };
  
      // SIDE EFFECTS ---------------------------->
      useEffect(() => {
          setCartItemNumber(data?.cartData?.length || 0);
          setSaveForLaterCount(data?.saveForLater?.length || 0);
      }, [data]);
  
      return (
          <TouchableOpacity onPress={handleCartButtonPress}>
              <FeatherIcon name="shopping-cart" size={wp(6.5)} color={colors.primary} />
              {cartItemNumber > 0 && (
                  <View style={styles.badge}>
                      <Text style={styles.badgeText}>{cartItemNumber}</Text>
                  </View>
              )}
          </TouchableOpacity>
      );
  }
  
  const styles = StyleSheet.create({
      badge: {
          position: 'absolute',
          top: wp(-0.5),
          right: wp(-1.2),
          width: wp(3.2),
          height: wp(3.2),
          borderRadius: wp(3),
          backgroundColor: colors.red,
          alignItems: 'center',
          justifyContent: 'center',
      },
      badgeText: {
          color: colors.white,
          fontSize: wp(2),
      },
  });
  