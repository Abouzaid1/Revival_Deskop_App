
import CompanyDetails from './CompanyDetails';
import CompanyCreationComponent from './CompanyCreationComponent';

export default function Companies() {
    const issuerData = JSON.parse(localStorage.getItem("issuerData")!);
    if (issuerData && issuerData.name && issuerData.id && issuerData.type) {
        return (
            <CompanyDetails />
        )
    } else {
        return (<CompanyCreationComponent />)
    }
}
