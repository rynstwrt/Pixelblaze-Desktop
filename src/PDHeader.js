import { PDSlider } from "./PDSlider"
import {Box, Button, makeStyles} from "@material-ui/core"

export function PDHeader()
{
    const loadButtonStyle = makeStyles({
        root: {
            backgroundColor: "#FF6666",
            margin: "1.75rem 0",
            marginLeft: "1.5rem",
            padding: ".5rem 1.75rem",

            "&:hover": {
                backgroundColor: "#FF8484"
            }
        }
    })

    return (
        <header>

            <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <h1>PIXELBLAZE DESKTOP</h1>
                <Button
                    className={loadButtonStyle().root}
                    onClick={() => { window.api.send("PD-load-patterns") }}>
                    <p>LOAD PROGRAMS</p>
                </Button>
            </Box>

            <Box display={"flex"} justifyContent={"space-evenly"} marginBottom={"4rem"}>
                <PDSlider text={"BRIGHTNESS"} propertyName={"brightness"} />
            </Box>
        </header>
    )
}