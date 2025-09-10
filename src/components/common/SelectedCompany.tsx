import type { issuerData } from "../../Types/types";


export default function SelectedCompany({ issuerData }: { issuerData: issuerData | null }) {
    return (
        <div>
            <div className="bg-white font-medium p-4 rounded-lg w-fit min-w-[40%]">
                <p>الشركه المحدده</p>
                {issuerData == null ? <p className="text-gray-400">لا توجد شركه محدده</p> :
                    <div className="bg-gray-200 rounded-lg mt-5 overflow-hidden w-full border-2 border-gray-300 flex flex-col gap-[2px] h-[100px]">
                        <div className="font-bold text-gray-700 w-full h-[33%] py-1 px-4 flex flex-row gap-5 bg-white">
                            <p>اسم الشركه :</p>
                            <p className="font-normal text-black">{issuerData!.name}</p>
                        </div>
                        <div className="font-bold text-gray-700 w-full h-[33%] py-1 px-4 flex flex-row gap-5 bg-white">
                            <p>السجل الضريبي :</p>
                            <p className="font-normal text-black">{issuerData!.id}</p>
                        </div>
                        <div className="font-bold text-gray-700 w-full h-[33%] py-1 px-4 flex flex-row gap-5 bg-white">
                            <p> رقم السجل :</p>
                            <p className="font-normal text-black">{issuerData!.type}</p>
                        </div>
                    </div>}
            </div>
        </div>
    )
}
