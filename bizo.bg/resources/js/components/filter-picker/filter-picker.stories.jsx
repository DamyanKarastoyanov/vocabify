/**
 * FilterPicker Component Usage Examples
 */
import { useState } from "react";
import FilterPicker from "./filter-picker";

// Sample data matching the requested format
const insuranceTypes = [
    "Имотна застраховка",
    "Застраховка пътуване",
    "Автомобилна застраховка",
    "Здравна застраховка",
    "Живот застраховка",
];

const statusOptions = ["Активна", "Неактивна"];

const paymentOptions = ["Платени с", "Неплатени", "Частично платени"];

const periodOptions = [
    "Всички",
    "Последен месец",
    "Последни 3 месеца",
    "Последна година",
];

export default function FilterPickerExamples() {
    const [selectedInsurance, setSelectedInsurance] = useState(null);
    const [selectedWithDefault, setSelectedWithDefault] = useState(
        insuranceTypes[0],
    );
    const [selectedStatus, setSelectedStatus] = useState("Активна");
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState(null);

    return (
        <div style={{ padding: "20px", maxWidth: "800px" }}>
            <h2>FilterPicker Component Examples</h2>

            <div style={{ marginBottom: "30px" }}>
                <h3>Filter Bar Layout (like screenshot)</h3>
                <div
                    style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                        marginBottom: "10px",
                    }}
                >
                    <FilterPicker
                        values={paymentOptions}
                        selectedValue={selectedPayment}
                        title="Платени с"
                        onChange={setSelectedPayment}
                    />
                    <FilterPicker
                        values={insuranceTypes}
                        selectedValue={selectedInsurance}
                        title="Вид застраховки"
                        onChange={setSelectedInsurance}
                    />
                    <FilterPicker
                        values={periodOptions}
                        selectedValue={selectedPeriod}
                        title="Период"
                        onChange={setSelectedPeriod}
                    />
                    <FilterPicker
                        values={statusOptions}
                        selectedValue={selectedStatus}
                        title="Статус"
                        onChange={setSelectedStatus}
                    />
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                    Selected: Payment: {selectedPayment || "None"}, Insurance:{" "}
                    {selectedInsurance || "None"}, Period:{" "}
                    {selectedPeriod || "None"}, Status:{" "}
                    {selectedStatus || "None"}
                </div>
            </div>

            <div style={{ marginBottom: "30px" }}>
                <h3>Basic Usage</h3>
                <FilterPicker
                    values={insuranceTypes}
                    selectedValue={selectedInsurance}
                    title="Вид застраховки"
                    onChange={setSelectedInsurance}
                />
                <p>Selected: {selectedInsurance || "None"}</p>
            </div>

            <div style={{ marginBottom: "30px" }}>
                <h3>With Default Selection</h3>
                <FilterPicker
                    values={insuranceTypes}
                    selectedValue={selectedWithDefault}
                    title="Избери застраховка"
                    onChange={setSelectedWithDefault}
                />
                <p>Selected: {selectedWithDefault}</p>
            </div>

            <div style={{ marginBottom: "30px" }}>
                <h3>Status Filter Example</h3>
                <FilterPicker
                    values={statusOptions}
                    selectedValue={selectedStatus}
                    title="Статус"
                    onChange={setSelectedStatus}
                />
                <p>Selected: {selectedStatus || "None"}</p>
            </div>

            <div style={{ marginBottom: "30px" }}>
                <h3>Disabled State</h3>
                <FilterPicker
                    values={insuranceTypes}
                    selectedValue={null}
                    title="Недостъпно"
                    disabled={true}
                    onChange={() => {}}
                />
            </div>

            <div style={{ marginBottom: "30px" }}>
                <h3>Custom Styling</h3>
                <FilterPicker
                    values={insuranceTypes}
                    selectedValue={null}
                    title="Избери тип"
                    onChange={() => {}}
                    className="custom-filter-picker"
                    style={{ minWidth: "300px" }}
                />
            </div>
        </div>
    );
}
