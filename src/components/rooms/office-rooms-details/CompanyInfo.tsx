import { CompanyInfoProps } from "@/types/filter-props.types";

export const CompanyInfo: React.FC<CompanyInfoProps> = ({ company }) => (
  <div className="mt-4">
    <h3 className="font-semibold mb-2">{company.name}</h3>
    <p className="text-muted-foreground">{company.address}</p>
    <p className="text-muted-foreground">Type: {company.type}</p>
  </div>
);
