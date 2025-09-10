import { useEffect, useState } from "react";
import InvoicesTable from "../common/InvoicesTable";
import SelectedCompany from "../common/SelectedCompany";
import type { issuerData } from "../../Types/types";
import apis from "../../apis/main";

export default function Invoices() {
    const [issuerData, setIssuerData] = useState<issuerData | null>(null);
    const [allInvoices, setAllInvoices] = useState<any[]>([]);
    useEffect(() => {
        const issuerDataCheck = apis.getTheIssuerData();
        if (issuerDataCheck) {
            setIssuerData(issuerDataCheck);
            getAllInvoicesAsync();
        }
    }, [])
    const getAllInvoicesAsync = async () => {
        const data = await apis.getAllInvoices();
        setAllInvoices(data);
    }
    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold mb-4">الفواتير</h1>
            {/* Add your invoice content here */}
            <SelectedCompany issuerData={issuerData} />
            {
                issuerData !== null ? (
                    <div className="mt-6 bg-white p-4 rounded-lg">
                        <p className=" font-medium ">قم بتحديد الفواتير التي تريد ارسالها</p>
                        <InvoicesTable invoices={allInvoices} />
                    </div>
                ) : (<>
                    <div className="mt-6 bg-white p-4 rounded-lg flex flex-col items-center justify-center min-h-[200px]">
                        <p className="text-gray-700 text-2xl">قم باضافه شركه اولا.</p>
                        <p className="text-gray-500">لا توجد فواتير متاحة للاختيار.</p>
                    </div>
                </>)
            }

        </div>
    )
}
