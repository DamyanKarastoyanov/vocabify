/**
 * Internal dependencies
 */
import IconButton from "@/components/icon-button/icon-button";
import Popper from "@/components/popper";
import EditPaymentForm from "./edit-payment-form";
import IconInfo from "@/components/icons/info";

const ManageCellRenderer = ({ datarow }) => {
    return (
        <Popper variant="elevated" width="600px">
            <Popper.Trigger asChild>
                <IconButton icon={IconInfo} />
            </Popper.Trigger>
            <Popper.Content>
                <EditPaymentForm datarow={datarow} />
            </Popper.Content>
        </Popper>
    );
};

export default ManageCellRenderer;
