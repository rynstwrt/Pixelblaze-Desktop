import react from "react"
import { PDHeader } from "./PDHeader"
import {PDPatterns} from "./PDPatterns";

let sliders = {};
let patternButtons = {};

export class PDApp extends react.Component
{
    __isMounted = false;

    componentDidMount()
    {
        this.__isMounted = true;

        window.api.receive("create-pattern-buttons", programList =>
        {
            patternButtons = programList;
            this.forceUpdate();
        });

        window.api.receive("create-controls", controls =>
        {
            console.log("create-controls received");

            sliders = { "brightness": 1 }

            // const ctrls = controls === undefined ? {} : controls;
            // const ctrlKeys = Object.keys(ctrls);
            //
            // const slidersFiltered = ctrlKeys.filter(key =>
            // {
            //     return key.startsWith("slider") || key === "brightness";
            // });
            //
            // if (slidersFiltered.length === 0)
            // {
            //     this.forceUpdate();
            //     return;
            // }
            //
            // sliders = slidersFiltered.reduce((obj, key) =>
            // {
            //     return { ...obj, [key]: ctrls[key] }
            // }, {});
            //
            // this.forceUpdate();
            // console.log("UPDATED SLIDERS");
        });
    }

    componentWillUnmount()
    {
        this.__isMounted = false;
    }

    render()
    {
        return (
            <div>
                <PDHeader sliders={sliders} />
                <PDPatterns buttons={patternButtons} />
            </div>
        )
    }
}
