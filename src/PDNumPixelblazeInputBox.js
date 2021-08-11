import {Button, makeStyles, TextField, Typography} from "@material-ui/core";
import Popup from "reactjs-popup"
import 'reactjs-popup/dist/index.css';


function handleLoadButtonClick()
{
    const numValue = document.getElementById("num-pixelblaze-textfield").value

    if (numValue.isEmpty || numValue < 1 || numValue > 100) return

    document.getElementById("popup-root").style.display = "none";
    document.getElementById("setup-button").style.display = "none";

    window.api.send("PD-load-patterns", numValue)
}


export function PDNumPixelblazeInputBox()
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
    });

    const typographyStyle = makeStyles({
        root: {
            marginRight: ".5rem",
            color: "#273036",
            textAlign: "center"
        }
    });

    return (
        <Popup
            modal
            closeOnDocumentClick={true}
            trigger = {(
                <Button id={"setup-button"} className={loadButtonStyle().root}>
                    <p>SETUP</p>
                </Button>
            )}
        >
                <div>
                    <Typography id={"labeled-slider-label"} className={typographyStyle().root}>
                        Enter the number of pixelblaze on the network:
                    </Typography>

                    <TextField
                        id={"num-pixelblaze-textfield"}
                        type={"number"}
                        InputProps = {{
                            inputProps: {
                                min: 1,
                                max: 100
                            }
                        }}
                    />
                </div>

                <Button
                    className={loadButtonStyle().root}
                    onClick={handleLoadButtonClick}>
                    <p>LOAD PROGRAMS</p>
                </Button>
        </Popup>
    )
}