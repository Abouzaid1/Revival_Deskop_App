import { useEffect, useState } from "react";
import apis from "../../apis/main";

export default function Audit() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [results, setResults] = useState<any[]>([]);
  // Use objects keyed by DocNum for per-invoice state
  const [resubmitLoading, setResubmitLoading] = useState<{ [docNum: string]: boolean }>({});
  const [resubmitError, setResubmitError] = useState<{ [docNum: string]: string | null }>({});

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const [invoices, audit] = await Promise.all([
          apis.getAllInvoices(),
          apis.getTheInvoicesAudit()
        ]);
        const invoiceMap = new Map();
        invoices.forEach((inv: any) => {
          invoiceMap.set(inv.DocNum, inv);
        });
        // Show all audit entries, matched or not
        const merged = audit.map((a: any) => {
          let matchedInv = a.invoiceId ? invoiceMap.get(a.invoiceId) : null;

          // Try match by internalId if not found
          if (!matchedInv && a.internalId) {
            matchedInv = invoices.find(
              (i: any) =>
                i.DocNum == a.internalId ||
                i.DocNum === a.internalId?.toString()
            );
          }

          // Format audit message nicely (preserve line breaks)
          let formattedMsg = a.message;
          if (formattedMsg && typeof formattedMsg === "string") {
            formattedMsg = formattedMsg.split("; ").join("<br/>");
          }

          return {
            // Always keep invoice data if found
            ...matchedInv,
            // Add audit-specific fields
            auditStatus: a.status,
            auditDetails: a,
            DocNum: matchedInv?.DocNum || a.invoiceId || a.internalId || a.documentId || "—",
            CardName: matchedInv?.CardName || "—",
            DocDate: matchedInv?.DocDate || a.createdAt || null,
            DocTotal: matchedInv?.DocTotal ?? null,
            auditMessage: formattedMsg,
          };
        });
        setResults(merged.reverse());
      } catch (err: any) {
        setError("حدث خطأ أثناء جلب البيانات.");
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 w-full">
        <div className="w-12 h-12 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  if (error) {
    return <div className="text-red-600 text-center my-8">{error}</div>;
  }
  return (
    <div className="p-6 ">
      <h1 className="text-2xl font-bold mb-4">سجل الفواتير</h1>
      {results.map((inv) => (
        <div key={inv.DocNum + inv.auditStatus + inv.DocDate} className="rounded-xl  border p-5 my-2 flex flex-col gap-2 bg-white">
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">فاتورة #{inv.DocNum}</span>
            <span className={
              inv.auditStatus === 'ACCEPTED'
                ? 'bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold'
                : inv.auditStatus === 'REJECTED'
                  ? 'bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold'
                  : 'bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold'
            }>
              {inv.auditStatus === 'ACCEPTED' ? 'مقبولة' : inv.auditStatus === 'REJECTED' ? 'مرفوضة' : 'مرفوضة'}
            </span>
          </div>
          <div className="text-gray-600 text-sm">اسم العميل: {inv.CardName}</div>
          <div className="text-gray-600 text-sm">رقم المستند: {inv.DocNum}</div>
          <div className="text-gray-600 text-sm">التاريخ: {inv.DocDate ? new Date(inv.DocDate).toLocaleDateString('ar-EG') : '—'}</div>
          <div className="text-gray-600 text-sm">الإجمالي: {inv.DocTotal !== undefined && inv.DocTotal !== null ? inv.DocTotal.toLocaleString() + ' ج.م' : '—'}</div>
          {/* {inv.auditMessage && (
            <div className="text-xs text-blue-700 mt-2" dangerouslySetInnerHTML={{ __html: inv.auditMessage }}></div>
          )} */}
          {inv.auditStatus !== 'ACCEPTED' && (
            <div className="flex flex-col gap-2 self-end w-full md:w-auto">
              <button
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-bold self-end flex items-center justify-center min-w-[120px]"
                disabled={!!resubmitLoading[inv.DocNum]}
                onClick={async () => {
                  setResubmitLoading((prev) => ({ ...prev, [inv.DocNum]: true }));
                  setResubmitError((prev) => ({ ...prev, [inv.DocNum]: null }));
                  try {
                    const issuerData = await apis.getTheIssuerData();
                    const res = await apis.submitInvoices([inv], issuerData);
                    if (res && res[0] && res[0].success) {
                      setResults((prev) => prev.filter((item) => item.DocNum !== inv.DocNum));
                    } else {
                      setResubmitError((prev) => ({ ...prev, [inv.DocNum]: res[0]?.message || 'فشل إعادة إرسال الفاتورة' }));
                    }
                  } catch (err) {
                    setResubmitError((prev) => ({ ...prev, [inv.DocNum]: 'حدث خطأ أثناء إعادة إرسال الفاتورة' }));
                  } finally {
                    setResubmitLoading((prev) => ({ ...prev, [inv.DocNum]: false }));
                  }
                }}
              >
                {resubmitLoading[inv.DocNum] ? 'جاري الإرسال...' : 'إعادة الإرسال'}
              </button>
              {resubmitError[inv.DocNum] && !resubmitLoading[inv.DocNum] && (
                <div className="text-red-600 text-xs mt-1">{resubmitError[inv.DocNum]}</div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
