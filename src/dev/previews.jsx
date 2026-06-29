import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import RegistHacktoday from "../pages/CompeRegisPage/RegistHacktoday.jsx";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/RegistHacktoday">
                <RegistHacktoday/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews