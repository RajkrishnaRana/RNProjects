import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { colors } from '../../common/colors';
import Animated, {
  FadeInDown,
  LinearTransition,
} from 'react-native-reanimated';
import { useAccordian } from '../../hooks/useAccordian';
import { isTab } from '../../utils/isTab';

const AnimatedFontAwesome5Icon =
  Animated.createAnimatedComponent(FontAwesome5Icon);

interface Props {
  header: string;
  children: React.ReactNode;
  initialState?: boolean;
}

export default function Accordian({
  header,
  children,
  initialState = false,
}: Props) {
  const { dropdown, animatedIconStyle, toggleRotation } =
    useAccordian(initialState);

  return (
    <Animated.View
      style={styles.accordianContainer}
      layout={LinearTransition.springify()}
    >
      <TouchableOpacity
        style={styles.header}
        onPress={toggleRotation}
        activeOpacity={1}
      >
        <Text style={styles.headerText}>{header}</Text>
        <AnimatedFontAwesome5Icon
          name="chevron-down"
          size={isTab ? wp(3) : wp(5)}
          color={colors.darkBlue}
          style={animatedIconStyle}
        />
      </TouchableOpacity>

      {dropdown && (
        <Animated.View
          style={{
            marginVertical: hp(1),
            height: hp(0.1),
            backgroundColor: colors.lightGrey,
          }}
          entering={FadeInDown}
        />
      )}

      {dropdown && <>{children}</>}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  accordianContainer: {
    backgroundColor: 'white',
    borderRadius: isTab ? wp(2) : wp(5),
    paddingHorizontal: isTab ? wp(3) : wp(5),
    paddingVertical: isTab ? wp(2) : wp(3),
    marginHorizontal: wp(3),
    marginTop: isTab ? hp(1) : hp(2),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: isTab ? wp(3) : wp(4.5),
    color: colors.black,
    fontWeight: 'bold',
  },
});
