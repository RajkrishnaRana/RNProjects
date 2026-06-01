import { StyleSheet, Text, TextInput, View } from 'react-native';
import React from 'react';
import { colors } from '../../common/colors';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import CustomDromdown from '../Dropdown/CustomDromdown';
import Lucide from '@react-native-vector-icons/lucide';

interface Props {
    filterData: any[];
    filter: any;
    setFilter: any;
    search: string;
    setSearch: any;
}

export default function WorkerFilterSection({ filterData, filter, setFilter, search, setSearch }: Props) {
    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <FontAwesome6 name="filter" size={20} color={colors.green} iconStyle="solid" />
                <Text style={{ color: colors.black, fontSize: 13, fontWeight: 'bold' }}>Filters</Text>
            </View>

            <CustomDromdown data={filterData} value={filter} setValue={setFilter} customValueField="id" customLabelField="name" />

            <View style={styles.searchContainer}>
                <Lucide name="search" size={17} color={colors.grey} />
                <TextInput
                    value={search}
                    onChangeText={setSearch}
                    style={styles.input}
                    placeholder="Search workers by id, name ..."
                    placeholderTextColor={colors.grey}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 12,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.20)',
        marginVertical: 10,
        marginHorizontal: 10,
        borderRadius: 8,
    },
    searchContainer: {
        marginTop: 10,
        borderWidth: 0.5,
        borderColor: colors.lightGreenShade,
        borderRadius: 10,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    input: {
        fontSize: 12,
        fontWeight: '500',
        flex: 1,
    },
});
