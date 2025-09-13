import { useState, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import apis from '../../apis/main';

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
    const [loading, setLoading] = useState(false);
    const [invoiceData, setInvoiceData] = useState<any[]>([]);
    const navigate = useNavigate();
    const handleInvoiceClick = (id: number) => {
        navigate(`/invoice/${id}`);
    }
    const [filterDate, setFilterDate] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

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
            // Date range filter
            let matchesDate = true;
            if (startDate && endDate) {
                matchesDate = inv.DocDate >= startDate && inv.DocDate <= endDate;
            } else if (startDate) {
                matchesDate = inv.DocDate >= startDate;
            } else if (endDate) {
                matchesDate = inv.DocDate <= endDate;
            } else if (filterDate) {
                matchesDate = inv.DocDate && inv.DocDate.startsWith(filterDate);
            }
            return matchesStatus && matchesSearch && matchesDate;
        });
    }, [search, status, invoices, filterDate, startDate, endDate]);

    // Pagination state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); // Allow user to choose page size
    const pageCount = Math.ceil(filteredInvoices.length / pageSize);
    const paginatedInvoices = filteredInvoices.slice((page - 1) * pageSize, page * pageSize);

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
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");
    const [submitResults, setSubmitResults] = useState<any[] | null>(null);
    const submitSelected = async () => {
        setSubmitting(true);
        setSubmitError("");
        setSubmitSuccess("");
        setSubmitResults(null);
        try {
            const issuerData = await apis.getTheIssuerData();
            const results = await apis.submitInvoices(selectedInvoices, issuerData!);
            setSubmitting(false);
            setSubmitResults(results);
            const successCount = results.filter((r: any) => r.success).length;
            const failCount = results.length - successCount;
            if (failCount === 0) {
                setSubmitSuccess("تم إرسال جميع الفواتير بنجاح!");
            } else if (successCount > 0) {
                setSubmitSuccess(`تم إرسال ${successCount} فاتورة بنجاح. فشل إرسال ${failCount} فاتورة.`);
            } else {
                setSubmitError("فشل إرسال جميع الفواتير.");
            }
        } catch (err: any) {
            setSubmitting(false);
            setSubmitError("حدث خطأ أثناء إرسال الفواتير. حاول مرة أخرى.");
        }
    }
    // Date filter UI
    const dateFilterUI = (
        <div className="flex flex-row items-center gap-2 ">
            {/* <input
                type="date"
                className="border rounded px-2 py-1 bg-gray-50"
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
            />
            <span className="text-xs text-gray-500">أو</span> */}
            <input
                type="date"
                className="border rounded px-2 py-1 bg-gray-50"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                placeholder="تاريخ البداية"
            />
            <span className="text-xs text-gray-500">الى</span>
            <input
                type="date"
                className="border rounded px-2 py-1 bg-gray-50"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                placeholder="تاريخ النهاية"
            />
            <button
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                onClick={() => setFilterDate(todayStr)}
            >
                اليوم
            </button>
            <button
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                onClick={() => setFilterDate(yesterdayStr)}
            >
                أمس
            </button>
            {(filterDate || startDate || endDate) && (
                <button
                    className="bg-gray-300 text-gray-800 px-2 py-1 rounded hover:bg-gray-400 ml-2"
                    onClick={() => { setFilterDate(""); setStartDate(""); setEndDate(""); }}
                >
                    إزالة الفلتر
                </button>
            )}
        </div>
    );

    const selectedInvoices = invoices.filter(inv => selected.includes(inv.DocNum));
    const selectedCount = selected.length;
    const unselectedCount = invoices.length - selectedCount;

    // If loading, show spinner
    if (loading) {
        return (
            <div className="flex items-center justify-center h-96 w-full">
                <div className="w-12 h-12 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">

            {/* Selected Invoices Table (عرض فقط بدون checkboxes) */}
            {selectedInvoices.length > 0 && (
                <div className="bg-indigo-50 rounded-2xl  border my-5 border-indigo-200 p-4 overflow-x-auto" style={{ maxHeight: '30vh', overflowY: 'auto' }}>
                    <div className="mb-2 font-bold text-indigo-700 px-5 ">الفواتير المحددة</div>
                    {submitError && (
                        <div className="mb-4 text-red-600 bg-red-100 rounded-lg px-4 py-2 text-right font-bold text-sm border border-red-200">
                            {submitError}
                        </div>
                    )}
                    {submitSuccess && (
                        <div className="mb-4 text-green-700 bg-green-100 rounded-lg px-4 py-2 text-right font-bold text-sm border border-green-200">
                            {submitSuccess}
                        </div>
                    )}
                    {submitResults && (
                        <div className="mb-4">
                            <table className="w-full text-xs border border-gray-200 rounded">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-2 py-1">رقم الفاتورة</th>
                                        <th className="px-2 py-1">الحالة</th>
                                        <th className="px-2 py-1">الرسالة</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submitResults.map((r, idx) => (
                                        <tr key={r.docNum || idx} className={r.success ? "bg-green-50" : "bg-red-50"}>
                                            <td className="px-2 py-1 font-bold">{r.docNum}</td>
                                            <td className="px-2 py-1 font-bold">
                                                {r.success ? "تم الإرسال" : "فشل الإرسال"}
                                            </td>
                                            <td className="px-2 py-1">{r.message}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <table className="w-full text-xs md:text-sm text-gray-700">
                        <thead className="bg-indigo-100 sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-3 text-right font-bold">رقم الفاتورة</th>
                                <th className="px-4 py-3 text-right font-bold">تاريخ الفاتورة</th>
                                <th className="px-4 py-3 text-right font-bold">اسم العميل</th>
                                <th className="px-4 py-3 text-right font-bold">الإجمالي</th>
                                <th className="px-4 py-3 text-right font-bold">الحالة</th>
                                <th className="px-4 py-3 text-right font-bold">إزالة</th>
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
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            className="text-red-600 hover:text-red-800 font-bold text-xs border border-red-200 rounded px-2 py-1"
                                            onClick={() => toggleSelect(inv.DocNum)}
                                        >
                                            إزالة
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='flex justify-end'>
                        <button
                            className='px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-bold flex items-center gap-2'
                            onClick={submitSelected}
                            disabled={submitting}
                        >
                            {submitting && <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                            {submitting ? 'جاري الإرسال...' : 'ارسال'}
                        </button>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3 items-center mb-2">
                <input
                    type="text"
                    placeholder="ابحث باسم الفاتورة أو العميل..."
                    className="w-full md:w-1/3 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-200 focus:outline-none bg-gray-50 text-sm "
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                {/* <select
                    className="w-full md:w-40 px-3 py-1 rounded-lg border border-gray-200 bg-gray-50 text-sm  focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                >
                    {statusOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select> */}
                {dateFilterUI}
            </div>

            {/* Counters and Page Size Selector */}
            <div className="flex gap-4 items-center mb-2">
                <span className="text-green-700 font-bold">المحدد: {selectedCount}</span>
                <span className="text-gray-500">غير محدد: {unselectedCount}</span>
                <span className="text-gray-400">عدد الفواتير: {invoices.length}</span>
                <div className="flex items-center gap-1">
                    <label htmlFor="pageSize" className="text-gray-600">عدد العناصر:</label>
                    <select
                        id="pageSize"
                        className="border rounded px-1 py-0.5 text-xs"
                        value={pageSize}
                        onChange={e => {
                            setPageSize(Number(e.target.value));
                            setPage(1); // Reset to first page when page size changes
                        }}
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>

            {/* Main Table */}
            <div className={`rounded-2xl  border border-gray-100${filterDate ? ' border-2 border-green-300 bg-green-50' : 'bg-white '} overflow-x-auto`} style={{ maxHeight: '60vh', overflowY: 'auto', padding: '0.5rem' }}>
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
                            <th className="px-4 py-3 text-right font-bold bg-gray-100">المستلم</th>
                            <th className="px-4 py-3 text-right font-bold bg-gray-100">اجمالي المبيعات</th>
                            <th className="px-4 py-3 text-right font-bold bg-gray-100">اجمالي الضرائب</th>
                            <th className="px-4 py-3 text-right font-bold bg-gray-100">الاجمالي</th>
                            <th className="px-4 py-3 text-right font-bold bg-gray-100">الحاله</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paginatedInvoices.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="text-center py-8 text-gray-400 text-base">لا توجد نتائج مطابقة</td>
                            </tr>
                        ) : (
                            paginatedInvoices.reverse().map((invoice) => (
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
            {/* Pagination Controls */}
            {pageCount > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                    <button
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                    >
                        السابق
                    </button>
                    <span className="font-bold">{page} / {pageCount}</span>
                    <button
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                        onClick={() => setPage(page + 1)}
                        disabled={page === pageCount}
                    >
                        التالي
                    </button>
                </div>
            )}
        </div>
    );
}
