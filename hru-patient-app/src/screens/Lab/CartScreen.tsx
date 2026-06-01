import {StyleSheet} from 'react-native';
import React from 'react';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors} from '../../common/colors';
import MyCartScreen from './Cart/MyCartScreen';
import SaveForLater from './Cart/SaveForLaterScreen';
import {useCartStore} from '../../store/cartStore';

export default function CartScreen() {
    // GLOBAL STATE ------------------------>
    const {cartItemNumber, saveForLaterCount} = useCartStore();

    // LOCAL STATES ------------------------>
    const [index, setIndex] = React.useState(0);

    const renderScene = SceneMap({
        first: MyCartScreen,
        second: SaveForLater,
    });

    const routes = [
        {key: 'first', title: `My Cart ${cartItemNumber ? '(' + cartItemNumber + ')' : ''}`, count: cartItemNumber},
        {key: 'second', title: `Save For Later ${saveForLaterCount ? '(' + saveForLaterCount + ')' : ''}`, count: saveForLaterCount},
    ];

    return (
        <TabView
            navigationState={{index, routes}}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{width: wp(100)}}
            renderTabBar={props => (
                <TabBar
                    {...props}
                    style={styles.tabBar}
                    indicatorStyle={{backgroundColor: colors.primary}}
                    activeColor={colors.primary}
                    inactiveColor={colors.grey}
                />
            )}
        />
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#fff',
    },
});
