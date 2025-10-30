import './ColorSlider.css'

function ColorSlider({label, value, func}) 
{
    return (
        <div id="color">
            <label>
                {label} : {value}
            </label>
            <input type="range" min="0" max="255" value={value} onChange={(e) => func(e.target.value)} />
        </div>
    )
}

export default ColorSlider;