import { useEffect, useMemo, useState } from 'react';
import { database } from '../../..';
import WorkerMaster from '../../model/workerMaster';
import BookMaster from '../../model/bookMaster';

type Filter = {
    id: string;
    name: string;
};

const useViewWorkers = () => {
    const [allFilters, setAllFilters] = useState<Filter[]>([{ id: 'all', name: 'All Books' }]);
    const [filter, setFilter] = useState({ id: 'all', name: 'All Books' });
    const [search, setSearch] = useState('');
    const [workersData, setWorkersData] = useState<WorkerMaster[]>([]);

    // 🔍 Derived filtered list (filtered + searched)
    const filteredWorkersData = useMemo(() => {
        let list = workersData.map(w => w);

        // 1️⃣ Filter by book
        if (filter.id !== 'all') {
            list = list.filter(w => w.workerBookId === filter.id);
        }

        // 2️⃣ Search by name
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(w => w.workerName?.toLowerCase().startsWith(q) || w.workerCode?.toLowerCase().includes(q));
        }

        return list;
    }, [workersData, filter, search]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const workersCollection = database.collections.get<WorkerMaster>('worker_master');
                const booksCollection = database.collections.get<BookMaster>('book_master');

                // Fetch both in parallel
                const [workers, books] = await Promise.all([workersCollection.query().fetch(), booksCollection.query().fetch()]);

                setWorkersData(workers);

                const recordsProcessed = books.map(r => ({ id: r.bookId, name: r.bookName }));
                setAllFilters(prev => [...prev, ...recordsProcessed]);
            } catch (err) {
                console.error('WatermelonDB fetch error:', err);
            }
        };

        fetchData();
    }, []);

    return {
        allFilters,
        filter,
        setFilter,
        search,
        setSearch,
        workersData,
        filteredWorkersData,
    };
};

export default useViewWorkers;
