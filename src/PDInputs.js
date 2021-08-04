import { Grid } from "@material-ui/core";
import { PDSlider } from "./PDSlider";

export function PDInputs(props)
{
    return (
        <Grid container
            direction={"row"}
            justifyContent={"center"}
            spacing={2}>
            {
                Object.keys(props.sliders).map(sliderName =>
                {
                    return <PDSlider
                        key={sliderName}
                        text={sliderName}
                        propertyName={sliderName} />
                })
            }
        </Grid>
    )
}

// export function PDInputs(props)
// {
//     if (props.sliders === undefined)
//     {
//         // TODO: get this initValue programmatically
//         return (
//             <Box display={"flex"} justifyContent={"space-evenly"} marginBottom={"4rem"}>
//                 {/*<PDSlider text={"BRIGHTNESS"} propertyName={"brightness"} initValue={1} />*/}
//             </Box>
//         )
//     }
//
//     return (
//         <Box display={"flex"} justifyContent={"space-evenly"} marginBottom={"4rem"}>
//             {
//                 Object.keys(props.sliders).map(propertyName =>
//                 {
//                     return <PDSlider key={propertyName} text={propertyName} propertyName={propertyName} initValue={props.sliders[propertyName]} />
//                 })
//             }
//         </Box>
//     )
// }