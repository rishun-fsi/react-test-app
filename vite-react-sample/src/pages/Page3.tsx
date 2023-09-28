import PermissionsGate from "../components/PermissionsGate";
import { SCOPES } from "../components/permission-maps";
    
const Page3: React.FC = () => {
  return (
    <PermissionsGate
    // RenderError={() => <p>You shall not pass!</p>}
    errorProps={{ disabled: true }}
    scopes={[SCOPES.canEdit]}
  >
    <>
    <h1>Private content</h1>
    <p>Must be an editor to view</p>
    </>
  </PermissionsGate>
  );

}
    
export default Page3;