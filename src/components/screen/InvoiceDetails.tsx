import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import apis from '../../apis/main';

const statusColors: Record<string, string> = {
    "غير مدفوع": "bg-red-100 text-red-600",
    "قيد الانتظار": "bg-yellow-100 text-yellow-600",
    "مدفوع": "bg-green-100 text-green-600",
    "مؤرشف": "bg-gray-200 text-gray-600",
};


export default function InvoiceDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [invoiceData, setInvoiceData] = useState<any>(null);

    useEffect(() => {
        async function fetchInvoice() {
            if (!id) return;
            const res = await apis.getInvoiceById(id);
            setInvoiceData(res);
        }
        fetchInvoice();
    }, [id]);

    if (!invoiceData) {
        return (
            <div className="w-full flex justify-center items-center h-96">
                <span className="text-lg font-bold text-gray-500">جاري تحميل الفاتورة...</span>
            </div>
        );
    }

    // Status mapping
    const statusMap: Record<string, string> = {
        "bost_Open": "غير مدفوع",
        "bost_Close": "مدفوع",
        "bost_Paid": "مدفوع",
        "bost_Waiting": "قيد الانتظار",
        "bost_Archived": "مؤرشف",
    };
    const status = statusMap[invoiceData.DocumentStatus] || "غير مدفوع";

    // Format date
    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return d.toLocaleDateString("ar-EG");
    };

    // Total
    const total = invoiceData.DocTotal || invoiceData.DocumentLines.reduce((sum: number, item: any) => sum + (item.Price * item.Quantity), 0);

    return (
        <div className="w-full bg-white rounded-xl p-8 font-medium text-right h-[90%] overflow-y-auto ">

            <div className='w-full flex justify-end '>
                <button
                    className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold text-sm transition flex justify-center items-center gap-2"
                    onClick={() => navigate(-1)}
                >
                    رجوع
                    <ArrowLeftIcon className="inline-block" />
                </button>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-700 mb-2">فاتورة رقم: {invoiceData.DocNum}</h2>
                    <div className="text-gray-500 text-sm">تاريخ الإصدار: {formatDate(invoiceData.DocDate)}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className="text-gray-700 text-lg font-bold">{invoiceData.CardName}</span>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusColors[status]}`}>{status}</span>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-100 mb-6">
                <table className="w-full text-xs md:text-sm text-gray-700">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-right font-bold">الخدمة / المنتج</th>
                            <th className="px-4 py-3 text-right font-bold">كود المنتج</th>
                            <th className="px-4 py-3 text-center font-bold">الكمية</th>
                            <th className="px-4 py-3 text-center font-bold">السعر</th>
                            <th className="px-4 py-3 text-center font-bold">الإجمالي</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {invoiceData.DocumentLines.map((item: any, idx: number) => (
                            <tr key={idx} className="hover:bg-indigo-50 transition">
                                <td className="px-4 py-3 font-semibold">{item.ItemDescription}</td>
                                <td className="px-4 py-3 font-semibold">{item.ItemCode}</td>
                                <td className="px-4 py-3 text-center">{item.Quantity}</td>
                                <td className="px-4 py-3 text-center">{item.Price.toLocaleString()} ج.م</td>
                                <td className="px-4 py-3 text-center font-bold">{(item.Price * item.Quantity).toLocaleString()} ج.م</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-6 mb-2">
                <span className="text-lg font-bold text-gray-700">الإجمالي الكلي</span>
                <span className="text-2xl font-extrabold text-gray-700">{total.toLocaleString()} ج.م</span>
            </div>


            <div className="bg-blue-50 rounded-lg p-4 mt-6 text-sm text-gray-800">
                <span className="font-bold">العنوان:</span> {invoiceData.AddressExtension?.BillToStreet || "-"}، {invoiceData.AddressExtension?.BillToCity || "-"}
            </div>
        </div>

    );
}
