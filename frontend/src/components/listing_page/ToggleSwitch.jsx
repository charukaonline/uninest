import { Switch } from "antd";

const ToggleSwitch = ({ label, checked, onChange }) => {
    return (
        <div className="flex items-center gap-2">
            <span className="text-gray-700">{label}</span>
            <Switch
                checked={checked}
                onChange={onChange}
                className="bg-gray-300"
                style={{
                    backgroundColor: checked ? "#047857" : "#d1d5db", // Green when ON, Gray when OFF
                }}
            />
        </div>
    );
};

export default ToggleSwitch;
