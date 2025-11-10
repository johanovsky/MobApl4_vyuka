import './ColorSlider.css'

function ColorSlider({ label, value, func }) {
    return (
        <div id="main">
            <label>
                {label} : {value}
            </label>
            <input
                type="range"
                min="0"
                max="255"
                value={value}
                onChange={(e) => func(Number(e.target.value))}
            />
        </div>
    )
}

export default ColorSlider