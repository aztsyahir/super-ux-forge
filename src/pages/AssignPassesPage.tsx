import { useParams, useNavigate } from "react-router-dom";
import { PreAssignPassesPage } from "@/components/group-visit/PreAssignPasses";

const DEMO_MEMBERS = [
  { id: "1", name: "Ahmad bin Ali", idNumber: "850101-14-1234", phone: "+6012-345-6789", passId: "1042", isPic: true },
  { id: "2", name: "Lim Wei Ming", idNumber: "900202-10-5678", phone: "+6017-888-9999", passId: "1043" },
  { id: "3", name: "Sarah binti Kamarul", idNumber: "921105-08-4321", phone: "+6019-111-2222" },
  { id: "4", name: "Rajesh Kumar", idNumber: "880715-05-3344", phone: "+6016-555-6666" },
  { id: "5", name: "Mei Ling", idNumber: "950330-14-5566", phone: "+6013-777-8888" },
  { id: "6", name: "John Doe", idNumber: "800101-01-1111", phone: "+6011-222-3333" },
  { id: "7", name: "Jane Smith", idNumber: "820202-02-2222", phone: "+6010-999-0000" },
  { id: "8", name: "Mohd Faiz", idNumber: "910315-06-7890", phone: "+6012-111-2222" },
  { id: "9", name: "Tan Ah Kow", idNumber: "870922-08-3456", phone: "+6016-333-4444" },
  { id: "10", name: "Nurul Ain", idNumber: "960708-14-5678", phone: "+6019-555-6666" },
  { id: "11", name: "Kumar s/o Rajan", idNumber: "750325-08-9012", phone: "+6013-777-8888" },
  { id: "12", name: "Siti Hajar", idNumber: "990112-08-3456", phone: "+6011-999-0000" },
  { id: "13", name: "Wong Chee Keong", idNumber: "830508-14-7890", phone: "+6017-111-2222" },
  { id: "14", name: "Aminah Binti Omar", idNumber: "910203-04-5678", phone: "+6012-333-4444" },
  { id: "15", name: "Dev Raj Singh", idNumber: "870415-08-9012", phone: "+6016-555-6666" },
];

export default function AssignPassesPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <PreAssignPassesPage
      groupName="Ahmad bin Ali"
      visitId={`GRP-20260224-${id ?? "88A"}`}
      hostName="Dr. Siti Nurhaliza"
      members={DEMO_MEMBERS}
      onBack={() => navigate(`/group-visits/${id}`)}
      onSave={() => {
        alert("Pass assignments saved successfully!");
        navigate(`/group-visits/${id}`);
      }}
    />
  );
}
