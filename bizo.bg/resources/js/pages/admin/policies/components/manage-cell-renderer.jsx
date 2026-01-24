/**
 * Internal dependencies
 */
import IconButton from "@/components/icon-button/icon-button";
import Popper from "@/components/popper";
import IconInfo from "@/components/icons/info";
import EditPolicyForm from "@/pages/admin/policies/components/edit-policy-form";

const ManageCellRenderer = ({ datarow }) => {
    return (
        <Popper variant="elevated" width="600px">
            <Popper.Trigger asChild>
                <IconButton icon={IconInfo} />
            </Popper.Trigger>
            <Popper.Content>
                <EditPolicyForm datarow={datarow} />
            </Popper.Content>
        </Popper>
    );
};

export default ManageCellRenderer;
