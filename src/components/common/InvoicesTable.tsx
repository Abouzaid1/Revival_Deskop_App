import { useState, useMemo } from 'react';
import { useNavigate } from "react-router-dom";

const statusColors: Record<string, string> = {
    "غير مدفوع": "bg-red-100 text-red-600",
    "قيد الانتظار": "bg-yellow-100 text-yellow-600",
    "مدفوع": "bg-green-100 text-green-600",
    "مؤرشف": "bg-gray-200 text-gray-600",
};

const statusOptions = ["الكل", "غير مدفوع", "قيد الانتظار", "مدفوع", "مؤرشف"];

export default function InvoicesTable({ invoices }: { invoices: any[] }) {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("الكل");
    const [selected, setSelected] = useState<number[]>([]);
    const navigate = useNavigate();
    const handleInvoiceClick = (id: number) => {
        navigate(`/invoice/${id}`);
    }
    const [filterDate, setFilterDate] = useState("");

    // Helper to get today and yesterday in yyyy-mm-dd
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    const yesterdayObj = new Date(today);
    yesterdayObj.setDate(today.getDate() - 1);
    const yyyyy = yesterdayObj.getFullYear();
    const ymm = String(yesterdayObj.getMonth() + 1).padStart(2, '0');
    const ydd = String(yesterdayObj.getDate()).padStart(2, '0');
    const yesterdayStr = `${yyyyy}-${ymm}-${ydd}`;

    const statusMap: Record<string, string> = {
        "bost_Open": "غير مدفوع",
        "bost_Close": "مدفوع",
        "bost_Paid": "مدفوع",
        "bost_Waiting": "قيد الانتظار",
        "bost_Archived": "مؤرشف",
    };

    // Filtering
    const filteredInvoices = useMemo(() => {
        return invoices.filter((inv) => {
            const statusArabic = statusMap[inv.DocumentStatus] || "غير مدفوع";
            const matchesStatus = status === "الكل" || statusArabic === status;
            const matchesSearch =
                (inv.DocNum?.toString() || "").includes(search) ||
                (inv.CardName || "").includes(search) ||
                (inv.DocDate || "").includes(search) ||
                (inv.DocTotal?.toString() || "").includes(search);
            const matchesDate = !filterDate || (inv.DocDate && inv.DocDate.startsWith(filterDate));
            return matchesStatus && matchesSearch && matchesDate;
        });
    }, [search, status, invoices, filterDate]);

    // Select logic
    const allSelected = filteredInvoices.length > 0 && filteredInvoices.every(inv => selected.includes(inv.DocNum));
    const toggleSelectAll = () => {
        if (allSelected) {
            setSelected(prev => prev.filter(id => !filteredInvoices.some(inv => inv.DocNum === id)));
        } else {
            setSelected(prev => Array.from(new Set([...prev, ...filteredInvoices.map(inv => inv.DocNum)])));
        }
    };

    const toggleSelect = (docNum: number) => {
        setSelected((prev) =>
            prev.includes(docNum) ? prev.filter(i => i !== docNum) : [...prev, docNum]
        );
    };

    // Date filter UI
    const dateFilterUI = (
        <div className="flex flex-row items-center gap-2 mb-4">
            <input
                type="date"
                className="border rounded px-2 py-1"
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
            />
            <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                onClick={() => setFilterDate(todayStr)}
            >
                اليوم
            </button>
            <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                onClick={() => setFilterDate(yesterdayStr)}
            >
                أمس
            </button>
            {filterDate && (
                <button
                    className="bg-gray-300 text-gray-800 px-2 py-1 rounded hover:bg-gray-400 ml-2"
                    onClick={() => setFilterDate("")}
                >
                    إزالة الفلتر
                </button>
            )}
        </div>
    );

    const selectedInvoices = invoices.filter(inv => selected.includes(inv.DocNum));

    return (
        <div className="flex flex-col gap-4">

            {/* Selected Invoices Table (عرض فقط بدون checkboxes) */}
            {selectedInvoices.length > 0 && (
                <div className="bg-indigo-50 rounded-2xl shadow border my-5 border-indigo-200 p-4 overflow-x-auto" style={{ maxHeight: '30vh', overflowY: 'auto' }}>
                    <div className="mb-2 font-bold text-indigo-700 px-5 ">الفواتير المحددة</div>
                    <table className="w-full text-xs md:text-sm text-gray-700">
                        <thead className="bg-indigo-100 sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-3 text-right font-bold">رقم الفاتورة</th>
                                <th className="px-4 py-3 text-right font-bold">تاريخ الفاتورة</th>
                                <th className="px-4 py-3 text-right font-bold">اسم العميل</th>
                                <th className="px-4 py-3 text-right font-bold">الإجمالي</th>
                                <th className="px-4 py-3 text-right font-bold">الحالة</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedInvoices.map((inv) => (
                                <tr key={inv.DocNum} className="hover:bg-indigo-100 transition">
                                    <td className="px-4 py-3 font-semibold">{inv.DocNum}</td>
                                    <td className="px-4 py-3">{new Date(inv.DocDate).toLocaleDateString("ar-EG")}</td>
                                    <td className="px-4 py-3">{inv.CardName}</td>
                                    <td className="px-4 py-3 font-bold">{inv.DocTotal?.toLocaleString()} ج.م</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusColors[statusMap[inv.DocumentStatus] || "غير مدفوع"]}`}>
                                            {statusMap[inv.DocumentStatus] || "غير مدفوع"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='flex justify-end'>
                        <button className='px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition text-sm font-bold'>ارسال</button>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3 items-center mb-2">
                <input
                    type="text"
                    placeholder="ابحث باسم الفاتورة أو العميل..."
                    className="w-full md:w-1/3 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-200 focus:outline-none bg-gray-50 text-sm shadow-sm"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select
                    className="w-full md:w-40 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm shadow-sm focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                >
                    {statusOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            </div>
            {dateFilterUI}

            {/* Main Table */}
            <div className={`rounded-2xl shadow-xl border border-gray-100${filterDate ? ' border-2 border-green-300 bg-green-50' : 'bg-white '} overflow-x-auto`} style={{ maxHeight: '60vh', overflowY: 'auto', padding: '0.5rem' }}>
                <table className="w-full text-xs md:text-sm text-gray-700">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                        <tr>
                            <th className="px-2 py-3 text-center font-bold">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={toggleSelectAll}
                                    className="accent-gray-600 w-4 h-4"
                                />
                            </th>
                            <th className="px-4 py-3 text-right font-bold bg-gray-100">تاريخ تقديم</th>
                            <th className="px-4 py-3 text-right font-bold bg-gray-100">رقم فاتوره</th>
                            <th className="px-4 py-3 text-right font-bold bg-gray-100">نوع الوثيقه</th>
                            <th className="px-4 py-3 text-right font-bold bg-gray-100">المرسل</th>
                            <th className="px-4 py-3 text-right font-bold bg-gray-100">المستلم</th>
                            <th className="px-4 py-3 text-right font-bold bg-gray-100">اجمالي المبيعات</th>
                            <th className="px-4 py-3 text-right font-bold bg-gray-100">اجمالي الضرائب</th>
                            <th className="px-4 py-3 text-right font-bold bg-gray-100">الاجمالي</th>
                            <th className="px-4 py-3 text-right font-bold bg-gray-100">الحاله</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredInvoices.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="text-center py-8 text-gray-400 text-base">لا توجد نتائج مطابقة</td>
                            </tr>
                        ) : (
                            filteredInvoices.map((invoice) => (
                                <tr key={invoice.DocNum} className="hover:bg-indigo-50 transition">
                                    <td className="px-2 py-3 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(invoice.DocNum)}
                                            onChange={e => {
                                                e.stopPropagation();
                                                toggleSelect(invoice.DocNum);
                                            }}
                                            className="accent-gray-600 w-4 h-4"
                                        />
                                    </td>
                                    <td onClick={() => handleInvoiceClick(invoice.DocNum)} className="px-4 py-3">{new Date(invoice.DocDate).toLocaleDateString("ar-EG")}</td>
                                    <td onClick={() => handleInvoiceClick(invoice.DocNum)} className="px-4 py-3 font-semibold">{invoice.DocNum}</td>
                                    <td onClick={() => handleInvoiceClick(invoice.DocNum)} className="px-4 py-3">فاتورة ضريبية</td>
                                    <td onClick={() => handleInvoiceClick(invoice.DocNum)} className="px-4 py-3">{invoice.CardName}</td>
                                    <td onClick={() => handleInvoiceClick(invoice.DocNum)} className="px-4 py-3">-</td>
                                    <td onClick={() => handleInvoiceClick(invoice.DocNum)} className="px-4 py-3 font-bold">{invoice.DocumentLines?.reduce((sum: number, l: any) => sum + (l.LineTotal || 0), 0).toLocaleString()} ج.م</td>
                                    <td onClick={() => handleInvoiceClick(invoice.DocNum)} className="px-4 py-3 font-bold">{invoice.DocumentLines?.reduce((sum: number, l: any) => sum + (l.TaxTotal || 0), 0).toLocaleString()} ج.م</td>
                                    <td onClick={() => handleInvoiceClick(invoice.DocNum)} className="px-4 py-3 font-bold">{invoice.DocTotal?.toLocaleString()} ج.م</td>
                                    <td onClick={() => handleInvoiceClick(invoice.DocNum)} className="px-4 py-3">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusColors[statusMap[invoice.DocumentStatus] || "غير مدفوع"]}`}>
                                            {statusMap[invoice.DocumentStatus] || "غير مدفوع"}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
