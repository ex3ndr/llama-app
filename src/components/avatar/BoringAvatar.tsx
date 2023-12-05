import React from "react"
import Svg, {
    Mask,
    G,
    Rect,
    Circle,
    Line
} from "react-native-svg"

const getNumber = (name: string) => {
    const charactersArray = Array.from(name)
    let charactersCodesSum = 0

    charactersArray.forEach((charactersArrayItem) => {
        return charactersCodesSum += charactersArrayItem.charCodeAt(0)
    })

    return charactersCodesSum;
}

const getModulus = (num: number, max: number) => {
    return num % max;
}

const getDigit = (number: number, ntn: number) => {
    return Math.floor((number / Math.pow(10, ntn)) % 10);
}

const getBoolean = (number: number, ntn: number) => {
    return (!((getDigit(number, ntn)) % 2))
}

const getAngle = (x: number, y: number) => {
    return Math.atan2(y, x) * 180 / Math.PI;
}

const getUnit = (number: number, range: number, index?: number) => {
    let value = number % range

    if (index && ((getDigit(number, index) % 2) === 0)) {
        return -value
    } else return value
}

const getRandomColor = (number: number, colors: string[], range: number) => {
    return colors[(number) % range]
}

const getContrast = (hexcolor: string) => {

    // If a leading # is provided, remove it
    if (hexcolor.slice(0, 1) === '#') {
        hexcolor = hexcolor.slice(1);
    }

    // Convert to RGB value
    var r = parseInt(hexcolor.substr(0, 2), 16);
    var g = parseInt(hexcolor.substr(2, 2), 16);
    var b = parseInt(hexcolor.substr(4, 2), 16);

    // Get YIQ ratio
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

    // Check contrast
    return (yiq >= 128) ? 'black' : 'white';

};

const ELEMENTS = 4
const SIZE = 80

function generateColors(name: string, colors: string[]) {
    const numFromName = getNumber(name)
    const range = colors && colors.length

    const elementsProperties = Array.from({ length: ELEMENTS }, (_, i) => ({
        color: getRandomColor(numFromName + i, colors, range),
        translateX: getUnit(numFromName * (i + 1), (SIZE / 2 - (i + 17)), 1),
        translateY: getUnit(numFromName * (i + 1), (SIZE / 2 - (i + 17)), 2),
        rotate: getUnit(numFromName * (i + 1), 360),
        isSquare: getBoolean(numFromName, 2)
    }));


    return elementsProperties
}

export const BoringAvatar = React.memo((props: { size: number, name: string, colors: string[] }) => {
    const properties = generateColors(props.name, props.colors);
    return (
        <Svg
            viewBox={"0 0 " + SIZE + " " + SIZE}
            fill="none"
            width={props.size}
            height={props.size}
            {...props}
        >
            <Mask
                id="mask__bauhaus"
                // maskUnits={EMaskUnits.USER_SPACE_ON_USE}
                x={0}
                y={0}
                width={SIZE}
                height={SIZE}
            >
                <Rect width={SIZE} height={SIZE} rx={SIZE / 2} fill="#fff" />
            </Mask>
            <G mask="url(#mask__bauhaus)">
                <Rect
                    width={SIZE}
                    height={SIZE}
                    rx={SIZE / 2}
                    fill={properties[0].color}
                />
                <Rect
                    x={(SIZE - 60) / 2}
                    y={(SIZE - 20) / 2}
                    width={SIZE}
                    height={properties[1].isSquare ? SIZE : SIZE / 8}
                    fill={properties[1].color}
                    transform={"translate(" + (properties[1].translateX) + " " + (properties[1].translateY) + ") rotate(" + properties[1].rotate + " " + SIZE / 2 + " " + SIZE / 2 + ")"}
                />
                <Circle
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    fill={properties[2].color}
                    r={SIZE / 5}
                    transform={"translate(" + properties[2].translateX + " " + properties[2].translateY + ")"}
                />
                <Line
                    x1={0}
                    y1={SIZE / 2}
                    x2={SIZE}
                    y2={SIZE / 2}
                    strokeWidth={2}
                    stroke={properties[3].color}
                    transform={"translate(" + properties[3].translateX + " " + properties[3].translateY + ") rotate(" + properties[3].rotate + " " + SIZE / 2 + " " + SIZE / 2 + ")"}
                />
            </G>
        </Svg>
    );
});