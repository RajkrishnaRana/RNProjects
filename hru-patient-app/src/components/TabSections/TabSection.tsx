import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {colors} from '../../common/colors';
import {ReferNow, InvitationHistory, BonusPoint} from './TabSectionComponents';

const renderScene = SceneMap({
    first: ReferNow,
    second: InvitationHistory,
    third: BonusPoint,
});

const routes = [
    {key: 'first', title: 'Refer Now'},
    {key: 'second', title: 'History'},
    {key: 'third', title: 'Bonus Point'},
];

export default function TabSection() {
    const [index, setIndex] = React.useState(0);

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
