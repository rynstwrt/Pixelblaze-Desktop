import { PDInputs } from "./PDInputs"
import { Box } from "@material-ui/core"
import { PDNumPixelblazeInputBox } from "./PDNumPixelblazeInputBox";

export function PDHeader(props)
{
    return (
        <header>
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <h1>PIXELBLAZE DESKTOP</h1>
                <PDNumPixelblazeInputBox />
            </Box>

            <PDInputs sliders={props.sliders}/>
        </header>
    )
}