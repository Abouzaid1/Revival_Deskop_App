import type { issuerData } from "../Types/types";
import axios from "axios";


const apis = {
    getAllInvoices: async () => {
        const token = sessionStorage.getItem("token");
        if (!token) throw new Error("No auth token found");
        // const response = await axios.get("http://localhost:9090/api/sap/invoices?fromDate=20250913&toDate=20250913", {
        //     headers: {
        //         Authorization: `Bearer ${token}`
        //     }
        // });
        const response = await axios.get("http://localhost:9090/api/sap/invoices", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.data) {
            return response.data.value;
        }
        return [];
    },
    submitInvoices: async (
        invoices: any[],
        issuerData: any,
        delayMs: number = 1000
    ) => {
        const token = sessionStorage.getItem("token");
        if (!token) throw new Error("No auth token found");

        const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));
        const trim = (num: number) => {
            if (num === null || num === undefined) return 0;
            return Number(num.toString().replace(/(\.\d{3})\d+$/, "$1"));
        };

        const results = [];
        for (let i = 0; i < invoices.length; i++) {
            const invoice = invoices[i];

            // ✅ Build invoice lines
            const documentLines = invoice.DocumentLines.map((line: any) => {
                const salesTotal = line.Quantity * line.UnitPrice;
                const discountAmount = salesTotal - line.LineTotal;

                const baseLine: any = {
                    description: line.ItemDescription || line.Description,
                    itemType: "EGS",
                    itemCode: line.U_etaxitmcod || line.ItemCode,
                    unitType: line.UnitType || "EA",
                    quantity: trim(line.Quantity),
                    internalCode: line.ItemCode,
                    salesTotal: trim(salesTotal),
                    total: trim(line.GrossTotal),
                    valueDifference: 0,
                    totalTaxableFees: 0,
                    netTotal: trim(line.LineTotal),
                    itemsDiscount: trim(discountAmount),
                    unitValue: {
                        currencySold: "EGP",
                        amountEGP: trim(line.UnitPrice)
                    },
                    discount: {
                        rate: trim(line.DiscountPercent || 0),
                        amount: trim(discountAmount),
                    }
                };

                if (line.VatGroup === "T1") {
                    return {
                        ...baseLine,
                        taxableItems: [
                            {
                                taxType: "T1",
                                amount: trim(line.LineTotal * 0.14),
                                subType: "V009",
                                rate: 14.0,
                            },
                        ],
                    };
                }

                return baseLine; // ✅ No taxableItems field at all if not T1
            });

            // ✅ Totals
            const totalSales = trim(documentLines.reduce((sum: any, l: any) => sum + l.salesTotal, 0));
            const netAmount = trim(documentLines.reduce((sum: any, l: any) => sum + l.netTotal, 0));
            const totalDiscount = trim(documentLines.reduce((sum: any, l: any) => sum + (l.discount?.amount || 0), 0));
            const totalTax = trim(
                documentLines.reduce(
                    (sum: any, l: any) =>
                        sum +
                        (l.taxableItems
                            ? l.taxableItems.reduce((s: any, t: any) => s + t.amount, 0)
                            : 0),
                    0
                )
            );
            const totalAmount = netAmount + totalTax;

            // ✅ Document object
            const document = {
                issuer: {
                    address: { ...issuerData },
                    type: issuerData.type,
                    id: issuerData.id,
                    name: issuerData.name,
                },
                receiver: {
                    address: {
                        country: "EG",
                        governate: invoice.AddressExtension.BillToCounty,
                        regionCity: invoice.AddressExtension.BillToCity,
                        street: invoice.AddressExtension.BillToStreet,
                        buildingNumber: invoice.AddressExtension.BillToBuilding,
                    },
                    type: "B", // force business type
                    id: invoice.FederalTaxID || "313717919",
                    name: invoice.CardName,
                },
                documentType: "I",
                documentTypeVersion: "1.0",
                dateTimeIssued: new Date().toISOString().split(".")[0] + "Z",
                taxpayerActivityCode: "6920",
                internalID: invoice.DocNum.toString(),
                invoiceLines: documentLines,
                totalDiscountAmount: totalDiscount,
                totalSalesAmount: totalSales,
                netAmount,
                taxTotals: totalTax > 0 ? [{ taxType: "T1", amount: totalTax }] : [],
                totalAmount:totalAmount - trim(invoice.TotalDiscount || 0),
                extraDiscountAmount: trim(invoice.TotalDiscount || 0),
                totalItemsDiscountAmount: 0,
            };

            const payload = { documents: [document] };

            try {
                const response = await fetch("http://localhost:9090/eta/real/sign-and-submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                });

                const result = await response.json();
                if (!response.ok) {
                    results.push({
                        docNum: invoice.DocNum,
                        success: false,
                        message: result?.message || `فشل إرسال الفاتورة رقم ${invoice.DocNum}`
                    });
                } else {
                    results.push({
                        docNum: invoice.DocNum,
                        success: true,
                        message: "تم إرسال الفاتورة بنجاح"
                    });
                }
            } catch (err) {
                results.push({
                    docNum: invoice.DocNum,
                    success: false,
                    message: `حدث خطأ أثناء إرسال الفاتورة رقم ${invoice.DocNum}`
                });
            }

            if (i < invoices.length - 1) {
                await wait(delayMs);
            }
        }

        return results;
    },



    saveTheIssuerData: async (issuerData: issuerData) => {
        const stringfiedIssuerData = JSON.stringify(issuerData);
        localStorage.setItem("issuerData", stringfiedIssuerData);
        if (localStorage.getItem("issuerData")) {
            window.location.reload();
        }
    },
    getTheIssuerData: (): issuerData | null => {
        const data = localStorage.getItem("issuerData");
        if (data) {
            return JSON.parse(data);
        }
        return null;
    },
    getInvoiceById: async (id: string) => {
        const invoices = await apis.getAllInvoices();
        return invoices.find((inv: any) => inv.DocNum == id) || null;
    },
    getTheInvoicesAudit: async () => {
        const token = sessionStorage.getItem("token");
        if (!token) throw new Error("No auth token found");
        const response = await axios.get("http://localhost:9090/invoices", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }

}

export default apis;
