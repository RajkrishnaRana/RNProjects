import React from 'react';
import StackHeader from '../components/Headers/StackHeader';
import { screenOptions } from '../constants/screenOptions';
import WorkerStats from '../components/Headers/WorkerStats';
import WorkerFilterSection from '../components/Sections/WorkerFilterSection';
import { LegendList } from '@legendapp/list';
import useViewWorkers from '../hooks/screenHooks/useViewWorkers';
import WorkerCard from '../components/Cards/WorkerCard';

export default function ViewWorkersScreen() {
    const { allFilters, filter, setFilter, search, setSearch, filteredWorkersData } = useViewWorkers();

    return (
        <>
            <StackHeader title={screenOptions[0].name} description={screenOptions[0].descriptions} children={<WorkerStats />} />

            {/* Filter Section */}
            <WorkerFilterSection filterData={allFilters} filter={filter} setFilter={setFilter} search={search} setSearch={setSearch} />

            {/* Worker List */}
            <LegendList
                data={filteredWorkersData}
                renderItem={({ item }) => <WorkerCard item={item} />}
                keyExtractor={item => item.id}
                recycleItems
            />
        </>
    );
}
