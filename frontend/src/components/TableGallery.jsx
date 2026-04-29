import React, { useState } from 'react';
import DataTable from './DataTable';
import SkillEditButton from './SkillEditButton';

export default function TableGallery() {
    // Generate more mock data
    const generateData = (count) => {
        const statuses = ['Active', 'Pending', 'Inactive', 'Active', 'Active'];
        const companies = ['Acme Corp', 'Globex Inc', 'Soylent', 'Initech', 'Stark Ind', 'Wayne Ent', 'Massive Dynamic', 'Cyberdyne', 'Umbrella Corp', 'Tyrell Corp'];

        return Array.from({ length: count }).map((_, i) => ({
            id: `CUST-${(i + 1).toString().padStart(3, '0')}`,
            customer: companies[i % companies.length],
            amount: `$${(Math.random() * 10000 + 500).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
            status: statuses[i % statuses.length],
            lastActive: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString()
        }));
    };

    const mockTableData = generateData(45); // 45 rows of mock data

    // Add a date column to make it a bit wider
    const mockTableCols = [
        { header: 'ID', accessorKey: 'id', cellClassName: 'font-mono text-slate-500 w-24' },
        { header: 'Customer', accessorKey: 'customer', cellClassName: 'font-medium text-slate-900 dark:text-slate-100' },
        { header: 'Amount', accessorKey: 'amount', cellClassName: 'font-medium' },
        { header: 'Last Active', accessorKey: 'lastActive', cellClassName: 'text-slate-500' },
        {
            header: 'Status', accessorKey: 'status', render: (row) => (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${row.status === 'Active' ?
                    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50' :
                    row.status === 'Pending' ?
                        'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50' :
                        'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                    }`}>
                    {row.status}
                </span>
            )
        }
    ];

    // Sorting state for paginated table
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const handleSort = (key, direction) => {
        setSortConfig({ key, direction });
    };

    const sortedMockData = React.useMemo(() => {
        let sortableData = [...mockTableData];
        if (sortConfig.key !== null) {
            sortableData.sort((a, b) => {
                let valA = a[sortConfig.key];
                let valB = b[sortConfig.key];
                if (typeof valA === 'string' && valA.startsWith('$')) valA = parseFloat(valA.replace(/[^0-9.-]+/g,"")) || 0;
                if (typeof valB === 'string' && valB.startsWith('$')) valB = parseFloat(valB.replace(/[^0-9.-]+/g,"")) || 0;
                
                if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableData;
    }, [mockTableData, sortConfig]);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const totalPages = Math.ceil(sortedMockData.length / pageSize);

    // Slice data for pagination
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedData = sortedMockData.slice(startIndex, startIndex + pageSize);

    return (
        <div className="space-y-12 pb-24">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
                <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-3xl font-semibold tracking-tight">Tables & Data Grids</h1>
                    <SkillEditButton skillPath="ui/components/data_table.md" />
                </div>
                <p className="text-slate-500 mt-2">Examples of data tables in different layout constraints and interactions.</p>
            </div>

            <section>
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Full Width Table (Scrollable)</h2>
                    <p className="text-sm text-slate-500">Fixed height container allowing the inner rows to scroll continuously without expanding the page size.</p>
                </div>
                {/* 
                    We set a fixed height on the wrapper div. 
                    DataTable's 'h-full flex flex-col' and nested 'flex-1 overflow-auto' will fill this and scroll automatically.
                */}
                <div className="w-full h-[400px]">
                    <DataTable
                        title="Continuous Customer Log"
                        subtitle={`Showing all ${mockTableData.length} customers`}
                        columns={mockTableCols}
                        data={mockTableData}
                        className="min-h-0"
                    />
                </div>
            </section>

            <section>
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Full Width Table (Paginated)</h2>
                    <p className="text-sm text-slate-500">Loads a fixed subset of rows with controls to navigate distinct pages.</p>
                </div>
                <div className="w-full">
                    <DataTable
                        title="Paginated Customer View"
                        subtitle={`Showing ${startIndex + 1}-${Math.min(startIndex + pageSize, sortedMockData.length)} of ${sortedMockData.length}`}
                        columns={mockTableCols}
                        data={paginatedData}
                        pagination={true}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        sortConfig={sortConfig}
                        onSort={handleSort}
                    />
                </div>
            </section>

            <section>
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Sidebar Width Table</h2>
                    <p className="text-sm text-slate-500">Constrained width for sidebars, context panels, or multi-column layouts.</p>
                </div>
                <div className="max-w-md h-[300px]">
                    <DataTable
                        title="Recent Customers"
                        columns={mockTableCols.slice(0, 3)}
                        data={mockTableData.slice(0, 15)}
                        showFilters={false}
                        className="min-h-0"
                    />
                </div>
            </section>
        </div>
    );
}
